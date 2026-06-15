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
import { lux } from "@/lib/theme";
import { DEMO_DASHBOARD_STATS, DEMO_PROJECTS } from "@/lib/sample-data";
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
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return String(rank);
}

function CategoryTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { category: string; count: number } }[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0].payload;
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white px-3 py-2 text-sm shadow-lux">
      <p className="font-medium text-slate-800">{entry.category}</p>
      <p className="text-slate-600">{entry.count} projects</p>
    </div>
  );
}

function SdgTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { sdg: string; count: number } }[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0].payload;
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white px-3 py-2 text-sm shadow-lux">
      <p className="font-medium text-slate-800">{entry.sdg}</p>
      <p className="text-slate-600">{entry.count} projects</p>
    </div>
  );
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

  const topProjects = useMemo(() => {
    const source = usingDemoData ? DEMO_PROJECTS : projects;
    return [...source]
      .sort((a, b) => b.beneficiaries - a.beneficiaries)
      .slice(0, 5);
  }, [projects, usingDemoData]);

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);

      const fetchedProjects = await fetchAllProjects();

      if (fetchedProjects.length === 0) {
        setStats(DEMO_DASHBOARD_STATS);
        setProjects(DEMO_PROJECTS);
        setUsingDemoData(true);
      } else {
        setStats(computeDashboardStats(fetchedProjects));
        setProjects(fetchedProjects);
        setUsingDemoData(false);
      }

      setIsLoading(false);
    }

    loadDashboard();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {usingDemoData && (
        <div className={lux.bannerWarning}>
          Showing demo data — submit your first project to see real stats
        </div>
      )}

      <header className={lux.pageHeader}>
        <h1 className={lux.pageTitle}>Analytics Dashboard</h1>
        <p className={lux.pageSubtitle}>{todayLabel}</p>
      </header>

      <section>
        <h2 className={lux.sectionTitle}>Top Stats</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricsCard
            label="Total Projects"
            value={stats.total_projects}
            icon={FolderOpen}
            color="blue"
            description="Overall organizational activity level"
          />
          <MetricsCard
            label="Volunteers Mobilized"
            value={stats.total_volunteers}
            icon={Users}
            color="green"
            description="Total human effort the club has coordinated"
          />
          <MetricsCard
            label="Beneficiaries Reached"
            value={stats.total_beneficiaries}
            icon={Heart}
            color="purple"
            description="The actual human impact — your most important number"
          />
          <MetricsCard
            label="Partnerships Formed"
            value={stats.total_partnerships}
            icon={Handshake}
            color="orange"
            description="Your club's network and collaborative reach"
          />
        </div>
      </section>

      <section>
        <h2 className={`${lux.sectionTitle} mb-4`}>Charts</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={lux.card}>
            <h3 className="text-base font-semibold tracking-tight text-ink">
              Projects by Category
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Where the club focuses its energy — useful for planning and district reporting
            </p>
            {stats.projects_by_category.length === 0 ? (
              <p className="mt-8 text-sm text-slate-500">No projects yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300} className="mt-4">
                <BarChart
                  data={stats.projects_by_category}
                  margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: "#64748B", fontSize: 10 }}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CategoryTooltip />} />
                  <Bar dataKey="count" fill="#2A85FF" radius={[4, 4, 0, 0]} name="Projects" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className={lux.card}>
            <h3 className="text-base font-semibold tracking-tight text-ink">
              SDG Distribution
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Global goals alignment — useful for district and international reporting
            </p>
            {stats.sdg_distribution.length === 0 ? (
              <p className="mt-8 text-sm text-slate-500">No SDG data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300} className="mt-4">
                <PieChart>
                  <Pie
                    data={stats.sdg_distribution}
                    dataKey="count"
                    nameKey="sdg"
                    cx="50%"
                    cy="42%"
                    outerRadius={88}
                    innerRadius={0}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {stats.sdg_distribution.map((entry) => (
                      <Cell key={entry.sdg} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<SdgTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, paddingTop: 16, color: "#64748B" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      <section className={lux.card}>
        <h2 className={lux.sectionTitle}>Most Impactful Initiatives</h2>
        <p className={lux.sectionSubtitle}>
          Which projects created the most impact — useful for showcasing to external stakeholders
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={lux.tableHead}>
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
                <tr key={project.id} className={lux.tableRow}>
                  <td className="py-3 pr-4 text-base font-bold text-foreground">
                    {getRankLabel(index + 1)}
                  </td>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-foreground">{project.project_name}</p>
                    <p className="text-xs text-muted-foreground">{project.club_name}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_BADGE_CLASSES[project.category]}`}
                    >
                      {project.category}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary/70" />
                      {project.volunteers}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Heart className="h-4 w-4 text-primary/70" />
                      {project.beneficiaries}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatDate(project.date)}</td>
                  <td className="py-3">
                    {usingDemoData ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">View Report →</span>
                        <span className="text-muted-foreground">Show Socials</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <Link href={`/report/${project.id}`} className={lux.link}>
                          View Report →
                        </Link>
                        <Link
                          href={`/report/${project.id}?view=socials`}
                          className={lux.link}
                        >
                          Show Socials
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
