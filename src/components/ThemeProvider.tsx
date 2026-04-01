import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_THEME, STORAGE_KEYS } from '@config/constants';
import { useTracking } from '@hooks/useTracking';
import type { ThemeContextType } from '@ui/components';
import type { Theme } from '@domain/theme';

const ThemeContext = createContext<ThemeContextType | null>(null);

const VALID_THEMES = new Set<string>(['cold', 'gold']);

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem(STORAGE_KEYS.THEME, t);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    const t: Theme = stored && VALID_THEMES.has(stored) ? (stored as Theme) : DEFAULT_THEME;
    applyTheme(t);
    return t;
  });

  const { trackThemeToggled } = useTracking();
  const prevThemeRef = useRef(theme);

  const setTheme = useCallback((next: Theme) => {
    trackThemeToggled(next, prevThemeRef.current);
    prevThemeRef.current = next;
    applyTheme(next);
    setThemeState(next);
  }, [trackThemeToggled]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'cold' ? 'gold' : 'cold');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
