const content = {
  fr: {
    subtitle: 'Développeur Full Stack',
    heroTagline: 'Je conçois et construis des produits web performants — React, Node.js, TypeScript.',
    heroStatus: 'Disponible pour de nouvelles opportunités',
    navProjects: 'Projets',
    navAbout: 'À propos',
    navTech: 'Stack',
    sectionTitle: 'À propos',
    techTitle: 'Stack technique',
    techFrameworks: 'Frameworks',
    techLanguages: 'Langages',
    techRuntime: 'Runtime',
    techDatabase: 'Base de données',
    techDevOps: 'DevOps & Cloud',
    aboutCards: [
      { label: 'Expérience', text: "10 ans d'expérience en développement Fullstack JS" },
      { label: 'Expertise', text: 'Expert React, Node.js et TypeScript' },
      { label: 'Langages', text: 'Compétences en Go (~2 ans)' },
      { label: 'Approche', text: 'Forte sensibilité UX/UI et culture produit' }
    ],
    resumeText: 'Télécharger mon CV',
    resumeFile: '/cv_luc_terracher.pdf',
    footerText: 'Basé en France'
  },
  en: {
    subtitle: 'Full Stack Developer',
    heroTagline: 'I design and build performant web products — React, Node.js, TypeScript.',
    heroStatus: 'Available for new opportunities',
    navProjects: 'Projects',
    navAbout: 'About',
    navTech: 'Stack',
    sectionTitle: 'About me',
    techTitle: 'Tech stack',
    techFrameworks: 'Frameworks',
    techLanguages: 'Languages',
    techRuntime: 'Runtime',
    techDatabase: 'Database',
    techDevOps: 'DevOps & Cloud',
    aboutCards: [
      { label: 'Experience', text: '10 years of experience in Fullstack JS development' },
      { label: 'Expertise', text: 'Expert in React, Node.js, and TypeScript' },
      { label: 'Languages', text: 'Proficient in Go (~2 years)' },
      { label: 'Approach', text: 'Strong UX/UI sensibility and product culture' }
    ],
    resumeText: 'Download my Resume',
    resumeFile: '/luc_Terracher_Resume.pdf',
    footerText: 'Based in France'
  }
};

export class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('language') || 'fr';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setLanguage(this.currentLang, false);
  }

  setupEventListeners() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
      button.addEventListener('click', () => {
        const lang = button.getAttribute('data-lang');
        this.setLanguage(lang, true);
      });
    });
  }

  setLanguage(lang, animate = false) {
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    // Update UI
    this.updateButtons(lang);
    this.updateContent(lang, animate);

    // Notify other managers (e.g. ProjectsManager)
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
  }

  updateButtons(lang) {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
    });
  }

  updateContent(lang, animate) {
    const langContent = content[lang];
    if (!langContent) return;

    const textMap = {
      'hero-subtitle': 'subtitle',
      'hero-tagline': 'heroTagline',
      'hero-status': 'heroStatus',
      'nav-projects': 'navProjects',
      'nav-about': 'navAbout',
      'nav-tech': 'navTech',
      'section-title': 'sectionTitle',
      'tech-title': 'techTitle',
      'tech-frameworks': 'techFrameworks',
      'tech-languages': 'techLanguages',
      'tech-runtime': 'techRuntime',
      'tech-database': 'techDatabase',
      'tech-devops': 'techDevOps',
      'resume-text': 'resumeText',
      'footer-text': 'footerText'
    };

    Object.entries(textMap).forEach(([id, key]) => {
      const element = document.getElementById(id);
      if (element && langContent[key]) {
        element.textContent = langContent[key];
        if (animate) {
          element.style.animation = 'none';
          element.offsetHeight; // Trigger reflow
          element.style.animation = 'fadeIn 0.3s ease-out';
        }
      }
    });

    // Update about cards
    const aboutGrid = document.getElementById('about-grid');
    if (aboutGrid && langContent.aboutCards) {
      aboutGrid.innerHTML = '';
      const icons = [
        '<path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        '<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        '<path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        '<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
      ];
      langContent.aboutCards.forEach((card, index) => {
        const article = document.createElement('article');
        article.className = 'about-card group flex flex-col gap-4 p-5 md:p-6 rounded-2xl bg-surface border border-border shadow-[var(--shadow-soft)] transition-all duration-200 hover:border-accent/50 hover:shadow-[var(--shadow-floating)] hover:-translate-y-0.5 cursor-default';
        article.innerHTML = `
          <div class="about-card-icon flex items-center justify-center w-10 h-10 rounded-xl bg-accent-on-surface/15 text-accent-on-surface shrink-0 transition-colors duration-200 group-hover:bg-accent-on-surface/25">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[index]}</svg>
          </div>
          <div class="flex flex-col gap-1 min-w-0">
            <h3 class="about-card-label text-sm font-semibold uppercase tracking-wider text-accent-on-surface">${card.label}</h3>
            <p class="about-card-text text-[1rem] text-text-secondary leading-relaxed">${card.text}</p>
          </div>
        `;
        if (animate) {
          article.style.animation = `fadeIn 0.3s ease-out ${index * 0.08}s both`;
        }
        aboutGrid.appendChild(article);
      });
    }

    // Update resume button
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) {
      resumeBtn.href = langContent.resumeFile;
    }
  }
}
