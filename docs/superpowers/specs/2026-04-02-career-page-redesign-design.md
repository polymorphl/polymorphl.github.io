# Career Page Redesign — Design Spec

**Date:** 2026-04-02
**Branch:** `feature/homepage-redesign-2026`
**Scope:** Align `CareerPage` visual language with the new homepage bento/spatial design
**Design direction:** Approach A — Bento Overview Row + Gradient Timeline + Bento Tech Grid

---

## 1. Context & Goals

The homepage is being redesigned to a spatial bento grid aesthetic (see `2026-04-02-homepage-redesign-design.md`). The career page currently scores **53/100** — 14 points below even the old homepage baseline — and will feel visually inconsistent once the new homepage ships.

**Goal:** Bring the career page to ~78/100 by adopting the same design vocabulary without rewriting the working timeline UX.

### Current Score Breakdown

| Category | Score | Key gaps |
|---|---|---|
| Visual Design | 56 | Flat card surfaces, no depth, plain section titles |
| UX & Usability | 70 | Good (preserved — timeline, ToC, logos all stay) |
| 2026 Trend Alignment | 30 | No bento, no spatial hierarchy, no depth effects |
| Homepage Coherence | 45 | Same tokens, completely different spatial grammar |
| Content Hierarchy | 62 | No hero moment, equal-weight sections |

---

## 2. Design Decisions

### 2.1 New Component — CareerOverview

A 4-cell bento row inserted above `CareerTimeline` in `CareerPage`. Mirrors the metrics/availability cells from the homepage hero.

**Grid:** `grid-template-columns: 1.4fr 1fr 1fr 1fr` · gap 8px

**Cell 1 — Availability** (green-tinted):
- Background: `rgba(74,222,128,0.08)` · border: `rgba(74,222,128,0.22)`
- Animated pulse dot (reuse existing keyframe)
- Label: "Disponible" · detail: "Freelance & opportunités CDI"
- Tags: Remote · Paris · Lead Eng.
- Radial glow top-right corner

**Cell 2 — Years** (cold gradient):
- Background: `linear-gradient(145deg, #13133a, #0e0e26, #0c0c1e)`
- Value: `10+` in accent orange · label: "ans en production"
- Computed from `CAREER_ENTRIES_BASE` at runtime

**Cell 3 — Companies** (cold gradient):
- Value: company count · label: "entreprises · startup → scale-up"
- Computed from `CAREER_ENTRIES_BASE` at runtime

**Cell 4 — Bilingual** (cold gradient):
- Value: `FR · EN` · label: "Bilingue · pro & tech"

**Responsive:** `md` → 4-col as above · `< md` → availability full-width top, 3 stats in a row below

**New file:** `src/components/CareerOverview.tsx`

**i18n keys added** (fr.json + en.json):
- `career.overview.available`
- `career.overview.availableDetail`
- `career.overview.tags` (array: Remote, Paris, Lead Eng.)
- `career.overview.yearsLabel`
- `career.overview.companiesLabel`
- `career.overview.bilingualValue`
- `career.overview.bilingualLabel`

---

### 2.2 Timeline Cards — Gradient Depth

Career entry cards upgrade from flat `SurfaceCard` to a new `variant="bento"` on `SurfaceCard`.

**Background:** `linear-gradient(135deg, #13133a 0%, #0e0e26 60%, #0c0c1e 100%)`
- Warm theme gets equivalent warm gradient via CSS variable

**Border:** `rgba(99,102,241,0.18)` at rest → `rgba(251,146,60,0.35)` on hover
- Left border: `3px solid accent` (was `4px border-l-accent`)

**Hover state:**
- `box-shadow: 0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(251,146,60,0.2)`
- `transform: translateY(-2px)`
- Border transitions to full accent

**Radial glow:** `radial-gradient(circle, rgba(251,146,60,0.08), transparent 70%)` — top-right, `position: absolute`, `pointer-events: none`

**Tech pills inside cards:** pick up indigo tint `rgba(99,102,241,0.1)` border — same vocabulary as homepage cell borders

