# RotaFlow (ImpactPilot AI)

Conversational documentation copilot for social impact organizations.

> "Tell us what happened. We'll handle the paperwork."

## Documentation

- [PRODUCT.md](./PRODUCT.md) — product definition, users, differentiators
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system layers, data flow, API routes
- [TECHSTACK.md](./TECHSTACK.md) — frameworks, AI services, env vars
- [TYPES.md](./TYPES.md) — TypeScript interfaces shared across the app
- [SDG_RULES.md](./SDG_RULES.md) — deterministic category → SDG mapping rules
- [PROMPTS.md](./PROMPTS.md) — NIM prompt templates for API routes
- [DATABASE.md](./DATABASE.md) — Supabase schema and RLS policies
- [SAMPLE_DATA.md](./SAMPLE_DATA.md) — demo narratives and dashboard seed data
- [UI_SYSTEM.md](./UI_SYSTEM.md) — colors, typography, component patterns, page layouts

## Tech Stack

- **Next.js 14** + TypeScript (App Router)
- **Tailwind CSS** + shadcn/ui
- **NVIDIA NIM** (Llama 3.3 70B + 3.2 Vision)
- **Deepgram** (speech-to-text)
- **Supabase** (database + storage)
- **jsPDF** + html2canvas (PDF export)
- **Recharts** (analytics charts)

## Getting Started

1. Copy environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your API keys in `.env.local`.

3. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── dashboard/page.tsx       # Analytics dashboard
├── submit/page.tsx          # Project submission
├── report/[id]/page.tsx     # Report view + export
├── archive/page.tsx         # Project archive
└── api/                     # API routes (NIM, Deepgram)
components/                  # UI components
lib/                         # Integrations & utilities
types/                       # TypeScript interfaces
```

## Supabase Schema

Run the SQL from [DATABASE.md](./DATABASE.md) or [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL editor.
Create a public `photos` storage bucket before uploading images.
