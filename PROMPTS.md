# ImpactPilot AI — NIM Prompt Templates

All prompts are used server-side only in `/api/` route handlers.
Model: `meta/llama-3.3-70b-instruct` for all text prompts.
Temperature: 0.3 for extraction (deterministic), 0.7 for creative (reports, social).
Always instruct the model to return ONLY valid JSON with no preamble, no markdown fences.

---

## PROMPT 1: Information Extraction
Used in: `/api/extract`

**System:**
```
You are a precise information extraction assistant for social impact organizations.
Extract structured data from natural language event descriptions.
Return ONLY valid JSON. No preamble. No explanation. No markdown.
If a field is not mentioned, set it to null. Never guess critical numbers.
```

**User:**
```
Extract project information from this narrative:

"[NARRATIVE]"

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
```

**Confidence rules:**
- `"confirmed"`: explicitly stated in the narrative
- `"inferred"`: reasonably implied but not directly stated
- `"missing"`: not mentioned at all

---

## PROMPT 2: Impact Report Generation
Used in: `/api/report`

**System:**
```
You are a professional report writer for social impact organizations including Rotary Clubs, Rotaract Clubs, and NGOs.
Write formal, concise, impactful documentation.
Return ONLY valid JSON. No preamble. No markdown.
```

**User:**
```
Generate a complete impact report for this project:

[PROJECT_JSON]

Return exactly this JSON:
{
  "executive_summary": "3 sentences. What happened, scale, key outcome.",
  "objectives": "2-3 sentences on why this initiative was conducted.",
  "activities_conducted": "3-4 sentences describing key activities and how they were organized.",
  "outcomes": "3-4 sentences on measurable achievements and community impact.",
  "recommendations": "2-3 sentences on improvements or follow-up actions.",
  "closing_statement": "1-2 sentences. Inspiring close connecting to organizational mission."
}
```

---

## PROMPT 3: Social Media Kit
Used in: `/api/social`

**System:**
```
You are a social media content creator for social impact organizations.
Write authentic, engaging content that celebrates volunteer work.
Return ONLY valid JSON. No preamble. No markdown.
```

**User:**
```
Create social media content for this project:

[PROJECT_JSON]

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
}
```

---

## PROMPT 4: Photo Analysis
Used in: `/api/vision`
Model: `meta/llama-3.2-11b-vision-instruct`

**User (multimodal):**
```
This is a photograph from a social impact event organized by a volunteer club.

Analyze the image and return ONLY valid JSON:
{
  "activity_description": "1-2 sentences describing what is happening in the photo.",
  "caption": "A social media caption for this photo under 100 characters.",
  "is_highlight": true | false,
  "tags": ["array", "of", "3-5", "descriptive", "tags"]
}
```

---

## Parsing Notes
- Always wrap NIM calls in try/catch
- Strip any accidental markdown fences before `JSON.parse()`
- If `JSON.parse` fails, retry once with a stricter prompt
- Log raw response to console in development for debugging
