# ImpactPilot AI — System Architecture

## Layer Overview

### 1. User Input Layer
- Manual form fields
- Free-text narrative input
- Voice note recording (browser MediaRecorder API)
- Photo uploads (up to 5 images)

### 2. Speech Layer
- **Deepgram API** — converts voice recordings to text transcript
- Transcript appears in editable textarea before AI processing

### 3. Conversational Intelligence Layer
- **NVIDIA NIM — meta/llama-3.3-70b-instruct**
- Handles: information extraction, auto-fill, missing field detection, report generation, social media generation
- All calls go through `/api/` Next.js route handlers (never from client directly)
- API base URL: `https://integrate.api.nvidia.com/v1/chat/completions`

### 4. Photo Intelligence Layer
- **NVIDIA NIM — meta/llama-3.2-11b-vision-instruct**
- Handles: activity descriptions, caption suggestions, highlight photo selection
- Images sent as base64 encoded strings
- Photos enrich documentation but never determine project type independently

### 5. Business Logic Layer (all deterministic, no AI)
- **Validation Engine**: checks required fields, data types, logical consistency
- **Metrics Engine**: calculates volunteer hours (volunteers × duration), partnerships count
- **SDG Rule Engine**: category → SDG mapping via hardcoded rules (see SDG_RULES.md)
- **PDF Generator**: jsPDF + html2canvas, renders hidden div to PDF

### 6. Application Layer
- Reports display
- Social Media Kit cards
- Project Archive with search/filter
- Analytics Dashboard with charts

## Data Flow
User Input → API Route → NIM/Deepgram → Structured JSON → Supabase → Report/PDF/Social Kit

## API Routes
- `POST /api/extract` — narrative text → structured project JSON
- `POST /api/report` — project data → full report text
- `POST /api/social` — project data → Instagram + LinkedIn + Twitter posts
- `POST /api/vision` — base64 image → activity description + caption
- `POST /api/transcribe` — audio blob → transcript text

## Database
- **Supabase PostgreSQL** — projects, reports, photos tables
- **Supabase Storage** — photo file storage

## Key Technical Decisions
- All NIM API calls are server-side only (API key never exposed to client)
- SDG mapping is deterministic (rule-based), not AI-generated, for reliability and trust
- Confidence indicators (confirmed/inferred/missing) are returned by extraction AI and displayed to user
- Users always retain full control to edit auto-filled fields before submission
