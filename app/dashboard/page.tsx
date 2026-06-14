"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FolderOpen,
  Handshake,
  Heart,
  Loader2,
  Users,
} from "lucide-react";
import { MetricsCard } from "@/components/MetricsCard";
import { DEMO_DASHBOARD_STATS } from "@/lib/sample-data";
import { SDG_COLORS } from "@/lib/sdg-rules";
import { computeDashboardStats, fetchAllProjects } from "@/lib/supabase";
import type { DashboardStats, Project, ProjectCategory } from "@/types";

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
    return "—";
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

function getRankLabel(rank: number): string {
  if (rank === 1) return "🥇 1";
  if (rank === 2) return "🥈 2";
  if (rank === 3) return "🥉 3";
  return String(rank);
}

function getSdgColor(sdgLabel: string): string {
  return SDG_COLORS[sdgLabel] ?? "#64748B";
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const topProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => b.beneficiaries - a.beneficiaries)
        .slice(0, 5),
    [projects]
  );

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);

      const fetchedProjects = await fetchAllProjects();

      if (fetchedProjects.length === 0) {
        setStats(DEMO_DASHBOARD_STATS);
        setProjects([]);
        setUsingDemoData(true);
      } else {
        setStats(computeDashboardStats(fetchedProjects, []));
        setProjects(fetchedProjects);
        setUsingDemoData(false);
      }

      setIsLoading(false);
    }

    loadDashboard();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-3 text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {usingDemoData && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Showing demo data — submit your first project to see real stats
        </div>
      )}

      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">{todayLabel}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricsCard
          label="Total Projects"
          value={stats.total_projects}
          icon={FolderOpen}
          color="blue"
        />
        <MetricsCard
          label="Volunteers Mobilized"
          value={stats.total_volunteers}
          icon={Users}
          color="green"
        />
        <MetricsCard
          label="Beneficiaries Reached"
          value={stats.total_beneficiaries}
          icon={Heart}
          color="purple"
        />
        <MetricsCard
          label="Partnerships"
          value={stats.total_partnerships}
          icon={Handshake}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Projects by Category
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.projects_by_category}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="category" tick={{ fill: "#64748B", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0" }}
              />
              <Bar
                dataKey="count"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                name="Projects"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            SDG Distribution
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.sdg_distribution}
                dataKey="count"
                nameKey="sdg"
                cx="50%"
                cy="50%"
                outerRadius={90}
              >
                {stats.sdg_distribution.map((entry) => (
                  <Cell key={entry.sdg} fill={getSdgColor(entry.sdg)} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Most Impactful Initiatives
        </h2>

        {topProjects.length === 0 ? (
          <p className="text-sm text-slate-500">
            Submit projects to see your most impactful initiatives here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Rank</th>
                  <th className="pb-3 pr-4 font-medium">Project Name</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Volunteers</th>
                  <th className="pb-3 pr-4 font-medium">Beneficiaries</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {topProjects.map((project, index) => (
                  <tr key={project.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-bold text-slate-900">
                      {getRankLabel(index + 1)}
                    </td>
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {project.project_name}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_BADGE_CLASSES[project.category]}`}
                      >
                        {project.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{project.volunteers}</td>
                    <td className="py-3 pr-4 text-slate-600">
                      {project.beneficiaries}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {formatDate(project.date)}
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/report/${project.id}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        View Report →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
