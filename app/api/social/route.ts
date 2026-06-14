export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { callNimJson } from "@/lib/nim";
import { buildSocialPrompt } from "@/lib/prompts";
import type { ProjectFormData, SocialKit } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project, report_summary } = body as {
      project: ProjectFormData;
      report_summary: string;
    };

    const socialKit = await callNimJson<SocialKit>(
      buildSocialPrompt(project, report_summary)
    );

    return NextResponse.json(socialKit, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
