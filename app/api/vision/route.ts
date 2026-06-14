export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { EMPTY_VISION_RESULT, analyzeImageSafe } from "@/lib/vision";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType } = body as {
      imageBase64?: string;
      mimeType?: string;
    };

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 });
    }

    const result = await analyzeImageSafe(imageBase64, mimeType || "image/jpeg");
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[NIM vision failed]", err);
    }
    return NextResponse.json(EMPTY_VISION_RESULT, { status: 200 });
  }
}
