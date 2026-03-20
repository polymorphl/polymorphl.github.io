import type { Lang } from '@domain/i18n';
import type { BlogPostMeta, BlogData } from '@domain/blog';
import type { MDXModule } from '@api/responses';

import blogMetadata from '@/generated/blog-metadata.json';

const blogLoaders = import.meta.glob<MDXModule>('/content/blog/**/*.mdx', { eager: false });

const { fileBaseToSlug, slugToFileBase } = blogMetadata as {
  fileBaseToSlug: Record<string, Partial<Record<Lang, string>>>;
  slugToFileBase: Record<string, string>;
};

const slugToSlugInLang = (slug: string, targetLang: Lang): string | null => {
  const fileBase = slugToFileBase[slug];
  if (!fileBase) return null;
  return fileBaseToSlug[fileBase]?.[targetLang] ?? null;
};

export function getBlogData(): BlogData {
  return { slugToSlugInLang };
}

export function getBlogList(): BlogPostMeta[] {
  const { posts } = blogMetadata as { posts: BlogPostMeta[] };
  return posts;
}

export function getPostMeta(slug: string, lang: Lang): BlogPostMeta | null {
  const { slugToPath } = blogMetadata as { slugToPath: Record<string, string> };
  const key = `${slug}__${lang}`;
  if (!slugToPath[key]) return null;
  const post = (blogMetadata as { posts: BlogPostMeta[] }).posts.find((p) => p.slug === slug && p.lang === lang);
  return post ?? null;
}

export async function loadPost(slug: string, lang: Lang): Promise<MDXModule | null> {
  const { slugToPath } = blogMetadata as { slugToPath: Record<string, string> };
  const key = `${slug}__${lang}`;
  const modulePath = slugToPath[key];
  if (!modulePath) return null;

  const loader = blogLoaders[modulePath];
  if (!loader) return null;

  const mod = await loader();
  return mod as MDXModule;
}
