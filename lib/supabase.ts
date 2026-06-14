import { createClient } from "@supabase/supabase-js";
import type {
  DashboardStats,
  InsertProject,
  InsertReport,
  Photo,
  Project,
  ProjectWithReport,
  ReportRow,
  SDGItem,
} from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function insertProject(data: InsertProject): Promise<Project> {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to insert project: ${error.message}`);
    }

    return project as Project;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Failed to insert project");
  }
}

export async function insertReport(data: InsertReport): Promise<ReportRow> {
  try {
    const { data: report, error } = await supabase
      .from("reports")
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to insert report: ${error.message}`);
    }

    return report as ReportRow;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Failed to insert report");
  }
}

export async function fetchAllProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return (data ?? []) as Project[];
  } catch {
    return [];
  }
}

export async function fetchProjectWithReportById(
  id: string
): Promise<ProjectWithReport | null> {
  try {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (projectError || !project) {
      return null;
    }

    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*")
      .eq("project_id", id)
      .maybeSingle();

    if (reportError) {
      return null;
    }

    return {
      project: project as Project,
      report: (report as ReportRow | null) ?? null,
    };
  } catch {
    return null;
  }
}

export async function uploadPhoto(projectId: string, file: File): Promise<string> {
  try {
    const path = `${projectId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload photo: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from("photos").getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Failed to upload photo");
  }
}

export async function insertPhoto(
  projectId: string,
  url: string,
  caption: string,
  isHighlight: boolean
): Promise<void> {
  try {
    const { error } = await supabase.from("photos").insert({
      project_id: projectId,
      storage_url: url,
      caption,
      is_highlight: isHighlight,
    });

    if (error) {
      throw new Error(`Failed to insert photo: ${error.message}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Failed to insert photo");
  }
}

export async function fetchPhotosByProjectId(projectId: string): Promise<Photo[]> {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      return [];
    }

    return (data ?? []) as Photo[];
  } catch {
    return [];
  }
}

export function computeDashboardStats(
  projects: Project[],
  reports: ReportRow[]
): DashboardStats {
  const total_volunteers = projects.reduce(
    (sum, project) => sum + (project.volunteers ?? 0),
    0
  );
  const total_beneficiaries = projects.reduce(
    (sum, project) => sum + (project.beneficiaries ?? 0),
    0
  );

  const uniquePartners = new Set<string>();
  for (const project of projects) {
    for (const partner of project.partners ?? []) {
      const normalized = partner.trim();
      if (normalized) {
        uniquePartners.add(normalized);
      }
    }
  }

  const categoryCounts = new Map<string, number>();
  for (const project of projects) {
    const category = project.category || "Other";
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }

  const sdgCounts = new Map<string, number>();
  for (const report of reports) {
    const sdgs = (report.sdgs ?? []) as SDGItem[];
    for (const sdg of sdgs) {
      const label = `SDG ${sdg.number}`;
      sdgCounts.set(label, (sdgCounts.get(label) ?? 0) + 1);
    }
  }

  return {
    total_projects: projects.length,
    total_volunteers,
    total_beneficiaries,
    total_partnerships: uniquePartners.size,
    projects_by_category: Array.from(categoryCounts.entries()).map(
      ([category, count]) => ({ category, count })
    ),
    sdg_distribution: Array.from(sdgCounts.entries()).map(([sdg, count]) => ({
      sdg,
      count,
    })),
  };
}
