import type { Lang } from '@domain/i18n';
import type { MDXModule } from '@api/responses';

const blogModules = import.meta.glob<MDXModule>('/content/blog/**/*.mdx', { eager: true });

function parseBlogPath(path: string): { fileBase: string; lang: Lang } | null {
  const match = path.match(/\/([^/]+)\.(fr|en)\.mdx$/);
  if (!match) return null;
  return { fileBase: match[1], lang: match[2] as Lang };
}

export interface BlogData {
  postsMap: Record<string, MDXModule>;
  slugToSlugInLang: (slug: string, targetLang: Lang) => string | null;
  fileBaseToSlug: Record<string, Partial<Record<Lang, string>>>;
  slugToFileBase: Record<string, string>;
}

export function buildBlogData(): BlogData {
  const postsMap: Record<string, MDXModule> = {};
  const fileBaseToSlug: Record<string, Partial<Record<Lang, string>>> = {};
  const slugToFileBase: Record<string, string> = {};

  for (const [path, mod] of Object.entries(blogModules)) {
    const parsed = parseBlogPath(path);
    if (!parsed) continue;
    const frontmatter = mod.frontmatter ?? {};
    const slug = frontmatter.slug ?? parsed.fileBase;

    postsMap[`${slug}__${parsed.lang}`] = mod;
    fileBaseToSlug[parsed.fileBase] = fileBaseToSlug[parsed.fileBase] ?? {};
    fileBaseToSlug[parsed.fileBase][parsed.lang] = slug;
    slugToFileBase[slug] = parsed.fileBase;
  }

  const slugToSlugInLang = (slug: string, targetLang: Lang): string | null => {
    const fileBase = slugToFileBase[slug];
    if (!fileBase) return null;
    return fileBaseToSlug[fileBase]?.[targetLang] ?? null;
  };

  return { postsMap, slugToSlugInLang, fileBaseToSlug, slugToFileBase };
}

// Cache build result
const cachedBlogData = buildBlogData();

export function getBlogData(): BlogData {
  return cachedBlogData;
}
