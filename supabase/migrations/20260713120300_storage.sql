-- ============================================================
-- Storage bucket used by /admin/media and the Portfolio editor
-- (public image URLs are read directly by the site).
-- ============================================================
insert into storage.buckets (id, name, public)
values ('cms-assets', 'cms-assets', true)
on conflict (id) do nothing;

-- Public bucket URLs bypass RLS for direct object reads already; the
-- SELECT policy below only gates list()/download() via the API, which
-- only /admin/media needs (as an authenticated admin).
create policy "cms_assets_admin_list" on storage.objects
  for select using (bucket_id = 'cms-assets' and public.is_admin());

create policy "cms_assets_admin_insert" on storage.objects
  for insert with check (bucket_id = 'cms-assets' and public.is_admin());

create policy "cms_assets_admin_update" on storage.objects
  for update using (bucket_id = 'cms-assets' and public.is_admin());

create policy "cms_assets_admin_delete" on storage.objects
  for delete using (bucket_id = 'cms-assets' and public.is_admin());
