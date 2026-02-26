# polymorphl.github.io

A modern portfolio and blog website built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. Features multi-language support (FR/EN), dynamic MDX blog content, and theme switching (light/dark).

## Quick Start

```bash
npm install
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run typecheck    # Type check without emit
```

## Architecture & Conventions

This project follows strict architectural patterns and conventions. **Read [CLAUDE.md](./CLAUDE.md) for detailed guidance** on:

- Type system organization (no barrel files)
- Path aliases and imports
- Component and page structure
- i18n implementation
- MDX blog content
- Styling with Tailwind CSS
- Quality assurance standards

## Tech Stack

- React 19.2.4
- TypeScript 5.9.3
- Vite 7.3.1
- Tailwind CSS 4.2.1
- i18next 25.8.13
- React Router 7.13.1
- MDX 3.1.1

## Contributing

1. Create a feature branch: `feature/*`
2. Follow patterns documented in [CLAUDE.md](./CLAUDE.md)
3. Run `npm run typecheck` to verify types
4. Open a PR to `main`

---

**📖 For developers:** See [CLAUDE.md](./CLAUDE.md) for architecture decisions, code patterns, and project conventions.
