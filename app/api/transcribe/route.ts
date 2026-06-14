export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/deepgram";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("Content-Type") ?? "audio/webm";
    const arrayBuffer = await request.arrayBuffer();

    if (arrayBuffer.byteLength === 0) {
      return NextResponse.json({ error: "Audio body is required" }, { status: 400 });
    }

    const audioBlob = new Blob([arrayBuffer], { type: contentType });
    const transcript = await transcribeAudio(audioBlob);

    return NextResponse.json({ transcript });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transcription failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
