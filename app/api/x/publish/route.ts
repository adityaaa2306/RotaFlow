export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPublishErrorStatus, publishProjectToX } from "@/lib/getxapi";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId } = body as { projectId?: string };

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const result = await publishProjectToX(projectId);

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
