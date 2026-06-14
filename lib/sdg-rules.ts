import type { ProjectCategory, SDGItem } from "@/types";

const SDG_REFERENCE: Record<
  number,
  { name: string; color: string; defaultReason: string }
> = {
  2: {
    name: "Zero Hunger",
    color: "#DDA63A",
    defaultReason:
      "Directly addresses food security and nutrition for vulnerable communities.",
  },
  3: {
    name: "Good Health and Well-Being",
    color: "#4C9F38",
    defaultReason:
      "Promotes healthier communities through healthcare access and interventions.",
  },
  4: {
    name: "Quality Education",
    color: "#C5192D",
    defaultReason:
      "Expands access to quality learning and skill development opportunities.",
  },
  5: {
    name: "Gender Equality",
    color: "#FF3A21",
    defaultReason: "Advances gender equality and empowerment for women and girls.",
  },
  6: {
    name: "Clean Water and Sanitation",
    color: "#26BDE2",
    defaultReason: "Improves access to clean water and sanitation facilities.",
  },
  8: {
    name: "Decent Work and Economic Growth",
    color: "#A21942",
    defaultReason: "Creates economic opportunities and promotes dignified livelihoods.",
  },
  10: {
    name: "Reduced Inequalities",
    color: "#DD1367",
    defaultReason: "Works to reduce disparities across communities and social groups.",
  },
  11: {
    name: "Sustainable Cities and Communities",
    color: "#FD9D24",
    defaultReason: "Builds safer, more inclusive, and sustainable communities.",
  },
  13: {
    name: "Climate Action",
    color: "#3F7E44",
    defaultReason: "Takes direct action to address climate change and its impacts.",
  },
  15: {
    name: "Life on Land",
    color: "#56C02B",
    defaultReason: "Protects and restores terrestrial ecosystems and biodiversity.",
  },
  17: {
    name: "Partnerships for the Goals",
    color: "#19486A",
    defaultReason:
      "Strengthens multi-stakeholder partnerships for sustainable development.",
  },
};

export const SDG_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(SDG_REFERENCE).map(([number, data]) => [`SDG ${number}`, data.color])
);

const CATEGORY_SDG_MAP: Record<ProjectCategory, number[]> = {
  Healthcare: [3],
  Education: [4, 10],
  Environment: [13, 15],
  "Hunger Relief": [2],
  "Women Empowerment": [5, 8],
  Sanitation: [6, 3],
  "Community Development": [11],
  Other: [17],
};

function buildSDGItem(number: number): SDGItem {
  const sdg = SDG_REFERENCE[number];
  if (!sdg) {
    throw new Error(`Unknown SDG number: ${number}`);
  }

  return {
    number,
    name: sdg.name,
    color: sdg.color,
    reason: sdg.defaultReason,
  };
}

export function mapCategoryToSDGs(category: ProjectCategory): SDGItem[] {
  const numbers = CATEGORY_SDG_MAP[category] ?? CATEGORY_SDG_MAP.Other;
  return numbers.map(buildSDGItem);
}

export function getSDGReference(number: number) {
  return SDG_REFERENCE[number];
}