**SurfaceCard change:** add `variant?: 'default' | 'bento'` prop. `bento` variant applies the gradient bg + indigo border. Default behavior unchanged (no regression on other uses).

---

### 2.3 Section Titles — Editorial Weight

All section titles in `CareerTimeline`, `Certifications`, `TechStack`:

| Before | After |
|---|---|
| `text-xl md:text-2xl font-bold` | `text-2xl md:text-3xl font-black` |
| `letter-spacing: 0` | `letter-spacing: -0.04em` |
| Plain text | Inline `::after` pseudo-element: gradient underline `accent → transparent`, height 2px, full width, bottom -3px |

The underline is implemented as a `.section-title-underline` CSS class added to `src/global.css` using `::after` (Tailwind v4 has no `::after` pseudo-element utility). No animation needed — static draw, unlike the homepage hero name underline which animates via Framer Motion.

---

### 2.4 Tech Stack — Bento Grid

Replace `className="columns-1 md:columns-2 gap-10"` wrapper in `TechStack.tsx` with a CSS grid.

**Layout:** `grid-template-columns: repeat(3, 1fr)` on desktop · `repeat(2, 1fr)` on tablet (`md`) · `1fr` on mobile

**Category cells (`TechCategoryList`):**
- Background: cold gradient (same as career cards)
- Border: `rgba(99,102,241,0.18)` at rest → `rgba(99,102,241,0.35)` on hover
- Category header label: indigo tint `rgba(165,180,252,0.6)` (was `text-text-secondary/70`)
- Remove `break-inside-avoid mb-5` (no longer needed with grid)

**Experience badges:**
- 4+ years → orange badge: `bg-accent/10 border-accent/20 text-accent`
- < 4 years → indigo badge: `bg-indigo-500/10 border-indigo-400/20 text-indigo-300`
- Same data from `computeTechExperience` — no logic change

---

### 2.5 Certifications — Accent Bento Cell

Upgrade from flat card to full bento cell, matching career entry depth.

**Card style:**
- Background: cold gradient
- Border: `rgba(251,146,60,0.28)` (full accent border, not the dimmed `/60` from before)
- Radial glow top-right corner (accent)
- Hover: lift + glow shadow

**New elements:**
- "✦ Certification" badge pill (top of card, accent-tinted)
- Year moves below issuer (monospace, accent color)
- Action links get a divider top border (`border-t border-white/7`)
- "Voir la certification →" with arrow

---

## 3. Files Affected

| File | Change |
|---|---|
| `src/components/CareerOverview.tsx` | **New** — 4-cell bento overview row |
| `src/components/SurfaceCard.tsx` | **Minor** — add `variant` prop (`'default' \| 'bento'`) |
| `src/components/CareerTimeline.tsx` | **Minor** — use `SurfaceCard variant="bento"`, update section title classes, pill tint |
| `src/components/TechStack.tsx` | **Minor** — replace `columns-*` with CSS grid, update category cell style |
| `src/components/Certifications.tsx` | **Minor** — upgrade to bento cell style, add badge pill |
| `src/pages/CareerPage.tsx` | **Minor** — insert `<CareerOverview />` above `<CareerTimeline />` |
| `src/locales/fr.json` | **Minor** — add `career.overview.*` keys |
| `src/locales/en.json` | **Minor** — add `career.overview.*` keys |

---

## 4. Out of Scope

- `TableOfContents` component — no change
- `CareerLogo` component — no change
- Timeline connector (dot + vertical line) — preserved exactly
- Routing, motion variants, hooks — no change
- Warm/gold theme — CSS variables handle it automatically via existing theme system

---

## 5. Success Criteria

- `CareerOverview` bento row renders correctly in both cold and gold themes
- Availability cell pulse dot animates (reuses existing keyframe)
- Career cards show cold gradient in dark mode, warm gradient in gold mode
- Tech stack renders as 3-col bento grid on desktop, 2-col on tablet, 1-col on mobile
- Section titles have gradient underline in all sections
- `npm run typecheck` passes with zero errors
- No regressions on existing ToC, logos, timeline connectors, or motion animations
- Mobile layout (< 768px) presents correctly for all new components
