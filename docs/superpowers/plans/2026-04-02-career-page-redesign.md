# Career Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the Career page visual language with the new homepage bento/spatial design — bento overview row, gradient timeline cards, editorial section titles, bento tech grid.

**Architecture:** Add CSS variables and utility classes for bento styling, extend `SurfaceCard` with a `variant="bento"` prop, create a new `CareerOverview` component, then update the three existing career components (CareerTimeline, Certifications, TechStack) to use the new styles. Compose everything in CareerPage.

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS v4, Framer Motion (motion/react-m), i18next, Vite

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/global.css` | Modify | CSS variables (`--bento-card-gradient`, `--bento-card-hover-shadow`) + utility classes (`.section-title-underline`, `.bento-card-glow`) |
| `src/types/ui/components.ts` | Modify | Add `variant` prop to `SurfaceCardProps` |
| `src/components/SurfaceCard.tsx` | Modify | Implement `variant="bento"` rendering path |
| `src/locales/fr.json` | Modify | Add `career.overview.*` keys |
| `src/locales/en.json` | Modify | Add `career.overview.*` keys |
| `src/components/CareerOverview.tsx` | Create | 4-cell bento overview row (availability + stats) |
| `src/components/CareerTimeline.tsx` | Modify | `variant="bento"` on cards, editorial section title |
| `src/components/Certifications.tsx` | Modify | Bento cell style + badge pill |
| `src/components/tech/TechListRow.tsx` | Modify | Conditional experience badge color (orange 4+ yrs, indigo < 4 yrs) |
| `src/components/TechStack.tsx` | Modify | Replace CSS columns with CSS grid, bento category cells |
| `src/pages/CareerPage.tsx` | Modify | Insert `<CareerOverview />` above `<CareerTimeline />` |

---

## Task 1: CSS Variables & Utility Classes

**Files:**
- Modify: `src/global.css`

- [ ] **Step 1: Add bento gradient CSS variable to both dark themes**

Open `src/global.css`. Inside the `[data-theme="cold"]` block (around line 51), add after the existing `--cta-primary-hover` line:

```css
    --bento-card-gradient: linear-gradient(135deg, #13133a 0%, #0e0e26 60%, #0c0c1e 100%);
    --bento-card-hover-shadow: 0 4px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.2);
```

Inside the `[data-theme="gold"]` block (around line 83), add after the existing `--cta-primary-hover` line:

```css
    --bento-card-gradient: linear-gradient(135deg, #1a1108 0%, #130d06 60%, #0a0a0e 100%);
    --bento-card-hover-shadow: 0 4px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(224, 105, 60, 0.2);
```

- [ ] **Step 2: Add `.section-title-underline` and `.bento-card-glow` utility classes**

At the end of `src/global.css`, after all existing rules, add:

```css
/* ========================================================================== */
/* BENTO DESIGN SYSTEM UTILITIES */
/* ========================================================================== */

/* Gradient underline for editorial section titles */
.section-title-underline {
  position: relative;
  display: inline-block;
}

.section-title-underline::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, var(--color-accent), transparent);
  border-radius: 1px;
}

/* Radial glow top-right corner for bento cards */
.bento-card-glow {
  position: relative;
  overflow: hidden;
}

.bento-card-glow::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  pointer-events: none;
  z-index: 0;
}

[data-theme="cold"] .bento-card-glow::before {
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1), transparent 70%);
}

[data-theme="gold"] .bento-card-glow::before {
  background: radial-gradient(circle, rgba(251, 146, 60, 0.08), transparent 70%);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/global.css
git commit -m "feat(css): add bento gradient variables and utility classes"
```

---

## Task 2: SurfaceCard Bento Variant — Type

**Files:**
- Modify: `src/types/ui/components.ts`

- [ ] **Step 1: Add `variant` to `SurfaceCardProps`**

Find this in `src/types/ui/components.ts` (around line 123):

```ts
export type SurfaceCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Dark-mode background opacity. Defaults to '40'. Use '70' for denser surfaces (e.g. blog cards). */
  darkOpacity?: '40' | '70';
};
```

Replace with:

```ts
export type SurfaceCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Dark-mode background opacity. Defaults to '40'. Use '70' for denser surfaces (e.g. blog cards). Ignored when variant is 'bento'. */
  darkOpacity?: '40' | '70';
  /** 'bento' applies the cold/warm gradient background matching homepage bento cells. Defaults to 'default'. */
  variant?: 'default' | 'bento';
};
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/ui/components.ts
git commit -m "feat(types): add variant prop to SurfaceCardProps"
```

---

## Task 3: SurfaceCard Bento Variant — Implementation

**Files:**
- Modify: `src/components/SurfaceCard.tsx`

- [ ] **Step 1: Implement the `bento` variant**

Replace the entire content of `src/components/SurfaceCard.tsx` with:

```tsx
import { forwardRef } from 'react';
import type { SurfaceCardProps } from '@ui/components';

