# Homepage Redesign — Q2 2026 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage with a Spatial Bento hero, evolved project cards, a featured blog section, and a JSON-LD SEO layer — targeting Q2 2026 design trends.

**Architecture:** The hero (`HeroSection`) is rewritten as a 3-column CSS grid bento (main cell / photo cell / right column with availability + metrics). `LatestPostTeaser` is replaced by `FeaturedPosts` showing the top 3 posts. An `ActionBar` (CV + socials) moves from inside `HeroSection` to the bottom of `HomePage`. The i18n, types, and SEO layers are updated in parallel.

**Tech Stack:** React 19, TypeScript (strict), Tailwind CSS v4, motion/react-m, i18next, React Router 7

**Spec:** `docs/superpowers/specs/2026-04-02-homepage-redesign-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `index.html` | Modify | JSON-LD Person schema + updated OG/meta tags |
| `src/locales/en.json` | Modify | Add 5 new i18n keys for bento cells |
| `src/locales/fr.json` | Modify | Same keys in French |
| `src/components/HeroPhoto.tsx` | Modify | Remove `rounded-full` → editorial crop |
| `src/components/HeroSection.tsx` | Rewrite | Bento 3-col grid; remove HeroStatusBadge + HeroActions sub-components |
| `src/types/ui/components.ts` | Modify | Remove now-unused `HeroStatusBadgeProps` + `HeroActionsProps` |
| `src/components/blog/FeaturedPosts.tsx` | Create | 3-post layout (1 featured + 2 mini), replaces LatestPostTeaser |
| `src/components/ProjectsGrid.tsx` | Modify | Evolve card border-radius + hover states |
| `src/pages/HomePage.tsx` | Modify | Add inline ActionBar, swap LatestPostTeaser → FeaturedPosts |

---

## Task 1: SEO — JSON-LD + OG meta update

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update index.html**

Replace the entire `<head>` content with:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description"
    content="Luc Terracher — Lead Software Engineer with 10+ years shipping high-performance web products. React, TypeScript, Node.js. Available for new opportunities.">
  <meta property="og:title" content="Luc Terracher — Lead Software Engineer">
  <meta property="og:description"
    content="Lead Software Engineer with 10+ years shipping high-performance web products. React, TypeScript, Node.js. Available for new opportunities.">
  <meta property="og:image" content="https://polymorphl.github.io/og-image.png">
  <meta property="og:url" content="https://polymorphl.github.io">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://polymorphl.github.io/og-image.png">
  <title>Luc Terracher — Lead Software Engineer</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preload" href="/profile.webp" as="image" type="image/webp">
  <script type="application/ld+json">
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
    "knowsAbout": ["React", "TypeScript", "Node.js", "Deep Learning", "LLM Engineering", "Agentic AI"]
  }
  </script>
</head>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat(seo): add JSON-LD Person schema and improve OG meta tags"
```

---

## Task 2: i18n — Add bento metric strings

**Files:**
- Modify: `src/locales/en.json`
- Modify: `src/locales/fr.json`

- [ ] **Step 1: Add keys to en.json**

In `src/locales/en.json`, add 4 keys inside the `"hero"` object (after `"contact"`):

```json
"metricYears": "Years in prod",
"metricRole": "Lead Engineer",
"metricBilingual": "Bilingual",
"metricAI": "Upskilling"
```

And add 1 key inside the `"home"` object (after `"allArticlesCta"`):

```json
"featuredPost": "Featured"
```

- [ ] **Step 2: Add keys to fr.json**

In `src/locales/fr.json`, add 4 keys inside the `"hero"` object (after `"contact"`):

```json
"metricYears": "Ans en prod",
"metricRole": "Ingénieur Lead",
"metricBilingual": "Bilingue",
"metricAI": "En formation"
```

And add 1 key inside the `"home"` object (after `"allArticlesCta"`):

```json
"featuredPost": "À la une"
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/locales/en.json src/locales/fr.json
git commit -m "feat(i18n): add bento hero metric strings and featured post label"
```

---

## Task 3: HeroPhoto — editorial crop

**Files:**
- Modify: `src/components/HeroPhoto.tsx`

