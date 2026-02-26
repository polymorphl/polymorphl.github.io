/**
 * Domain types for blog content
 */

import type { Lang } from './i18n';
import type { MDXModule } from '@api/responses';

export interface BlogPostMeta {
  slug: string;
  lang: Lang;
  title: string;
  date: string;
  excerpt: string;
  summary?: string;
  tags?: string[];
  cover?: string;
  readingTime?: number;
  draft?: boolean;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export interface AboutCard {
  label: string;
  text: string;
}

export interface BlogData {
  postsMap: Record<string, MDXModule>;
  slugToSlugInLang: (slug: string, targetLang: Lang) => string | null;
}
