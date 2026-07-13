-- ============================================================
-- NAVIGATION (header menu + two footer menus)
-- ============================================================
create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  menu_type text not null check (menu_type in ('header', 'footer_services', 'footer_company')),
  url text not null default '#',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.navigation_item_translations (
  id uuid primary key default gen_random_uuid(),
  navigation_item_id uuid not null references public.navigation_items(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  label text,
  unique (navigation_item_id, language_id)
);

-- ============================================================
-- SERVICES
-- ============================================================
create table public.service_items (
  id uuid primary key default gen_random_uuid(),
  icon_name text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.service_item_translations (
  id uuid primary key default gen_random_uuid(),
  service_item_id uuid not null references public.service_items(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  title text,
  description text,
  features_title text,
  features text,
  unique (service_item_id, language_id)
);

-- ============================================================
-- PROCESS STEPS
-- ============================================================
create table public.process_steps (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.process_step_translations (
  id uuid primary key default gen_random_uuid(),
  process_step_id uuid not null references public.process_steps(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  title text,
  description text,
  unique (process_step_id, language_id)
);

-- ============================================================
-- USPs ("Waarom Viesa")
-- ============================================================
create table public.usp_items (
  id uuid primary key default gen_random_uuid(),
  icon_name text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.usp_item_translations (
  id uuid primary key default gen_random_uuid(),
  usp_item_id uuid not null references public.usp_items(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  title text,
  description text,
  unique (usp_item_id, language_id)
);

-- ============================================================
-- FAQ
-- ============================================================
create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.faq_item_translations (
  id uuid primary key default gen_random_uuid(),
  faq_item_id uuid not null references public.faq_items(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  question text,
  answer text,
  unique (faq_item_id, language_id)
);

-- ============================================================
-- PORTFOLIO (gated behind PORTFOLIO_ENABLED feature flag)
-- ============================================================
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- app/sitemap.ts reads updated_at for each portfolio item's lastModified.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger portfolio_items_set_updated_at
  before update on public.portfolio_items
  for each row execute function public.set_updated_at();

create table public.portfolio_item_translations (
  id uuid primary key default gen_random_uuid(),
  portfolio_item_id uuid not null references public.portfolio_items(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  title text,
  description text,
  unique (portfolio_item_id, language_id)
);

-- ============================================================
-- PARTNERS (trust marquee — no translations, name is shown as-is)
-- ============================================================
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_navigation_items_menu_type on public.navigation_items(menu_type);
create index idx_navigation_item_translations_nav_id on public.navigation_item_translations(navigation_item_id);
create index idx_service_item_translations_item_id on public.service_item_translations(service_item_id);
create index idx_process_step_translations_step_id on public.process_step_translations(process_step_id);
create index idx_usp_item_translations_item_id on public.usp_item_translations(usp_item_id);
create index idx_faq_item_translations_item_id on public.faq_item_translations(faq_item_id);
create index idx_portfolio_item_translations_item_id on public.portfolio_item_translations(portfolio_item_id);
