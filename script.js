// Theme Manager
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setTheme(this.currentTheme, false);
  }

  setupEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme, true);
  }

  setTheme(theme, animate = false) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Update theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      if (animate) {
        themeToggle.style.animation = 'none';
        themeToggle.offsetHeight; // Trigger reflow
        themeToggle.style.animation = 'rotate 0.3s ease-out';
      }
    }
  }
}

// Language content
const content = {
  fr: {
    subtitle: 'Développeur Full Stack',
    sectionTitle: 'À propos',
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

class LanguageManager {
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

// Simple fade animation for content updates
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0.5; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(style);

// Background Animation - Fluid Aurora
class FluidAurora {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.orbs = [];
    this.orbCount = 5; // Keep it low for performance
    this.resizeTimeout = null;
    this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    this.init();
  }

  init() {
    this.resize();
    this.createOrbs();
    this.setupObservers();
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.resize();
        this.createOrbs();
      }, 200);
    });
  }

  setupObservers() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  resize() {
    this.width = window.innerWidth / 2;
    this.height = window.innerHeight / 2;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createOrbs() {
    this.orbs = [];
    for (let i = 0; i < this.orbCount; i++) {
      this.orbs.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * (this.width * 0.25) + (this.width * 0.15),
        baseRadius: Math.random() * (this.width * 0.25) + (this.width * 0.15),
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02
      });
    }
  }

  getThemeColors() {
    if (this.isDark) {
      // Dark mode: Vibrant Deep colors
      return [
        { r: 255, g: 60, b: 20 },   // Bright Orange-Red
        { r: 60, g: 60, b: 180 },   // Electric Blue
        { r: 120, g: 20, b: 120 }   // Deep Magenta
      ];
    } else {
      // Light mode: Stronger, more saturated colors
      return [
        { r: 255, g: 120, b: 80 },  // Stronger Orange/Salmon
        { r: 100, g: 120, b: 255 }, // Stronger Blue
        { r: 200, g: 50, b: 100 }   // Pink/Red accent
      ];
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const colors = this.getThemeColors();
    this.ctx.globalCompositeOperation = this.isDark ? 'screen' : 'multiply';

    this.orbs.forEach((orb, index) => {
      // Move
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Pulse logic
      orb.pulse += orb.pulseSpeed;
      orb.radius = orb.baseRadius + Math.sin(orb.pulse) * 20;

      // Bounce
      if (orb.x < -orb.radius) orb.vx = Math.abs(orb.vx);
      if (orb.x > this.width + orb.radius) orb.vx = -Math.abs(orb.vx);
      if (orb.y < -orb.radius) orb.vy = Math.abs(orb.vy);
      if (orb.y > this.height + orb.radius) orb.vy = -Math.abs(orb.vy);

      // Draw
      const baseColor = colors[index % colors.length];
      const gradient = this.ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, orb.radius
      );

      const alpha = this.isDark ? 0.4 : 0.25;
      gradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new LanguageManager();
  new FluidAurora();
});
