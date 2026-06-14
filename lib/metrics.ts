import type { ImpactMetrics, Project } from "@/types";

type MetricsInput = Pick<
  Project,
  "volunteers" | "beneficiaries" | "duration_hours" | "partners"
>;

export function calculateMetrics(project: MetricsInput): ImpactMetrics {
  return {
    volunteer_hours: project.volunteers * project.duration_hours,
    beneficiaries_reached: project.beneficiaries,
    partnerships_mobilized: project.partners.length,
    outcome_indicators: [],
  };
}
