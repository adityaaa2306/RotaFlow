import { mapCategoryToSDGs } from "@/lib/sdg-rules";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  DashboardStats,
  InsertProject,
  InsertReport,
  Photo,
  Project,
  ProjectWithReport,
  ReportRow,
} from "@/types";

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured");
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

export async function insertProject(data: InsertProject): Promise<Project> {
  try {
    const { data: project, error } = await getSupabase()
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
    const { data: report, error } = await getSupabase()
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
    const { data, error } = await getSupabase()
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
    const { data: project, error: projectError } = await getSupabase()
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (projectError || !project) {
      return null;
    }

    const { data: report, error: reportError } = await getSupabase()
      .from("reports")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
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

    const { error: uploadError } = await getSupabase().storage
      .from("photos")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload photo: ${uploadError.message}`);
    }

    const { data } = getSupabase().storage.from("photos").getPublicUrl(path);
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
    const { error } = await getSupabase().from("photos").insert({
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
    const { data, error } = await getSupabase()
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

export function computeDashboardStats(projects: Project[]): DashboardStats {
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
        uniquePartners.add(normalized.toLowerCase());
      }
    }
  }

  const categoryCounts = new Map<string, number>();
  for (const project of projects) {
    const category = project.category || "Other";
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }

  const sdgCounts = new Map<string, { count: number; color: string }>();
  for (const project of projects) {
    for (const sdg of mapCategoryToSDGs(project.category)) {
      const label = `SDG ${sdg.number}`;
      const existing = sdgCounts.get(label);
      if (existing) {
        existing.count += 1;
      } else {
        sdgCounts.set(label, { count: 1, color: sdg.color });
      }
    }
  }

  return {
    total_projects: projects.length,
    total_volunteers,
    total_beneficiaries,
    total_partnerships: uniquePartners.size,
    projects_by_category: Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count),
    sdg_distribution: Array.from(sdgCounts.entries())
      .map(([sdg, data]) => ({ sdg, count: data.count, color: data.color }))
      .sort((a, b) => b.count - a.count),
  };
}
