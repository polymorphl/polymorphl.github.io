/**
 * ProjectsManager - Featured Work project data and rendering
 *
 * Optimized structure: common fields (url, image) defined once,
 * translations (title, stack) in `translations` per language.
 * `image` field: local path under /assets/projects/ (e.g. /assets/projects/orcrux.gif).
 */

const projects = [
  {
    id: 'orcrux',
    url: 'https://github.com/polymorphl/orcrux',
    image: '/assets/projects/orcrux.webp'
  },
  {
    id: 'go-kv',
    url: 'https://github.com/polymorphl/go-kv',
    image: '/assets/projects/go-kv.webp'
  },
  {
    id: 'my-open-claude',
    url: 'https://github.com/polymorphl/my-open-claude',
    image: '/assets/projects/my-open-claude.webp'
  }
];

const translations = {
  fr: {
    orcrux: {
      title: 'Orcrux',
      stack: 'Go, Wails, TypeScript',
      description: 'GUI desktop multiplateforme avec Wails pour tester le partage de secret de Shamir — générer, diviser et restaurer des secrets.'
    },
    'go-kv': {
      title: 'Go-kv',
      stack: 'Go',
      description: 'Une implémentation de serveur compatible Redis en Go, haute performance (sans dépendances externes).'
    },
    'my-open-claude': {
      title: 'My Open Claude',
      stack: 'Rust',
      description: 'Assistant de code LLM en Rust. Chat TUI & CLI mono-prompt. Outils : Read, Write, Edit, Grep, ListDir, Glob, Bash. OpenRouter, streaming, historique, commandes slash.'
    }
  },
  en: {
    orcrux: {
      title: 'Orcrux',
      stack: 'Go, Wails, TypeScript',
      description: "Cross-platform desktop GUI with Wails to test Shamir’s Secret Sharing — generate, split, and recover secrets."
    },
    'go-kv': {
      title: 'Go-kv',
      stack: 'Go',
      description: 'A high-performance Redis-compatible server implementation in Go (no external dependencies).'
    },
    'my-open-claude': {
      title: 'My Open Claude',
      stack: 'Rust',
      description: 'LLM coding assistant in Rust. TUI chat & single-shot CLI. Tools: Read, Write, Edit, Grep, ListDir, Glob, Bash. OpenRouter, streaming, history, slash cmds.'
    }
  }
};

const sectionTitles = {
  fr: 'Projets',
  en: 'Featured Work'
};

const viewLabels = {
  fr: 'Voir le projet',
  en: 'View project'
};

export class ProjectsManager {
  constructor() {
    this.currentLang = document.documentElement.getAttribute('data-lang') || 'fr';
    this.container = document.getElementById('projects-grid');
    if (this.container) this.render();
  }

  setLanguage(lang) {
    this.currentLang = lang;
    if (this.container) this.render();
  }

  render() {
    const t = translations[this.currentLang] || translations.fr;
    const title = sectionTitles[this.currentLang] || sectionTitles.fr;
    const viewLabel = viewLabels[this.currentLang] || viewLabels.fr;

    const titleEl = document.getElementById('projects-title');
    if (titleEl) titleEl.textContent = title;

    // Update first card (inlined in HTML for LCP) when language changes
    this.updateFirstCard(t, viewLabel);

    // Render only projects 2+ (first is in HTML)
    const remaining = projects.filter((p) => p.id !== 'orcrux');
    const items = remaining.map((p) => ({ ...p, ...t[p.id] }));

    // Remove previously rendered cards (keep first inlined card)
    const existingCards = this.container.querySelectorAll('.project-card:not(#project-card-orcrux)');
    existingCards.forEach((el) => el.remove());

    const div = document.createElement('div');
    div.innerHTML = items.map((p) => `
      <a href="${p.url}" target="_blank" rel="noopener noreferrer"
        class="project-card group flex flex-row md:flex-col overflow-hidden rounded-lg md:rounded-xl bg-surface border border-border shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-floating)] hover:border-accent hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        aria-label="${p.title}">
        <div class="project-card-image w-20 h-20 md:w-full md:h-auto shrink-0 rounded-l-lg md:rounded-none md:rounded-t-xl aspect-square md:aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
          ${p.image && p.image !== 'null' ? `<img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover md:object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy">` : ''}
          <div class="project-card-overlay absolute inset-0 bg-[#09090b]/90 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span class="text-white font-semibold text-sm">${viewLabel}</span>
          </div>
        </div>
        <div class="flex flex-col justify-center min-w-0 flex-1 p-3 md:p-4">
          <h3 class="font-semibold text-text-primary text-sm md:text-lg truncate" style="font-family: var(--font-display)">${p.title}</h3>
          <p class="text-xs text-text-secondary mt-0.5 md:mt-1">${p.stack}</p>
          ${p.description ? `<p class="text-xs md:text-sm text-text-secondary mt-1.5 md:mt-2 line-clamp-4 md:line-clamp-6 hidden md:block">${p.description}</p>` : ''}
        </div>
        <span class="self-center mr-3 md:hidden text-text-secondary/60 shrink-0" aria-hidden="true">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </span>
      </a>
    `).join('');
    while (div.firstChild) this.container.appendChild(div.firstChild);
  }

  updateFirstCard(t, viewLabel) {
    const card = document.getElementById('project-card-orcrux');
    if (!card) return;
    const orc = t.orcrux || translations.fr.orcrux;
    const viewEl = card.querySelector('[data-l10n="view-project"]');
    const descEl = card.querySelector('[data-l10n="project-orcrux-desc"]');
    if (viewEl) viewEl.textContent = viewLabel;
    if (descEl) descEl.textContent = orc.description;
  }
}
