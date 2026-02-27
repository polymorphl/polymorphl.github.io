import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { usePostHog } from 'posthog-js/react';
import { useLanguage } from '@hooks/useLanguage';
import { useArticleTracking } from '@hooks/useArticleTracking';
import MDXComponents from '@components/blog/MDXComponents';
import ReadingProgressBar from '@components/blog/ReadingProgressBar';
import { getBlogData } from '@lib/blog';

const { postsMap, slugToSlugInLang } = getBlogData();

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export default function BlogPostPage() {
  const posthog = usePostHog();
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useLanguage();
  let post = slug ? postsMap[`${slug}__${lang}`] : null;

  useEffect(() => {
    if (post?.frontmatter) {
      const { title, tags, readingTime, date } = post.frontmatter;
      posthog?.capture('blog_post_viewed', {
        slug,
        title,
        lang,
        tags,
        reading_time: readingTime,
        date,
      });
    }
  // Capture once per slug+lang combination
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, lang, post]);

  // Track article reading time and scroll depth
  useArticleTracking({
    slug: slug || '',
    title: post?.frontmatter?.title || '',
    lang,
    readingTime: post?.frontmatter?.readingTime,
  });

  if (!post && slug) {
    const slugInCurrentLang = slugToSlugInLang(slug, lang);
    if (slugInCurrentLang) {
      return <Navigate to={`/blog/${slugInCurrentLang}`} replace />;
    }
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const Content = post.default;
  const { title, date, summary, tags, cover, readingTime } = post.frontmatter ?? {};

  return (
    <>
      <ReadingProgressBar />
      <article className="md:col-span-2 w-full max-w-3xl mx-auto">
      {/* Hero: only rendered when a cover image is provided */}
      {cover && (
        <div
          className="rounded-xl overflow-hidden mb-8 h-40 md:h-56"
          style={{
            background: `linear-gradient(to bottom, transparent 30%, var(--color-bg) 100%), url(${cover}) center/cover no-repeat`
          }}
        />
      )}

      {/* Frosted glass card: header + prose */}
      <div className="backdrop-blur-md bg-background/80 rounded-2xl ring-1 ring-border/40 shadow-floating px-6 md:px-10 py-8">
        {/* Header */}
        <header className="mb-10">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {title && (
            <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-3 leading-tight">
              {title}
            </h1>
          )}
          {summary && (
            <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-4">{summary}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            {date && (
              <time dateTime={date}>{formatDate(date)}</time>
            )}
            {date && readingTime && <span aria-hidden>·</span>}
            {readingTime && <span>{readingTime} {t('blog.readingTime')}</span>}
          </div>
          <hr className="border-border mt-6" />
        </header>

        {/* Content */}
        <div className="prose-blog">
          <MDXProvider components={MDXComponents}>
            <Content />
          </MDXProvider>
        </div>
      </div>
    </article>
    </>
  );
}
