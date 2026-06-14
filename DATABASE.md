# ImpactPilot AI — Database Schema

## Platform: Supabase (PostgreSQL)

Run this entire block in the Supabase SQL Editor before starting development.

```sql
-- Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  club_name text not null default '',
  project_name text not null,
  category text not null default 'Other',
  date date,
  volunteers integer,
  beneficiaries integer,
  duration_hours numeric,
  partners text[] default '{}',
  activities text[] default '{}',
  description text default '',
  raw_narrative text default '',
  created_at timestamptz default now()
);

-- Reports table
create table reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  executive_summary text,
  objectives text,
  activities_conducted text,
  outcomes text,
  recommendations text,
  closing_statement text,
  sdgs jsonb default '[]',
  social_kit jsonb default '{}',
  volunteer_hours numeric,
  created_at timestamptz default now()
);

-- Photos table
create table photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  storage_url text not null,
  caption text default '',
  is_highlight boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security (open for hackathon, lock down in production)
alter table projects enable row level security;
alter table reports enable row level security;
alter table photos enable row level security;

create policy "Allow all for now" on projects for all using (true);
create policy "Allow all for now" on reports for all using (true);
create policy "Allow all for now" on photos for all using (true);
```

## Storage Bucket
Create a bucket called `photos` in Supabase Storage.
Set it to Public for hackathon purposes.

## Relationships
- One Project → One Report (1:1)
- One Project → Many Photos (1:N)
- Cascade delete: deleting a project removes its report and photos

## Notes
- SDGs stored as JSONB array: `[{number, name, color, reason}]`
- `social_kit` stored as JSONB: `{instagram: {...}, linkedin: {...}, twitter: {...}}`
- `partners` and `activities` stored as PostgreSQL text arrays
- RLS policies are permissive for hackathon — tighten before production
