create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resume_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  filename text not null,
  source_text text,
  created_at timestamptz not null default now()
);

create table public.resume_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null default '',
  headline text not null default '',
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  links jsonb not null default '[]'::jsonb,
  summary text not null default '',
  skills jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_profile_id uuid references public.resume_profiles(id) on delete set null,
  job_id uuid,
  title text not null,
  content jsonb not null,
  ats_score integer,
  created_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled job',
  company text not null default 'Unknown company',
  location text not null default '',
  url text not null default '',
  description text not null default '',
  notes text not null default '',
  stage text not null default 'Saved'
    check (stage in ('Saved', 'Tailored', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.resume_versions
  add constraint resume_versions_job_id_fkey
  foreign key (job_id) references public.jobs(id) on delete set null;

create table public.job_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  event_type text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);

create table public.cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  subject text not null default '',
  body text not null,
  mode text not null default 'demo' check (mode in ('demo', 'ai')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  kind text not null check (kind in ('resume', 'cover-letter')),
  format text not null check (format in ('pdf', 'docx')),
  storage_path text,
  created_at timestamptz not null default now()
);

create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  provider text not null default 'deepseek',
  action text not null,
  model text,
  prompt_tokens integer,
  completion_tokens integer,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger resume_profiles_updated_at
before update on public.resume_profiles
for each row execute function public.set_updated_at();

create trigger jobs_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

create trigger cover_letters_updated_at
before update on public.cover_letters
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.resume_sources enable row level security;
alter table public.resume_profiles enable row level security;
alter table public.resume_versions enable row level security;
alter table public.jobs enable row level security;
alter table public.job_events enable row level security;
alter table public.cover_letters enable row level security;
alter table public.documents enable row level security;
alter table public.ai_usage enable row level security;

create policy "profiles are owner readable" on public.profiles
  for select using ((select auth.uid()) = id);
create policy "profiles are owner writable" on public.profiles
  for all using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "resume sources are owner scoped" on public.resume_sources
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "resume profiles are owner scoped" on public.resume_profiles
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "resume versions are owner scoped" on public.resume_versions
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "jobs are owner scoped" on public.jobs
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "job events are owner scoped" on public.job_events
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "cover letters are owner scoped" on public.cover_letters
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "documents are owner scoped" on public.documents
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "ai usage is owner scoped" on public.ai_usage
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
