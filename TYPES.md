# ImpactPilot AI — TypeScript Types

All types live in `types/index.ts`. Every component and API route imports from here.

## ProjectCategory
```ts
type ProjectCategory =
  | "Healthcare"
  | "Education"
  | "Environment"
  | "Hunger Relief"
  | "Women Empowerment"
  | "Sanitation"
  | "Community Development"
  | "Other";
```

## ConfidenceLevel
```ts
type ConfidenceLevel = "confirmed" | "inferred" | "missing";
```

## ExtractionConfidence
```ts
interface ExtractionConfidence {
  project_name: ConfidenceLevel;
  category: ConfidenceLevel;
  date: ConfidenceLevel;
  volunteers: ConfidenceLevel;
  beneficiaries: ConfidenceLevel;
  duration_hours: ConfidenceLevel;
  partners: ConfidenceLevel;
}
```

## ExtractedProject
```ts
interface ExtractedProject {
  project_name: string | null;
  category: ProjectCategory | null;
  date: string | null; // YYYY-MM-DD
  volunteers: number | null;
  beneficiaries: number | null;
  duration_hours: number | null;
  partners: string[];
  activities: string[];
  confidence: ExtractionConfidence;
}
```

## ProjectFormData
```ts
interface ProjectFormData {
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
```

## SDGItem
```ts
interface SDGItem {
  number: number;
  name: string;
  color: string;
  reason: string;
}
```

## ImpactMetrics
```ts
interface ImpactMetrics {
  volunteer_hours: number;       // volunteers × duration_hours
  beneficiaries_reached: number;
  partnerships_mobilized: number;
  outcome_indicators: OutcomeIndicator[];
}

interface OutcomeIndicator {
  label: string;   // e.g. "Blood units collected"
  value: string;   // e.g. "62 units"
}
```

## ReportData
```ts
interface ReportData {
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
```

## SocialKit
```ts
interface SocialKit {
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
```

## Project (Supabase row)
```ts
interface Project {
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
```

## Photo
```ts
interface Photo {
  id: string;
  project_id: string;
  storage_url: string;
  caption: string;
  is_highlight: boolean;
}
```

## DashboardStats
```ts
interface DashboardStats {
  total_projects: number;
  total_volunteers: number;
  total_beneficiaries: number;
  total_partnerships: number;
  projects_by_category: { category: string; count: number }[];
  sdg_distribution: { sdg: string; count: number }[];
}
```