const DARK_OPACITY_CLASS = {
  '40': 'dark:bg-surface/40',
  '70': 'dark:bg-surface/70',
} as const;

const SurfaceCard = forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ className, darkOpacity = '40', variant = 'default', ...props }, ref) => {
    const baseClass =
      // For bento, border-color is omitted from the base so callers freely apply their own
      // color class without Tailwind v4 cascade conflicts.
      variant === 'bento'
        ? 'rounded-xl border [background:var(--bento-card-gradient)]'
        : `rounded-xl border border-border bg-surface/60 ${DARK_OPACITY_CLASS[darkOpacity]}`;
    return (
      <div
        ref={ref}
        className={`${baseClass}${className ? ` ${className}` : ''}`}
        {...props}
      />
    );
  }
);

SurfaceCard.displayName = 'SurfaceCard';
export default SurfaceCard;
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/SurfaceCard.tsx
git commit -m "feat(surface-card): add bento variant with gradient background"
```

---

## Task 4: i18n Keys

**Files:**
- Modify: `src/locales/fr.json`
- Modify: `src/locales/en.json`

- [ ] **Step 1: Add `career.overview` to `fr.json`**

In `src/locales/fr.json`, inside the `"career"` object, add the `"overview"` key after `"downloadCertification"`:

```json
"overview": {
  "available": "Disponible",
  "availableDetail": "Freelance & opportunités CDI",
  "tags": ["Remote", "Paris", "Lead Eng."],
  "yearsLabel": "ans en production",
  "companiesLabel": "entreprises · startup → scale-up",
  "bilingualValue": "FR · EN",
  "bilingualLabel": "Bilingue · pro & tech"
}
```

- [ ] **Step 2: Add `career.overview` to `en.json`**

In `src/locales/en.json`, inside the `"career"` object, add the `"overview"` key after `"downloadCertification"`:

```json
"overview": {
  "available": "Available",
  "availableDetail": "Freelance & CDI opportunities",
  "tags": ["Remote", "Paris", "Lead Eng."],
  "yearsLabel": "years in production",
  "companiesLabel": "companies · startup → scale-up",
  "bilingualValue": "FR · EN",
  "bilingualLabel": "Bilingual · pro & tech"
}
```

- [ ] **Step 3: Commit**

```bash
git add src/locales/fr.json src/locales/en.json
git commit -m "feat(i18n): add career.overview keys for bento overview row"
```

---

## Task 5: CareerOverview Component

**Files:**
- Create: `src/components/CareerOverview.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/CareerOverview.tsx` with the following content:

```tsx
import * as m from 'motion/react-m';
import { useMemo } from 'react';
import { useLanguage } from '@hooks/useLanguage';
import { useMotionTransition } from '@hooks/useMotionTransition';
import { containerCareer, fadeInUp30 } from '@config/motion';
import { CAREER_ENTRIES_BASE } from '@config/career';
import { getPeriodDurationInYears } from '@lib/computeTechExperience';

