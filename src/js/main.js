import '../styles/main.css';

import { ThemeManager } from './ThemeManager.js';
import { LanguageManager } from './LanguageManager.js';
import { FluidAurora } from './FluidAurora.js';

document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new LanguageManager();
  new FluidAurora();
});
