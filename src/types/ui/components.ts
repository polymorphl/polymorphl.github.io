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

export interface StepBlockProps {
  step: number;
  children?: ReactNode;
}

export interface MarkdownBlockProps {
  /** Contenu markdown à afficher. Ignoré si contentFile ou children sont fournis. */
  content?: string;
  /** Enfants MDX (ex. bloc ```json). Prioritaire sur content quand fourni. */
  children?: React.ReactNode;
  /** Chemin vers un fichier public (ex. /assets/configs/tmux.conf). Charge le contenu à l'exécution. */
  contentFile?: string;
  /** Langage pour le bloc code quand contentFile est utilisé (ex. "bash", "json"). */
  language?: string;
  title?: string;
  variant?: 'default' | 'card' | 'accordion';
  downloadUrl?: string;
  downloadLabel?: string;
  /** Label du bouton accordion quand replié (ex. "Voir la config complète") */
  accordionLabel?: string;
}
