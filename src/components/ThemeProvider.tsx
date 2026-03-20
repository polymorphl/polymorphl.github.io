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

const ThemeContext = createContext<ThemeContextType | null>(null);

function applyTheme(t: string) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem(STORAGE_KEYS.THEME, t);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<string>(() => {
    const t = localStorage.getItem(STORAGE_KEYS.THEME) || DEFAULT_THEME;
    applyTheme(t);
    return t;
  });

  const { trackThemeToggled } = useTracking();
  const prevThemeRef = useRef(theme);

  const setTheme = useCallback((next: string) => {
    trackThemeToggled(next, prevThemeRef.current);
    prevThemeRef.current = next;
    applyTheme(next);
    setThemeState(next);
  }, [trackThemeToggled]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
