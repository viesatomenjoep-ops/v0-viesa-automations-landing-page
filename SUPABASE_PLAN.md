# Supabase Recovery Plan

Your original Supabase project (`relrkcrglgktabjafirn` region eu-west-3) was deleted along with all
its tables. A new project with the **same ref/URL** already exists (created 2026-07-13, status
`ACTIVE_HEALTHY`) and `.env` already points at it — it just has no schema yet (confirmed via
`list_tables`: empty).

This plan reconstructs the schema by reverse-engineering every Supabase query in the codebase
(admin CMS editors, public section components, middleware, hooks). The SQL below is written as
Supabase migration files under [`supabase/migrations/`](supabase/migrations) so you can apply it
with the Supabase CLI, the Supabase MCP tools, or by pasting each file into the SQL Editor in order.

## How the app uses Supabase

- **Auth**: email/password only, no public sign-up UI. [`middleware.ts`](middleware.ts) +
  [`lib/supabase/middleware.ts`](lib/supabase/middleware.ts) protect `/admin/*`, requiring a logged-in
  user whose `profiles.role = 'admin'`.
- **Content (CMS)**: a generic key/value model (`sections` → `content_keys` → `translations`,
  keyed by `language_id`) drives simple text sections (Hero, About, Trust, section headers, Contact
  modal, Footer text). Repeatable list content (Services, Process steps, USPs, FAQ, Navigation links,
  Portfolio items, Partners) each get their own `*_items` table plus a `*_item_translations` table.
- **i18n**: three languages — `nl` (default), `en`, `es` — stored as rows in `languages`. The public
  site (`hooks/use-translation.tsx`) fetches all translations for the active `language_id` in one
  query; the admin editor (`app/admin/editor`) writes per-language rows via `upsert(... onConflict:
  'content_key_id,language_id')`.
- **Storage**: one public bucket, `cms-assets`, used by `/admin/media` and the Portfolio editor for
  uploaded images.
- **Contact form**: `/api/contact` sends an email via Resend directly — it never touches Supabase, so
  no submissions table is needed.

## Schema

| Table | Purpose |
|---|---|
| `languages` | `id, code, name` — nl/en/es |
| `profiles` | `id (=auth.users.id), role` — gates `/admin` |
| `sections` | `id, name, display_name` — hero/about/trust/services/process/usp/faq/contact/portfolio/footer |
| `content_keys` | `id, section_id, key, field_type(text\|textarea)` |
| `translations` | `id, content_key_id, language_id, value` |
| `navigation_items` / `navigation_item_translations` | header + footer menu links |
| `service_items` / `service_item_translations` | Services grid cards |
| `process_steps` / `process_step_translations` | "Onze Werkwijze" steps |
| `usp_items` / `usp_item_translations` | "Waarom Viesa" items |
| `faq_items` / `faq_item_translations` | FAQ accordion |
| `portfolio_items` / `portfolio_item_translations` | Portfolio page (currently feature-flagged off) |
| `partners` | Trust marquee logos/names (no translations) |

All tables use `uuid` primary keys (`gen_random_uuid()`) and cascade-delete their translation rows.
`portfolio_items` also has an `updated_at` column with an auto-update trigger, since
[`app/sitemap.ts`](app/sitemap.ts) reads it for each portfolio URL's `lastModified`.

## Row Level Security

- Every content table: **public SELECT** (the site reads with the anon key, unauthenticated) and
  **admin-only INSERT/UPDATE/DELETE**, gated by a `public.is_admin()` `SECURITY DEFINER` function that
  checks `profiles.role = 'admin'` for `auth.uid()`.
- `profiles`: a user may only read/update their own row.
- Storage bucket `cms-assets`: public read, admin-only write, matching how `/admin/media` and the
  Portfolio editor use it.

## Migration files