export default function CareerOverview() {
  const { t, tObject } = useLanguage();
  const transition = useMotionTransition(0.5);

  const { yearsTotal, companyCount } = useMemo(() => {
    const companies = CAREER_ENTRIES_BASE.filter((e) => !!e.website);
    const earliest = CAREER_ENTRIES_BASE[CAREER_ENTRIES_BASE.length - 1].period[0];
    const years = Math.floor(getPeriodDurationInYears([earliest, 'present']));
    return { yearsTotal: years, companyCount: companies.length };
  }, []);

  const tags = (tObject<string[]>('career.overview.tags') ?? []) as string[];

  return (
    <m.div
      className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 mb-8 md:mb-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      variants={containerCareer}
    >
      {/* Availability cell — green tinted, spans full width on mobile */}
      <m.div
        className="col-span-2 md:col-span-1 relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4"
        variants={fadeInUp30}
        transition={transition}
      >
        <div
          className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(74,222,128,0.12), transparent 70%)' }}
          aria-hidden
        />
        <div className="flex items-center gap-2 mb-1.5">
          <span className="relative inline-flex w-2.5 h-2.5">
            <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" aria-hidden />
            <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-bold text-emerald-400">{t('career.overview.available')}</span>
        </div>
        <p className="text-xs text-text-secondary mb-2.5">{t('career.overview.availableDetail')}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </m.div>

      {/* Years cell */}
      <m.div
        className="bento-card-glow rounded-xl border border-border p-4 [background:var(--bento-card-gradient)]"
        variants={fadeInUp30}
        transition={transition}
      >
        <div className="text-2xl font-black text-accent tracking-[-0.05em] leading-none">
          {yearsTotal}
          <span className="text-base font-semibold opacity-60">+</span>
        </div>
        <p className="text-xs text-text-secondary mt-1.5">{t('career.overview.yearsLabel')}</p>
      </m.div>

      {/* Companies cell */}
      <m.div
        className="bento-card-glow rounded-xl border border-border p-4 [background:var(--bento-card-gradient)]"
        variants={fadeInUp30}
        transition={transition}
      >
        <div className="text-2xl font-black text-accent tracking-[-0.05em] leading-none">
          {companyCount}
        </div>
        <p className="text-xs text-text-secondary mt-1.5">{t('career.overview.companiesLabel')}</p>
      </m.div>

      {/* Bilingual cell — spans full width on mobile */}
      <m.div
        className="col-span-2 md:col-span-1 bento-card-glow rounded-xl border border-border p-4 [background:var(--bento-card-gradient)]"
        variants={fadeInUp30}
        transition={transition}
      >
        <div className="text-base font-black text-text-primary tracking-[-0.02em] leading-tight">
          {t('career.overview.bilingualValue')}
        </div>
        <p className="text-xs text-text-secondary mt-1.5">{t('career.overview.bilingualLabel')}</p>
      </m.div>
    </m.div>
  );
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Start dev server and visually verify the component renders (you will need to integrate it first in Task 10, but verify no compile errors here)**

```bash
npm run dev
```

Expected: dev server starts without errors on http://localhost:3000.

- [ ] **Step 4: Commit**

```bash
git add src/components/CareerOverview.tsx
git commit -m "feat(career): add CareerOverview bento stats row component"
```

---

## Task 6: CareerTimeline — Bento Cards & Editorial Title

**Files:**
- Modify: `src/components/CareerTimeline.tsx`

- [ ] **Step 1: Update section title classes**

In `src/components/CareerTimeline.tsx`, find:

```tsx
      <h2
        id="career-timeline"
        className="section-title text-xl md:text-2xl font-bold text-text-primary mb-6 md:mb-8 tracking-tight scroll-mt-28"
      >
```

Replace with:

```tsx
      <h2
        id="career-timeline"
        className="section-title section-title-underline text-2xl md:text-3xl font-black text-text-primary mb-6 md:mb-8 tracking-[-0.04em] scroll-mt-28"
      >
```

- [ ] **Step 2: Apply bento variant and updated hover classes to career cards**

Find:

```tsx
            <SurfaceCard className="career-card flex-1 min-w-0 pl-4 md:pl-5 pr-4 md:pr-5 py-4 md:py-5 border-l-4 border-l-accent transition-all duration-300 ease-out hover:shadow-soft hover:-translate-y-1 hover:border-accent/30">
```

Replace with:

