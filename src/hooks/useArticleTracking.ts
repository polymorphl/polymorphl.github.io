import { useEffect, useRef } from 'react';
import { usePostHog } from 'posthog-js/react';

const MIN_TIME_TO_TRACK = 30000; // 30 seconds in milliseconds
const READ_THRESHOLD = 90; // 90% scroll to consider article as read

interface ArticleTrackingOptions {
  slug: string;
  title: string;
  lang: string;
  readingTime?: number;
}

export function useArticleTracking(options: ArticleTrackingOptions) {
  const posthog = usePostHog();
  const startTimeRef = useRef(Date.now());
  const maxScrollPercentRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    maxScrollPercentRef.current = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      maxScrollPercentRef.current = Math.max(maxScrollPercentRef.current, scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      // Track when leaving the page
      const timeSpent = Date.now() - startTimeRef.current;

      // Only track if user spent at least 30 seconds on the article
      if (timeSpent >= MIN_TIME_TO_TRACK) {
        const isArticleRead = maxScrollPercentRef.current >= READ_THRESHOLD;

        posthog?.capture('blog_post_read', {
          slug: options.slug,
          title: options.title,
          lang: options.lang,
          reading_time: options.readingTime,
          time_spent_seconds: Math.round(timeSpent / 1000),
          max_scroll_percent: Math.round(maxScrollPercentRef.current),
          is_article_read: isArticleRead,
        });
      }
    };
  }, [options.slug, options.title, options.lang, options.readingTime, posthog]);
}