- [ ] **Step 1: Remove rounded-full from the img**

Change `src/components/HeroPhoto.tsx` to:

```tsx
export default function HeroPhoto() {
  return (
    <picture className="profile-photo-picture block relative z-10 size-full">
      <source srcSet="/profile.webp" type="image/webp" />
      <img
        src="/profile.png"
        alt="Luc TERRACHER"
        fetchPriority="high"
        className="hero-photo block size-full object-cover object-top"
        width={288}
        height={260}
      />
    </picture>
  );
}
```

Note: `object-center` → `object-top` so the face is visible when the cell clips vertically.

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroPhoto.tsx
git commit -m "feat(hero): switch photo to editorial crop (remove rounded-full)"
```

---

## Task 4: HeroSection — bento grid rewrite

**Files:**
- Modify: `src/components/HeroSection.tsx`

This task removes `HeroStatusBadge` and `HeroActions` sub-components (and their prop types imports) and replaces the centered layout with a 3-column bento grid.

- [ ] **Step 1: Rewrite HeroSection.tsx**

Replace the entire file content:

```tsx
import * as m from "motion/react-m";
import { Link } from "react-router-dom";
import { useLanguage } from "@hooks/useLanguage";
import { useMotionTransition } from "@hooks/useMotionTransition";
import { containerHero, fadeInUp20, scaleIn } from "@config/motion";
import HeroPhoto from "@components/HeroPhoto";
import TechPill from "@components/TechPill";

