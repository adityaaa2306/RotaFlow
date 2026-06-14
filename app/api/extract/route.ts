export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { callNimJson } from "@/lib/nim";
import { buildExtractionPrompt } from "@/lib/prompts";
import type { ExtractedProject } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { narrative } = body as { narrative?: string };

    if (!narrative || typeof narrative !== "string" || narrative.trim() === "") {
      return NextResponse.json({ error: "narrative is required" }, { status: 400 });
    }

    const result = await callNimJson<ExtractedProject>(
      buildExtractionPrompt(narrative.trim())
    );

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
