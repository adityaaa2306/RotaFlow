# ImpactPilot AI — Technology Stack

## Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

## Backend
- **API Routes**: Next.js API Route Handlers (app/api/)
- **Language**: TypeScript

## AI / ML
- **Primary LLM**: NVIDIA NIM — meta/llama-3.3-70b-instruct
  - Endpoint: https://integrate.api.nvidia.com/v1/chat/completions
  - Used for: extraction, report generation, social media kit
- **Vision LLM**: NVIDIA NIM — meta/llama-3.2-11b-vision-instruct
  - Same endpoint, different model string
  - Used for: photo analysis, caption generation
- **Speech-to-Text**: Deepgram API
  - Used for: voice note transcription

## Database & Storage
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage (photos bucket)
- **Client**: @supabase/supabase-js

## Export
- **PDF Generation**: jsPDF + html2canvas
- **Strategy**: render hidden #pdf-content div, capture with html2canvas, embed in jsPDF

## Development
- **IDE**: Cursor (AI-assisted development)
- **Package Manager**: npm

## Environment Variables Required
```
NVIDIA_NIM_TEXT_API_KEY=
NVIDIA_NIM_VISION_API_KEY=
DEEPGRAM_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Install Command
```bash
npx create-next-app@latest impactpilot --typescript --tailwind --app
cd impactpilot
npx shadcn@latest init
npm install recharts jspdf html2canvas @supabase/supabase-js @deepgram/sdk lucide-react
```
