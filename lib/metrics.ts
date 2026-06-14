import type { ImpactMetrics, OutcomeIndicator, Project, ProjectCategory } from "@/types";

type MetricsInput = Pick<
  Project,
  "volunteers" | "beneficiaries" | "duration_hours" | "partners"
> & {
  category?: ProjectCategory | "" | null;
};

function toNumber(value: number | null | undefined): number {
  return value ?? 0;
}

function buildOutcomeIndicators(
  category: ProjectCategory,
  beneficiaries: number
): OutcomeIndicator[] {
  switch (category) {
    case "Healthcare":
      return [
        {
          label: "Blood units collected / Patients screened",
          value: `${beneficiaries} units`,
        },
      ];
    case "Education":
      return [{ label: "Students trained", value: `${beneficiaries} students` }];
    case "Environment":
      return [
        {
          label: "Environment beneficiaries",
          value: `${beneficiaries} people reached`,
        },
      ];
    case "Hunger Relief":
      return [
        {
          label: "Meals / food packages distributed",
          value: `${beneficiaries} people fed`,
        },
      ];
    case "Women Empowerment":
      return [
        { label: "Women empowered", value: `${beneficiaries} participants` },
      ];
    case "Sanitation":
      return [
        {
          label: "Sanitation facilities improved for",
          value: `${beneficiaries} households`,
        },
      ];
    case "Community Development":
      return [
        {
          label: "Community members reached",
          value: `${beneficiaries} residents`,
        },
      ];
    case "Other":
    default:
      return [
        { label: "Beneficiaries reached", value: `${beneficiaries} people` },
      ];
  }
}

export function calculateMetrics(project: MetricsInput): ImpactMetrics {
  const volunteers = toNumber(project.volunteers);
  const durationHours = toNumber(project.duration_hours);
  const beneficiaries = toNumber(project.beneficiaries);
  const partners = project.partners ?? [];
  const category: ProjectCategory = project.category || "Other";

  return {
    volunteer_hours: volunteers * durationHours,
    beneficiaries_reached: beneficiaries,
    partnerships_mobilized: partners.length,
    outcome_indicators: buildOutcomeIndicators(category, beneficiaries),
  };
}
