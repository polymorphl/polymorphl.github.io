/**
 * Domain types for blog content
 */

import type { Lang } from './i18n';

export type BlogPostMeta = {
  slug: string;
  lang: Lang;
  title: string;
  date: string;
  excerpt: string;
  summary?: string;
  tags?: string[];
  cover?: string;
  readingTime?: number;
};

export type BlogPost = BlogPostMeta & { content: string };

export type BlogData = {
  slugToSlugInLang: (slug: string, targetLang: Lang) => string | null;
};
