import Link from "next/link";
import { Calendar, Heart, Users } from "lucide-react";
import type { Project, ProjectCategory } from "@/types";

export interface ProjectCardProps {
  project: Project;
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

function formatDate(date: string): string {
  if (!date) {
    return "Date not set";
  }
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <div className="flex justify-end">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_BADGE_CLASSES[project.category]}`}
        >
          {project.category}
        </span>
      </div>

      <h2 className="mt-2 text-base font-semibold text-slate-900">{project.project_name}</h2>
      <p className="text-sm text-slate-500">{project.club_name}</p>

      <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <Calendar className="h-3 w-3" />
        {formatDate(project.date)}
      </p>

      <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1">
          <Users className="h-4 w-4 text-slate-500" />
          {project.volunteers}
        </span>
        <span className="inline-flex items-center gap-1">
          <Heart className="h-4 w-4 text-slate-500" />
          {project.beneficiaries}
        </span>
      </div>

      <Link
        href={`/report/${project.id}`}
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        View Report →
      </Link>
    </article>
  );
}
