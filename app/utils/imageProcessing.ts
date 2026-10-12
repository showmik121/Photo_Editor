/**
 * Image processing utilities for Chobi Studio
 * Handles file validation, HTML5 canvas pre-processing (downscale/compression to max 1024px),
 * client-side WebAssembly background removal with mobile memory safeguards,
 * automatic fallback to server API endpoint (/api/remove-bg), and instant canvas segmentation fallback.
 */

export interface ValidationResult {
  valid: boolean;
  errorBn?: string;
  errorEn?: string;
}

export function validateImageFile(file: File): ValidationResult {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      errorBn: "শুধুমাত্র JPG, PNG বা WebP ফরম্যাটের ছবি আপলোড করুন।",
      errorEn: "Please upload a valid JPG, PNG, or WebP image file.",
    };
  }

  const maxSizeBytes = 20 * 1024 * 1024; // 20 MB
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      errorBn: "ছবির সাইজ ২০ মেগাবাইট (MB) এর কম হতে হবে।",
      errorEn: "Image size must be under 20 megabytes (MB).",
    };
  }

  return { valid: true };
}

export interface CutoutProgressStep {
  textBn: string;
  textEn: string;
  percent: number;
}

export const CUTOUT_STEPS: CutoutProgressStep[] = [
  { textBn: "ছবি আপলোড ও স্ক্যান হচ্ছে...", textEn: "Scanning photo composition...", percent: 20 },
  { textBn: "AI ব্যাকগ্রাউন্ড ডিটেক্ট করছে...", textEn: "Detecting background boundaries...", percent: 50 },
  { textBn: "প্রোডাক্টের এজ ও টেক্সচার আলাদা হচ্ছে...", textEn: "Segmenting fine fabric & product edges...", percent: 75 },
  { textBn: "3D কন্টাক্ট শ্যাডো ও লাইটিং তৈরি হচ্ছে...", textEn: "Synthesizing realistic 3D contact shadows...", percent: 92 },
  { textBn: "স্টুডিও ব্যানার প্রস্তুত!", textEn: "Studio composite ready!", percent: 100 },
];

/**
 * 1. Image Pre-processing:
 * Automatically downscale and compress image to a maximum dimension of 1024px
 * using an in-memory HTML5 canvas before passing to the background removal engine.
 * Prevents mobile browser freezing, WebAssembly OOM errors, and tab crashes.
 */
export async function preprocessImage(
  source: File | Blob | string,
  maxDimension = 1024
): Promise<string> {
  if (typeof window === "undefined" || !source) {
    return typeof source === "string" ? source : "";
  }

  return new Promise((resolve, reject) => {
    let objectUrl: string | null = null;
    let imageSrc = "";

    if (typeof source === "string") {
      imageSrc = source;
    } else if (typeof Blob !== "undefined" && source instanceof Blob) {
      objectUrl = URL.createObjectURL(source);
      imageSrc = objectUrl;
    } else {
      return reject(new Error("Invalid image source provided for pre-processing"));
    }

    const img = new Image();
    if (!imageSrc.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }

    // Safety timeout: 4 seconds maximum so processing never hangs
    const timeoutId = setTimeout(() => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (typeof source === "string") {
        resolve(source);
      } else {
        reject(new Error("Image pre-processing timed out"));
      }
    }, 4000);

    img.onload = () => {
      clearTimeout(timeoutId);
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          resolve(typeof source === "string" ? source : imageSrc);
          return;
        }

        // Downscale preserving aspect ratio to maximum 1024px
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // In-memory HTML5 Canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          resolve(typeof source === "string" ? source : imageSrc);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Format determination: preserve transparent PNG if applicable, otherwise JPEG 0.88 for compact RAM usage
        const isPng =
          (typeof source === "string" && source.startsWith("data:image/png")) ||
          (typeof source === "object" && source !== null && "type" in source && (source as File).type === "image/png");

        const outputFormat = isPng ? "image/png" : "image/jpeg";
        const quality = isPng ? undefined : 0.88;

        const resultDataUrl = canvas.toDataURL(outputFormat, quality);

        // Immediate memory cleanup
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        canvas.width = 0;
        canvas.height = 0;

        resolve(resultDataUrl);
      } catch (err) {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        console.warn("Canvas pre-processing exception, fallback to source:", err);
        if (typeof source === "string") {
          resolve(source);
        } else {
          reject(err);
        }
      }
    };

    img.onerror = (err) => {
      clearTimeout(timeoutId);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      console.warn("Image load error in pre-processor:", err);
      if (typeof source === "string") {
        resolve(source);
      } else {
        reject(new Error("Failed to load image for pre-processing"));
      }
    };

    img.src = imageSrc;
  });
}

