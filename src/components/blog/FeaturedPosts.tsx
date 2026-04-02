import { Link } from "react-router-dom";
import { useLanguage } from "@hooks/useLanguage";
import { getBlogList } from "@lib/blog";
import type { FeaturedPostCardProps } from "@ui/components";

function formatDate(date: string, lang: string): string {
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(date));
}

export default function FeaturedPosts() {
  const { lang, t } = useLanguage();

  const posts = getBlogList()
    .filter((p) => p.lang === lang)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  if (posts.length === 0) return null;

  const [featured, ...mini] = posts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
      <FeaturedCard post={featured} lang={lang} t={t} />
      <div className="flex flex-col gap-4">
        {mini.map((post) => (
          <MiniCard key={post.slug} post={post} lang={lang} t={t} />
        ))}
      </div>
    </div>
  );
}

function FeaturedCard({ post, lang, t }: FeaturedPostCardProps) {
  return (
    <Link
      to={`/${lang}/blog/${post.slug}`}
      className="group block no-underline rounded-2xl overflow-hidden border border-border bg-surface/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-floating)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
    >
      {post.cover ? (
        <div className="relative h-36 overflow-hidden">
          <img
            src={post.cover}
            alt=""
            aria-hidden
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent" />
          {post.tags?.[0] && (
            <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-md bg-accent/20 border border-accent/25 text-accent-on-surface">
              {post.tags[0]}
            </span>
          )}
          <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-text-secondary/50">
            {t("home.featuredPost")}
          </span>
        </div>
      ) : (
        <div className="h-12 bg-gradient-to-r from-accent/10 to-transparent flex items-end px-4 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/50">
            {t("home.featuredPost")}
          </span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-text-primary text-base leading-snug group-hover:text-accent transition-colors mb-2">
          {post.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-text-secondary/60">
          {post.date && (
            <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          )}
          {post.readingTime != null && (
            <>
              <span className="w-1 h-1 rounded-full bg-current opacity-40" aria-hidden />
              <span>
                {post.readingTime} {t("blog.readingTime")}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function MiniCard({ post, lang, t }: FeaturedPostCardProps) {
  return (
    <Link
      to={`/${lang}/blog/${post.slug}`}
      className="group flex-1 block no-underline rounded-xl border border-border bg-surface/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
    >
      <h3 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-accent transition-colors">
        {post.title}
      </h3>
      <div className="flex items-center gap-2 text-[10px] text-text-secondary/50 mt-2">
        {post.date && (
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
        )}
        {post.readingTime != null && (
          <>
            <span className="w-1 h-1 rounded-full bg-current opacity-40" aria-hidden />
            <span>
              {post.readingTime} {t("blog.readingTime")}
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
