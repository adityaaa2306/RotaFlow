"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Globe,
  Handshake,
  Lightbulb,
  ListChecks,
  Loader2,
  MapPin,
  Quote,
  RefreshCw,
  Share2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { MetricsCard } from "@/components/MetricsCard";
import { SDGBadges } from "@/components/SDGBadges";
import { SocialMediaKit } from "@/components/SocialMediaKit";
import type { Project, ProjectCategory, ReportData } from "@/types";

export interface ReportViewProps {
  report: ReportData;
  project: Project;
  onDownloadPDF: () => void;
  isGeneratingPDF: boolean;
  onRegenerateReport?: () => void;
  isRegenerating?: boolean;
  showRegenerate?: boolean;
}

const CATEGORY_BADGE_CLASSES: Record<ProjectCategory, string> = {
  Healthcare: "bg-red-50 text-red-700",
  Education: "bg-blue-50 text-blue-700",
  Environment: "bg-green-50 text-green-700",
  "Hunger Relief": "bg-orange-50 text-orange-700",
  "Women Empowerment": "bg-purple-50 text-purple-700",
  Sanitation: "bg-cyan-50 text-cyan-700",
  "Community Development": "bg-indigo-50 text-indigo-700",
  Other: "bg-slate-50 text-slate-700",
};

const REPORT_SECTIONS = [
  { title: "Executive Summary", icon: FileText, key: "executive_summary" as const },
  { title: "Objectives", icon: Target, key: "objectives" as const },
  { title: "Activities Conducted", icon: ListChecks, key: "activities_conducted" as const },
  { title: "Outcomes Achieved", icon: TrendingUp, key: "outcomes" as const },
  { title: "Recommendations", icon: Lightbulb, key: "recommendations" as const },
  { title: "Closing Statement", icon: Quote, key: "closing_statement" as const, italic: true },
];

function formatDate(date: string): string {
  if (!date) {
    return "—";
  }
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
      <Icon className="h-5 w-5 text-blue-600" />
      {children}
    </h2>
  );
}

export function ReportView({
  report,
  project,
  onDownloadPDF,
  isGeneratingPDF,
  onRegenerateReport,
  isRegenerating = false,
  showRegenerate = false,
}: ReportViewProps) {
  const partnersLabel =
    project.partners.length > 0 ? project.partners.join(", ") : "No partners listed";

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <p className="font-semibold text-slate-900">{project.project_name}</p>
          <div className="flex items-center gap-2">
            {showRegenerate && onRegenerateReport && (
              <button
                type="button"
                onClick={onRegenerateReport}
                disabled={isRegenerating || isGeneratingPDF}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRegenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                <RefreshCw className="h-4 w-4" />
                Regenerate Report
              </button>
            )}
            <button
              type="button"
              onClick={onDownloadPDF}
              disabled={isGeneratingPDF || isRegenerating}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGeneratingPDF && <Loader2 className="h-4 w-4 animate-spin" />}
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div id="pdf-content" className="mx-auto max-w-5xl space-y-8 p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{project.club_name}</p>
          <h1 className="text-2xl font-bold text-slate-900">{project.project_name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              {formatDate(project.date)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              {project.volunteers} volunteers
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              {partnersLabel}
            </span>
          </div>
          <span
            className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_BADGE_CLASSES[project.category]}`}
          >
            {project.category}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <MetricsCard
            label="Volunteer Hours"
            value={report.metrics.volunteer_hours}
            icon={Clock}
            color="blue"
          />
          <MetricsCard
            label="Beneficiaries Reached"
            value={report.metrics.beneficiaries_reached}
            icon={Users}
            color="green"
          />
          <MetricsCard
            label="Partnerships"
            value={report.metrics.partnerships_mobilized}
            icon={Handshake}
            color="purple"
          />
        </div>

        {REPORT_SECTIONS.map(({ title, icon: Icon, key, italic }) => (
          <div
            key={key}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <SectionHeading icon={Icon}>{title}</SectionHeading>
            <p className={`text-sm text-slate-600 ${italic ? "italic" : ""}`}>
              {report[key]}
            </p>
          </div>
        ))}

        <section>
          <SectionHeading icon={Globe}>SDG Alignment</SectionHeading>
          <SDGBadges sdgs={report.sdgs} />
        </section>

        <section>
          <SectionHeading icon={Share2}>Social Media Kit</SectionHeading>
          <SocialMediaKit socialKit={report.social_kit} />
        </section>
      </div>
    </div>
  );
}
