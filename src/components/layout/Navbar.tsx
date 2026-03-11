import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@components/ThemeProvider';
import { useLanguage } from '@hooks/useLanguage';

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const { lang, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // ESC key closes the drawer
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  // Body scroll lock when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-[1000] px-4 md:px-6 lg:px-8 animate-[slide-down-mobile_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex justify-between items-center w-full min-w-0 bg-surface/90 backdrop-blur-md rounded-full px-4 sm:px-5 md:px-7 py-3.5 shadow-[var(--shadow-floating)] ring-1 ring-border/50 gap-2 md:gap-4">
          <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
            {/* Hamburger button — mobile only, positioned on left */}
            <button
              type="button"
              className="md:hidden relative w-10 h-10 bg-background rounded-full cursor-pointer flex flex-col items-center justify-center gap-[5px] border-none ring-1 ring-border/50 hover:ring-accent/50 hover:bg-border/30 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 shrink-0"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? t('nav.close') : t('nav.menu')}
            >
              <span
                className={`hamburger-line block w-[18px] h-0.5 bg-current rounded-sm origin-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-text-primary ${
                  isMenuOpen
                    ? 'translate-y-[7px] rotate-45'
                    : ''
                }`}
              />
              <span
                className={`hamburger-line block w-[18px] h-0.5 bg-current rounded-sm origin-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-text-primary ${
                  isMenuOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`hamburger-line block w-[18px] h-0.5 bg-current rounded-sm origin-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-text-primary ${
                  isMenuOpen
                    ? '-translate-y-[7px] -rotate-45'
                    : ''
                }`}
              />
            </button>

            <Link
              to="/"
              className="nav-home inline-flex text-sm font-bold tracking-wider text-text-primary hover:text-accent transition-colors duration-200 cursor-pointer shrink-0"
              aria-label="Accueil"
            >
              LT
            </Link>
            {/* Desktop nav links — hidden on mobile */}
            <div className="nav-links hidden md:flex flex-1 justify-center items-center gap-0.5 sm:gap-1">
              <Link
                to="/#projects"
                className="nav-link px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-border/40 transition-all duration-200 cursor-pointer shrink-0"
              >
                {t('nav.projects')}
              </Link>
              <Link
                to="/#career"
                className="nav-link px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-border/40 transition-all duration-200 cursor-pointer shrink-0"
              >
                {t('nav.career')}
              </Link>
              <Link
                to="/#tech"
                className="nav-link px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-border/40 transition-all duration-200 cursor-pointer shrink-0"
              >
                {t('nav.tech')}
              </Link>
              <Link
                to="/blog"
                className="nav-link px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-border/40 transition-all duration-200 cursor-pointer shrink-0"
              >
                {t('nav.blog')}
              </Link>
            </div>
          </div>

          <div className="flex gap-2 md:gap-4 items-center shrink-0">
            {/* Theme toggle — always visible */}
            <button
              type="button"
              className="theme-toggle relative w-10 h-10 bg-background rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 overflow-hidden border-none ring-1 ring-border/50 hover:ring-accent/50 hover:bg-border/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <svg className="absolute w-[18px] h-[18px] transition-all duration-300 opacity-100 dark:opacity-0 scale-100 dark:scale-0 brightness-0 saturate-100" width="18" height="18" aria-hidden>
                <use href="/assets/icons/sprite.svg#moon" />
              </svg>
              <svg className="absolute w-[18px] h-[18px] transition-all duration-300 opacity-0 dark:opacity-100 scale-0 dark:scale-100 brightness-0 saturate-100 dark:invert" width="18" height="18" aria-hidden>
                <use href="/assets/icons/sprite.svg#sun" />
              </svg>
            </button>

            {/* Language selector — always visible */}
            <div className="flex gap-2 bg-background rounded-full p-1 relative">
              <div
                className={`absolute top-1 left-1 w-[calc(50%-0.5rem)] h-[calc(100%-0.5rem)] rounded-full bg-primary shadow-[var(--shadow-button)] z-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${lang === 'en' ? 'translate-x-[calc(100%+0.5rem)]' : ''}`}
                aria-hidden
              />
              <button
                type="button"
                className={`relative z-10 bg-transparent border-none py-2 px-5 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${lang === 'fr' ? 'text-on-primary' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setLanguage('fr')}
                aria-label="Switch to French"
              >
                FR
              </button>
              <button
                type="button"
                className={`relative z-10 bg-transparent border-none py-2 px-5 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${lang === 'en' ? 'text-on-primary' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setLanguage('en')}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>
          </div>
        </div>
        </div>
      </nav>

      {/* Mobile drawer — rendered outside nav pill, portal-like via fragment */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-[998] bg-background/60 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className="mobile-menu-open md:hidden fixed left-4 right-4 top-[5rem] z-[999] bg-surface/95 backdrop-blur-md rounded-2xl shadow-[var(--shadow-floating)] ring-1 ring-border/50 p-4 animate-[mobile-menu-open_0.3s_cubic-bezier(0.16,1,0.3,1)_both]"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu')}
          >
            <nav className="flex flex-col gap-1">
              <Link
                to="/#projects"
                onClick={closeMenu}
                className="flex items-center min-h-[48px] px-4 rounded-xl text-base font-medium text-text-secondary hover:text-text-primary hover:bg-border/40 transition-all duration-200"
              >
                {t('nav.projects')}
              </Link>
              <Link
                to="/#career"
                onClick={closeMenu}
                className="flex items-center min-h-[48px] px-4 rounded-xl text-base font-medium text-text-secondary hover:text-text-primary hover:bg-border/40 transition-all duration-200"
              >
                {t('nav.career')}
              </Link>
              <Link
                to="/#tech"
                onClick={closeMenu}
                className="flex items-center min-h-[48px] px-4 rounded-xl text-base font-medium text-text-secondary hover:text-text-primary hover:bg-border/40 transition-all duration-200"
              >
                {t('nav.tech')}
              </Link>
              <Link
                to="/blog"
                onClick={closeMenu}
                className="flex items-center min-h-[48px] px-4 rounded-xl text-base font-medium text-text-secondary hover:text-text-primary hover:bg-border/40 transition-all duration-200"
              >
                {t('nav.blog')}
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
