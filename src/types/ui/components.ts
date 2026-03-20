/**
 * UI component prop types
 */

import type { ReactNode, HTMLAttributes } from 'react';
import type { TechIconConfig } from '@config/techs';
import type { CareerEntry } from '@domain/career';
import type { useLogoTransition } from '@hooks/useMotionTransition';

/** Transition config for logo entrance animations (e.g. CareerLogo) */
export type LogoTransition = ReturnType<typeof useLogoTransition>;

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
  /** Persistent active state (e.g. while detail panel is showing) */
  isActive?: boolean;
}

export interface TimelineItem {
  year: string;
  tool: string;
  desc: string;
}

export interface CareerLogoProps {
  entry: CareerEntry;
  transition: LogoTransition;
  visitWebsiteLabel: string;
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


export interface TechCategoryItem {
  techId: string;
  name: string;
  icon: string;
  viewBox?: string;
  invert?: boolean;
  iconClass?: string;
}

export interface TechCategoryWithIds {
  labelKey: string;
  items: TechCategoryItem[];
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLElement | null>;
  /** Slug of the current article — used to re-run effect when navigating to a different post */
  slug?: string;
  /** Current language — used to re-run effect when switching language (content changes) */
  lang?: string;
}

export interface SurfaceCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Dark-mode background opacity. Defaults to '40'. Use '70' for denser surfaces (e.g. blog cards). */
  darkOpacity?: '40' | '70';
}

export interface MarkdownBlockProps {
  /** Markdown content to display. Ignored if contentFile or children are provided. */
  content?: string;
  /** MDX children (e.g. ```json block). Takes precedence over content when provided. */
  children?: React.ReactNode;
  /** Path to a public file (e.g. /assets/configs/tmux.conf). Loads content at runtime. */
  contentFile?: string;
  /** Language for the code block when contentFile is used (e.g. "bash", "json"). */
  language?: string;
  title?: string;
  variant?: 'default' | 'card' | 'accordion';
  downloadUrl?: string;
  downloadLabel?: string;
  /** Label for the accordion button when collapsed (e.g. "View full config") */
  accordionLabel?: string;
}
