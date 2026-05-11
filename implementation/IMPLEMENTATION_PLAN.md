# CMS & Localization Implementation Plan

## Overview
This plan outlines the steps to implement a custom CMS and multi-language support (Dutch, English, Spanish) for the VIESA Automations landing page using Supabase as the backend.

---

## 1. Database Schema (Supabase)

We will use a normalized schema to handle multi-language content across different sections.

### Tables

#### `languages`
Stores supported locales.
- `id`: uuid (primary key)
- `code`: text (e.g., 'nl', 'en', 'es')
- `name`: text (e.g., 'Dutch', 'English', 'Spanish')
- `is_default`: boolean

#### `sections`
Groups content by page section.
- `id`: uuid (primary key)
- `name`: text (unique, e.g., 'hero', 'services', 'about')
- `display_name`: text (for CMS UI)

#### `content_keys`
Defines specific editable fields within a section.
- `id`: uuid (primary key)
- `section_id`: uuid (references `sections.id`)
- `key`: text (e.g., 'title', 'subtitle', 'cta_primary')
- `field_type`: text (e.g., 'text', 'textarea', 'image', 'richtext')

#### `translations`
The actual content per language.
- `id`: uuid (primary key)
- `content_key_id`: uuid (references `content_keys.id`)
- `language_id`: uuid (references `languages.id`)
- `value`: text (the translated content)

#### `media`
Stores image references.
- `id`: uuid (primary key)
- `url`: text
- `alt_text`: text
- `content_key_id`: uuid (optional, for direct mapping)

---

## 2. Environment Variables

We will need the following variables in `.env.local`:

```bash
# Supabase Connectivity
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # For admin/server-side operations

# Optional: Project ID for CLI/Tools
SUPABASE_PROJECT_ID=bvdpybsxzuhnclpviuas
```

## 2. Authentication & Security

- **Supabase Auth**: Use email/password login for admin access.
- **Middleware**: Implement Next.js middleware to protect all routes under `/admin`.
- **Role-Based Access**: Create a `profiles` table to store user roles (e.g., 'admin').
- **RLS (Row Level Security)**: 
    - `languages`, `sections`, `content_keys`, `translations`: Publicly readable, admin-only write.

---

## 3. CMS UI Design (Admin Route)

The admin dashboard will be located at `/admin` and built using **Shadcn UI**.

### Layout
- **Sidebar**: Links to dashboard, sections (Hero, Services, About, etc.), and Settings.
- **Header**: User profile, Logout, and a Global Language Switcher (to preview/edit specific languages).

### Section Editor (Mobile-Friendly)
- **Form**: Built with `react-hook-form` and `zod`.
- **Fields**: 
    - Text inputs for short titles.
    - Textareas for descriptions.
    - Image Uploaders with preview (integrating with Supabase Storage).
- **Tabbed Language View**: Edit NL, EN, and ES side-by-side or via tabs.

---

## 4. Multi-Language Frontend Strategy

### Routing
- Use a dynamic route segment: `/[locale]/...` or a middleware-based detection.
- Supported locales: `nl` (default), `en`, `es`.

### Content Fetching
- Create a `getTranslations(locale)` server action or utility that fetches all content for the current language.
- Use a `TranslationProvider` (Context) to make translations available globally via a `useTranslation()` hook.

### Component Integration
- Replace hardcoded text with: `{t('hero.title')}`.
- Replace hardcoded images with: `<Image src={t('hero.image_url')} ... />`.

---

## 5. Step-by-Step Execution Path

### Phase 1: Supabase Foundation
1.  **Migrations**: Run SQL scripts to create tables and RLS policies.
2.  **Storage**: Create a `cms_assets` bucket for images/logos.
3.  **Initial Data**: Seed the database with current hardcoded content and language definitions.

### Phase 2: Backend & Auth
1.  **Auth Setup**: Configure Supabase Auth and create an admin user.
2.  **Middleware**: Setup `middleware.ts` to redirect unauthenticated users from `/admin`.
3.  **Server Actions**: Create CRUD actions for translations and media uploads.

### Phase 4: Admin UI Development
1.  **Admin Layout**: Build the sidebar and main content area.
2.  **Login Page**: Simple, clean Shadcn form.
3.  **Section Editors**: 
    - Build a generic `SectionForm` component.
    - Implement specific editors for Hero, Services, About, etc.
4.  **Media Manager**: A simple view to see and upload assets to Supabase Storage.

### Phase 5: Frontend Integration
1.  **Localization Hook**: Implement fetching and context logic (using `localStorage` for state-based persistence).
2.  **Refactor Components**: Systematically replace hardcoded text with `t()` function calls.
3.  **Language Switcher**: Add a premium dropdown in the main site navigation.

---

## 6. Confirmed Decisions
- **Language Switching**: State-based (stays on `/`). Content persists via `localStorage`/`cookies`.
- **Initial Data**: Seeding with existing Dutch content as the primary language.
- **Admin Security**: Simple single-role check (Email-based or a specific `role` field).
