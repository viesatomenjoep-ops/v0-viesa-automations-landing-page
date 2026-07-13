-- ============================================================
-- Helper: is the current authenticated user an admin?
-- SECURITY DEFINER so it can read public.profiles without
-- recursing through that table's own RLS policies.
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- profiles
-- ============================================================
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- ============================================================
-- Content tables: public (anon) read, admin-only write.
-- The site reads content with the anon key; the admin editor
-- writes with the same client but an authenticated admin session.
-- ============================================================

alter table public.languages enable row level security;
create policy "languages_public_read" on public.languages for select using (true);
create policy "languages_admin_write" on public.languages for all using (public.is_admin()) with check (public.is_admin());

alter table public.sections enable row level security;
create policy "sections_public_read" on public.sections for select using (true);
create policy "sections_admin_write" on public.sections for all using (public.is_admin()) with check (public.is_admin());

alter table public.content_keys enable row level security;
create policy "content_keys_public_read" on public.content_keys for select using (true);
create policy "content_keys_admin_write" on public.content_keys for all using (public.is_admin()) with check (public.is_admin());

alter table public.translations enable row level security;
create policy "translations_public_read" on public.translations for select using (true);
create policy "translations_admin_write" on public.translations for all using (public.is_admin()) with check (public.is_admin());

alter table public.navigation_items enable row level security;
create policy "navigation_items_public_read" on public.navigation_items for select using (true);
create policy "navigation_items_admin_write" on public.navigation_items for all using (public.is_admin()) with check (public.is_admin());

alter table public.navigation_item_translations enable row level security;
create policy "navigation_item_translations_public_read" on public.navigation_item_translations for select using (true);
create policy "navigation_item_translations_admin_write" on public.navigation_item_translations for all using (public.is_admin()) with check (public.is_admin());

alter table public.service_items enable row level security;
create policy "service_items_public_read" on public.service_items for select using (true);
create policy "service_items_admin_write" on public.service_items for all using (public.is_admin()) with check (public.is_admin());

alter table public.service_item_translations enable row level security;
create policy "service_item_translations_public_read" on public.service_item_translations for select using (true);
create policy "service_item_translations_admin_write" on public.service_item_translations for all using (public.is_admin()) with check (public.is_admin());

alter table public.process_steps enable row level security;
create policy "process_steps_public_read" on public.process_steps for select using (true);
create policy "process_steps_admin_write" on public.process_steps for all using (public.is_admin()) with check (public.is_admin());

alter table public.process_step_translations enable row level security;
create policy "process_step_translations_public_read" on public.process_step_translations for select using (true);
create policy "process_step_translations_admin_write" on public.process_step_translations for all using (public.is_admin()) with check (public.is_admin());

alter table public.usp_items enable row level security;
create policy "usp_items_public_read" on public.usp_items for select using (true);
create policy "usp_items_admin_write" on public.usp_items for all using (public.is_admin()) with check (public.is_admin());

alter table public.usp_item_translations enable row level security;
create policy "usp_item_translations_public_read" on public.usp_item_translations for select using (true);
create policy "usp_item_translations_admin_write" on public.usp_item_translations for all using (public.is_admin()) with check (public.is_admin());

alter table public.faq_items enable row level security;
create policy "faq_items_public_read" on public.faq_items for select using (true);
create policy "faq_items_admin_write" on public.faq_items for all using (public.is_admin()) with check (public.is_admin());

alter table public.faq_item_translations enable row level security;
create policy "faq_item_translations_public_read" on public.faq_item_translations for select using (true);
create policy "faq_item_translations_admin_write" on public.faq_item_translations for all using (public.is_admin()) with check (public.is_admin());

alter table public.portfolio_items enable row level security;
create policy "portfolio_items_public_read" on public.portfolio_items for select using (true);
create policy "portfolio_items_admin_write" on public.portfolio_items for all using (public.is_admin()) with check (public.is_admin());

alter table public.portfolio_item_translations enable row level security;
create policy "portfolio_item_translations_public_read" on public.portfolio_item_translations for select using (true);
create policy "portfolio_item_translations_admin_write" on public.portfolio_item_translations for all using (public.is_admin()) with check (public.is_admin());

alter table public.partners enable row level security;
create policy "partners_public_read" on public.partners for select using (true);
create policy "partners_admin_write" on public.partners for all using (public.is_admin()) with check (public.is_admin());
