# VIESA Automations Landing Page V2 - Premium Evolution

## Vision
Transform the existing static landing page into a high-end, dynamic digital experience that reflects the cutting-edge nature of AI and IT automation. Move away from generic "AI-generated" aesthetics toward a curated, premium design system.

---

## 1. Design System (The "Obsidian Tech" Palette)

### Colors
- **Base**: `#050505` (Obsidian Black) - Absolute depth for backgrounds.
- **Surface**: `#0f1419` (Deep Charcoal) - For glass cards and containers.
- **Primary Accent**: `#00f2ff` (Electric Cyan) - Glows, primary CTAs, and active states.
- **Secondary Accent**: `#7000ff` (Vivid Violet) - Used in gradients for depth and "premium tech" feel.
- **Text**: `#ffffff` (High emphasis), `#94a3b8` (Medium), `#475569` (Low).

### Typography
- **Headings**: *Outfit* or *Clash Display* (Bold/Medium) - Geometric and modern.
- **Body**: *Inter* (Regular/Medium) - High readability for complex info.
- **Letter Spacing**: `-0.02em` for headings, `+0.05em` for small caps/labels.

---

## 2. Advanced Component Strategy

### A. The Bento-Box Services Grid
- **Concept**: Abandon the uniform grid for a modular "Bento" layout.
- **Visuals**:
    - Semi-transparent glass backgrounds (`backdrop-blur-xl`).
    - 1px thin borders with a subtle "border-glow" on hover.
    - **3D Tilt**: Implement `framer-motion` parallax tilt on cards.
- **Content**: Use high-quality abstract 3D renders (via image generation) as background textures for cards.

### B. Dynamic Hero Section
- **Visual**: Move from a simple video background to a "Liquid Gradient" or "Grainy Mesh" background that reacts to the mouse.
- **Headline**: Split layout (Headline left, 3D interactive element or high-end mockup right).

### C. Magnetic Navigation
- **Interaction**: Navigation items and buttons should have a "magnetic" pull effect when the cursor is near.

---

## 3. Animation Framework (Framer Motion)

### I. Scroll-Triggered Reveals
- **Staggered Entrance**: Sections and list items should "cascade" in with a `y: 20` and `opacity: 0` transition.
- **View-port Triggers**: Animations only fire when 20% of the element is visible.

### II. Micro-Interactions
- **Magnetic Buttons**: CTAs that follow the cursor slightly within a 30px radius.
- **Smooth Layout Transitions**: Use `layoutId` for shared element transitions between states.
- **Glow Follow**: A subtle radial gradient that follows the cursor behind the glass cards.

### III. Parallax Effects
- **Layered Scrolling**: Background decorative orbs and foreground text move at different speeds (speed factors: 0.1 vs 1.0).

---

## 4. Implementation Steps

1.  **Style Foundation**: Update `globals.css` with the new color tokens and glassmorphism utilities.
2.  **Typography**: Integrate Google Fonts (Outfit).
3.  **Layout Refactor**: Convert `ServicesGrid` to a Bento layout.
4.  **Animation Layer**: Wrap key components in `motion` divs from Framer Motion.
5.  **Visual Polish**: Generate and integrate 3D abstract assets for card backgrounds and hero visuals.

---

## 5. Success Metrics
- **Feel**: Must feel like a $10k+ custom agency site.
- **Performance**: Maintain 90+ Lighthouse score despite animations.
- **Cohesion**: Colors and animations must feel intentional, not cluttered.
