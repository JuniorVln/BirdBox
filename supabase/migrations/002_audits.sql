-- ============================================
-- Audits — Website audit results
-- ============================================
create table public.audits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  pitch_id uuid references public.pitches(id) on delete set null,
  business_name text not null,
  website_url text not null,

  -- Overall score (0-100)
  overall_score integer,

  -- Individual scores (0-100)
  performance_score integer,
  seo_score integer,
  mobile_score integer,
  accessibility_score integer,
  best_practices_score integer,

  -- Detailed audit data from PageSpeed / Lighthouse
  audit_data jsonb,

  -- AI-generated summary of issues found
  summary text,
  issues jsonb default '[]'::jsonb,
  recommendations jsonb default '[]'::jsonb,

  status text default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  error_message text,

  created_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.audits enable row level security;
create policy "Users can CRUD own audits" on public.audits for all using (auth.uid() = user_id);

create index idx_audits_user_id on public.audits(user_id);
create index idx_audits_pitch_id on public.audits(pitch_id);
create index idx_audits_status on public.audits(status);
