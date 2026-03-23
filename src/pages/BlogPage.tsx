import { Link } from 'react-router-dom';
import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useLanguageNavigation } from '@hooks/useLanguageNavigation';
import { useMotionTransition } from '@hooks/useMotionTransition';
import { containerBlogList, fadeInUp30 } from '@config/motion';
import { getBlogList } from '@lib/blog';
import SurfaceCard from '@components/SurfaceCard';

export default function BlogPage() {
  const { lang, t } = useLanguage();
  const transition = useMotionTransition(0.4);

  useLanguageNavigation(lang);

  const posts = getBlogList().filter((p) => p.lang === lang);

  // Group posts by month (YYYY-MM)
  const postsByMonth = posts.reduce<Record<string, typeof posts>>(
    (acc, post) => {
      const month = post.date.substring(0, 7);
      if (!acc[month]) acc[month] = [];
      acc[month].push(post);
      return acc;
    },
    {}
  );

  const months = Object.keys(postsByMonth).sort().reverse();

  return (
    <m.div
      className="md:col-span-2 w-full"
      initial="hidden"
      animate="visible"
      variants={containerBlogList}
    >
      <m.h1
        className="sr-only"
        variants={fadeInUp30}
        transition={transition}
      >
        Blog
      </m.h1>
      <m.div
        className="relative flex flex-col gap-6 md:gap-8"
        variants={containerBlogList}
      >
        {posts.length === 0 ? (
          <p className="text-text-secondary">{t('blog.noPosts')}</p>
        ) : (
          months.map((month) => (
            <div key={month}>
              <m.h2
                className="text-sm md:text-base font-semibold text-accent mb-4 md:mb-6 uppercase tracking-widest opacity-80"
                variants={fadeInUp30}
                transition={transition}
              >
                {new Date(`${month}-01`).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </m.h2>
              <m.div
                className="flex flex-col gap-6 md:gap-8"
                variants={containerBlogList}
              >
                {postsByMonth[month].map((post, index) => (
            <m.div
              key={`${post.slug}-${post.lang}`}
              variants={fadeInUp30}
              transition={transition}
            >
              <Link
                to={`/${lang}/blog/${post.slug}`}
                className="group relative flex gap-4 md:gap-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded-xl"
              >
                <div className="flex flex-col items-center shrink-0 w-14">
                  {post.date && (
                    <time
                      dateTime={post.date}
                      className="text-xs font-mono text-accent shrink-0 capitalize text-center"
                    >
                      {(() => {
                        const date = new Date(`${post.date}T00:00:00`);
                        const weekday = new Intl.DateTimeFormat(
                          lang === 'fr' ? 'fr-FR' : 'en-US',
                          { weekday: 'long' }
                        ).format(date);
                        const day = new Intl.DateTimeFormat(
                          lang === 'fr' ? 'fr-FR' : 'en-US',
                          { day: 'numeric' }
                        ).format(date);
                        return `${weekday} ${day}`;
                      })()}
                    </time>
                  )}
                  <div className="flex flex-col items-center flex-1 min-h-0 self-stretch">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0 mt-3 ring-2 ring-background transition-transform duration-300 group-hover:scale-125 group-hover:ring-accent/30" />
                    {index < posts.length - 1 && (
                      <div className="flex-1 w-0.5 min-h-[2rem] -mb-6 md:-mb-8 bg-gradient-to-b from-accent/70 via-accent/40 to-border mt-1" />
                    )}
                  </div>
                </div>

                <SurfaceCard darkOpacity="70" className="flex-1 min-w-0 backdrop-blur-md p-4 md:p-5 border-l-4 border-l-accent transition-all duration-300 ease-out hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:border-accent/30">
                  <h2 className="font-semibold text-text-primary text-lg mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  {(post.summary ?? post.excerpt) && (
                    <p className="text-sm text-text-secondary line-clamp-3">{post.summary ?? post.excerpt}</p>
                  )}
                </SurfaceCard>
              </Link>
            </m.div>
                ))}
              </m.div>
            </div>
          ))
        )}
      </m.div>
    </m.div>
  );
}