export default function HeroSection() {
  const { t } = useLanguage();
  const transition = useMotionTransition(0.6);

  return (
    <m.section
      className="hero-section w-full pt-6 md:pt-10 pb-4"
      variants={containerHero}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_200px] gap-3">

        {/* ── Cell: Main ── */}
        <m.div
          className="md:row-span-2 flex flex-col justify-between gap-6 rounded-[20px] border border-border p-8 min-h-[200px] md:min-h-[300px]"
          style={{ background: "linear-gradient(145deg, var(--color-surface) 0%, var(--color-background) 100%)" }}
          variants={fadeInUp20}
          transition={transition}
        >
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-accent-on-surface/60 flex items-center gap-2">
              <span className="inline-block w-1 h-1 rounded-full bg-accent-on-surface/60" aria-hidden />
              {t("hero.subtitle")} · {t("hero.experience")}
            </p>
            <h1 className="hero-title text-[2.6rem] sm:text-[3rem] lg:text-[3.4rem] font-extrabold leading-[0.92] tracking-[-0.04em] text-text-primary">
              Luc{" "}
              <span className="relative inline-block">
                TERRACHER
                <m.span
                  className="absolute left-0 right-0 bottom-[-2px] h-[3px] rounded-sm origin-left"
                  style={{ background: "var(--accent-line-gradient)" }}
                  variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
                  initial="hidden"
                  animate="visible"
                  transition={{ ...transition, delay: 0.15 }}
                  aria-hidden
                />
              </span>
            </h1>
            <p className="text-sm md:text-base text-text-secondary/80 leading-relaxed max-w-md">
              {t("hero.tagline")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex flex-wrap gap-2">
              <TechPill name="React" icon="react" />
              <TechPill name="TypeScript" icon="typescript" />
              <TechPill name="Node.js" icon="nodejs" />
            </div>
            <Link
              to="/career"
              className="cta-primary inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm no-underline shadow-[var(--shadow-button)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 shrink-0"
            >
              {t("projects.viewCareerCta")}
              <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
        </m.div>

        {/* ── Cell: Photo ── */}
        <m.div
          className="md:row-span-2 rounded-[20px] border border-border overflow-hidden relative h-[220px] md:h-auto"
          variants={scaleIn}
          transition={transition}
        >
          <HeroPhoto />
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(to top, var(--color-background), transparent)" }}
            aria-hidden
          />
        </m.div>

        {/* ── Cell: Availability ── */}
        <m.div
          className="rounded-[20px] p-5 flex flex-col gap-3"
          style={{
            background: "linear-gradient(145deg, rgba(14,26,14,0.95), rgba(9,20,9,0.9))",
            border: "1px solid rgba(74,222,128,0.25)",
          }}
          variants={fadeInUp20}
          transition={{ ...transition, delay: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <span className="relative inline-flex w-2.5 h-2.5 shrink-0">
              <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" aria-hidden />
              <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-bold text-emerald-400 tracking-wide">
              {t("hero.status")}
            </span>
          </div>
          <p className="text-[11px] text-emerald-300/60 leading-relaxed">
            {t("hero.training")}
          </p>
        </m.div>

        {/* ── Cell: Metrics ── */}
        <m.div
          className="rounded-[20px] border border-border bg-surface/60 p-5 grid grid-cols-2 gap-4"
          variants={fadeInUp20}
          transition={{ ...transition, delay: 0.15 }}
        >
          <div>
            <p className="text-[1.5rem] font-black leading-none tracking-tight text-text-primary">
              10<span className="text-[1rem] text-accent-on-surface">+</span>
            </p>
            <p className="text-[10px] text-text-secondary/50 mt-1 leading-tight">
              {t("hero.metricYears")}
            </p>
          </div>
          <div>
            <p className="text-[1.2rem] font-black leading-none tracking-tight text-accent-on-surface">
              Lead
            </p>
            <p className="text-[10px] text-text-secondary/50 mt-1 leading-tight">
              {t("hero.metricRole")}
            </p>
          </div>
          <div>
            <p className="text-[1.1rem] font-black leading-none tracking-tight text-text-primary">
              FR/EN
            </p>
            <p className="text-[10px] text-text-secondary/50 mt-1 leading-tight">
              {t("hero.metricBilingual")}
            </p>
          </div>
          <div>
            <p className="text-[1.1rem] font-black leading-none tracking-tight text-accent-on-surface">
              AI
            </p>
            <p className="text-[10px] text-text-secondary/50 mt-1 leading-tight">
              {t("hero.metricAI")}
            </p>
          </div>
        </m.div>

      </div>
    </m.section>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors. (Note: `HeroStatusBadgeProps` and `HeroActionsProps` are still exported from `@ui/components` — they're exported types so `noUnusedLocals` won't flag them. They will be cleaned up in Task 5.)

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat(hero): rewrite as spatial bento grid (3-col: main, photo, availability, metrics)"
```

---

## Task 5: Types — remove unused HeroStatusBadgeProps and HeroActionsProps

**Files:**
- Modify: `src/types/ui/components.ts`

These prop types were used exclusively by the sub-components (`HeroStatusBadge`, `HeroActions`) that were removed in Task 4.

- [ ] **Step 1: Remove the two unused prop types from components.ts**

Delete lines 170–180 (the `HeroStatusBadgeProps` and `HeroActionsProps` type exports):

```
// Remove these two blocks entirely:

export type HeroStatusBadgeProps = {
  transition: ReturnType<typeof useMotionTransition>;
  t: (key: string) => string;
};

export type HeroActionsProps = {
  transition: ReturnType<typeof useMotionTransition>;
  t: (key: string) => string;
  trackResumeDownloaded: (source: string) => void;
  trackSocialLinkClicked: (network: 'linkedin' | 'github' | 'email', source: string) => void;
};
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/ui/components.ts
git commit -m "chore(types): remove unused HeroStatusBadgeProps and HeroActionsProps"
```

---

## Task 6: FeaturedPosts — new component

**Files:**
- Create: `src/components/blog/FeaturedPosts.tsx`

Replaces `LatestPostTeaser`. Shows top 3 posts (by date, current language): 1 large featured card + 2 mini cards side by side.

- [ ] **Step 1: Create src/components/blog/FeaturedPosts.tsx**

```tsx
import { Link } from "react-router-dom";
import { useLanguage } from "@hooks/useLanguage";
import { getBlogList } from "@lib/blog";
import type { BlogPostMeta } from "@domain/blog";

function formatDate(date: string, lang: string): string {
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(date));
}

export default function FeaturedPosts() {
  const { lang, t } = useLanguage();

  const posts = getBlogList()
    .filter((p) => p.lang === lang)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  if (posts.length === 0) return null;

  const [featured, ...mini] = posts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
      <FeaturedCard post={featured} lang={lang} t={t} />
      <div className="flex flex-col gap-4">
        {mini.map((post) => (
          <MiniCard key={post.slug} post={post} lang={lang} t={t} />
        ))}
      </div>
    </div>
  );
}

type CardProps = {
  post: BlogPostMeta;
  lang: string;
  t: (key: string) => string;
};

function FeaturedCard({ post, lang, t }: CardProps) {
  return (
    <Link
      to={`/${lang}/blog/${post.slug}`}
      className="group block no-underline rounded-2xl overflow-hidden border border-border bg-surface/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-floating)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
    >
      {post.cover ? (
        <div className="relative h-36 overflow-hidden">
          <img
            src={post.cover}
            alt=""
            aria-hidden
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent" />
          {post.tags?.[0] && (
            <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-md bg-accent/20 border border-accent/25 text-accent-on-surface">
              {post.tags[0]}
            </span>
          )}
          <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary/50">
            {t("home.featuredPost")}
          </span>
        </div>
      ) : (
        <div className="h-12 bg-gradient-to-r from-accent/10 to-transparent flex items-end px-4 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/50">
            {t("home.featuredPost")}
          </span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-text-primary text-base leading-snug group-hover:text-accent transition-colors mb-2">
          {post.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-text-secondary/60">
          {post.date && (
            <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          )}
          {post.readingTime != null && (
            <>
              <span className="w-1 h-1 rounded-full bg-current opacity-40" aria-hidden />
              <span>
                {post.readingTime} {t("blog.readingTime")}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function MiniCard({ post, lang, t }: CardProps) {
  return (
    <Link
      to={`/${lang}/blog/${post.slug}`}
      className="group flex-1 block no-underline rounded-xl border border-border bg-surface/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
    >
      <h3 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-accent transition-colors">
        {post.title}
      </h3>
      <div className="flex items-center gap-2 text-[10px] text-text-secondary/50 mt-2">
        {post.date && (
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
        )}
        {post.readingTime != null && (
          <>
            <span className="w-1 h-1 rounded-full bg-current opacity-40" aria-hidden />
            <span>
              {post.readingTime} {t("blog.readingTime")}
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/FeaturedPosts.tsx
git commit -m "feat(blog): add FeaturedPosts component (1 featured + 2 mini cards)"
```

---

## Task 7: ProjectsGrid — evolve card styles

**Files:**
- Modify: `src/components/ProjectsGrid.tsx`

Two targeted changes: rounder corners on cards, stronger hover border accent.

- [ ] **Step 1: Update card className in ProjectsGrid.tsx**

Find the `<m.a>` element with `className="project-card group ..."` (line 29) and update two classes:

- `rounded-xl` → `rounded-2xl`
- `hover:border-accent` → `hover:border-accent/60`

The updated className string:

```tsx
className="project-card group flex flex-col overflow-hidden rounded-2xl bg-surface border border-border shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-floating)] hover:border-accent/60 hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectsGrid.tsx
git commit -m "feat(projects): evolve card border-radius and hover accent"
```

---

## Task 8: HomePage — ActionBar + wire FeaturedPosts

**Files:**
- Modify: `src/pages/HomePage.tsx`

Replace `LatestPostTeaser` import with `FeaturedPosts`. Add an inline `ActionBar` sub-component with CV download + LinkedIn + GitHub. Import `useTracking` for resume download tracking.

- [ ] **Step 1: Rewrite HomePage.tsx**

```tsx
import { Link } from "react-router-dom";
import { useLanguage } from "@hooks/useLanguage";
import { useHomeScroll } from "@hooks/useHomeScroll";
import { useTracking } from "@hooks/useTracking";
import ProjectsGrid from "@components/ProjectsGrid";
import HeroSection from "@components/HeroSection";
import FeaturedPosts from "@components/blog/FeaturedPosts";

export default function HomePage() {
  const { t } = useLanguage();
  useHomeScroll();

  return (
    <div className="flex flex-col gap-10 md:gap-14 lg:gap-20">
      <HeroSection />

      <section id="projects" className="flex flex-col gap-4">
        <h2 className="section-title text-xl md:text-2xl font-bold text-text-primary tracking-tight text-left">
          {t("projects.title")}
        </h2>
        <p className="text-sm md:text-base text-text-secondary/80">
          {t("home.projectsIntro")}
        </p>
        <ProjectsGrid />
      </section>

      <section
        id="latest-article"
        className="flex flex-col gap-4 border-t border-border/60 pt-8 md:pt-10"
      >
        <h2 className="section-title text-xl md:text-2xl font-bold text-text-primary tracking-tight text-left">
          {t("sections.latestPost")}
        </h2>
        <p className="text-sm md:text-base text-text-secondary/80">
          {t("home.blogIntro")}
        </p>
        <FeaturedPosts />
        <div>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 border border-border bg-surface/80 px-5 py-2.5 rounded-full font-medium text-xs md:text-sm no-underline shadow-[var(--shadow-soft)] text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            {t("home.allArticlesCta")}
            <span aria-hidden className="text-xs md:text-sm">→</span>
          </Link>
        </div>
      </section>

      <ActionBar t={t} />
    </div>
  );
}

function ActionBar({ t }: { t: (key: string) => string }) {
  const { trackResumeDownloaded, trackSocialLinkClicked } = useTracking();

  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface/70 px-6 py-4 shadow-[var(--shadow-soft)]">
      <a
        href={t("resume.file")}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium no-underline text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        download
        onClick={() => trackResumeDownloaded("home-action-bar")}
      >
        {t("resume.text")}
      </a>
      <div className="flex gap-2">
        <a
          href="https://www.linkedin.com/in/lucterracher/"
          className="social-link flex items-center justify-center w-9 h-9 bg-surface border border-border rounded-full transition-all duration-200 text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          onClick={() => trackSocialLinkClicked("linkedin", "home-action-bar")}
        >
          <svg
            className="w-4 h-4 text-text-primary [fill:currentColor]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <use href="/assets/icons/sprite.svg#linkedin" />
          </svg>
        </a>
        <a
          href="https://github.com/polymorphl"
          className="social-link flex items-center justify-center w-9 h-9 bg-surface border border-border rounded-full transition-all duration-200 text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          onClick={() => trackSocialLinkClicked("github", "home-action-bar")}
        >
          <svg
            className="w-4 h-4 text-text-primary [fill:currentColor]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <use href="/assets/icons/sprite.svg#github" />
          </svg>
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Delete the now-replaced LatestPostTeaser**

```bash
rm src/components/blog/LatestPostTeaser.tsx
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/HomePage.tsx
git rm src/components/blog/LatestPostTeaser.tsx
git commit -m "feat(home): add ActionBar, swap LatestPostTeaser for FeaturedPosts"
```

---

## Task 9: Final verification

**Files:** None modified — verification only.

- [ ] **Step 1: Full typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: build completes without errors. Note any warnings about chunk sizes but do not address them in this plan.

- [ ] **Step 3: Visual smoke test**

```bash
npm run preview
```

Open `http://localhost:4173` and verify:

- [ ] Hero renders as 3-column bento on desktop (≥ 768px): main cell / photo / availability cell / metrics cell
- [ ] Hero stacks cleanly on mobile (< 768px): main cell → photo (220px height) → availability + metrics
- [ ] Photo shows editorial crop (no circle)
- [ ] Availability cell has animated green pulse dot and is visible above the fold
- [ ] Metrics cell shows 4 values (10+, Lead, FR/EN, AI)
- [ ] Gold theme (toggle with 🔥/❄️): all bento cells re-color correctly via CSS variables
- [ ] Cold theme: same check
- [ ] Projects section: cards have `rounded-2xl` corners
- [ ] Blog section: featured large card visible, 2 mini-cards alongside (if ≥ 3 posts in current lang)
- [ ] ActionBar visible at bottom of homepage with CV download + LinkedIn + GitHub
- [ ] `<script type="application/ld+json">` present in page source

- [ ] **Step 4: Validate JSON-LD**

Copy the JSON-LD from page source and validate at https://validator.schema.org — expected: no errors.

- [ ] **Step 5: Final commit if any last fixes were needed**

```bash
git add -p  # stage only intentional changes
git commit -m "fix(homepage-redesign): final smoke test fixes"
```
