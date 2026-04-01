import { useEffect } from 'react';

/**
 * Lazy-loads highlight.js dark theme CSS only when rendering blog content.
 * Cleans up by removing the stylesheet when the component unmounts.
 * Both cold and gold themes use the dark code highlight stylesheet.
 */
export function useHighlightJsTheme() {
  useEffect(() => {
    const darkLink = document.createElement('link');
    darkLink.id = 'hljs-dark-theme';
    darkLink.rel = 'stylesheet';
    darkLink.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github-dark.min.css';
    document.head.appendChild(darkLink);

    return () => {
      document.getElementById('hljs-dark-theme')?.remove();
    };
  }, []);
}
