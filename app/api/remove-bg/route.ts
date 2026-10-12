import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // 60 seconds timeout for AI generation

// Reusable cached client instances across requests
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

    const token =
      process.env.HF_TOKEN ||
      process.env.HUGGINGFACE_API_KEY ||
      "";

    const imageBlob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });

    // 1. Primary Engine: Hugging Face BRIA RMBG-1.4 (Unlimited, No ZeroGPU Quota Limit, Fast ~4s)
    try {
      const client = await getRmbg14Client(token);
      const result: any = await client.predict("/run", {
        image: imageBlob,
      });

      if (result && result.data && Array.isArray(result.data)) {
        // Output format: [ [preview1, preview2], { path, url, orig_name: 'no_bg_image.png' } ]
        const cutoutFile = result.data[1] || result.data[0];
        const fileUrl = cutoutFile?.url || (Array.isArray(cutoutFile) ? cutoutFile[0]?.url : null);

        if (fileUrl) {
          const cutRes = await fetch(fileUrl, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
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
      console.warn("RMBG-1.4 error, trying RMBG-2.0:", rmbg14Err?.message || rmbg14Err);
      cachedRmbg14Client = null; // reset cache on failure
    }

    // 2. Secondary Engine: Hugging Face BRIA RMBG-2.0
    try {
      const client2 = await getRmbg20Client(token);
      const result2: any = await client2.predict("/image", {
        image: imageBlob,
      });

      if (result2 && result2.data && Array.isArray(result2.data)) {
        const cutoutFile = result2.data[1] || result2.data[0];
        const fileUrl = cutoutFile?.url || (Array.isArray(cutoutFile) ? cutoutFile[0]?.url : null);

        if (fileUrl) {
          const cutRes = await fetch(fileUrl, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
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
      console.warn("RMBG-2.0 error:", rmbg20Err?.message || rmbg20Err);
      cachedRmbg20Client = null; // reset cache on failure
    }

    // 3. Fallback indication: instruct client to use instant canvas segmentation
    return NextResponse.json({
      success: false,
      fallbackToLocal: true,
      message: "ক্লাউড এআই এই মুহূর্তে ব্যস্ত, ইনস্ট্যান্ট ক্যানভাস ইঞ্জিন দিয়ে রিমুভ করা হচ্ছে।",
    });
  } catch (error: any) {
    console.error("API /api/remove-bg unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        fallbackToLocal: true,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
