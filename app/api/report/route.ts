export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { callNimJson } from "@/lib/nim";
import { buildReportPrompt } from "@/lib/prompts";
import { calculateMetrics } from "@/lib/metrics";
import { mapCategoryToSDGs } from "@/lib/sdg-rules";
import type { ProjectCategory, ProjectFormData } from "@/types";

interface ReportSections {
  executive_summary: string;
  objectives: string;
  activities_conducted: string;
  outcomes: string;
  recommendations: string;
  closing_statement: string;
}

function toMetricsInput(data: ProjectFormData) {
  return {
    category: data.category || "Other",
    volunteers: typeof data.volunteers === "number" ? data.volunteers : 0,
    beneficiaries: typeof data.beneficiaries === "number" ? data.beneficiaries : 0,
    duration_hours: typeof data.duration_hours === "number" ? data.duration_hours : 0,
    partners: data.partners ?? [],
  };
}

export async function POST(request: Request) {
  try {
    const projectData = (await request.json()) as ProjectFormData;

    const report = await callNimJson<ReportSections>(
      buildReportPrompt(JSON.stringify(projectData))
    );

    const category: ProjectCategory = projectData.category || "Other";
    const sdgs = mapCategoryToSDGs(category);
    const metrics = calculateMetrics(toMetricsInput(projectData));

    return NextResponse.json({ report, sdgs, metrics }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
