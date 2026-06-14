# RotaFlow

**Conversational documentation copilot for social impact organizations.**

> Tell us what happened. We'll handle the paperwork.

RotaFlow helps Rotary clubs, Rotaract clubs, NGOs, and volunteer groups turn event stories into complete impact documentation — in minutes instead of hours.

---

## The Problem

After every community event, volunteers spend **2–4 hours** on paperwork: writing reports, tallying metrics, preparing district submissions, drafting social posts, and mapping work to UN Sustainable Development Goals. The result is documentation fatigue, inconsistent reporting, and weak institutional memory across clubs and chapters.

## The Solution

Volunteers describe what happened — by typing or speaking naturally. RotaFlow structures the data, flags anything missing, generates a professional report, aligns the project to SDGs, prepares social content, and stores everything in a searchable archive with leadership analytics.

---

## Key Features

### Conversational Capture
- **AI Mode** — paste or speak a narrative; the system extracts structured project data automatically
- **Manual Mode** — traditional form for users who prefer full control
- **Voice input** — record in the browser, transcribed via Deepgram, then editable before processing
- **Photo upload** — up to 5 images per project, with AI-generated captions (JPEG and HEIC supported)

### Smart Extraction with Confidence Indicators
Every auto-filled field is tagged so users know what to verify:
- **Confirmed** — explicitly stated in the narrative
- **Inferred** — reasonably implied, needs a quick check
- **Missing** — not mentioned; user must fill in

### Automated Documentation
- Professional **impact report** (executive summary, objectives, activities, outcomes, recommendations)
- **SDG alignment** via a deterministic rule engine — same category always maps to the same goals
- **Impact metrics** — volunteer hours, beneficiaries reached, partnerships mobilized
- **Social media kit** — ready-to-post content for Instagram, LinkedIn, and X
- **PDF export** — one-click downloadable documentation package

### Publishing & Archive
- **Instagram publishing** via Meta OAuth
- **X (Twitter) publishing** via GetXAPI
- **Project archive** with search, category filter, and year filter
- **Analytics dashboard** — projects by category, SDG distribution, aggregate impact stats

---

## Who It's For

- Rotary and Rotaract club officers (Presidents, Secretaries, Service Directors, PR teams)
- NGO program leads and community organizers
- Student organizations and social enterprises running recurring service projects

---

## How It Works

```
Volunteer input (text / voice / photos)
        ↓
AI extraction & transcription (NVIDIA NIM + Deepgram)
        ↓
User reviews & confirms structured data
        ↓
Report + SDGs + metrics + social kit generated
        ↓
Saved to Supabase → view, export PDF, publish, analyze
```

**Design principle:** AI handles language; deterministic code handles compliance. SDG mapping uses fixed category rules — not probabilistic guessing — so district reviewers get consistent, auditable results.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| AI (text) | NVIDIA NIM — Llama 3.3 70B |
| AI (vision) | NVIDIA NIM — Llama 3.2 11B Vision |
| Speech | Deepgram |
| Database & storage | Supabase (PostgreSQL + Storage) |
| Charts | Recharts |
| PDF export | jsPDF + html2canvas |
| Social | Meta Graph API (Instagram), GetXAPI (X) |

---

## Project Structure

```
app/
├── page.tsx              Landing page
├── submit/page.tsx       Project submission (manual + AI modes)
├── report/[id]/page.tsx  Generated report, PDF, social publishing
├── archive/page.tsx      Searchable project history
├── dashboard/page.tsx    Impact analytics
└── api/                  Server-side AI, upload, and publish routes

components/               UI components
lib/                      Integrations (NIM, Deepgram, Supabase, SDG rules, PDF)
types/                    Shared TypeScript interfaces
supabase/schema.sql       Database schema
```

---

## Getting Started

**Prerequisites:** Node.js 18+, a Supabase project, and API keys for NVIDIA NIM and Deepgram.

```bash
cp .env.local.example .env.local   # fill in your keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before first use, run `supabase/schema.sql` in your Supabase SQL Editor to create the required tables and storage bucket.

See `.env.local.example` for the full list of environment variables (AI keys, Supabase, Instagram, X).

---

## Deployment

The easiest path is **Vercel** for the Next.js app + your existing **Supabase** project for data.

1. Push the repo to GitHub
2. Import on [vercel.com](https://vercel.com), add all env vars from `.env.local`
3. Set `NEXT_PUBLIC_APP_URL` to your production URL
4. Update `META_REDIRECT_URI` and Meta Developer Console if using Instagram publishing

---

## License

Private project — all rights reserved.
