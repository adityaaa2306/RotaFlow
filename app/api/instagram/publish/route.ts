export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { publishProjectToInstagram } from "@/lib/instagram";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId } = body as { projectId?: string };

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const result = await publishProjectToInstagram(projectId);

    return NextResponse.json({
      success: true,
      media_id: result.mediaId,
      caption: result.caption,
      photo_count: result.photoCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to publish to Instagram";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
