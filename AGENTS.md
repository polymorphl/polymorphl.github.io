# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Luc TERRACHER, a Full Stack Developer. It is a single-page application built with Vite, using vanilla HTML, Tailwind CSS, and JavaScript.

## Development Commands

- **Start dev server**: `npm run dev` (runs on port 3000)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Regenerate icon sprite**: After adding new SVG icons to `public/assets/icons/`, run:
  ```bash
  python3 scripts/generate_sprite.py
  ```

## Deployment (GitHub Pages)

The site is deployed via GitHub Actions. On each push to `main`, the workflow (`.github/workflows/deploy.yml`) runs `npm run build` and deploys the `dist/` output to GitHub Pages. **Repository Settings > Pages** must use **Source: GitHub Actions** (not "Deploy from a branch"). The site is served at the root URL (`base: '/'` is correct for the `polymorphl.github.io` user site).

## Architecture

### File Structure

```
├── index.html              # Single-page application entry point
├── vite.config.js          # Vite config with @tailwindcss/vite plugin
├── src/
│   ├── js/
│   │   ├── main.js         # Entry point - imports CSS and initializes managers
│   │   ├── ThemeManager.js # Handles dark/light theme toggle with localStorage persistence
│   │   ├── LanguageManager.js # Handles FR/EN language switching with localStorage persistence
│   │   ├── ProjectsManager.js # Featured Work section - projects grid with i18n
│   │   └── FluidAurora.js  # Canvas-based animated background with theme-aware colors
│   └── styles/
│       ├── main.css        # Tailwind entry - @import tailwindcss, @theme, imports
│       ├── base/
│       │   └── fonts.css   # Placeholder (fonts via HTML: Space Grotesk, DM Sans)
│       └── complex.css     # Pseudo-elements, theme toggle, invert-dark, canvas
├── public/                 # Static assets served at root path
│   ├── assets/
│   │   ├── fonts/          # Geist Sans variable font
│   │   └── icons/          # Individual SVGs + generated sprite.svg
│   ├── cv_luc_terracher.pdf
│   ├── luc_Terracher_Resume.pdf
│   ├── profile.png
│   └── favicon.svg
└── scripts/
    └── generate_sprite.py  # Combines SVGs into sprite.svg for efficient loading
```

### CSS Architecture

The CSS uses **Tailwind CSS v4** with the Vite plugin. Styling is utility-first in HTML, with a small `complex.css` for cases Tailwind cannot handle.

**main.css**:
- `@import "tailwindcss"` - Tailwind base, components, utilities
- `@custom-variant dark` - Dark mode via `[data-theme="dark"]` on `<html>`
- `@theme` - Design tokens: colors, shadows, radius, font, custom animations
- `@layer base` - html, body, dark theme variable overrides
- Imports `fonts.css` and `complex.css`

**base/fonts.css**:
- Placeholder (fonts loaded via HTML link: Space Grotesk, DM Sans)

**complex.css** (uniquement ce que Tailwind ne peut pas gérer):
- Navbar centering, logo invert dark
- Theme toggle moon/sun visibility
- Language selector `::before` (slider animé), `.lang-btn`
- About `.about-item::before` (flèche)
- Tech icons `.invert-dark` et Vercel dark mode
- Background canvas `.background-pattern`
- Tech item stagger (animation-delay nth-child)
- Reduced motion, responsive body

### Key Patterns

**Tailwind Utilities**:
- Utility classes in HTML (e.g. `bg-primary`, `text-text-secondary`, `animate-fade-in-up`)
- Custom theme colors in `@theme` (primary, secondary, accent, background, surface, text-primary, text-secondary, border)
- Theming via `data-theme` attribute on `<html>` (dark/light) — variables overridden in complex.css

**Legacy Classes** (in complex.css):
- `.theme-toggle`, `.theme-icon`, `.moon-icon`, `.sun-icon` — theme toggle
- `.language-selector`, `.lang-btn` — language switcher with pseudo-element slider
- `.project-card`, `.project-card-overlay` — Featured Work cards with hover overlay
- `.tech-item`, `.tech-icon`, `.invert-dark` — tech stack items
- `.about-item` — about list with `::before` arrow

**JavaScript**:
- ES6 modules with class-based managers
- Each manager self-initializes on DOMContentLoaded
- localStorage for persisting user preferences (theme, language)
- MutationObserver in FluidAurora watches for theme changes

**Icon System**:
- SVG sprite at `/assets/icons/sprite.svg`
- Icons referenced via `<use href="/assets/icons/sprite.svg#icon-id" />`
- Icons needing dark mode inversion have `.invert-dark` class

**Internationalization**:
- Content defined in `LanguageManager.js` as `content` object with `fr` and `en` keys
- Projects in `ProjectsManager.js` with `projects.fr` and `projects.en`
- `languagechange` custom event for syncing ProjectsManager when language switches
- HTML elements have IDs mapping to content keys (e.g., `hero-subtitle` → `subtitle`)
- `data-lang` attribute on `<html>` drives content updates and CSS selectors

### State Management

- **Theme**: Stored in localStorage as 'theme', applied via `data-theme` attribute on `<html>`
- **Language**: Stored in localStorage as 'language', applied via `data-lang` and `lang` attributes
- Both default to 'dark' theme and 'fr' language
