import '../styles/main.css';

import { initI18n } from './i18n.js';
import { ThemeManager } from './ThemeManager.js';
import { LanguageManager } from './LanguageManager.js';
import { ProjectsManager } from './ProjectsManager.js';
import { FluidAurora } from './FluidAurora.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initI18n();

  new ThemeManager();
  new LanguageManager();
  const projectsManager = new ProjectsManager();

  window.addEventListener('languagechange', (e) => {
    projectsManager.setLanguage(e.detail.lang);
  });

  new FluidAurora();
});