Apply in this order (they're numbered so `supabase db push` / the SQL Editor runs them correctly):

1. [`20260713120000_core_tables.sql`](supabase/migrations/20260713120000_core_tables.sql) — extensions,
   `languages`, `profiles` (+ auto-create-profile trigger on signup), `sections`, `content_keys`,
   `translations`.
2. [`20260713120100_content_item_tables.sql`](supabase/migrations/20260713120100_content_item_tables.sql)
   — navigation, services, process, USPs, FAQ, portfolio, partners.
3. [`20260713120200_rls_policies.sql`](supabase/migrations/20260713120200_rls_policies.sql) —
   `is_admin()` helper + RLS policies for every table.
4. [`20260713120300_storage.sql`](supabase/migrations/20260713120300_storage.sql) — creates the
   `cms-assets` bucket and its storage policies.
5. [`20260713120400_seed_data.sql`](supabase/migrations/20260713120400_seed_data.sql) — seeds the 3
   languages and the section/content_key/translation rows whose text could be recovered verbatim from
   fallback strings hardcoded in the components (e.g. `t('hero.title', 'Uw Bedrijf op')`).

### What could **not** be recovered

The seed file restores every *static section text* that had a hardcoded fallback in the code. It
cannot restore **item-level rows** — actual Services, Process steps, USPs, FAQ entries, Navigation
links, Portfolio projects, and Partner logos — because that content only ever lived in the deleted
database, with no fallback anywhere in source. After migrating, log into `/admin/editor` and
re-enter those manually (or restore from a Supabase backup/PITR if one exists for the old project).

### Known gotcha: seeded text must match each component's hardcoded fallback

`hooks/use-translation.tsx` only fetches translations client-side (`useEffect`, after mount), so
**every server-rendered page always shows each component's own hardcoded default text** first,
regardless of what's in the DB or what locale the visitor has — the DB value only appears after
the client-side fetch resolves. If a seeded value differs from the component's own fallback string,
React sees different text on the server vs. the client's first render and throws a hydration error.

This happened once already: the `services` section was seeded with the admin editor's own
init-default text (`'Onze Diensten'`), which differs from the fallback actually hardcoded in
[`components/services-grid.tsx:198`](components/services-grid.tsx:198) (`'Onze Expertise'`) — fixed
directly in the DB and in `20260713120400_seed_data.sql`. If you edit content_keys text going
forward (via `/admin/editor` or SQL), check whether that key also has a hardcoded default in the
component that renders it, and keep the Dutch (`nl`) value in sync to avoid this. Note this is a
pre-existing app-level limitation, not something these migrations can fully fix: since translations
never load during SSR, **any visitor whose active locale isn't Dutch will always see a similar flash/
mismatch on first load** for every translated string, because the server can only ever render the
Dutch-language fallback baked into the component.

## How to apply

Option A — Supabase CLI (recommended if you have it installed and linked):
```bash
supabase link --project-ref relrkcrglgktabjafirn
supabase db push
```

Option B — MCP `apply_migration` tool, one file at a time in the order above, or paste each file's
contents into the Supabase Dashboard SQL Editor in order.

## Post-migration steps

1. **Create your admin user**: Supabase Dashboard → Authentication → Add User (email/password) —
   there is no self-service sign-up in this app. The `handle_new_user` trigger will auto-create a
   matching `profiles` row with `role = 'user'`.
2. **Promote it to admin**:
   ```sql
   update public.profiles set role = 'admin' where id = '<the new user id>';
   ```
3. **Log in** at `/admin/login` and re-enter the lost item-level content via `/admin/editor` and
   `/admin/media`.
4. **Regenerate types** (optional but recommended) once the schema is live, e.g. via the Supabase MCP
   `generate_typescript_types` tool, and wire them into `lib/supabase/*` clients for type safety.
5. Fill in `SUPABASE_SERVICE_ROLE_KEY` in `.env` if any future server-side/admin script needs it (not
   currently used by the app — all current code uses the anon key).

I have not applied any of this to your live project yet — let me know if you'd like me to run the
migrations now via the Supabase MCP tools.
