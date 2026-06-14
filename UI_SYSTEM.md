# ImpactPilot AI — UI System Reference

## Design Philosophy
Clean, trustworthy, mission-driven. This is a tool for NGOs and volunteer clubs,
not a startup SaaS. It should feel professional, warm, and efficient.
No flashy animations. High information density. Every pixel earns its place.

## Color Palette
Primary: #2563EB (blue-600) — actions, links, active states
Success: #16A34A (green-600) — confirmed fields, success states
Warning: #D97706 (amber-600) — inferred fields, verify states
Danger: #DC2626 (red-600) — missing fields, errors
Background: #F8FAFC (slate-50) — page background
Surface: #FFFFFF — cards, panels
Border: #E2E8F0 (slate-200) — all borders
Text Primary: #0F172A (slate-900)
Text Secondary: #64748B (slate-500)
Text Muted: #94A3B8 (slate-400)

## Typography
Font: Inter (already included with Next.js)
Page Title: text-2xl font-bold text-slate-900
Section Heading: text-lg font-semibold text-slate-800
Card Title: text-base font-semibold text-slate-800
Body: text-sm text-slate-600
Muted: text-xs text-slate-400
Stat Number: text-3xl font-bold text-slate-900

## Component Patterns

### Cards
Always use: rounded-xl border border-slate-200 bg-white shadow-sm p-6
Hover state on clickable cards: hover:shadow-md hover:border-slate-300 transition-all

### Buttons
Primary: bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium
Secondary: border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2 text-sm font-medium
Danger: bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium
Disabled: opacity-50 cursor-not-allowed (always add disabled prop)
Loading: show a Loader2 icon from lucide-react with animate-spin class, disable the button

### Form Fields
Input: w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
Label: block text-sm font-medium text-slate-700 mb-1
Error: text-xs text-red-600 mt-1
Required marker: <span class="text-red-500 ml-0.5">*</span> after label text

### Status Badges (for MissingFieldsPanel)
Confirmed: bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 text-xs font-medium
Inferred: bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 text-xs font-medium
Missing: bg-red-50 text-red-700 border border-red-200 rounded-full px-2 py-0.5 text-xs font-medium

### Category Badges (for ProjectCard, Archive)
Each category gets a fixed color:
Healthcare: bg-red-50 text-red-700
Education: bg-blue-50 text-blue-700
Environment: bg-green-50 text-green-700
Hunger Relief: bg-orange-50 text-orange-700
Women Empowerment: bg-purple-50 text-purple-700
Sanitation: bg-cyan-50 text-cyan-700
Community Development: bg-indigo-50 text-indigo-700
Other: bg-slate-50 text-slate-700

### Loading States
Full page: centered Loader2 animate-spin text-blue-600 w-8 h-8 with "Loading..." text below
Inline: Loader2 animate-spin w-4 h-4 inline next to text
Skeleton: use shadcn Skeleton component, match the shape of the content it replaces

### Empty States
Centered div with a Lucide icon (muted, w-12 h-12), heading, subtext, optional CTA button
Example: FileX icon, "No projects yet", "Submit your first project to get started", [Submit Project] button

### Error States  
Alert box: bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3
AlertCircle icon in red-600, error message text in red-700
Always show in context (below the trigger button, not as a toast)

## Layout

### Sidebar (desktop)
Width: w-64, fixed left
Background: bg-white border-r border-slate-200
Logo area: h-16 flex items-center px-6, ImpactPilot AI in font-bold text-blue-600
Nav items: flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
Active: bg-blue-50 text-blue-700
Inactive: text-slate-600 hover:bg-slate-50 hover:text-slate-900

### Main Content
ml-64 (offset for sidebar), min-h-screen bg-slate-50
Inner padding: p-8 max-w-5xl (for forms and reports), p-8 max-w-7xl (for dashboard)

### Page Header
mb-8 border-b border-slate-200 pb-6
Title in text-2xl font-bold, subtitle in text-slate-500 text-sm mt-1

## Specific Component Layouts

### Submit Page — Two Tabs
Tab bar at top using shadcn Tabs
Tab 1 "Manual Entry" — icon: ClipboardList
Tab 2 "AI Mode ✨" — icon: Sparkles, slight blue tint on the tab
Active tab: blue underline indicator

### AI Mode Tab Layout (top to bottom)
1. ConversationalInput (textarea + buttons)
2. MissingFieldsPanel (only when extraction result exists, with smooth appear)
3. Divider with text "Review and complete the form below"
4. SubmitForm (pre-filled with extracted values)
5. Photo upload section
6. Submit button

### Report Page Layout (top to bottom)
1. Sticky header bar: back button, project title, Download PDF button
2. Project meta row: date, club name, category badge
3. Metrics row: 3 MetricsCards in a grid
4. Report sections: each in its own card with a section heading
5. SDG Alignment section: heading + SDGBadges grid
6. Social Media Kit section: heading + SocialMediaKit 3-card grid
7. id="pdf-content" wraps items 2 through 6 for PDF capture

### Dashboard Layout
Row 1: 4 stat cards (Total Projects, Volunteers, Beneficiaries, Partnerships)
Row 2: BarChart (projects by category) + PieChart (SDG distribution) side by side
Row 3: "Most Impactful Projects" — full width table, top 5 by beneficiaries

### Archive Layout
Top bar: Search input (left) + Category filter dropdown + Year filter (right)
Below: responsive grid — 3 cols on desktop, 2 on tablet, 1 on mobile
Each cell: ProjectCard component
Empty/no results: empty state component

## Recharts Config
Always use ResponsiveContainer width="100%" height={300}
BarChart: CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0"
Bar fill="#2563EB" radius={[4,4,0,0]}
XAxis tick color: #64748B fontSize 12
YAxis tick color: #64748B fontSize 12
Tooltip: contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0" }}
PieChart: use SDG hex colors for each slice, Legend below

## Do Not
- No gradients anywhere
- No dark mode (not in scope)
- No modals or drawers (keep everything inline on the page)
- No toast notifications (show errors inline)
- No animations except Loader2 spin and transition-all on hover
- Never use arbitrary Tailwind values like w-[347px] — use scale values only
- Never hardcode colors in style props — always use Tailwind classes
