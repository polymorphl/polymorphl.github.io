import { Link } from 'react-router-dom';
import { useLanguage } from '@hooks/useLanguage';
import type { BlogPostMeta } from '@domain/blog';
import type { Lang } from '@domain/i18n';
import type { MDXModule } from '@api/responses';

const blogModules = import.meta.glob<MDXModule>('/content/blog/**/*.mdx', { eager: true });

/** Parse path like content/blog/2025-02/mon-premier-post.fr.mdx → { fileBase, lang } */
function parseBlogPath(path: string): { fileBase: string; lang: Lang } | null {
  const match = path.match(/\/([^/]+)\.(fr|en)\.mdx$/);
  if (!match) return null;
  return { fileBase: match[1], lang: match[2] as Lang };
}

function buildPosts(): BlogPostMeta[] {
  return Object.entries(blogModules)
    .map(([path, mod]) => {
      const parsed = parseBlogPath(path);
      if (!parsed) return null;
      const frontmatter = mod.frontmatter ?? {};
      const slug = frontmatter.slug ?? parsed.fileBase;
      return {
        slug,
        lang: parsed.lang,
        title: frontmatter.title ?? 'Untitled',
        date: frontmatter.date ?? '',
        excerpt: frontmatter.excerpt ?? '',
        summary: frontmatter.summary,
        tags: frontmatter.tags
      } as BlogPostMeta;
    })
    .filter((p): p is BlogPostMeta => p !== null)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

const allPosts = buildPosts();

export default function BlogPage() {
  const { lang, t } = useLanguage();
  const posts = allPosts.filter((p) => p.lang === lang);

  return (
    <div className="md:col-span-2 w-full">
      <h1 className="section-title text-xl md:text-2xl font-bold text-text-primary mb-6 md:mb-8 tracking-tight">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {posts.length === 0 ? (
          <p className="text-text-secondary col-span-full">{t('blog.noPosts')}</p>
        ) : (
          posts.map((post) => (
            <Link
              key={`${post.slug}-${post.lang}`}
              to={`/blog/${post.slug}`}
              className="project-card group flex flex-col overflow-hidden rounded-lg md:rounded-xl bg-surface border border-border shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-floating)] hover:border-accent hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <div className="p-4 md:p-5 flex flex-col gap-2">
                <h2 className="font-semibold text-text-primary text-lg">{post.title}</h2>
                {post.date && <time className="text-xs text-text-secondary">{post.date}</time>}
                {(post.summary ?? post.excerpt) && (
                  <p className="text-sm text-text-secondary line-clamp-3">{post.summary ?? post.excerpt}</p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
