/**
 * UI component prop types
 */

import type { ReactNode } from 'react';

export interface LayoutProps {
  children?: ReactNode;
}

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

export interface LanguageContextType {
  lang: string;
  setLanguage: (lang: string) => Promise<void>;
}

export interface TechPillProps {
  name: string;
  icon: string;
  viewBox?: string;
  invert?: boolean;
  iconClass?: string;
  mini?: boolean;
}

export interface TimelineItem {
  year: string;
  tool: string;
  desc: string;
}

export interface ArticleImageProps {
  src?: string;
  alt: string;
  caption?: string;
}
