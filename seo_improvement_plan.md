# SEO Improvement Implementation Plan - VIESA Automations

This plan outlines the steps to optimize the VIESA Automations landing page and portfolio for search engines, social media, and accessibility.

## 1. Technical SEO Foundation
- [ ] **Dynamic Metadata Implementation**:
    - Update `app/portfolio/[slug]/page.tsx` (or similar) to use `generateMetadata` to pull localized titles and descriptions from Supabase.
    - Ensure unique titles for every page (e.g., "Project Name | VIESA Portfolio").
- [ ] **Canonical URLs**:
    - Implement a helper to generate canonical URLs to prevent duplicate content issues.
- [ ] **Sitemap & Robots**:
    - Create `app/sitemap.ts` to dynamically generate a sitemap including all portfolio items.
    - Create `app/robots.ts` to define crawling rules.

## 2. Internationalization (i18n) SEO
- [ ] **Hreflang Tags**:
    - Add `alternate` links in metadata to tell search engines about the Dutch, English, and Spanish versions of each page.
- [ ] **Localized Metadata**:
    - Ensure the `description` and `title` fields in `layout.tsx` are translated based on the current locale.

## 3. Social & Rich Results
- [ ] **Open Graph (OG) Tags**:
    - Add OG images, titles, and descriptions for better sharing on LinkedIn/WhatsApp.
- [ ] **Twitter Cards**:
    - Implement `summary_large_image` cards.
- [ ] **JSON-LD Structured Data**:
    - Add `Organization` schema to the home page.
    - Add `Project` or `CaseStudy` schema to portfolio items.
    - Add `FAQPage` schema to the FAQ section.

## 4. Content & Asset Optimization
- [ ] **Image Alt Text**:
    - Ensure the CMS (Supabase) has an `alt_text` field for portfolio images.
    - Update `PortfolioContent` to render these alt tags instead of defaults.
- [ ] **Semantic HTML Audit**:
    - Ensure proper `h1`-`h6` hierarchy across all sections (Services, Process, About).
- [ ] **Core Web Vitals**:
    - Optimize any large assets (like `background.mp4`) to ensure they don't block the Largest Contentful Paint (LCP).

## 5. Next Steps
1. Implement `sitemap.ts` and `robots.ts`.
2. Enhance `layout.tsx` with full OG/Twitter metadata.
3. Add JSON-LD snippets to the main sections.
