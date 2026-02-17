-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- Profiles
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  agency_name text,
  avatar_url text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- Leads
-- ============================================
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  business_name text not null,
  address text,
  phone text,
  website_url text,
  email text,
  rating numeric,
  review_count integer,
  category text,
  google_maps_data jsonb,
  created_at timestamptz default now()
);

alter table public.leads enable row level security;
create policy "Users can CRUD own leads" on public.leads for all using (auth.uid() = user_id);

-- ============================================
-- Pitches
-- ============================================
create table public.pitches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lead_id uuid references public.leads(id) on delete set null,
  business_name text not null,
  website_url text,
  scraped_data jsonb,
  template_id text default 'modern-professional',
  generated_html text,
  preview_url text,
  colors jsonb default '{"primary": "#2563eb", "secondary": "#1e40af", "accent": "#3b82f6"}'::jsonb,
  status text default 'draft' check (status in ('draft', 'sent', 'opened', 'feedback')),
  email_sent_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.pitches enable row level security;
create policy "Users can CRUD own pitches" on public.pitches for all using (auth.uid() = user_id);
create policy "Anyone can view pitch for public preview" on public.pitches for select using (true);

-- ============================================
-- Pitch Views (public — no auth required for tracking)
-- ============================================
create table public.pitch_views (
  id uuid default uuid_generate_v4() primary key,
  pitch_id uuid references public.pitches(id) on delete cascade not null,
  viewed_at timestamptz default now(),
  ip_address text,
  location jsonb,
  user_agent text,
  duration_seconds integer
);

alter table public.pitch_views enable row level security;
create policy "Anyone can insert views" on public.pitch_views for insert with check (true);
create policy "Pitch owners can view" on public.pitch_views for select using (
  exists (select 1 from public.pitches where pitches.id = pitch_views.pitch_id and pitches.user_id = auth.uid())
);

-- ============================================
-- Pitch Feedback (public insert)
-- ============================================
create table public.pitch_feedback (
  id uuid default uuid_generate_v4() primary key,
  pitch_id uuid references public.pitches(id) on delete cascade not null,
  rating integer check (rating between 1 and 5),
  message text,
  contact_email text,
  created_at timestamptz default now()
);

alter table public.pitch_feedback enable row level security;
create policy "Anyone can submit feedback" on public.pitch_feedback for insert with check (true);
create policy "Pitch owners can view feedback" on public.pitch_feedback for select using (
  exists (select 1 from public.pitches where pitches.id = pitch_feedback.pitch_id and pitches.user_id = auth.uid())
);

-- ============================================
-- Email Settings
-- ============================================
create table public.email_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  gmail_access_token text,
  gmail_refresh_token text,
  gmail_email text,
  warmup_enabled boolean default false,
  warmup_api_key text,
  warmup_holder_uid text,
  warmup_temperature numeric default 0,
  daily_capacity integer default 0,
  updated_at timestamptz default now()
);

alter table public.email_settings enable row level security;
create policy "Users can CRUD own email settings" on public.email_settings for all using (auth.uid() = user_id);

-- ============================================
-- Indexes
-- ============================================
create index idx_leads_user_id on public.leads(user_id);
create index idx_pitches_user_id on public.pitches(user_id);
create index idx_pitches_status on public.pitches(status);
create index idx_pitch_views_pitch_id on public.pitch_views(pitch_id);
create index idx_pitch_feedback_pitch_id on public.pitch_feedback(pitch_id);

-- ============================================
-- Updated_at trigger
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger pitches_updated_at before update on public.pitches
  for each row execute procedure public.update_updated_at();

create trigger email_settings_updated_at before update on public.email_settings
  for each row execute procedure public.update_updated_at();
