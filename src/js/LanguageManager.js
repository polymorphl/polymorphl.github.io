import { t, tObject, changeLanguage, getLanguage } from './i18n.js';

export class LanguageManager {
  constructor() {
    this.currentLang = getLanguage();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setLanguage(this.currentLang, false);
  }

  setupEventListeners() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const lang = button.getAttribute('data-lang');
        this.setLanguage(lang, true);
      });
    });
  }

  async setLanguage(lang, animate = false) {
    this.currentLang = lang;
    await changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    this.updateButtons(lang);
    this.updateContent(animate);

    window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
  }

  updateButtons(lang) {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
    });
  }

  updateContent(animate) {
    // Update elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      const value = t(key);
      if (value && typeof value === 'string') {
        element.textContent = value;
        if (animate) {
          element.style.animation = 'none';
          element.offsetHeight;
          element.style.animation = 'fadeIn 0.3s ease-out';
        }
      }
    });

    // Update about cards
    const aboutGrid = document.getElementById('about-grid');
    if (aboutGrid) {
      const cards = tObject('about.cards');
      if (Array.isArray(cards)) {
        aboutGrid.innerHTML = '';
        const icons = [
          '<path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
          '<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
          '<path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
          '<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
        ];
        cards.forEach((card, index) => {
          const article = document.createElement('article');
          article.className = 'about-card group flex flex-row md:flex-col gap-3 md:gap-4 p-3 md:p-6 rounded-xl md:rounded-2xl bg-surface border border-border shadow-[var(--shadow-soft)] transition-all duration-200 hover:border-accent/50 hover:shadow-[var(--shadow-floating)] hover:-translate-y-0.5 cursor-default';
          article.innerHTML = `
            <div class="about-card-icon flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent-on-surface/15 text-accent-on-surface shrink-0 transition-colors duration-200 group-hover:bg-accent-on-surface/25">
              <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[index]}</svg>
            </div>
            <div class="flex flex-col gap-0.5 md:gap-1 min-w-0 flex-1">
              <h3 class="about-card-label text-xs md:text-sm font-semibold uppercase tracking-wider text-accent-on-surface">${card.label}</h3>
              <p class="about-card-text text-sm md:text-[1rem] text-text-secondary leading-relaxed">${card.text}</p>
            </div>
          `;
          if (animate) {
            article.style.animation = `fadeIn 0.3s ease-out ${index * 0.08}s both`;
          }
          aboutGrid.appendChild(article);
        });
      }
    }

    // Update resume button
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) {
      resumeBtn.href = t('resume.file');
    }
  }
}
