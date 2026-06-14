export type ProjectCategory =
  | "Healthcare"
  | "Education"
  | "Environment"
  | "Hunger Relief"
  | "Women Empowerment"
  | "Sanitation"
  | "Community Development"
  | "Other";

export type ConfidenceLevel = "confirmed" | "inferred" | "missing";

export interface ExtractionConfidence {
  project_name: ConfidenceLevel;
  category: ConfidenceLevel;
  date: ConfidenceLevel;
  volunteers: ConfidenceLevel;
  beneficiaries: ConfidenceLevel;
  duration_hours: ConfidenceLevel;
  partners: ConfidenceLevel;
}

export interface ExtractedProject {
  project_name: string | null;
  category: ProjectCategory | null;
  date: string | null;
  volunteers: number | null;
  beneficiaries: number | null;
  duration_hours: number | null;
  partners: string[];
  activities: string[];
  confidence: ExtractionConfidence;
}

export interface ProjectFormData {
  club_name: string;
  project_name: string;
  category: ProjectCategory | "";
  date: string;
  volunteers: number | "";
  beneficiaries: number | "";
  duration_hours: number | "";
  partners: string[];
  activities: string[];
  description: string;
  raw_narrative: string;
}

export interface SDGItem {
  number: number;
  name: string;
  color: string;
  reason: string;
}

export interface OutcomeIndicator {
  label: string;
  value: string;
}

export interface ImpactMetrics {
  volunteer_hours: number;
  beneficiaries_reached: number;
  partnerships_mobilized: number;
  outcome_indicators: OutcomeIndicator[];
}

export interface SocialKit {
  instagram: {
    caption: string;
    hashtags: string[];
  };
  linkedin: {
    post: string;
  };
  twitter: {
    post: string;
  };
}

export interface ReportData {
  id: string;
  project_id: string;
  executive_summary: string;
  objectives: string;
  activities_conducted: string;
  outcomes: string;
  recommendations: string;
  closing_statement: string;
  sdgs: SDGItem[];
  metrics: ImpactMetrics;
  social_kit: SocialKit;
  created_at: string;
}

export interface Project {
  id: string;
  club_name: string;
  project_name: string;
  category: ProjectCategory;
  date: string;
  volunteers: number;
  beneficiaries: number;
  duration_hours: number;
  partners: string[];
  activities: string[];
  description: string;
  raw_narrative: string;
  created_at: string;
}

export interface Photo {
  id: string;
  project_id: string;
  storage_url: string;
  caption: string;
  is_highlight: boolean;
}

export interface DashboardStats {
  total_projects: number;
  total_volunteers: number;
  total_beneficiaries: number;
  total_partnerships: number;
  projects_by_category: { category: string; count: number }[];
  sdg_distribution: { sdg: string; count: number }[];
}

export type InsertProject = Omit<Project, "id" | "created_at">;

export interface InsertReport {
  project_id: string;
  executive_summary?: string;
  objectives?: string;
  activities_conducted?: string;
  outcomes?: string;
  recommendations?: string;
  closing_statement?: string;
  sdgs?: SDGItem[];
  social_kit?: SocialKit;
  volunteer_hours?: number;
}

export interface ReportRow {
  id: string;
  project_id: string;
  executive_summary: string | null;
  objectives: string | null;
  activities_conducted: string | null;
  outcomes: string | null;
  recommendations: string | null;
  closing_statement: string | null;
  sdgs: SDGItem[] | null;
  social_kit: SocialKit | null;
  volunteer_hours: number | null;
  created_at: string;
}

export interface ProjectWithReport {
  project: Project;
  report: ReportRow | null;
}
