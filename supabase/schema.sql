-- ImpactPilot AI — Supabase schema
-- Run in Supabase SQL Editor (see DATABASE.md)

create table if not exists projects (
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

create table if not exists reports (
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

create table if not exists photos (
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

create policy "Allow all for now" on projects for all using (true) with check (true);
create policy "Allow all for now" on reports for all using (true) with check (true);
create policy "Allow all for now" on photos for all using (true) with check (true);

-- Public photos bucket for uploads
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

create policy "Public read photos"
on storage.objects for select
using (bucket_id = 'photos');

create policy "Allow uploads to photos"
on storage.objects for insert
with check (bucket_id = 'photos');

create policy "Allow updates to photos"
on storage.objects for update
using (bucket_id = 'photos')
with check (bucket_id = 'photos');

create table if not exists instagram_connections (
  id uuid primary key default gen_random_uuid(),
  ig_user_id text not null unique,
  username text,
  access_token text not null,
  token_expires_at timestamptz,
  updated_at timestamptz default now()
);

alter table instagram_connections enable row level security;

create policy "Allow all for now" on instagram_connections for all using (true) with check (true);

create table if not exists x_connections (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  auth_token text not null,
  ct0 text,
  twid text,
  updated_at timestamptz default now()
);

alter table x_connections enable row level security;

create policy "Allow all for now" on x_connections for all using (true) with check (true);
