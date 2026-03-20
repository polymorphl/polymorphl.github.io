import { use, useRef, Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useLanguageNavigation } from '@hooks/useLanguageNavigation';
import { useArticleTracking } from '@hooks/useArticleTracking';
import { useMotionTransition } from '@hooks/useMotionTransition';
import { containerStagger06, fadeInUp20 } from '@config/motion';
import MDXComponents from '@components/blog/MDXComponents';
import ReadingProgressBar from '@components/blog/ReadingProgressBar';
import TableOfContents from '@components/blog/TableOfContents';
import { getBlogData, getPostMeta, loadPost } from '@lib/blog';
import type { Lang } from '@domain/i18n';
import type { MDXModule } from '@api/responses';
import type { BlogPostContentProps } from '@ui/components';

const { slugToSlugInLang } = getBlogData();

// Module-level cache — keyed by slug+lang, shares promises across re-renders
const postCache = new Map<string, Promise<MDXModule | null>>();

function loadCachedPost(slug: string, lang: Lang): Promise<MDXModule | null> {
  const key = `${slug}__${lang}`;
  if (!postCache.has(key)) {
    postCache.set(key, loadPost(slug, lang).catch(() => null));
  }
  return postCache.get(key)!;
}

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

function BlogPostSkeleton() {
  return (
    <div className="md:col-span-2 w-full lg:grid lg:grid-cols-[1fr_200px] lg:gap-12 lg:items-start animate-pulse">
      <article className="w-full max-w-3xl mx-auto lg:mx-0">
        <div className="rounded-xl overflow-hidden mb-8 h-40 md:h-56 bg-surface" />
        <div className="backdrop-blur-md bg-background/80 rounded-2xl ring-1 ring-border/40 shadow-floating px-6 md:px-10 py-8">
          <div className="mb-10">
            <div className="h-4 w-24 rounded bg-surface mb-4" />
            <div className="h-10 w-3/4 rounded bg-surface mb-3" />
            <div className="h-5 w-full rounded bg-surface/60 mb-4" />
            <div className="h-4 w-32 rounded bg-surface/60" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-surface/40" />
            <div className="h-4 w-full rounded bg-surface/40" />
            <div className="h-4 w-2/3 rounded bg-surface/40" />
          </div>
        </div>
      </article>
    </div>
  );
}

function BlogPostContent({ slug, lang, meta, transition, t }: BlogPostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const mod = use(loadCachedPost(slug, lang));

  if (!mod) return null;

  const Content = mod.default;
  const { title, date, summary, tags, cover, readingTime } = meta;

  return (
    <m.div
      className="md:col-span-2 w-full min-w-0 lg:grid lg:grid-cols-[1fr_200px] lg:gap-12 lg:items-start"
      initial="hidden"
      animate="visible"
      variants={containerStagger06}
    >
      <m.article
        className="w-full min-w-0 max-w-3xl mx-auto lg:mx-0"
        variants={fadeInUp20}
        transition={transition}
      >
        {cover && (
          <m.div
            className="relative rounded-xl overflow-hidden mb-8 h-40 md:h-56"
            variants={fadeInUp20}
            transition={transition}
          >
            <img
              src={cover}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 30%, var(--color-bg) 100%)' }}
              aria-hidden
            />
          </m.div>
        )}

        <m.div
          className="backdrop-blur-md bg-background/80 rounded-2xl ring-1 ring-border/40 shadow-floating px-6 md:px-10 py-8"
          variants={fadeInUp20}
          transition={transition}
        >
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

          <div ref={contentRef} className="prose-blog min-w-0 overflow-x-hidden">
            <MDXProvider components={MDXComponents}>
              <Content />
            </MDXProvider>
          </div>
        </m.div>
      </m.article>
      <TableOfContents contentRef={contentRef} slug={slug} lang={lang} />
    </m.div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useLanguage();
  const transition = useMotionTransition(0.5);

  useLanguageNavigation(lang);

  const meta = slug ? getPostMeta(slug, lang) : null;

  useArticleTracking({
    slug: slug || '',
    title: meta?.title || '',
    lang,
    readingTime: meta?.readingTime,
    tags: meta?.tags,
    date: meta?.date,
  });

  if (!meta && slug) {
    const slugInCurrentLang = slugToSlugInLang(slug, lang);
    if (slugInCurrentLang) {
      return <Navigate to={`/${lang}/blog/${slugInCurrentLang}`} replace />;
    }
  }

  if (!meta) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <ReadingProgressBar />
      <Suspense fallback={<BlogPostSkeleton />}>
        <BlogPostContent slug={slug!} lang={lang} meta={meta} transition={transition} t={t} />
      </Suspense>
    </>
  );
}
