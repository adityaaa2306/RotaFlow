"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { ReportView } from "@/components/ReportView";
import { calculateMetrics } from "@/lib/metrics";
import { generatePDF } from "@/lib/pdf-generator";
import { fetchProjectWithReportById, fetchPhotosByProjectId, insertReport } from "@/lib/supabase";
import { lux } from "@/lib/theme";
import type {
  ImpactMetrics,
  Photo,
  Project,
  ProjectFormData,
  ReportData,
  ReportRow,
  SocialKit,
} from "@/types";

const EMPTY_SOCIAL_KIT: SocialKit = {
  instagram: { caption: "", hashtags: [] },
  linkedin: { post: "" },
  twitter: { post: "" },
};

function projectToFormData(project: Project): ProjectFormData {
  return {
    club_name: project.club_name,
    project_name: project.project_name,
    category: project.category,
    date: project.date,
    volunteers: project.volunteers,
    beneficiaries: project.beneficiaries,
    duration_hours: project.duration_hours,
    partners: project.partners,
    activities: project.activities,
    description: project.description,
    raw_narrative: project.raw_narrative,
  };
}

function buildMetrics(project: Project): ImpactMetrics {
  return calculateMetrics({
    category: project.category,
    volunteers: project.volunteers,
    beneficiaries: project.beneficiaries,
    duration_hours: project.duration_hours,
    partners: project.partners,
  });
}

function reportRowToReportData(row: ReportRow, project: Project): ReportData {
  const metrics = buildMetrics(project);

  return {
    id: row.id,
    project_id: row.project_id,
    executive_summary: row.executive_summary ?? "",
    objectives: row.objectives ?? "",
    activities_conducted: row.activities_conducted ?? "",
    outcomes: row.outcomes ?? "",
    recommendations: row.recommendations ?? "",
    closing_statement: row.closing_statement ?? "",
    sdgs: row.sdgs ?? [],
    metrics: {
      ...metrics,
      volunteer_hours: row.volunteer_hours ?? metrics.volunteer_hours,
    },
    social_kit: row.social_kit ?? EMPTY_SOCIAL_KIT,
    created_at: row.created_at,
  };
}

async function generateReportForProject(loadedProject: Project): Promise<ReportData> {
  const formData = projectToFormData(loadedProject);

  const [reportResponse, socialResponse] = await Promise.all([
    fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }),
    fetch("/api/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: formData,
        report_summary: "",
      }),
    }),
  ]);

  const reportPayload = await reportResponse.json();
  const socialPayload = await socialResponse.json();

  if (!reportResponse.ok) {
    throw new Error(reportPayload.error ?? "Failed to generate report");
  }

  if (!socialResponse.ok) {
    throw new Error(socialPayload.error ?? "Failed to generate social media kit");
  }

  const { report: reportSections, sdgs, metrics } = reportPayload as {
    report: {
      executive_summary: string;
      objectives: string;
      activities_conducted: string;
      outcomes: string;
      recommendations: string;
      closing_statement: string;
    };
    sdgs: ReportData["sdgs"];
    metrics: ImpactMetrics;
  };
  const socialKit = socialPayload as SocialKit;

  const savedReport = await insertReport({
    project_id: loadedProject.id,
    executive_summary: reportSections.executive_summary,
    objectives: reportSections.objectives,
    activities_conducted: reportSections.activities_conducted,
    outcomes: reportSections.outcomes,
    recommendations: reportSections.recommendations,
    closing_statement: reportSections.closing_statement,
    sdgs,
    social_kit: socialKit,
    volunteer_hours: metrics.volunteer_hours,
  });

  return {
    id: savedReport.id,
    project_id: savedReport.project_id,
    executive_summary: savedReport.executive_summary ?? "",
    objectives: savedReport.objectives ?? "",
    activities_conducted: savedReport.activities_conducted ?? "",
    outcomes: savedReport.outcomes ?? "",
    recommendations: savedReport.recommendations ?? "",
    closing_statement: savedReport.closing_statement ?? "",
    sdgs: savedReport.sdgs ?? sdgs,
    metrics,
    social_kit: savedReport.social_kit ?? socialKit,
    created_at: savedReport.created_at,
  };
}

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hadExistingReport, setHadExistingReport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runReportGeneration = useCallback(async (loadedProject: Project) => {
    setIsGeneratingReport(true);
    setError(null);
    setReport(null);

    try {
      const generatedReport = await generateReportForProject(loadedProject);
      setReport(generatedReport);
      setHadExistingReport(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate report";
      setError(message);
    } finally {
      setIsGeneratingReport(false);
    }
  }, []);

  useEffect(() => {
    async function loadReport() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchProjectWithReportById(id);

        if (!result) {
          setError("Project not found");
          return;
        }

        const loadedProject = result.project;
        setProject(loadedProject);
        setPhotos(await fetchPhotosByProjectId(id));

        if (result.report) {
          setReport(reportRowToReportData(result.report, loadedProject));
          setHadExistingReport(true);
          return;
        }

        await runReportGeneration(loadedProject);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load report";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadReport();
  }, [id, runReportGeneration]);

  const handleRegenerateReport = useCallback(async () => {
    if (!project) {
      return;
    }

    await runReportGeneration(project);
  }, [project, runReportGeneration]);

  const handleDownloadPDF = useCallback(async () => {
    if (!project) {
      return;
    }

    setIsGeneratingPDF(true);

    try {
      await generatePDF(project.project_name);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate PDF";
      setError(message);
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rota-blue" />
        <p className="mt-3 text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (isGeneratingReport) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rota-blue" />
        <p className="mt-3 text-sm text-slate-500">Generating your report with AI...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-8">
        <div className={`flex gap-3 ${lux.bannerError}`}>
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (project && report) {
    return (
      <ReportView
        report={report}
        project={project}
        photos={photos}
        onDownloadPDF={handleDownloadPDF}
        isGeneratingPDF={isGeneratingPDF}
        onRegenerateReport={handleRegenerateReport}
        isRegenerating={isGeneratingReport}
        showRegenerate={hadExistingReport}
      />
    );
  }

  return null;
}
