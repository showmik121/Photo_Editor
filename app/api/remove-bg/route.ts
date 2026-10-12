import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // 60 seconds timeout for AI generation

// Reusable cached client instances across requests for Hugging Face
let cachedRmbg14Client: any = null;
let cachedRmbg20Client: any = null;

async function getRmbg14Client(token: string) {
  if (!cachedRmbg14Client) {
    const { Client } = await import("@gradio/client");
    cachedRmbg14Client = await Client.connect("briaai/BRIA-RMBG-1.4", { token } as any);
  }
  return cachedRmbg14Client;
}

async function getRmbg20Client(token: string) {
  if (!cachedRmbg20Client) {
    const { Client } = await import("@gradio/client");
    cachedRmbg20Client = await Client.connect("briaai/BRIA-RMBG-2.0", { token } as any);
  }
  return cachedRmbg20Client;
}

export async function POST(req: NextRequest) {
  try {
    let imageBuffer: Buffer | null = null;
    let mimeType = "image/png";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json(
          { error: "কোনো ছবি পাওয়া যায়নি (No image file uploaded)" },
          { status: 400 }
        );
      }
      imageBuffer = Buffer.from(await file.arrayBuffer());
      mimeType = file.type || "image/png";
    } else {
      const body = await req.json();
      const base64Str = body.image || "";
      if (!base64Str) {
        return NextResponse.json(
          { error: "ছবির ডেটা পাওয়া যায়নি (Image data missing)" },
          { status: 400 }
        );
      }
      const match = base64Str.match(/^data:(.*?);base64,(.*)$/);
      if (match) {
        mimeType = match[1] || "image/png";
        imageBuffer = Buffer.from(match[2], "base64");
      } else {
        imageBuffer = Buffer.from(base64Str, "base64");
      }
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      return NextResponse.json(
        { error: "অবৈধ ছবির ফাইল (Invalid image data)" },
        { status: 400 }
      );
    }

    const base64DataUrl = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;

    // =========================================================================
    // 1. PRIMARY PRODUCTION ENGINE: fal.ai 'bria/rmbg-2.0'
    // Endpoint: fal-ai/bria/background/remove
    // =========================================================================
    const falKey = process.env.FAL_KEY || process.env.FAL_API_KEY || "";
    if (falKey) {
      try {
        const falRes = await fetch("https://fal.run/fal-ai/bria/background/remove", {
          method: "POST",
          headers: {
            Authorization: `Key ${falKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: base64DataUrl,
          }),
        });

        if (falRes.ok) {
          const falData = await falRes.json();
          const cutoutUrl = falData?.image?.url;
          if (cutoutUrl) {
            const cutRes = await fetch(cutoutUrl);
            if (cutRes.ok) {
              const cutBuf = Buffer.from(await cutRes.arrayBuffer());
              const dataUrl = `data:image/png;base64,${cutBuf.toString("base64")}`;
              return NextResponse.json({
                success: true,
                source: "fal-bria-rmbg-2.0",
                cutout: dataUrl,
              });
            }
          }
        } else {
          console.warn("fal.ai responded with HTTP status", falRes.status);
        }
      } catch (falErr: any) {
        console.warn("fal.ai bria/rmbg-2.0 error, trying backup engines:", falErr?.message || falErr);
      }
    }

    // =========================================================================
    // 2. SECONDARY ENGINE: rembg microservice (if REMBG_URL is configured)
    // =========================================================================
    const rembgUrl = process.env.REMBG_URL || "";
    if (rembgUrl) {
      try {
        const form = new FormData();
        form.append("file", new Blob([new Uint8Array(imageBuffer)], { type: mimeType }), "input.png");
        const remRes = await fetch(rembgUrl, { method: "POST", body: form });
        if (remRes.ok) {
          const remBuf = Buffer.from(await remRes.arrayBuffer());
          return NextResponse.json({
            success: true,
            source: "rembg-service",
            cutout: `data:image/png;base64,${remBuf.toString("base64")}`,
          });
        }
      } catch (remErr: any) {
        console.warn("rembg service error:", remErr?.message || remErr);
      }
    }

    // =========================================================================
    // 3. TERTIARY ENGINE: Hugging Face BRIA RMBG-2.0 & RMBG-1.4 (with HF_TOKEN)
    // =========================================================================
    const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || "";
    if (hfToken) {
      const imageBlob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });

      // 3A. Hugging Face BRIA RMBG-2.0
      try {
        const client2 = await getRmbg20Client(hfToken);
        const result2: any = await client2.predict("/image", {
          image: imageBlob,
        });

        if (result2 && result2.data && Array.isArray(result2.data)) {
          const cutoutFile = result2.data[1] || result2.data[0];
          const fileUrl = cutoutFile?.url || (Array.isArray(cutoutFile) ? cutoutFile[0]?.url : null);

          if (fileUrl) {
            const cutRes = await fetch(fileUrl, {
              headers: { Authorization: `Bearer ${hfToken}` },
            });

            if (cutRes.ok) {
              const cutBuf = Buffer.from(await cutRes.arrayBuffer());
              const dataUrl = `data:image/png;base64,${cutBuf.toString("base64")}`;
              return NextResponse.json({
                success: true,
                source: "huggingface-rmbg-2.0",
                cutout: dataUrl,
              });
            }
          }
        }
      } catch (rmbg20Err: any) {
        console.warn("RMBG-2.0 error, trying RMBG-1.4:", rmbg20Err?.message || rmbg20Err);
        cachedRmbg20Client = null;
      }

      // 3B. Hugging Face BRIA RMBG-1.4
      try {
        const client1 = await getRmbg14Client(hfToken);
        const result1: any = await client1.predict("/run", {
          image: imageBlob,
        });

        if (result1 && result1.data && Array.isArray(result1.data)) {
          const cutoutFile = result1.data[1] || result1.data[0];
          const fileUrl = cutoutFile?.url || (Array.isArray(cutoutFile) ? cutoutFile[0]?.url : null);

          if (fileUrl) {
            const cutRes = await fetch(fileUrl, {
              headers: { Authorization: `Bearer ${hfToken}` },
            });

            if (cutRes.ok) {
              const cutBuf = Buffer.from(await cutRes.arrayBuffer());
              const dataUrl = `data:image/png;base64,${cutBuf.toString("base64")}`;
              return NextResponse.json({
                success: true,
                source: "huggingface-rmbg-1.4",
                cutout: dataUrl,
              });
            }
          }
        }
      } catch (rmbg14Err: any) {
        console.warn("RMBG-1.4 error:", rmbg14Err?.message || rmbg14Err);
        cachedRmbg14Client = null;
      }
    }

    // =========================================================================
    // 4. FALLBACK TO CLIENT-SIDE WASM:
    // If no server keys are configured or all cloud endpoints failed
    // =========================================================================
    return NextResponse.json({
      success: false,
      fallbackToClient: true,
      message: "Server background removal unavailable or unconfigured, falling back to client-side engine.",
    });
  } catch (error: any) {
    console.error("API /api/remove-bg unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        fallbackToClient: true,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
