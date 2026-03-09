import { Link } from 'react-router-dom';
import { useLanguage } from '@hooks/useLanguage';
import { useLanguageNavigation } from '@hooks/useLanguageNavigation';
import { getBlogList } from '@lib/blog';

export default function BlogPage() {
  const { lang, t } = useLanguage();

  // Update URL when language changes
  useLanguageNavigation(lang);

  const posts = getBlogList().filter((p) => p.lang === lang);

  return (
    <div className="md:col-span-2 w-full">
      <h1 className="section-title text-xl md:text-2xl font-bold text-text-primary mb-6 md:mb-8 tracking-tight">Blog</h1>
      <div className="relative flex flex-col gap-6 md:gap-8">
        {posts.length === 0 ? (
          <p className="text-text-secondary">{t('blog.noPosts')}</p>
        ) : (
          posts.map((post, index) => (
            <Link
              key={`${post.slug}-${post.lang}`}
              to={`/${lang}/blog/${post.slug}`}
              className="group relative flex gap-4 md:gap-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded-xl"
            >
              {/* Timeline: date + dot + connector */}
              <div className="flex flex-col items-center shrink-0">
                {post.date && (
                  <time
                    dateTime={post.date}
                    className="text-xs font-mono text-accent tabular-nums shrink-0"
                  >
                    {post.date}
                  </time>
                )}
                <div className="flex flex-col items-center flex-1 min-h-0 self-stretch">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0 mt-3 ring-2 ring-background transition-transform duration-300 group-hover:scale-125 group-hover:ring-accent/30" />
                  {index < posts.length - 1 && (
                    <div className="flex-1 w-0.5 min-h-[2rem] -mb-6 md:-mb-8 bg-gradient-to-b from-accent/70 via-accent/40 to-border mt-1" />
                  )}
                </div>
              </div>

              {/* Content card */}
              <div className="flex-1 min-w-0 rounded-xl border border-border bg-surface/60 dark:bg-surface/70 backdrop-blur-md p-4 md:p-5 border-l-4 border-l-accent transition-all duration-300 ease-out hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:border-accent/30">
                <h2 className="font-semibold text-text-primary text-lg mb-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
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
