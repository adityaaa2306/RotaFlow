export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { uploadProjectPhoto } from "@/lib/photo-upload";

const MAX_SERVER_UPLOAD_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const projectId = formData.get("projectId");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    if (typeof projectId !== "string" || !projectId.trim()) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    if (file.size > MAX_SERVER_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          error:
            "Photo is too large to process. Please choose a smaller image or use iPhone Camera > Formats > Most Compatible.",
        },
        { status: 413 }
      );
    }

    const result = await uploadProjectPhoto(projectId.trim(), file);

    return NextResponse.json({
      success: true,
      storage_url: result.storageUrl,
      caption: result.caption,
      is_highlight: result.isHighlight,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to upload photo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
