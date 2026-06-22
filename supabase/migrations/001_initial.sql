-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Couples table (one per wedding site)
create table public.couples (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  slug text unique not null,
  bride_name text not null default '',
  groom_name text not null default '',
  tagline text,
  wedding_date timestamptz,
  hero_image_url text,
  logo_url text,
  color_theme jsonb not null default '{"mode":"light","accent":"#C9A96E"}'::jsonb,
  font_style text not null default 'serif' check (font_style in ('serif', 'sans', 'script')),
  nav_labels jsonb not null default '{"wishes":"Well Wishes","schedule":"Schedule","qa":"Q&A","rsvp":"RSVP","gifting":"Gifting"}'::jsonb,
  sections_enabled jsonb not null default '{"wishes":true,"schedule":true,"qa":true,"rsvp":true,"gifting":true}'::jsonb,
  gift_message text,
  rsvp_deadline date,
  rsvp_required_fields jsonb not null default '{"first_name":true,"last_name":true,"email":true,"phone":false,"relationship":false,"address":false,"attending_for":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Wedding schedule events
create table public.wedding_events (
  id uuid primary key default uuid_generate_v4(),
  couple_id uuid references public.couples(id) on delete cascade not null,
  name text not null,
  date date,
  time time,
  venue_name text,
  venue_address text,
  dress_groom text,
  dress_bride text,
  colors jsonb not null default '[]'::jsonb,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- RSVP submissions
create table public.rsvp_submissions (
  id uuid primary key default uuid_generate_v4(),
  couple_id uuid references public.couples(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  relationship text,
  address text,
  attending_for text check (attending_for in ('bride', 'groom', 'both')),
  created_at timestamptz not null default now()
);

-- Well wishes
create table public.well_wishes (
  id uuid primary key default uuid_generate_v4(),
  couple_id uuid references public.couples(id) on delete cascade not null,
  wisher_name text not null,
  message text not null,
  media_url text,
  media_type text check (media_type in ('image', 'video')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- Gift methods
create table public.gift_methods (
  id uuid primary key default uuid_generate_v4(),
  couple_id uuid references public.couples(id) on delete cascade not null,
  type text not null check (type in ('bank_transfer', 'flutterwave', 'paystack', 'amazon')),
  bank_name text,
  account_number text,
  account_name text,
  currency text,
  link_url text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- FAQs
create table public.faqs (
  id uuid primary key default uuid_generate_v4(),
  couple_id uuid references public.couples(id) on delete cascade not null,
  question text not null,
  answer text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Page views (lightweight analytics)
create table public.page_views (
  id uuid primary key default uuid_generate_v4(),
  couple_id uuid references public.couples(id) on delete cascade not null,
  viewed_at timestamptz not null default now()
);

-- Updated_at trigger for couples
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger couples_updated_at
  before update on public.couples
  for each row execute function public.handle_updated_at();

-- Row Level Security
alter table public.couples enable row level security;
alter table public.wedding_events enable row level security;
alter table public.rsvp_submissions enable row level security;
alter table public.well_wishes enable row level security;
alter table public.gift_methods enable row level security;
alter table public.faqs enable row level security;
alter table public.page_views enable row level security;

-- Couples: owner full access; public can read by slug
create policy "couples_owner_all" on public.couples
  for all using (auth.uid() = user_id);

create policy "couples_public_read" on public.couples
  for select using (true);

-- Wedding events: owner writes, public reads
create policy "events_owner_all" on public.wedding_events
  for all using (
    exists (select 1 from public.couples where id = couple_id and user_id = auth.uid())
  );

create policy "events_public_read" on public.wedding_events
  for select using (true);

-- RSVPs: anyone can insert, owner can read
create policy "rsvp_public_insert" on public.rsvp_submissions
  for insert with check (true);

create policy "rsvp_owner_read" on public.rsvp_submissions
  for select using (
    exists (select 1 from public.couples where id = couple_id and user_id = auth.uid())
  );

-- Well wishes: anyone can insert, owner manages, public reads approved
create policy "wishes_public_insert" on public.well_wishes
  for insert with check (true);

create policy "wishes_public_read_approved" on public.well_wishes
  for select using (status = 'approved' or exists (
    select 1 from public.couples where id = couple_id and user_id = auth.uid()
  ));

create policy "wishes_owner_update_delete" on public.well_wishes
  for all using (
    exists (select 1 from public.couples where id = couple_id and user_id = auth.uid())
  );

-- Gift methods: owner writes, public reads
create policy "gifts_owner_all" on public.gift_methods
  for all using (
    exists (select 1 from public.couples where id = couple_id and user_id = auth.uid())
  );

create policy "gifts_public_read" on public.gift_methods
  for select using (true);

-- FAQs: owner writes, public reads
create policy "faqs_owner_all" on public.faqs
  for all using (
    exists (select 1 from public.couples where id = couple_id and user_id = auth.uid())
  );

create policy "faqs_public_read" on public.faqs
  for select using (true);

-- Page views: anyone can insert, owner can read
create policy "pageviews_public_insert" on public.page_views
  for insert with check (true);

create policy "pageviews_owner_read" on public.page_views
  for select using (
    exists (select 1 from public.couples where id = couple_id and user_id = auth.uid())
  );

-- Storage bucket for wedding assets
insert into storage.buckets (id, name, public) values ('wedding-assets', 'wedding-assets', true);

create policy "wedding_assets_public_read" on storage.objects
  for select using (bucket_id = 'wedding-assets');

create policy "wedding_assets_auth_upload" on storage.objects
  for insert with check (bucket_id = 'wedding-assets' and auth.role() = 'authenticated');

create policy "wedding_assets_owner_delete" on storage.objects
  for delete using (bucket_id = 'wedding-assets' and auth.uid()::text = (storage.foldername(name))[1]);
