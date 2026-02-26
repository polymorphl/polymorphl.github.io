# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio/blog website built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. It features a multi-language interface (FR/EN), dynamic blog content via MDX, and a modern design with theme support (light/dark).

## Development Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:3000)
npm run build        # Build for production + copy index.html to 404.html
npm run preview      # Preview production build locally
npm run typecheck    # Run TypeScript type checking (no emit)
```

## Architecture & Key Concepts

### Type System (No Barrel Files)

**ALL types and interfaces MUST be in `src/types/`** - never define them in component or page files.

Types are organized into semantic categories with **direct imports** (no `index.ts` re-exports):

- **`src/types/domain/`** - Business domain types
  - `i18n.ts`: Lang, LanguageConfig, TranslationObject
  - `blog.ts`: BlogPost, BlogPostMeta, AboutCard, BlogData

- **`src/types/api/`** - API/external response types
  - `responses.ts`: MDXModule for Vite glob imports

- **`src/types/ui/`** - Component-specific prop types (ALL component prop interfaces go here)
  - `components.ts`: LayoutProps, ThemeContextType, LanguageContextType, TechPillProps, TimelineItem, ArticleImageProps

- **`src/types/common.ts`** - Utility types (Nullable, Optional, Maybe, ApiError, ApiResponse)

**Import pattern**: `import type { Lang } from '@domain/i18n'` (not `@types/...`)

### Path Aliases (TypeScript + Vite)

Configured in both `tsconfig.json` and `vite.config.mts`:

```
@/          → src/
@domain/    → src/types/domain/
@api/       → src/types/api/
@ui/        → src/types/ui/
@components/ → src/components/
@pages/     → src/pages/
@hooks/     → src/hooks/
@lib/       → src/lib/
@config/    → src/config/
```

Always use aliases in new imports for consistency and to avoid brittle relative paths.

### Configuration

**`src/config/`** - Centralized, typed configuration:

- `constants.ts`: App name, languages, storage keys, event names, theme defaults
- `routes.ts`: Route paths with helper functions

Access constants via imports, don't hardcode strings:
```ts
import { STORAGE_KEYS, EVENTS, DEFAULT_LANGUAGE } from '@config/constants';
localStorage.setItem(STORAGE_KEYS.LANGUAGE, 'en');
```

### Internationalization (i18n)

- **i18next** setup: `src/lib/i18n.ts` with resources from `src/locales/*.json`
- **Hook**: `useLanguage()` returns `{ lang, setLanguage, t, tObject }`
- **Translations**: FR/EN in `src/locales/` with key structure matching UI sections
- **Dynamic year**: Use `{year}` placeholder in i18n strings and replace with `new Date().getFullYear()`

Example:
```tsx
const { t } = useLanguage();
t('footer.copyright').replace('{year}', new Date().getFullYear().toString())
```

### Components & Pages

- **`src/components/`** - Reusable UI components
  - `layout/` - Navbar, Footer (shell components)
  - `blog/` - MDXComponents for rendering blog content
  - Individual components like ProjectsGrid, FluidAurora

- **`src/pages/`** - Full page components (HomePage, BlogPage, BlogPostPage)
  - Routing handled in `src/App.tsx` with React Router

- **`src/hooks/`** - Custom hooks (useLanguage, useTheme)
  - Both manage state via localStorage with events for cross-tab sync

### Styling

- **Tailwind CSS v4** via `@tailwindcss/vite`
- **CSS variables** for theming (light/dark mode)
- **Responsive classes**: Use `md:` and `lg:` breakpoints
- **Custom fonts**: Via `@fontsource-variable` (Archivo, Space Grotesk)

### MDX & Blog

- **Content**: `content/blog/YYYY-MM/filename.LANG.mdx`
- **Vite import**: `import.meta.glob()` in blog pages to load MDX modules
- **Frontmatter**: YAML frontmatter parsed by remark plugins (title, date, excerpt, tags, etc.)
- **MDXComponents**: Custom renderers for headings, code, blockquotes, callouts in `src/components/blog/MDXComponents.tsx`

Example blog post structure:
```mdx
---
title: "Post Title"
slug: "post-slug"
date: "2025-02-26"
excerpt: "Short description"
summary: "Longer summary"
tags: ["tag1", "tag2"]
cover: "/path/to/image.webp"
readingTime: 5
---

# Content here
```

### Theme & Language

- **Theme**: `useTheme()` hook manages light/dark via `data-theme` attribute on `<html>`
- **Language**: `useLanguage()` hook manages language via `data-lang` attribute, synced across tabs via CustomEvent
- **Storage keys**: Use `STORAGE_KEYS` from config (LANGUAGE, THEME)
- **Events**: Use `EVENTS.LANGUAGE_CHANGE` constant for custom events

### TypeScript Strictness

Enabled: `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`

All code must be type-safe. No `any` unless absolutely necessary with a comment explaining why.

## Common Patterns

### Adding a New Page

1. Create `src/pages/MyPage.tsx`
2. Add route to `src/App.tsx`
3. Import with `@pages/MyPage` alias

### Adding a New Config Constant

1. Add to `src/config/constants.ts` as const
2. Import where needed: `import { MY_CONSTANT } from '@config/constants'`
3. Never hardcode magic strings/numbers

### Adding a New Type

1. **Always** place in `src/types/`, never in components or pages
2. Determine category:
   - **domain**: Business logic types (BlogPost, Lang, AboutCard, etc.)
   - **api**: External API/response types (MDXModule, etc.)
   - **ui**: Component prop interfaces (all component Props go here)
   - **common**: Shared utility types (Nullable, Optional, ApiError, etc.)
3. Create/edit file in `src/types/CATEGORY/` (e.g., `src/types/ui/components.ts`)
4. Import with appropriate alias (e.g., `import type { TechPillProps } from '@ui/components'`)
5. No re-exports needed (no barrel files)

### Adding Blog Content

1. Create MDX file: `content/blog/YYYY-MM/slug.LANG.mdx`
2. Add frontmatter with metadata
3. Use MDX components like `<Callout>`, `<Timeline>`, `<ArticleImage>`
4. Vite glob imports in BlogPage/BlogPostPage automatically pick it up

### Updating i18n Strings

1. Update both `src/locales/fr.json` and `src/locales/en.json`
2. Keep key structure parallel (same paths in both files)
3. Test language switching in UI after changes

## Quality Assurance

- **Type checking**: Run `npm run typecheck` to catch TS errors
- **React Doctor**: Use `react-doctor` skill to scan for architecture/performance/security issues (should score 100/100)
- No barrel files (`index.ts` re-exports) - imports must be explicit and direct

## Stack & Versions

- React 19.2.4
- TypeScript 5.9.3
- Vite 7.3.1
- Tailwind CSS 4.2.1
- i18next 25.8.13
- React Router 7.13.1
- MDX 3.1.1

## Git Workflow

- Main branch: `main` (production)
- Feature branches: `feature/*` (e.g., `feature/react-plus-blog`)
- PR required before merging to main