```tsx
            <SurfaceCard variant="bento" className="bento-card-glow career-card flex-1 min-w-0 pl-4 md:pl-5 pr-4 md:pr-5 py-4 md:py-5 border-l-[3px] border-l-accent border-[rgba(99,102,241,0.18)] transition-all duration-300 ease-out hover:[box-shadow:var(--bento-card-hover-shadow)] hover:-translate-y-[2px] hover:border-accent">
```

- [ ] **Step 3: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/CareerTimeline.tsx
git commit -m "feat(career-timeline): apply bento gradient cards and editorial section title"
```

---

## Task 7: Certifications — Bento Cell & Badge Pill

**Files:**
- Modify: `src/components/Certifications.tsx`

- [ ] **Step 1: Update section title**

In `src/components/Certifications.tsx`, find:

```tsx
      <h2
        id="certifications"
        className="section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight scroll-mt-28"
      >
```

Replace with:

```tsx
      <h2
        id="certifications"
        className="section-title section-title-underline text-2xl md:text-3xl font-black text-text-primary mb-4 md:mb-6 tracking-[-0.04em] scroll-mt-28"
      >
```

- [ ] **Step 2: Update cert card to bento style with badge pill**

Find the `<SurfaceCard` for each certification (inside the `.map()`):

```tsx
          <SurfaceCard
            key={cert.id}
            className="p-4 md:p-5 flex flex-col gap-2 border-l-4 border-l-accent/60 hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm md:text-base font-semibold text-text-primary leading-snug">
                {cert.name}
              </h3>
              <span className="text-[11px] font-mono text-text-secondary/80 tabular-nums shrink-0">
                {cert.date}
              </span>
            </div>
            <p className="text-xs md:text-sm text-text-secondary">
              {cert.issuer}
            </p>
```

Replace with:

```tsx
          <SurfaceCard
            key={cert.id}
            variant="bento"
            className="bento-card-glow p-4 md:p-5 flex flex-col gap-2 border-accent/25 transition-all duration-300 hover:-translate-y-[2px] hover:[box-shadow:var(--bento-card-hover-shadow)] hover:border-accent/50"
          >
            <span className="inline-flex items-center gap-1 self-start text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
              ✦ Certification
            </span>
            <h3 className="text-sm md:text-base font-bold text-text-primary leading-snug tracking-[-0.02em]">
              {cert.name}
            </h3>
            <p className="text-xs md:text-sm text-text-secondary">
              {cert.issuer}
            </p>
            <span className="text-[11px] font-mono text-accent tabular-nums">
              {cert.date}
            </span>
```

- [ ] **Step 3: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Certifications.tsx
git commit -m "feat(certifications): upgrade to bento cell with badge pill and gradient depth"
```

---

## Task 8: TechListRow — Conditional Experience Badge Color

**Files:**
- Modify: `src/components/tech/TechListRow.tsx`

- [ ] **Step 1: Add conditional badge color logic**

In `src/components/tech/TechListRow.tsx`, find:

```tsx
          {yearsLabel && (
            <span className="text-[11px] font-medium text-accent bg-accent/10 rounded-full px-2 py-0.5 leading-tight whitespace-nowrap">
              {yearsLabel}
            </span>
          )}
```

Replace with:

```tsx
          {yearsLabel && (
            <span
              className={`text-[11px] font-medium rounded-full px-2 py-0.5 leading-tight whitespace-nowrap border ${
                (experience?.years ?? 0) >= 4
                  ? 'text-accent-on-surface bg-accent/10 border-accent/20'
                  : 'text-indigo-300 bg-indigo-500/10 border-indigo-400/20'
              }`}
            >
              {yearsLabel}
            </span>
          )}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/tech/TechListRow.tsx
git commit -m "feat(tech-list-row): add conditional experience badge color (orange 4+ yrs, indigo <4)"
```

---

## Task 9: TechStack — Bento Grid Layout

**Files:**
- Modify: `src/components/TechStack.tsx`

- [ ] **Step 1: Update section title**

In `src/components/TechStack.tsx`, find:

```tsx
      <h2
        id="tech-stack"
        className="section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight scroll-mt-28"
      >
```

Replace with:

```tsx
      <h2
        id="tech-stack"
        className="section-title section-title-underline text-2xl md:text-3xl font-black text-text-primary mb-4 md:mb-6 tracking-[-0.04em] scroll-mt-28"
      >
```

