import type { DashboardStats } from "@/types";

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
    { sdg: "SDG 3", count: 4 },
    { sdg: "SDG 4", count: 3 },
    { sdg: "SDG 13", count: 2 },
    { sdg: "SDG 5", count: 1 },
    { sdg: "SDG 11", count: 2 },
  ],
};
