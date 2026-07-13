-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- LANGUAGES
-- ============================================================
create table public.languages (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

comment on table public.languages is 'Site languages, e.g. nl / en / es. Referenced by every *_translations table.';

-- ============================================================
-- PROFILES (extends auth.users with an app role)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth user. role=admin is required to access /admin.';

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- CMS core: sections -> content_keys -> translations
-- Generic key/value content model used by Hero, About, Trust,
-- Services header, Process header, USP header, FAQ header/CTA,
-- Contact modal and Footer text.
-- ============================================================
create table public.sections (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.content_keys (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  key text not null,
  field_type text not null default 'text' check (field_type in ('text', 'textarea')),
  created_at timestamptz not null default now(),
  unique (section_id, key)
);

create table public.translations (
  id uuid primary key default gen_random_uuid(),
  content_key_id uuid not null references public.content_keys(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  value text,
  unique (content_key_id, language_id)
);

create index idx_content_keys_section_id on public.content_keys(section_id);
create index idx_translations_content_key_id on public.translations(content_key_id);
create index idx_translations_language_id on public.translations(language_id);
