/**
 * UI component prop types
 */

import type { ReactNode } from 'react';
import type { TechIconConfig } from '@config/techIcons';

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
  icon?: string;
  viewBox?: string;
  invert?: boolean;
  iconClass?: string;
  mini?: boolean;
  /** Compact style for inline use (e.g. career timeline) */
  compact?: boolean;
  /** Pre-resolved config from batch lookup; null = looked up, no icon. Omit = fallback to per-pill lookup */
  iconConfig?: TechIconConfig | null;
}

export interface TimelineItem {
  year: string;
  tool: string;
  desc: string;
}

export interface CareerTimelineProps {
  // Reserved for future external props
}

export interface ArticleImageProps {
  src?: string;
  alt: string;
  caption?: string;
}

export interface MarkdownBlockProps {
  content: string;
  title?: string;
  variant?: 'default' | 'card';
}
