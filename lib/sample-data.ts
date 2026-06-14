import type { DashboardStats, Project } from "@/types";

export const SAMPLE_NARRATIVE_1 = `Yesterday our Rotaract Club of Pune organized a blood donation camp in collaboration with Ruby Hall Clinic at Fergusson College. Around 48 volunteers coordinated registrations, health screenings, and awareness sessions throughout the day. We successfully collected 62 units of blood between 9 AM and 2 PM, directly benefiting patients in need across the city.`;

export const SAMPLE_NARRATIVE_2 = `Last Saturday, 35 members of our Rotary Club planted 120 saplings near Vetal Tekdi in partnership with PMC. The drive ran from 7 AM to 11 AM and focused on native species. Local school students also participated and learned about urban biodiversity.`;

export const SAMPLE_NARRATIVE_3 = `We ran a digital literacy workshop for 80 women from the Hadapsar community over two days. Our team of 12 trainers covered smartphone basics, UPI payments, and online safety. The program was supported by Tata Trusts.`;

export const SAMPLE_NARRATIVES = [
  { id: 1, label: "Blood Donation Camp", text: SAMPLE_NARRATIVE_1 },
  { id: 2, label: "Tree Plantation Drive", text: SAMPLE_NARRATIVE_2 },
  { id: 3, label: "Digital Literacy Workshop", text: SAMPLE_NARRATIVE_3 },
] as const;

export const DEMO_DASHBOARD_STATS: DashboardStats = {
  total_projects: 12,
  total_volunteers: 340,
  total_beneficiaries: 1240,
  total_partnerships: 8,
  projects_by_category: [
    { category: "Healthcare", count: 4 },
    { category: "Education", count: 3 },
    { category: "Environment", count: 2 },
    { category: "Community Development", count: 2 },
    { category: "Women Empowerment", count: 1 },
  ],
  sdg_distribution: [
    { sdg: "SDG 3", count: 4, color: "#4C9F38" },
    { sdg: "SDG 4", count: 3, color: "#C5192D" },
    { sdg: "SDG 13", count: 2, color: "#3F7E44" },
    { sdg: "SDG 11", count: 2, color: "#FD9D24" },
    { sdg: "SDG 5", count: 1, color: "#FF3A21" },
  ],
};

const DEMO_TIMESTAMP = "2026-01-01T00:00:00.000Z";

export const DEMO_PROJECTS: Project[] = [
  {
    id: "demo-blood-donation",
    club_name: "Rotaract Club of Pune",
    project_name: "Citywide Blood Donation Camp",
    category: "Healthcare",
    date: "2026-05-20",
    volunteers: 48,
    beneficiaries: 620,
    duration_hours: 5,
    partners: ["Ruby Hall Clinic", "Fergusson College"],
    activities: ["Donor registration", "Health screening", "Awareness sessions"],
    description: "Multi-site blood donation drive across the city.",
    raw_narrative: SAMPLE_NARRATIVE_1,
    created_at: DEMO_TIMESTAMP,
  },
  {
    id: "demo-meal-drive",
    club_name: "Rotary Club of Mumbai",
    project_name: "Community Meal Drive",
    category: "Hunger Relief",
    date: "2026-04-12",
    volunteers: 52,
    beneficiaries: 480,
    duration_hours: 6,
    partners: ["Akshaya Patra", "Local Municipal Ward"],
    activities: ["Meal preparation", "Distribution", "Logistics"],
    description: "Weekly meal support for underserved neighborhoods.",
    raw_narrative: "",
    created_at: DEMO_TIMESTAMP,
  },
  {
    id: "demo-literacy",
    club_name: "Rotaract Club of Hadapsar",
    project_name: "Digital Literacy Workshop",
    category: "Women Empowerment",
    date: "2026-03-08",
    volunteers: 12,
    beneficiaries: 320,
    duration_hours: 16,
    partners: ["Tata Trusts"],
    activities: ["Smartphone training", "UPI workshops", "Online safety"],
    description: "Two-day digital skills program for women entrepreneurs.",
    raw_narrative: SAMPLE_NARRATIVE_3,
    created_at: DEMO_TIMESTAMP,
  },
  {
    id: "demo-tree-plantation",
    club_name: "Rotary Club of Pune",
    project_name: "Urban Tree Plantation Drive",
    category: "Environment",
    date: "2026-02-15",
    volunteers: 35,
    beneficiaries: 280,
    duration_hours: 4,
    partners: ["PMC", "Local Schools"],
    activities: ["Sapling planting", "Community briefing"],
    description: "Native species plantation near Vetal Tekdi.",
    raw_narrative: SAMPLE_NARRATIVE_2,
    created_at: DEMO_TIMESTAMP,
  },
  {
    id: "demo-health-camp",
    club_name: "Rotaract Club of Bengaluru",
    project_name: "Free Health Screening Camp",
    category: "Healthcare",
    date: "2026-01-28",
    volunteers: 28,
    beneficiaries: 210,
    duration_hours: 8,
    partners: ["City Hospital", "NGO Partners"],
    activities: ["Screenings", "Counseling", "Referrals"],
    description: "Preventive health camp for low-income families.",
    raw_narrative: "",
    created_at: DEMO_TIMESTAMP,
  },
];
