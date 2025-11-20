const content = {
  fr: {
    subtitle: 'Développeur Full Stack',
    sectionTitle: 'À propos',
    techTitle: 'Stack technique',
    techFrontend: 'Frontend',
    techBackend: 'Backend',
    techTools: 'Outils & DevOps',
    aboutList: [
      "10 ans d'expérience en développement Fullstack JS",
      "Expert React, Node.js et TypeScript",
      "Compétences en Go (~2 ans)",
      "Forte sensibilité UX/UI et culture produit"
    ],
    resumeText: 'Télécharger mon CV',
    resumeFile: '/public/cv_luc_terracher.pdf',
    footerText: 'Basé en France 🇫🇷'
  },
  en: {
    subtitle: 'Full Stack Developer',
    sectionTitle: 'About me',
    techTitle: 'Tech stack',
    techFrontend: 'Frontend',
    techBackend: 'Backend',
    techTools: 'Tools & DevOps',
    aboutList: [
      "10 years of experience in Fullstack JS development",
      "Expert in React, Node.js, and TypeScript",
      "Proficient in Go (~2 years)",
      "Strong UX/UI sensibility and product culture"
    ],
    resumeText: 'Download my Resume',
    resumeFile: '/public/luc_Terracher_Resume.pdf',
    footerText: 'Based in France 🇫🇷'
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
      'section-title': 'sectionTitle',
      'tech-title': 'techTitle',
      'tech-frontend': 'techFrontend',
      'tech-backend': 'techBackend',
      'tech-tools': 'techTools',
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

    // Update about list
    const aboutList = document.getElementById('about-list');
    if (aboutList && langContent.aboutList) {
      aboutList.innerHTML = '';
      langContent.aboutList.forEach((text, index) => {
        const li = document.createElement('li');
        li.className = 'about-item';
        li.textContent = text;
        if (animate) {
          li.style.animation = `fadeIn 0.3s ease-out ${index * 0.1}s both`;
        }
        aboutList.appendChild(li);
      });
    }

    // Update resume button
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) {
      resumeBtn.href = langContent.resumeFile;
    }
  }
}

