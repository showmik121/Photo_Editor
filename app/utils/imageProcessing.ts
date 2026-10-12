/**
 * Image processing utilities for Chobi Studio
 * Handles file validation, HTML5 canvas pre-compression (downscale to max 1024px),
 * Production server background removal pipeline (/api/remove-bg: fal.ai bria/rmbg-2.0, rembg, Hugging Face RMBG-2.0),
 * and client-side @imgly/background-removal fallback on downscaled images (<= 800px).
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
  { textBn: "ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", textEn: "Processing photo, please wait...", percent: 20 },
  { textBn: "ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", textEn: "Processing photo, please wait...", percent: 50 },
  { textBn: "ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", textEn: "Processing photo, please wait...", percent: 75 },
  { textBn: "ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", textEn: "Processing photo, please wait...", percent: 90 },
  { textBn: "স্টুডিও ব্যানার প্রস্তুত!", textEn: "Studio composite ready!", percent: 100 },
];

/**
 * 1. Client-Side Image Pre-compression (Crucial for Mobile):
 * Automatically downscale and compress uploaded images to a maximum dimension
 * of 1024px using an in-memory HTML5 Canvas before any processing.
 * Prevents mobile memory crashes and fixes edge-detection failures.
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

    // Safety timeout: 4 seconds maximum so decoding never freezes
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

        // Downscale preserving aspect ratio to maximum dimension (e.g. 1024px or 800px)
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

        // Format determination: preserve transparent PNG if applicable, otherwise compact JPEG
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

// Backwards-compatible alias
export const downscaleImageIfNeeded = preprocessImage;

/**
 * Production Server API Endpoint (/api/remove-bg) Caller:
 * Calls server endpoint which uses fal.ai bria/rmbg-2.0, rembg, or Hugging Face RMBG-2.0
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
 * Client-Side @imgly/background-removal Fallback:
 * ONLY executed on downscaled images (<= 800px) when running purely client-side without API key
 */
async function runImglyBackgroundRemoval(
  imageSource: string,
  onProgress?: (message: string, percent: number) => void
): Promise<string> {
  if (typeof window === "undefined" || typeof WebAssembly === "undefined") {
    throw new Error("WebAssembly is not supported in this environment");
  }

  // 12-second safety timeout to avoid mobile freeze
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error("@imgly/background-removal timeout (12s limit reached)")),
      12000
    )
  );

  const wasmTask = (async () => {
    const { removeBackground } = await import("@imgly/background-removal");
    const blob = await removeBackground(imageSource, {
      progress: (_key: string, current: number, total: number) => {
        if (total > 0) {
          const pct = Math.min(85, Math.round(60 + (current / total) * 25));
          onProgress?.("ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", pct);
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
 * 2. Hybrid Production Background Removal Pipeline:
 * - Step 1: Pre-compress image to max 1024px using HTML5 Canvas (Crucial for mobile memory)
 * - Step 2: Dedicated Server Endpoint (/api/remove-bg) using fal.ai 'bria/rmbg-2.0', rembg, or Hugging Face
 * - Step 3: Fallback purely client-side: uses '@imgly/background-removal' ONLY on downscaled images (<= 800px) inside try/catch
 * - Step 4: Instant Canvas color thresholding segmentation fallback
 */
export async function removeBackgroundAI(
  imageSource: string | File | Blob,
  onProgress?: (message: string, percent: number) => void
): Promise<string> {
  // Step 1: Client-Side Pre-compression to max 1024px
  onProgress?.("ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", 20);
  const preprocessed1024 = await preprocessImage(imageSource, 1024);

  let cutoutResult: string | null = null;

  // Step 2: Dedicated Server Endpoint (/api/remove-bg) - fal.ai bria/rmbg-2.0 / rembg / HF
  try {
    onProgress?.("ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", 45);
    cutoutResult = await callServerRemoveBg(preprocessed1024);
    if (cutoutResult) {
      onProgress?.("ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", 100);
      return cutoutResult;
    }
  } catch (serverErr: any) {
    console.warn("Server API (/api/remove-bg) fallback, will try client-side fallback:", serverErr?.message || serverErr);
  }

  // Step 3: Purely Client-Side Fallback:
  // Use '@imgly/background-removal' ONLY on downscaled images (<= 800px) inside try/catch
  try {
    onProgress?.("ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", 65);
    const downscaled800 = await preprocessImage(preprocessed1024, 800);
    cutoutResult = await runImglyBackgroundRemoval(downscaled800, onProgress);
    if (cutoutResult) {
      onProgress?.("ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", 100);
      return cutoutResult;
    }
  } catch (wasmErr: any) {
    console.warn("@imgly/background-removal fallback failed or timed out:", wasmErr?.message || wasmErr);
  }

  // Step 4: Instant local canvas segmentation fallback (15ms, zero RAM crash)
  try {
    onProgress?.("ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", 85);
    cutoutResult = await removeBackgroundClientSide(preprocessed1024);
    if (cutoutResult && cutoutResult !== preprocessed1024) {
      onProgress?.("ছবি প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", 100);
      return cutoutResult;
    }
  } catch (canvasErr) {
    console.warn("Local canvas segmentation fallback failed:", canvasErr);
  }

  // If all attempts failed, throw clear error
  throw new Error("প্রসেসিংয়ে সমস্যা হয়েছে, অনুগ্রহ করে ছোট সাইজের ছবি দিন");
}

/**
 * Ultra-fast local canvas-based background segmentation fallback:
 * Analyzes corner pixel colors and performs alpha thresholding with squared distance.
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
        const maxDim = 800; // Capped at 800px for speed & zero RAM lag
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
