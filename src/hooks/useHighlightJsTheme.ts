import { useEffect } from 'react';
import { useTheme } from '@components/ThemeProvider';

/**
 * Lazy-loads highlight.js theme CSS only when rendering blog content.
 * Cleans up by removing the stylesheet when the component unmounts.
 * Respects the user's current theme preference (light/dark).
 */
export function useHighlightJsTheme() {
  const { theme } = useTheme();

  useEffect(() => {
    // Load github.css for light mode (if not already loaded in global.css, we load it here)
    const lightLink = document.createElement('link');
    lightLink.id = 'hljs-light-theme';
    lightLink.rel = 'stylesheet';
    lightLink.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github.min.css';
    document.head.appendChild(lightLink);

    // Load github-dark.css if in dark mode
    if (theme === 'dark') {
      const darkLink = document.createElement('link');
      darkLink.id = 'hljs-dark-theme';
      darkLink.rel = 'stylesheet';
      darkLink.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github-dark.min.css';
      document.head.appendChild(darkLink);
    }

    // Cleanup: remove both stylesheets when unmounting
    return () => {
      document.getElementById('hljs-light-theme')?.remove();
      document.getElementById('hljs-dark-theme')?.remove();
    };
  }, [theme]);
}