// Backwards-compatible alias for existing imports
export const downscaleImageIfNeeded = preprocessImage;

/**
 * Client-Side WebAssembly Background Removal attempt with mobile RAM safeguards
 */
async function tryClientWasmRemoval(
  imageSource: string,
  onProgress?: (message: string, percent: number) => void
): Promise<string> {
  if (typeof window === "undefined" || typeof WebAssembly === "undefined") {
    throw new Error("WebAssembly is not available on this platform");
  }

  // Check for device memory if reported by browser (e.g. mobile < 2GB RAM)
  const nav = navigator as any;
  if (nav.deviceMemory && nav.deviceMemory < 2) {
    throw new Error("Mobile device RAM is too low (< 2GB) for client-side WebAssembly inference");
  }

  // 8-second safety timeout: if model loading or inference takes too long on mobile, abort immediately
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error("Client-side WebAssembly timeout (8s limit reached)")),
      8000
    )
  );

  const wasmTask = (async () => {
    const { removeBackground } = await import("@imgly/background-removal");
    const blob = await removeBackground(imageSource, {
      progress: (_key: string, current: number, total: number) => {
        if (total > 0) {
          const pct = Math.min(60, Math.round(25 + (current / total) * 35));
          onProgress?.("ডিভাইসে AI ব্যাকগ্রাউন্ড পৃথক করছে...", pct);
        }
      },
    });

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  })();

  return Promise.race([wasmTask, timeoutPromise]);
}

/**
 * Server API Endpoint (/api/remove-bg) caller with timeout
 */
