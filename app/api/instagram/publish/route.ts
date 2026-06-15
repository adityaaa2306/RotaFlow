export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { publishProjectToInstagram } from "@/lib/instagram";
import { getInstagramConnection } from "@/lib/supabase-admin";
import { recordSocialPost } from "@/lib/report-social";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId } = body as { projectId?: string };

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const result = await publishProjectToInstagram(projectId);
    const connection = await getInstagramConnection();

    try {
      await recordSocialPost(projectId, "instagram", {
        url: null,
        username: connection?.username ?? null,
      });
    } catch {
      // Publishing succeeded; status persistence is best-effort.
    }

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
