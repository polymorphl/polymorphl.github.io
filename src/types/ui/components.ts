/**
 * UI component prop types
 */

import type { ReactNode, HTMLAttributes } from 'react';
import type { TechIconConfig, TechExperience } from '@domain/tech';
import type { ProjectConfig } from '@domain/project';
import type { CareerEntry } from '@domain/career';
import type { BlogPostMeta } from '@domain/blog';
import type { Lang } from '@domain/i18n';
import type { Theme } from '@domain/theme';
import type { useLogoTransition, useMotionTransition } from '@hooks/useMotionTransition';

/** Transition config for logo entrance animations (e.g. CareerLogo) */
export type LogoTransition = ReturnType<typeof useLogoTransition>;

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export type LanguageContextType = {
  lang: string;
  setLanguage: (lang: string) => Promise<void>;
};

export type TechPillProps = {
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
};

export type TimelineItem = {
  year: string;
  tool: string;
  desc: string;
};

export type CareerLogoProps = {
  entry: CareerEntry;
  transition: LogoTransition;
  visitWebsiteLabel: string;
};

export type ArticleImageProps = {
  src?: string;
  alt: string;
  caption?: string;
};

export type ImageGridProps = {
  src1: string;
  alt1: string;
  src2: string;
  alt2: string;
  caption?: string;
};

export type LightboxProps = {
  src: string;
  alt: string;
  onClose: () => void;
};

export type StepBlockProps = {
  step: number;
  children?: ReactNode;
};

export type TechCategoryItem = {
  techId: string;
  name: string;
  icon: string;
  viewBox?: string;
  invert?: boolean;
  iconClass?: string;
};

export type TechCategoryWithIds = {
  labelKey: string;
  items: TechCategoryItem[];
};

export type TechCategoryListProps = {
  category: TechCategoryWithIds;
  experienceMap: Map<string, TechExperience>;
  projectsById: Map<string, ProjectConfig>;
  transition: ReturnType<typeof useMotionTransition>;
  t: (key: string, options?: Record<string, unknown>) => string;
};

export type TechListRowProps = {
  item: TechCategoryItem;
  experience?: TechExperience;
  projectsById: Map<string, ProjectConfig>;
  t: (key: string, options?: Record<string, unknown>) => string;
};

export type Heading = {
  id: string;
  text: string;
  level: number;
};

export type TableOfContentsProps = {
  contentRef: React.RefObject<HTMLElement | null>;
  /** Slug of the current article — used to re-run effect when navigating to a different post */
  slug?: string;
  /** Current language — used to re-run effect when switching language (content changes) */
  lang?: string;
};

export type SurfaceCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Dark-mode background opacity. Defaults to '40'. Use '70' for denser surfaces (e.g. blog cards). */
  darkOpacity?: '40' | '70';
};

export type MarkdownBlockProps = {
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
};

export type PreviewData = {
  url: string;
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  domain: string;
};

export type LinkPreviewProps = {
  url: string;
};

export type PostHogLazyProviderProps = {
  children: ReactNode;
};

export type BlogPostContentProps = {
  slug: string;
  lang: Lang;
  meta: BlogPostMeta;
  transition: ReturnType<typeof useMotionTransition>;
  t: (key: string) => string;
};

export type FeaturedPostCardProps = {
  post: BlogPostMeta;
  lang: Lang;
  t: (key: string) => string;
};
