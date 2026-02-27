import { useState, useEffect, useCallback } from 'react';
import posthog from 'posthog-js';

export function useTheme() {
  const [theme, setThemeState] = useState<string>(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      posthog.capture('theme_toggled', { theme: next, previous_theme: prev });
      return next;
    });
  }, []);

  return { theme, setTheme: setThemeState, toggleTheme };
}
