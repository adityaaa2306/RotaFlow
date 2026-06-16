"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Globe,
  Handshake,
  ImageIcon,
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
import { lux } from "@/lib/theme";
import { SDGBadges } from "@/components/SDGBadges";
import { SocialMediaKit } from "@/components/SocialMediaKit";
import { SocialPostsStatus } from "@/components/SocialPostsStatus";
import { InstagramPublish } from "@/components/InstagramPublish";
import { XPublish } from "@/components/XPublish";
import type { Photo, Project, ProjectCategory, ReportData, SocialPostRecord, SocialPosts } from "@/types";

export interface ReportViewProps {
  report: ReportData;
  project: Project;
  photos: Photo[];
  onDownloadPDF: () => void;
  isGeneratingPDF: boolean;
  onRegenerateReport?: () => void;
  isRegenerating?: boolean;
  showRegenerate?: boolean;
  focusSocials?: boolean;
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
    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight text-neutral-900">
      <Icon className="h-5 w-5 text-neutral-700" />
      {children}
    </h2>
  );
}

export function ReportView({
  report,
  project,
  photos,
  onDownloadPDF,
  isGeneratingPDF,
  onRegenerateReport,
  isRegenerating = false,
  showRegenerate = false,
  focusSocials = false,
}: ReportViewProps) {
  const partnersLabel =
    project.partners.length > 0 ? project.partners.join(", ") : "No partners listed";
  const [socialPosts, setSocialPosts] = useState<SocialPosts>(report.social_posts ?? {});

  useEffect(() => {
    setSocialPosts(report.social_posts ?? {});
  }, [report.social_posts]);

  useEffect(() => {
    if (!focusSocials) {
      return;
    }

    const timer = window.setTimeout(() => {
      document.getElementById("report-socials")?.scrollIntoView({ behavior: "smooth" });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [focusSocials]);

  function handleSocialPostPublished(record: SocialPostRecord) {
    setSocialPosts((prev) => ({ ...prev, [record.platform]: record }));
  }

  return (
    <div>
      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md md:sticky md:top-[4.5rem] md:z-40">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-4">
          <Link
            href={focusSocials ? "/dashboard" : "/archive"}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {focusSocials ? "Back to Dashboard" : "Back"}
          </Link>
          <p className="min-w-0 break-words text-lg font-semibold leading-tight text-slate-900 md:text-center md:text-base">
            {focusSocials ? "Social Media Kit" : project.project_name}
          </p>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
            {!focusSocials && showRegenerate && onRegenerateReport && (
              <button
                type="button"
                onClick={onRegenerateReport}
                disabled={isRegenerating || isGeneratingPDF}
                className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 text-center text-xs font-medium leading-tight text-[#334155] transition duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-sm"
              >
                {isRegenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                <RefreshCw className="h-4 w-4 shrink-0" />
                <span>Regenerate<span className="hidden sm:inline"> Report</span></span>
              </button>
            )}
            {!focusSocials && (
              <button
                type="button"
                onClick={onDownloadPDF}
                disabled={isGeneratingPDF || isRegenerating}
                className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-full bg-[#2A85FF] px-3 text-center text-xs font-semibold leading-tight text-white shadow-[0_4px_20px_rgb(42,133,255,0.35)] transition duration-200 hover:bg-[#2270E0] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-sm"
              >
                {isGeneratingPDF && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Download PDF</span>
              </button>
            )}
            {focusSocials && (
              <Link href={`/report/${project.id}`} className={lux.btnSecondary}>
                View Full Report
              </Link>
            )}
          </div>
        </div>
      </div>

      {!focusSocials && (
        <div id="pdf-content" className="mx-auto w-full max-w-5xl space-y-6 bg-white px-4 py-6 sm:px-6 lg:p-8">
          <div data-pdf-section className="lux-card">
            <p className="text-sm text-slate-500">{project.club_name}</p>
            <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              {project.project_name}
            </h1>
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

          {photos.length > 0 && (
            <section data-pdf-section className="lux-card">
              <SectionHeading icon={ImageIcon}>Event Photos</SectionHeading>
              <div className="report-photos-grid grid grid-cols-2 gap-4">
                {photos.map((photo) => (
                  <figure key={photo.id} className="overflow-hidden rounded-2xl border border-slate-200/70">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.storage_url}
                      alt={photo.caption || "Project photo"}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    {photo.caption && (
                      <figcaption className="border-t border-slate-100 px-3 py-2 text-xs text-slate-600">
                        {photo.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          <div data-pdf-section className="report-metrics-grid grid grid-cols-1 gap-4 sm:grid-cols-3">
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
            <div key={key} data-pdf-section className="lux-card">
              <SectionHeading icon={Icon}>{title}</SectionHeading>
              <p className={`break-words text-sm leading-relaxed text-slate-600 ${italic ? "italic" : ""}`}>
                {report[key]}
              </p>
            </div>
          ))}

          <section data-pdf-section className="lux-card">
            <SectionHeading icon={Globe}>SDG Alignment</SectionHeading>
            <SDGBadges sdgs={report.sdgs} />
          </section>
        </div>
      )}

      <section
        id="report-socials"
        className={`mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:p-8 ${focusSocials ? "" : "border-t border-slate-200/80"}`}
      >
        <div>
          <SectionHeading icon={Share2}>Social Media Kit</SectionHeading>
          <p className="mb-6 text-sm text-slate-500">
            Copy-ready posts for each platform and publish directly to Instagram or X.
          </p>
        </div>

        <SocialPostsStatus socialPosts={socialPosts} />
        <SocialMediaKit socialKit={report.social_kit} />
        <div className="space-y-6">
          <InstagramPublish
            projectId={project.id}
            onPublished={handleSocialPostPublished}
          />
          <XPublish projectId={project.id} onPublished={handleSocialPostPublished} />
        </div>
      </section>
    </div>
  );
}
