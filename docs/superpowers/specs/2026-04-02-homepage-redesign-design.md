# Homepage Redesign — Q2 2026 Design Spec

**Date:** 2026-04-02  
**Scope:** Full redesign of `HomePage` + `HeroSection` + `ProjectsGrid` + `LatestPostTeaser` + SEO layer  
**Design direction:** Spatial Bento · Dual cold/gold themes preserved · Photo in hero  

---

## 1. Goals

Triple objective, each element must serve all three simultaneously:

- **Employment** — Surface availability, experience, and credibility above the fold for recruiters and CTOs
- **Freelance** — Showcase projects with stronger visual hierarchy and case study feel
- **Audience / personal brand** — Blog discoverability improved with featured article + density

---

## 2. Current UI/UX Score (baseline)

**Overall: 67/100**

| Category | Score | Key gaps |
|---|---|---|
| Visual Design | 61 | Circular photo (dated), centered layout (generic 2023), no editorial type |
| UX & Usability | 62 | Availability badge buried, weak CTA hierarchy, no social proof numbers |
| Content & SEO | 34 | Zero JSON-LD, weak OG tags, blog barely discoverable |
| 2026 Trend Alignment | 29 | No bento/asymmetric layout, no depth effects, no cursor interactivity |

---

## 3. Design Decisions

### 3.1 Hero — Bento Grid (3-column)

Replace the current centered single-column hero with a 3-column asymmetric bento grid.

**Grid layout:**

```
┌─────────────────────┬──────────────┬──────────────────┐
│                     │              │  Availability    │
│   Main cell         │  Photo cell  │  (green theme)   │
│   (name, tagline,   │  (editorial  ├──────────────────┤
│   tech pills, CTA)  │  portrait)   │  Metrics cell    │
│                     │              │  (4 mini stats)  │
└─────────────────────┴──────────────┴──────────────────┘
```

**Column proportions:** `1fr 180px 200px`  
**Row proportions:** `1fr 1fr` (main and photo span both rows)

**Cell: Main** (`grid-column: 1, grid-row: 1/3`)
- Background: `linear-gradient(145deg, #13133a, #0e0e26, #0c0c1e)` (cold) / equivalent warm for gold
- Radial glow accent (top-right corner, 12% opacity)
- Content top: eyebrow label ("Lead Software Engineer · 10+ yrs") + hero name (`Luc / TERRACHER` with accent color on last name) + tagline paragraph
- Content bottom: tech pills row (React, TypeScript, Node.js) + primary CTA ("View career →")
- Name font size: `clamp(2.6rem, 5vw, 3.6rem)`, weight 900, letter-spacing -0.04em
- TERRACHER in `--color-accent-on-surface` with underline draw-in animation (already exists)
- Padding: 40px

**Cell: Photo** (`grid-column: 2, grid-row: 1/3`)
- Real photo from `HeroPhoto` component — display as `object-fit: cover`, full cell height
- No circular clip — use `border-radius: 16px` (editorial crop)
- Subtle gradient overlay at bottom (fade to background color)
- Corner tag showing current focus ("AI · LLM") — small pill, top-right
- Border: `rgba(99,102,241,0.15)` (cold) / warm equivalent (gold)

**Cell: Availability** (`grid-column: 3, grid-row: 1`)
- Background: green-tinted dark (`#0e1a0e` cold, equivalent warm)
- Border: `rgba(74,222,128,0.2)`
- Animated pulse dot (green, existing animation pattern)
- Label: "Available for opportunities"
- Detail text: current training focus
- Tags: Deep Learning · LLM Eng. · Agentic AI
- Padding: 24px

**Cell: Metrics** (`grid-column: 3, grid-row: 2`)
- Background: `#111128` (cold) / equivalent (gold)
- 2×2 grid of 4 mini metrics:
  - `10+` · Years in prod
  - `Lead` · Engineer
  - `FR/EN` · Bilingual
  - `AI` · Upskilling (accent color)
- Padding: 20px 24px