async function callServerRemoveBg(base64Image: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

  try {
    const res = await fetch("/api/remove-bg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server API responded with HTTP status ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.cutout) {
      return data.cutout;
    }
    return null;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * 2. Robust Background Removal Pipeline with Fallback & Memory Safety:
 * - Pre-processes image down to max 1024px using HTML5 canvas
 * - Attempts client-side Wasm processing with strict mobile RAM/timeout safeguards
 * - If client-side fails (due to mobile WebAssembly/RAM limits), automatically falls back to /api/remove-bg
 * - If server API is unavailable, falls back to lightweight in-memory canvas segmentation
 * - If all fail, throws clear user-facing error message: "প্রসেসিংয়ে সমস্যা হয়েছে, অনুগ্রহ করে ছোট সাইজের ছবি দিন"
 */
export async function removeBackgroundAI(
  imageSource: string | File | Blob,
  onProgress?: (message: string, percent: number) => void
): Promise<string> {
  // Step 1: In-memory HTML5 Canvas pre-processing (downscale & compress to max 1024px)
  onProgress?.("ছবি অপ্টিমাইজ ও কম্প্রেস করা হচ্ছে (Max 1024px)...", 15);
  const preprocessedImage = await preprocessImage(imageSource, 1024);

  let cutoutResult: string | null = null;

  // Step 2: Attempt client-side processing (WebAssembly / ONNX engine)
  try {
    onProgress?.("ডিভাইসের AI ইঞ্জিন যাচাই করা হচ্ছে...", 30);
    cutoutResult = await tryClientWasmRemoval(preprocessedImage, onProgress);
    if (cutoutResult) {
      onProgress?.("স্টুডিও কাটআউট প্রস্তুত!", 100);
      return cutoutResult;
    }
  } catch (clientWasmErr: any) {
    console.warn(
      "Client-side processing failed or limited by mobile WebAssembly/RAM. Automatically falling back to /api/remove-bg:",
      clientWasmErr?.message || clientWasmErr
    );
  }

  // Step 3: Automatic fallback to server API endpoint (/api/remove-bg)
  try {
    onProgress?.("সার্ভার AI এপিআই দিয়ে ব্যাকগ্রাউন্ড কাটা হচ্ছে...", 60);
    cutoutResult = await callServerRemoveBg(preprocessedImage);
    if (cutoutResult) {
      onProgress?.("প্রিমিয়াম স্টুডিও কাটআউট প্রস্তুত!", 100);
      return cutoutResult;
    }
  } catch (serverErr: any) {
    console.warn("Server API (/api/remove-bg) fallback failed or timed out:", serverErr?.message || serverErr);
  }

  // Step 4: Ultra-fast local canvas segmentation fallback (15ms, zero RAM freeze)
  try {
    onProgress?.("ক্যানভাস কালার সেগমেন্টেশন প্রয়োগ করা হচ্ছে...", 85);
    cutoutResult = await removeBackgroundClientSide(preprocessedImage);
    if (cutoutResult && cutoutResult !== preprocessedImage) {
      onProgress?.("কাটআউট সম্পন্ন!", 100);
      return cutoutResult;
    }
  } catch (canvasErr) {
    console.warn("Local canvas segmentation fallback failed:", canvasErr);
  }

  // Step 5: If all engines failed, throw clear error
  throw new Error("প্রসেসিংয়ে সমস্যা হয়েছে, অনুগ্রহ করে ছোট সাইজের ছবি দিন");
}

/**
 * Ultra-fast, lightweight canvas-based background segmentation fallback:
 * Analyzes corner pixel colors and performs alpha thresholding with squared distance
 * Optimized for mobile devices to prevent thread blocking (runs in ~15ms).
 */
export async function removeBackgroundClientSide(
  imageSource: string | HTMLImageElement
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = typeof imageSource === "string" ? new Image() : imageSource;
    if (typeof imageSource === "string") {
      img.crossOrigin = "anonymous";
      img.src = imageSource;
    }

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const maxDim = 1024;
        let w = img.width;
        let h = img.height;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(typeof imageSource === "string" ? imageSource : img.src);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        // Sample corner colors
        const corners = [
          [0, 0],
          [w - 1, 0],
          [0, h - 1],
          [w - 1, h - 1],
        ];

        let bgR = 0, bgG = 0, bgB = 0;
        for (const [cx, cy] of corners) {
          const idx = (cy * w + cx) * 4;
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        }
        bgR /= corners.length;
        bgG /= corners.length;
        bgB /= corners.length;

        const tolerance = 60;
        const feather = 30;
        const tolSq = tolerance * tolerance;
        const maxTolSq = (tolerance + feather) * (tolerance + feather);

        // Fast squared distance calculation: avoids Math.sqrt on majority of pixels
        for (let i = 0; i < data.length; i += 4) {
          const dr = data[i] - bgR;
          const dg = data[i + 1] - bgG;
          const db = data[i + 2] - bgB;

          const distSq = dr * dr + dg * dg + db * db;

          if (distSq < tolSq) {
            data[i + 3] = 0;
          } else if (distSq < maxTolSq) {
            const dist = Math.sqrt(distSq);
            const alphaRatio = (dist - tolerance) / feather;
            data[i + 3] = Math.round(data[i + 3] * Math.max(0, Math.min(1, alphaRatio)));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const result = canvas.toDataURL("image/png");
        canvas.width = 0;
        canvas.height = 0;
        resolve(result);
      } catch (err) {
        console.warn("Canvas cutout fallback error, using source:", err);
        resolve(typeof imageSource === "string" ? imageSource : img.src);
      }
    };

    img.onerror = (e) => reject(e);
  });
}
