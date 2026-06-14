# Mobile Performance Fix — Implementation Plan

## Root Cause Analysis

### 1. Sections not rendering (primary cause)
Services, Process, USP, About, FAQ all have this pattern:
```tsx
{!isLoading && data.length > 0 && <motion.div>...</motion.div>}
```
This means if Supabase is slow, fails, or times out on a mobile network, the section renders **nothing** — no skeleton, no fallback, just blank white space. On mobile (slower network, stricter background tab limits), Supabase requests frequently take 3-5s or fail silently.

### 2. Waterfall of sequential Supabase requests
On every page load the following requests fire in sequence:
1. `languages` table → detect browser language
2. `languages` table again → get language ID
3. `translations` table → fetch all copy
4. `service_items` + `service_item_translations` → services grid
5. `process_steps` table → process section
6. (+ more for USP, About, FAQ hooks)

Each section waits for `languageId` from the TranslationProvider before it can even start fetching. On mobile this chain can take 5-10 seconds, appearing as a blank page.

### 3. GPU-heavy CSS effects that lag on mobile
- `blur-[120px]` / `blur-[150px]` background orbs — multiple per section, CSS `filter: blur()` at this scale kills mobile GPU
- `backdrop-blur-md` on the services modal backdrop
- `animate-pulse` running on multiple elements simultaneously
- `animate-gradient` (background-position animation) on the hero title
- Infinite framer-motion animations (`repeat: Infinity`) running even when off-screen

### 4. Dynamic imports without loading fallbacks
All sections use `dynamic()` with no `loading:` prop. On slow mobile connections the JS bundle hasn't loaded yet when the page paints, so the user sees nothing until the chunk arrives.

---

## Fix Plan (ordered by impact)

### Fix 1 — Add skeleton/fallback states to all data-driven sections
**Files:** `components/services-grid.tsx`, `components/process-section.tsx`, and other section hooks  
**Change:** Replace `{!isLoading && data.length > 0 && ...}` with a skeleton UI while loading and an error fallback when data is empty after loading. At minimum show placeholder cards so the page doesn't look broken.

### Fix 2 — Batch all Supabase fetches into one request
**Files:** `hooks/use-translation.tsx`, create new `hooks/use-page-data.ts`  
**Change:** Combine the 3 translation queries (language detect → language ID → translations) into 2 queries max. Ideally prefetch language ID and translations in a single join. Use `Promise.all()` in the TranslationProvider to run the two queries in parallel instead of sequentially.

### Fix 3 — Reduce or remove heavy blur effects on mobile
**Files:** `components/hero-section.tsx`, `components/services-grid.tsx`, `components/process-section.tsx`, `components/usp-section.tsx`  
**Change:** Replace `blur-[120px]` and `blur-[150px]` with `blur-3xl` (48px) or hide the background orbs entirely on mobile using `hidden md:block`. Remove `backdrop-blur-md` from the services modal on mobile.

### Fix 4 — Disable infinite framer-motion animations on mobile
**Files:** `components/hero-section.tsx`, `components/services-grid.tsx`  
**Change:** Use a `useReducedMotion()` hook (framer-motion has this built in) to skip `repeat: Infinity` animations. Also set `viewport={{ once: true }}` on all `whileInView` animations (most already have this, verify all do).

### Fix 5 — Add `loading` props to dynamic imports
**Files:** `app/page.tsx`  
**Change:** Add skeleton loading components to each `dynamic()` call so the layout doesn't jump and sections are visually present while JS loads.

```tsx
const ServicesGrid = dynamic(
  () => import('@/components/services-grid').then(mod => mod.ServicesGrid),
  { loading: () => <SectionSkeleton /> }
);
```

### Fix 6 — Parallax scroll effect: disable on mobile
**Files:** `components/hero-section.tsx`  
**Change:** The `useScroll` + `useTransform` parallax (`y1`, `y2`, `opacity`) runs on every scroll event. On mobile this causes jank. Disable by returning static values when the viewport is mobile-sized using a `useMediaQuery` hook or CSS `will-change` optimization.

---

## Priority Order

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Skeleton/fallback states | High — sections appear even on slow network | Low |
| 2 | Batch Supabase fetches | High — cuts waterfall from 6+ requests to 2-3 | Medium |
| 3 | Reduce blur effects | High — biggest GPU lag on mobile | Low |
| 5 | Dynamic import skeletons | Medium — prevents blank layout on slow JS load | Low |
| 4 | Disable infinite animations on mobile | Medium — smooths scrolling | Low |
| 6 | Disable parallax on mobile | Medium — reduces scroll jank | Low |

---

## What NOT to change
- The framer-motion `whileInView` entrance animations — these are fine since they use `once: true`
- The overall dynamic import strategy — it's correct, just needs loading states
- Supabase as the data source — the schema is fine, just the fetch pattern needs optimizing
