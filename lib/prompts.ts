import type { ProjectFormData } from "@/types";

export const EXTRACTION_SYSTEM_PROMPT = `You are a precise information extraction assistant for social impact organizations.
Extract structured data from natural language event descriptions.
Return ONLY valid JSON. No preamble. No explanation. No markdown.
If a field is not mentioned, set it to null. Never guess critical numbers.`;

export const REPORT_SYSTEM_PROMPT = `You are a professional report writer for social impact organizations including Rotary Clubs, Rotaract Clubs, and NGOs.
Write formal, concise, impactful documentation.
Return ONLY valid JSON. No preamble. No markdown.`;

export const SOCIAL_SYSTEM_PROMPT = `You are a social media content creator for social impact organizations.
Write authentic, engaging content that celebrates volunteer work.
Return ONLY valid JSON. No preamble. No markdown.`;

export const VISION_USER_PROMPT = `This is a photograph from a social impact event organized by a volunteer club.

Analyze the image and return ONLY valid JSON:
{
  "activity_description": "1-2 sentences describing what is happening in the photo.",
  "caption": "A social media caption for this photo under 100 characters.",
  "is_highlight": true | false,
  "tags": ["array", "of", "3-5", "descriptive", "tags"]
}`;

export function buildExtractionPrompt(narrative: string): string {
  return `Extract project information from this narrative:

"${narrative}"

Return exactly this JSON structure:
{
  "project_name": string | null,
  "category": one of ["Healthcare","Education","Environment","Hunger Relief","Women Empowerment","Sanitation","Community Development","Other"] | null,
  "date": "YYYY-MM-DD" | null,
  "volunteers": number | null,
  "beneficiaries": number | null,
  "duration_hours": number | null,
  "partners": string[],
  "activities": string[],
  "confidence": {
    "project_name": "confirmed" | "inferred" | "missing",
    "category": "confirmed" | "inferred" | "missing",
    "date": "confirmed" | "inferred" | "missing",
    "volunteers": "confirmed" | "inferred" | "missing",
    "beneficiaries": "confirmed" | "inferred" | "missing",
    "duration_hours": "confirmed" | "inferred" | "missing",
    "partners": "confirmed" | "inferred" | "missing"
  }
}

Confidence rules:
- "confirmed": explicitly stated in the narrative
- "inferred": reasonably implied but not directly stated
- "missing": not mentioned at all`;
}

export function buildReportPrompt(projectJson: string): string {
  return `Generate a complete impact report for this project:

${projectJson}

Return exactly this JSON:
{
  "executive_summary": "3 sentences. What happened, scale, key outcome.",
  "objectives": "2-3 sentences on why this initiative was conducted.",
  "activities_conducted": "3-4 sentences describing key activities and how they were organized.",
  "outcomes": "3-4 sentences on measurable achievements and community impact.",
  "recommendations": "2-3 sentences on improvements or follow-up actions.",
  "closing_statement": "1-2 sentences. Inspiring close connecting to organizational mission."
}`;
}

export function buildSocialPrompt(project: ProjectFormData, report_summary: string): string {
  return `Create social media content for this project:

Project data:
${JSON.stringify(project, null, 2)}

Report summary:
${report_summary}

Return exactly this JSON:
{
  "instagram": {
    "caption": "Engaging caption under 150 words. Conversational tone. Celebrate volunteers. Mention key numbers.",
    "hashtags": ["array", "of", "10", "relevant", "hashtags", "without", "the", "hash", "symbol"]
  },
  "linkedin": {
    "post": "Professional post 150-200 words. Formal tone. Mention partners. Include call to action."
  },
  "twitter": {
    "post": "Under 280 characters. Punchy. Include 2 hashtags inline. Lead with the impact number."
  }
}`;
}
