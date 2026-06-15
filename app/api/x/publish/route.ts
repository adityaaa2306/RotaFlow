export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPublishErrorStatus, getXUsername, publishProjectToX } from "@/lib/getxapi";
import { recordSocialPost } from "@/lib/report-social";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId } = body as { projectId?: string };

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const result = await publishProjectToX(projectId);

    try {
      await recordSocialPost(projectId, "x", {
        url: result.tweetUrl,
        username: getXUsername(),
      });
    } catch {
      // Publishing succeeded; status persistence is best-effort.
    }

    return NextResponse.json({
      success: true,
      tweet_id: result.tweetId,
      tweet_url: result.tweetUrl,
      text: result.text,
      photo_count: result.photoCount,
      status: result.status,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to publish to X";
    const code = err instanceof Error && "code" in err ? String(err.code) : undefined;
    return NextResponse.json(
      { error: message, code },
      { status: getPublishErrorStatus(err) }
    );
  }
}
