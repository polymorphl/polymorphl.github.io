# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Luc TERRACHER, a Full Stack Developer. It is a single-page application built with Vite, using vanilla HTML, CSS, and JavaScript.

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
├── src/
│   ├── js/
│   │   ├── main.js         # Entry point - imports CSS and initializes managers
│   │   ├── ThemeManager.js # Handles dark/light theme toggle with localStorage persistence
│   │   ├── LanguageManager.js # Handles FR/EN language switching with localStorage persistence
│   │   └── FluidAurora.js  # Canvas-based animated background with theme-aware colors
│   └── styles/
│       ├── main.css        # CSS entry point - imports all modules
│       ├── base/           # Variables, fonts, reset, animations
│       ├── components/     # Reusable UI components (buttons, tech-item, etc.)
│       └── layout/         # Page sections (navbar, hero, about, tech-stack)
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

The CSS is organized following a modular approach:

**Base** (`src/styles/base/`):
- `variables.css` - CSS custom properties for theming, spacing, typography
- `fonts.css` - @font-face declarations
- `reset.css` - CSS reset and base styles
- `animations.css` - Keyframe animations and utility classes

**Components** (`src/styles/components/`):
- `buttons.css` - Primary button styles
- `social-links.css` - Social link icons
- `tech-item.css` - Technology grid items with hover effects

**Layout** (`src/styles/layout/`):
- `container.css` - Main layout grid and footer
- `navbar.css` - Fixed navigation with theme toggle and language selector
- `hero.css` - Hero section with profile image
- `about.css` - About section with bullet points
- `tech-stack.css` - Tech stack grid with categories

### Key Patterns

**CSS Variables**:
- Theming via `data-theme` attribute on `<html>` (dark/light)
- All colors, shadows, spacing use CSS custom properties
- Transition timings defined as variables for consistency

**BEM Naming**:
- Block: `.navbar`, `.hero`, `.tech-item`
- Element: `.navbar-content`, `.hero-title`, `.tech-item__label`
- Modifier: `.lang-btn.active`, `.tech-icon.invert-dark`

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
- HTML elements have IDs mapping to content keys (e.g., `hero-subtitle` → `subtitle`)
- `data-lang` attribute on `<html>` drives content updates and CSS selectors

### State Management

- **Theme**: Stored in localStorage as 'theme', applied via `data-theme` attribute on `<html>`
- **Language**: Stored in localStorage as 'language', applied via `data-lang` and `lang` attributes
- Both default to 'dark' theme and 'fr' language
