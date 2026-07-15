# RotaFlow · ImpactPilot AI

**Conversational documentation copilot for social impact organizations.**

> Tell us what happened. We'll handle the paperwork.

[RotaFlow](https://github.com/adityaaa2306/RotaFlow) helps Rotary clubs, Rotaract clubs, NGOs, and volunteer groups turn event stories into complete impact documentation — in minutes instead of hours.

---

## The Problem

After every community event, volunteers spend **2–4 hours** on paperwork: writing reports, tallying metrics, preparing district submissions, drafting social posts, and mapping work to UN Sustainable Development Goals. The result is documentation fatigue, inconsistent reporting, and weak institutional memory across clubs and chapters.

## The Solution

Volunteers describe what happened — by typing or speaking naturally. ImpactPilot AI structures the data, flags anything missing, generates a professional report, aligns the project to SDGs, prepares social content, and stores everything in a searchable archive with leadership analytics.

---

## Key Features

### Conversational Capture
- **AI Mode** — paste or speak a narrative; the system extracts structured project data automatically
- **Manual Mode** — traditional form for users who prefer full control
- **Voice input** — record in the browser, transcribed via Deepgram, then editable before processing
- **Photo upload** — up to 5 images per project, with AI-generated captions (JPEG and HEIC supported)
- **Mobile-friendly date entry** — month / day / year selects (avoids iOS Safari validation issues)

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
- **PDF export** — one-click download through SDG alignment (excludes social/publish sections)

### Publishing & Archive
- **Instagram publishing** via Meta OAuth
- **X publishing** via GetXAPI (`/api/twitter/*` routes)
- **Publication status** — track where content was posted (Instagram, X)
- **Dashboard “Show Socials”** — open the social kit for any project from analytics
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
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI |
| AI (text) | NVIDIA NIM — Llama 3.3 70B |
| AI (vision) | NVIDIA NIM — Llama 3.2 11B Vision |
| Speech | Deepgram |
| Database & storage | Supabase (PostgreSQL + Storage) |
| Charts | Recharts |
| PDF export | jsPDF + html2canvas (section-based pagination) |
| Social | Meta Graph API (Instagram), GetXAPI (X) |
| Deployment | Vercel |

---

## Project Structure

```
app/
├── page.tsx                 Landing page (ImpactPilot AI)
├── submit/page.tsx          Project submission (manual + AI modes)
├── report/[id]/page.tsx     Generated report, PDF, social publishing
├── archive/page.tsx         Searchable project history
├── dashboard/page.tsx       Impact analytics + Show Socials
└── api/
    ├── extract/             AI field extraction from narrative
    ├── transcribe/          Deepgram speech-to-text
    ├── report/              AI report generation
    ├── social/              Social media kit generation
    ├── vision/              Photo captioning
    ├── photos/upload/       Image upload (HEIC → JPEG)
    ├── instagram/           Meta OAuth + publish
    └── twitter/             GetXAPI status + publish (X)

components/                  UI (forms, report view, landing, dashboard)
lib/                         Integrations (NIM, Deepgram, Supabase, SDG rules, PDF)
types/                       Shared TypeScript interfaces
supabase/
├── schema.sql               Full database schema
└── add_social_posts.sql     Migration for publish tracking
```

---

## Getting Started

**Prerequisites:** Node.js 18+, a Supabase project, and API keys for NVIDIA NIM and Deepgram.

```bash
git clone https://github.com/adityaaa2306/RotaFlow.git
cd RotaFlow
cp .env.local.example .env.local   # fill in your keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database setup

1. Run `supabase/schema.sql` in the Supabase SQL Editor
2. Run `supabase/add_social_posts.sql` to enable social publish tracking

### Environment variables

See `.env.local.example` for the full list:

| Variable | Purpose |
| --- | --- |
| `NVIDIA_NIM_TEXT_API_KEY` | Extraction, report, social kit |
| `NVIDIA_NIM_VISION_API_KEY` | Photo captions |
| `DEEPGRAM_API_KEY` | Voice transcription |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side Supabase access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side publish tracking |
| `META_APP_ID` / `META_APP_SECRET` | Instagram OAuth |
| `META_REDIRECT_URI` | Instagram callback URL |
| `NEXT_PUBLIC_APP_URL` | Production app URL |
| `GETXAPI_API_KEY` / `GETXAPI_AUTH_TOKEN` | X publishing |

---

## Deployment (Vercel + Supabase)

1. Push to [github.com/adityaaa2306/RotaFlow](https://github.com/adityaaa2306/RotaFlow)
2. Import the repo on [vercel.com](https://vercel.com)
3. Add **all** environment variables from `.env.local.example` in the Vercel dashboard
4. Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://your-app.vercel.app`)
5. Update `META_REDIRECT_URI` to match production if using Instagram
6. Redeploy after adding env vars

> **Note:** X publish routes live at `/api/twitter/*` (not `/api/x/*`) to avoid ad-blocker interference on mobile browsers.

---

## Demo Flow (for presentations)

1. **Landing** → Submit a Project
2. **AI Mode** → record or paste a narrative → Auto-Fill with AI
3. Review confidence tags, upload photos, submit
4. **Report page** → read AI report, download PDF, publish to Instagram/X
5. **Dashboard** → analytics, View Report, Show Socials
6. **Archive** → search past projects

---

## License

Private project — all rights reserved.

---

**Repository:** [github.com/adityaaa2306/RotaFlow](https://github.com/adityaaa2306/RotaFlow)
