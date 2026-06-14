"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileX, Search } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { lux } from "@/lib/theme";
import { fetchAllProjects } from "@/lib/supabase";
import type { Project, ProjectCategory } from "@/types";

const CATEGORIES: ProjectCategory[] = [
  "Healthcare",
  "Education",
  "Environment",
  "Hunger Relief",
  "Women Empowerment",
  "Sanitation",
  "Community Development",
  "Other",
];

const inputClassName = lux.input;

function ProjectCardSkeleton() {
  return (
    <div className="lux-card">
      <div className="flex justify-end">
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <Skeleton className="mt-3 h-3 w-32" />
      <div className="mt-4 flex gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="mt-4 h-4 w-28" />
    </div>
  );
}

function getProjectYear(date: string): string | null {
  if (!date) {
    return null;
  }
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? null : String(year);
}

export default function ArchivePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      const data = await fetchAllProjects();
      setProjects(data);
      setIsLoading(false);
    }

    loadProjects();
  }, []);

  async function handleDeleteProject(projectId: string) {
    const project = projects.find((entry) => entry.id === projectId);
    const label = project?.project_name ?? "this project";

    if (
      !window.confirm(
        `Delete "${label}" and its report, photos, and social posts? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingProjectId(projectId);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete project");
      }

      setProjects((current) => current.filter((entry) => entry.id !== projectId));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete project";
      setDeleteError(message);
    } finally {
      setDeletingProjectId(null);
    }
  }

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    for (const project of projects) {
      const year = getProjectYear(project.date);
      if (year) {
        years.add(year);
      }
    }
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.project_name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || project.category === categoryFilter;

      const projectYear = getProjectYear(project.date);
      const matchesYear =
        yearFilter === "all" || projectYear === yearFilter;

      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [projects, searchQuery, categoryFilter, yearFilter]);

  const filtersActive =
    searchQuery.trim().length > 0 ||
    categoryFilter !== "all" ||
    yearFilter !== "all";

  return (
    <div className="mx-auto max-w-7xl p-8">
      <header className={lux.pageHeader}>
        <h1 className={lux.pageTitle}>Project Archive</h1>
        <p className={lux.pageSubtitle}>All your documented initiatives.</p>
      </header>

      <div className="sticky top-20 z-10 bg-neutral-100 pb-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative md:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search projects..."
              className={`${inputClassName} pl-9`}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className={`${inputClassName} px-3`}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={yearFilter}
            onChange={(event) => setYearFilter(event.target.value)}
            className={`${inputClassName} px-3`}
          >
            <option value="all">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {!isLoading && (
          <p className="mt-3 text-sm text-slate-500">
            Showing {filteredProjects.length} projects
          </p>
        )}

        {deleteError && (
          <p className={`mt-3 ${lux.bannerError}`}>
            {deleteError}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileX className="h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-lg font-semibold text-slate-800">No projects found</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            {filtersActive
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Submit your first project to get started."}
          </p>
          {!filtersActive && (
            <Link
              href="/submit"
              className={`${lux.btnPrimary} mt-6`}
            >
              Submit Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
              isDeleting={deletingProjectId === project.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