- [ ] **Step 2: Replace the columns wrapper with a CSS grid**

Find:

```tsx
      <m.div
        className="columns-1 md:columns-2 gap-10"
        variants={containerTechStack}
      >
```

Replace with:

```tsx
      <m.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerTechStack}
      >
```

- [ ] **Step 3: Update `TechCategoryList` wrapper and card to bento style**

Find the `TechCategoryList` function body (the `return` statement):

```tsx
    <m.div
      className="break-inside-avoid mb-5"
      variants={fadeInUp30}
      transition={transition}
    >
      <SurfaceCard className="overflow-hidden">
        <div className="px-4 pt-3.5 pb-2 border-b border-border/30">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary/70">
            {t(category.labelKey)}
          </h3>
        </div>
```

Replace with:

```tsx
    <m.div
      variants={fadeInUp30}
      transition={transition}
    >
      <SurfaceCard variant="bento" className="overflow-hidden border-[rgba(99,102,241,0.18)] hover:border-[rgba(99,102,241,0.32)] transition-colors duration-200">
        <div className="px-4 pt-3.5 pb-2 border-b border-[rgba(99,102,241,0.12)]">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[rgba(165,180,252,0.65)]">
            {t(category.labelKey)}
          </h3>
        </div>
```

- [ ] **Step 4: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/TechStack.tsx
git commit -m "feat(tech-stack): replace CSS columns with bento grid and indigo category cells"
```

---

## Task 10: CareerPage — Integrate CareerOverview

**Files:**
- Modify: `src/pages/CareerPage.tsx`

- [ ] **Step 1: Import and insert CareerOverview**

In `src/pages/CareerPage.tsx`, add the import after the existing imports:

```tsx
import CareerOverview from '@components/CareerOverview';
```

Then find the `<div ref={contentRef} ...>` block:

```tsx
        <div
          ref={contentRef}
          className="flex flex-col gap-10 md:gap-14"
        >
          <CareerTimeline />
```

Replace with:

```tsx
        <div
          ref={contentRef}
          className="flex flex-col gap-10 md:gap-14"
        >
          <CareerOverview />
          <CareerTimeline />
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/CareerPage.tsx
git commit -m "feat(career-page): integrate CareerOverview bento row above timeline"
```

---

## Task 11: Visual Verification

**Files:** none — read-only verification pass

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open http://localhost:3000/career in the browser.

- [ ] **Step 2: Verify CareerOverview bento row**

Check the following at the top of the page:
- 4-cell grid renders: availability (green), years, companies, bilingual
- Availability cell shows animated pulse dot (green)
- Years cell shows computed number (should be 10) + "+" suffix
- Companies cell shows 6 (CAREER_ENTRIES_BASE entries with a website)
- Switch to FR → labels update; switch to EN → labels update
- On mobile (resize to < 768px): availability spans full width, years + companies on same row, bilingual spans full width

- [ ] **Step 3: Verify career cards**

- Cards have cold gradient background (dark blue-tinted)
- Left border is accent color (3px)
- Hover: card lifts 2px, border transitions to full accent
- Section title "Parcours" has gradient underline visible

- [ ] **Step 4: Verify certifications**

- Card shows "✦ Certification" badge pill at top in accent color
- Card has gradient background with accent border
- Date is in accent color below issuer

- [ ] **Step 5: Verify tech stack**

- Categories render in 3-column grid on desktop (≥ 1024px)
- Categories render in 2-column grid on tablet (768px–1023px)
- Categories render in 1-column on mobile (< 768px)
- Category headers are indigo-tinted (not white/grey)
- Experience badges: 4+ years in orange, under 4 years in indigo

- [ ] **Step 6: Verify both themes**

Toggle between cold and gold themes using the theme switcher:
- Cold: bento cards have cold indigo-dark gradient
- Gold: bento cards have warm brown-dark gradient
- Section title underlines adapt to each theme's accent color

- [ ] **Step 7: Final typecheck**

```bash
npm run typecheck
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 8: Commit if any minor tweaks were made during verification**

```bash
git add -p
git commit -m "fix(career): visual tweaks from verification pass"
```