**Responsive behavior:**
- `md` (≥768px): 3-column bento as above
- `< md` (mobile): stack to single column — main cell full width, then photo cell (fixed height ~200px), then availability + metrics side by side

### 3.2 Navbar

**No change.** The floating pill navbar is already strong. Preserve as-is.

### 3.3 Projects Section

Evolve existing `ProjectsGrid` cards — keep 2-column structure, upgrade visual style:

- `border-radius`: increase from `rounded-xl` (12px) to `rounded-2xl` (16px)
- Border color: subtler at rest, more pronounced on hover (`rgba(99,102,241,0.35)`)
- Image overlay: darken gradient from bottom, project name label overlaid on image
- Hover: `border-color` transition + `-translate-y-1` (existing) — keep
- No layout change (2-col grid preserved)

### 3.4 Blog Section — Featured Layout

Replace `LatestPostTeaser` single card with a 2-part featured layout:

```
┌────────────────────────────────┬──────────────────┐
│  Featured article              │  Article 2       │
│  (cover image + tag + title +  ├──────────────────┤
│   date + reading time)         │  Article 3       │
└────────────────────────────────┴──────────────────┘
```

- Left: large card with cover image (height ~140px), category tag pill, title, meta (date · reading time · tags)
- Right: 2 mini-cards stacked (title + date + reading time only, no image)
- "All articles →" link preserved below the grid
- Data source: same Vite glob import — just expose top 3 posts instead of top 1

### 3.5 Action Bar

Replace the current inline `HeroActions` sub-component (CV + social icons) with a dedicated bottom action bar:

- Full-width container with subtle border and background
- Contents: "Download Resume" pill button · LinkedIn icon · GitHub icon
- Positioned after blog section, before footer
- Visual style: `bg-surface/70 border border-border rounded-2xl`

### 3.6 SEO Layer (no visual impact)

**JSON-LD structured data** — add `<script type="application/ld+json">` in `index.html`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Luc Terracher",
  "jobTitle": "Lead Software Engineer",
  "url": "https://polymorphl.github.io",
  "sameAs": [
    "https://www.linkedin.com/in/lucterracher/",
    "https://github.com/polymorphl"
  ],
  "knowsAbout": ["React", "TypeScript", "Node.js", "Deep Learning", "LLM Engineering"]
}
```

**OG meta tags** — ensure per-page `og:title`, `og:description`, `og:image` in `index.html` (static for homepage, dynamic for blog posts via frontmatter).

**Blog post OG images** — static fallback image at `/assets/og-default.png` (1200×630). Blog posts can use their `cover` frontmatter field as `og:image`.

---

## 4. Files Affected

| File | Change type |
|---|---|
| `src/components/HeroSection.tsx` | Major — rewrite to bento grid layout |
| `src/components/HeroPhoto.tsx` | Minor — remove circular clip, add editorial styling |
| `src/pages/HomePage.tsx` | Minor — add action bar, update section structure |
| `src/components/ProjectsGrid.tsx` | Minor — evolve card styles |
| `src/components/blog/LatestPostTeaser.tsx` | Major — rewrite to featured 3-post layout |
| `src/global.css` | Minor — new bento cell CSS variables/classes |
| `index.html` | Minor — add JSON-LD + OG meta tags |
| `src/types/ui/components.ts` | Minor — update prop types for new components |

---

## 5. Out of Scope

- Career page (`/career`) — not changed in this iteration
- Blog post page (`/blog/:slug`) — not changed
- Theme switcher logic — preserved exactly
- i18n keys for existing strings — preserved; new strings added for new UI elements
- Cursor spotlight / scroll parallax effects — deferred to V2

---

## 6. Success Criteria

- Hero renders correctly in both cold and gold themes
- Photo displays as editorial crop (no circle) at all breakpoints
- Availability cell visible above the fold on desktop (≥ 1024px)
- Blog section shows 3 posts (1 featured + 2 mini)
- JSON-LD validates at schema.org/validator
- `npm run typecheck` passes with zero errors
- No regressions on mobile (< 768px)
