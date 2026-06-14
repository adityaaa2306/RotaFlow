import { createClient } from "@supabase/supabase-js";
import type {
  InsertProject,
  InsertReport,
  Project,
  ProjectWithReport,
  ReportRow,
} from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function insertProject(project: InsertProject): Promise<Project> {
  const { data, error } = await supabase.from("projects").insert(project).select().single();

  if (error) {
    throw new Error(`Failed to insert project: ${error.message}`);
  }

  return data as Project;
}

export async function insertReport(report: InsertReport): Promise<ReportRow> {
  const { data, error } = await supabase.from("reports").insert(report).select().single();

  if (error) {
    throw new Error(`Failed to insert report: ${error.message}`);
  }

  return data as ReportRow;
}

export async function fetchAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return (data ?? []) as Project[];
}

export async function fetchProjectWithReportById(
  id: string
): Promise<ProjectWithReport | null> {
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projectError) {
    if (projectError.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch project: ${projectError.message}`);
  }

  const { data: report, error: reportError } = await supabase
    .from("reports")
    .select("*")
    .eq("project_id", id)
    .maybeSingle();

  if (reportError) {
    throw new Error(`Failed to fetch report: ${reportError.message}`);
  }

  return {
    project: project as Project,
    report: (report as ReportRow | null) ?? null,
  };
}
