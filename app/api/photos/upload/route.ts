export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { uploadProjectPhoto } from "@/lib/photo-upload";

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
