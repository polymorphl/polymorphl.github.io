/**
 * ProjectsManager - Featured Work project data and rendering
 *
 * Optimized structure: common fields (url, image) defined once,
 * translations (title, stack, description) via i18n.
 *
 * @see src/locales/fr.json, en.json for projects.* keys
 */

import { t } from './i18n.js';

const projects = [
  { id: 'orcrux', url: 'https://github.com/polymorphl/orcrux', image: '/assets/projects/orcrux.webp' },
  { id: 'go-kv', url: 'https://github.com/polymorphl/go-kv', image: '/assets/projects/go-kv.webp' },
  { id: 'my-open-claude', url: 'https://github.com/polymorphl/my-open-claude', image: '/assets/projects/my-open-claude.webp' }
];

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
    const viewLabel = t('projects.viewProject');
    // projects-title and first card are updated by LanguageManager via data-i18n

    const remaining = projects.filter((p) => p.id !== 'orcrux');
    const items = remaining.map((p) => ({
      ...p,
      title: t(`projects.${p.id}.title`),
      stack: t(`projects.${p.id}.stack`),
      description: t(`projects.${p.id}.description`)
    }));

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
}
