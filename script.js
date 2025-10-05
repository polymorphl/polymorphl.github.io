(function () {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const savedLang = localStorage.getItem('language') || 'fr';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-lang', savedLang);
})();

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    requestAnimationFrame(() => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.remove();
      }, 320);
    });
  }
}

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.themeToggle = document.getElementById('theme-toggle');
    this.init();
  }

  init() {
    if (!document.documentElement.hasAttribute('data-theme')) {
      this.setTheme(this.currentTheme);
    }
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (this.themeToggle) {
      this.themeToggle.setAttribute('data-theme', theme);
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

}

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('language') || 'fr';
    this.languages = {
      fr: {
        subtitleParts: [
          'Développeur Fullstack JS avec 10 ans d\'expérience.',
          'Spécialisé en React, Node.js, et TypeScript (et Go ~ 2 ans).',
          'Solide background en UX/UI et culture produit.',
        ],
        resumeText: 'Télécharger mon CV',
        resumeFile: '/public/cv_luc_terracher.pdf'
      },
      en: {
        subtitleParts: [
          'Fullstack JS Developer with 10 years of experience.',
          'Specialized in React, Node.js, and TypeScript (plus 2 years with Go).',
          'Strong background in UX/UI and product-focused front-end development.',
        ],
        resumeText: 'Download my Resume',
        resumeFile: '/public/luc_terracher_resume.pdf'
      }
    };

    this.elements = {
      langButtons: document.querySelectorAll('.lang-btn'),
      resumeLink: document.getElementById('resume-link')
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    if (!document.documentElement.hasAttribute('data-lang')) {
      this.setLanguage(this.currentLang);
    } else {
      this.updateUI(this.currentLang);
    }
    setTimeout(() => {
      const subtitleParts = document.querySelectorAll('.subtitle-part');
      this.animateSubtitleParts(subtitleParts);
    }, 400);
  }

  setupEventListeners() {
    this.elements.langButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        this.setLanguage(lang);
      });
    });
  }

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    this.updateUI(lang);
    this.animateLanguageSwitch(lang);
  }

  updateUI(lang) {
    const config = this.languages[lang];
    if (!config) return;
    const subtitleParts = document.querySelectorAll('.subtitle-part');
    subtitleParts.forEach((part, index) => {
      if (config.subtitleParts[index]) {
        part.textContent = config.subtitleParts[index];
      }
    });
    if (this.elements.resumeLink) {
      this.elements.resumeLink.textContent = config.resumeText;
      this.elements.resumeLink.href = config.resumeFile;
    }
    this.animateSubtitlePartsWithShimmer(subtitleParts);
    if (this.elements.resumeLink) {
      this.elements.resumeLink.classList.add('shimmer');
      setTimeout(() => {
        this.elements.resumeLink.classList.remove('shimmer');
      }, 800);
    }
  }

  animateSubtitleParts(parts) {
    parts.forEach((part, index) => {
      setTimeout(() => {
        part.classList.add('visible');
      }, index * 150); // Stagger each part by 150ms for smoother effect
    });
  }

  animateSubtitlePartsWithShimmer(parts) {
    parts.forEach((part, index) => {
      part.classList.add('visible');
      setTimeout(() => {
        part.classList.add('shimmer');
        setTimeout(() => {
          part.classList.remove('shimmer');
        }, 800);
      }, index * 30);
    });
  }

  animateLanguageSwitch(lang) {
    this.elements.langButtons.forEach(btn => {
      const isClickedButton = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isClickedButton);

      if (isClickedButton) {
        btn.classList.add('shimmer');
        setTimeout(() => {
          btn.classList.remove('shimmer');
        }, 800);

        btn.style.animation = 'none';
        btn.offsetHeight;
        btn.style.animation = 'buttonActivate 0.2s ease-out';
      }
    });
  }
}

class App {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeApp());
    } else {
      this.initializeApp();
    }
  }

  initializeApp() {
    this.themeManager = new ThemeManager();
    this.languageManager = new LanguageManager();

    const savedLang = localStorage.getItem('language') || 'fr';
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === savedLang);
    });
    setTimeout(() => {
      hideLoadingScreen();
    }, 150);
  }
}

new App();