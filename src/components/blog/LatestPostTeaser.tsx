import { Link } from 'react-router-dom';
import { useLanguage } from '@hooks/useLanguage';
import { getBlogList } from '@lib/blog';
import SurfaceCard from '@components/SurfaceCard';

export default function LatestPostTeaser() {
  const { lang, t } = useLanguage();

  const post = getBlogList()
    .filter((p) => p.lang === lang)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  const formattedDate =
    post?.date != null
      ? new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).format(new Date(post.date))
      : null;

  if (!post) return null;

  return (
    <section className="md:col-span-2 w-full">
      <h2 className="section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight">
        {t('sections.latestPost')}
      </h2>
      <Link
        to={`/${lang}/blog/${post.slug}`}
        className="group block no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded-xl"
      >
        <SurfaceCard darkOpacity="70" className="p-5 md:p-6 border-l-4 border-l-accent transition-all duration-300 ease-out hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:border-accent/30">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-semibold text-text-primary text-lg leading-snug group-hover:text-accent transition-colors">
              {post.title}
            </h3>
            <span className="text-accent shrink-0 text-sm font-medium">↗</span>
          </div>
          {(post.summary ?? post.excerpt) && (
            <p className="text-sm text-text-secondary line-clamp-3 mb-3">
              {post.summary ?? post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-text-secondary/70">
            {formattedDate && <time dateTime={post.date}>{formattedDate}</time>}
            {post.readingTime != null && (
              <span>{post.readingTime} {t('blog.readingTime')}</span>
            )}
          </div>
        </SurfaceCard>
      </Link>
    </section>
  );
}
