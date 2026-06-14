-- ImpactPilot AI — Supabase schema
-- Run in Supabase SQL Editor (see DATABASE.md)

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

create table photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  storage_url text not null,
  caption text default '',
  is_highlight boolean default false,
  created_at timestamptz default now()
);

alter table projects enable row level security;
alter table reports enable row level security;
alter table photos enable row level security;

create policy "Allow all for now" on projects for all using (true);
create policy "Allow all for now" on reports for all using (true);
create policy "Allow all for now" on photos for all using (true);
