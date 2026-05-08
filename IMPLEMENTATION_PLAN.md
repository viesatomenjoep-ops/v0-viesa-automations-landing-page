# VIESA Automations Landing Page - Implementation Plan

## Project Overview
Modern, enterprise-grade landing page for Dutch IT Automation company. Emphasis on clean design, professional typography, and smooth interactions.

---

## Design System

### Color Palette (3 Colors + Neutrals)
- **Primary**: VIESA Teal (#0F5373) - brand color from logo, accents, CTAs
- **Secondary**: Deep Slate (#1a2332) - backgrounds, cards, secondary elements
- **Accent**: Light Cyan (#00d9ff) - highlights, hover states, secondary CTAs
- **Neutrals**: White (#ffffff), Off-white (#f8fafc), Dark Gray (#334155)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Inter Bold/Semibold (72px hero down to 24px section titles)
- **Body**: Inter Regular/Medium (16px-18px)
- **Line-height**: 1.6 (relaxed readability)

### Design Tokens (globals.css + tailwind.config.ts)
```
--background: #1a2332 (deep slate)
--foreground: #ffffff (white)
--card: #0f1419 (darker slate for contrast)
--primary: #0F5373 (VIESA teal - from logo)
--accent: #00d9ff (light cyan for highlights)
--muted: #334155 (slate gray)
--border: #2d3e52 (subtle dark border)
```

---

## Component Structure

### Pages & Layouts
```
app/
├── layout.tsx          (Root layout with Inter font, metadata, bg-background class)
├── page.tsx            (Main landing page - imports all sections)
└── globals.css         (Design tokens, custom utilities)

components/
├── Navigation.tsx      (Sticky header, transparent, logo + Contact CTA)
├── Hero.tsx            (Title, subtitle, dual CTAs)
├── Trust.tsx           (Infinite scrolling marquee of logos)
├── Services.tsx        (4-card grid with hover effects)
├── Process.tsx         (Horizontal timeline: Discovery → Design → Build → Automate)
├── USP.tsx             (3-column: Kwaliteit, Doorlooptijd, Tarieven)
├── FAQ.tsx             (Accordion: 8-10 questions in Dutch)
└── Footer.tsx          (Dark footer, links, social icons)
```

---

## Detailed Component Specs

### 1. Navigation
- **Layout**: Flexbox, sticky top, z-50
- **Background**: Transparent initially, with optional scroll-triggered backdrop blur
- **Content**:
  - Left: Logo image (`/viesa-logo.png` 48px) + text "VIESA" in VIESA teal
  - Right: "Contact" CTA button (VIESA teal background, white text)
- **Responsive**: Hamburger menu on mobile (simple, no drawer for now)

### 2. Hero Section
- **Layout**: Centered flex column, min-h-screen, vertical padding 120px
- **Content Alignment**: Center-aligned, max-width 900px
- **Elements**:
  - H1 (72px): "Uw Bedrijf op Autopiloot met VIESA"
  - Subtitle (18px, slate gray): "Van high-end websites tot complexe CRM-systemen: wij automatiseren uw groei van A tot Z."
  - Dual CTAs (side-by-side on desktop, stacked on mobile):
    - "Start Project" (VIESA teal bg, white text, px-8 py-4)
    - "Onze Diensten" (VIESA teal border, VIESA teal text, px-8 py-4)
- **Visual**: Subtle background gradient (deep slate → slightly lighter at bottom)

### 3. Trust Section (Marquee)
- **Layout**: Flex, overflow-hidden, py-20
- **Content**: Horizontal scrolling loop of 6-8 grayscale placeholder logos
- **Tech**: Use Framer Motion (or CSS animation) for infinite scroll
- **Styling**: Grayscale filter, opacity 0.6, hover increases to 1.0
- **Height**: 80px logos with padding

### 4. Services Grid
- **Layout**: CSS Grid, grid-cols-1 md:grid-cols-2 lg:grid-cols-4, gap-6
- **Cards**:
  - Background: Card (#0f1419)
  - Padding: p-8
  - Border: 1px border-muted
  - Hover: Scale 1.05, shadow-lg, border-primary (VIESA teal)
  - Icon: Lucide React (64px, VIESA teal)
  - Title: 20px, white
  - Description: 16px, slate gray (hidden on mobile, show on hover for mobile via CSS)
- **Transition**: smooth 300ms

### 5. Process Section (A-Z Workflow)
- **Layout**: Horizontal timeline flex, gap-8, py-20
- **Steps** (4 total): Discovery → Design → Build → Automate
- **Per Step**:
  - Icon: Large Lucide (48px, VIESA teal)
  - Number/Badge: "01", "02", "03", "04" (VIESA teal background, rounded)
  - Title: 20px white
  - Description: 16px slate gray
  - Connector Line: Horizontal line between steps (hidden on mobile)
- **Desktop**: 4-column horizontal layout
- **Mobile**: Vertical stacked, connector becomes vertical line on left

### 6. USP Section ("Waarom VIESA?")
- **Layout**: 3-column grid on desktop, stacked on mobile
- **Section Title**: H2 (48px) centered above
- **Per Column**:
  - Icon: Lucide (48px, VIESA teal)
  - Title: 24px white
  - Description: 16px slate gray
  - Background: Subtle card background, light borders
  - Padding: p-8
  - Hover: Border-primary glow effect (VIESA teal)

### 7. FAQ Section
- **Layout**: Max-width 900px, centered, py-20
- **Title**: H2 (48px) centered
- **Accordion**:
  - Use Shadcn Accordion component (collapsible)
  - 8-10 questions in Dutch (e.g., "Hoe lang duurt een project?", "Wat zijn de kosten?", "Ondersteun jullie integraties met X?")
  - Question: Bold, VIESA teal underline on hover
  - Answer: Slate gray, p-4, smooth collapse animation
  - Chevron icon: Rotates 180° on expand, VIESA teal

### 8. Footer
- **Layout**: Flex column, bg-background, py-12, border-t border-muted
- **Sections**:
  - Logo/Brand (left)
  - Quick Links (center-left)
  - Contact Info (center-right): Phone, Email, Address (Dutch format)
  - Social Icons (right): LinkedIn, GitHub, Twitter (Lucide icons)
- **Bottom**: Copyright text, centered
- **Responsive**: Stack to single column on mobile

---

## Implementation Order

1. **Setup** (`layout.tsx`, `globals.css`, `tailwind.config.ts`)
   - Configure Inter font
   - Define design tokens
   - Set body background

2. **Navigation** (`Navigation.tsx`)
   - Simple, no dependencies
   - Sticky positioning, basic styling

3. **Hero** (`Hero.tsx`)
   - Core CTAs, no dependencies
   - Set tone for rest of page

4. **Services Grid** (`Services.tsx`)
   - Static component, no dependencies
   - Cards with icons, hover effects

5. **Trust/Marquee** (`Trust.tsx`)
   - May need Framer Motion
   - Infinite scroll animation

6. **Process Timeline** (`Process.tsx`)
   - Visual connectors
   - Responsive layout (horizontal→vertical)

7. **USP Section** (`USP.tsx`)
   - 3-column grid
   - Icon + text layout

8. **FAQ Accordion** (`FAQ.tsx`)
   - Use Shadcn accordion
   - 8-10 Dutch questions

9. **Footer** (`Footer.tsx`)
   - Last component
   - Contact info, social links

10. **Main Page** (`page.tsx`)
    - Import all sections
    - Verify flow, spacing, scroll behavior

---

## Dependencies
```json
{
  "lucide-react": "latest",
  "framer-motion": "^11.0.0",
  "@radix-ui/react-accordion": "latest",
  "tailwindcss": "latest",
  "next": "latest"
}
```

---

## Responsive Breakpoints
- **Mobile**: < 768px (single column, stacked)
- **Tablet**: 768px-1024px (2 columns where applicable)
- **Desktop**: > 1024px (full layouts as designed)

---

## Animation & Transitions
- **Hover States**: 300ms ease-in-out scale/shadow with VIESA teal borders
- **Marquee**: Infinite 20s loop with grayscale filter
- **Accordion**: 200ms smooth height animation
- **Scroll Animations**: Consider subtle fade-in on sections (optional polish)

---

## Accessibility
- Semantic HTML (header, nav, main, footer, section)
- ARIA labels on interactive elements (buttons, accordion)
- Color contrast: VIESA Teal (#0F5373) on dark bg, Light Cyan on dark bg both pass WCAG AA
- Alt text on logos (if images)
- Skip-to-main-content link (optional)

---

## Performance Considerations
- Use **next/image** for logo placeholders (if images)
- Optimize Framer Motion marquee (use `will-change: transform`)
- Lazy-load sections below fold (optional)
- Lighthouse target: 95+ Performance, 100 Accessibility

---

## Deployment
- Deploy to Vercel (native Next.js support)
- Environment: No external APIs needed for MVP
- Domain: Configure custom domain post-launch

---

## Notes
- All text content provided in Dutch (nl-NL)
- Logo placeholders: Use SVG text "VIESA" or simple geometric shapes
- Icons: Lucide React (consistent, professional)
- No forms/backend required for initial launch (Contact CTA can link to email or external form)

---

## Approval Checklist
- [ ] Color palette approved (VIESA Teal, Deep Slate, Light Cyan)
- [ ] Logo integrated (VIESA shield in navigation)
- [ ] Typography (Inter, sizing hierarchy) approved
- [ ] Component specs clear and aligned
- [ ] Implementation order logical
- [ ] Responsive breakpoints acceptable
- [ ] Dependencies minimal and approved

