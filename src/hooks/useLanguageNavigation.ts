import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Lang } from '@domain/i18n';

/**
 * Hook that updates the URL when language changes on blog/prefixed routes
 * Example: /blog/my-post → /en/blog/my-post (when switching to EN)
 */
export function useLanguageNavigation(lang: Lang) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    const SUPPORTED_LANGS = ['en', 'fr'];

    // Check if we're on a blog route
    const isBlogRoute = pathname.includes('/blog');
    if (!isBlogRoute) return;

    // Check if URL already has correct language prefix
    const pathSegments = pathname.split('/').filter(Boolean);
    const currentLangPrefix = pathSegments[0];
    const hasLangPrefix = SUPPORTED_LANGS.includes(currentLangPrefix);

    // Determine target path
    let targetPath: string;

    if (hasLangPrefix && currentLangPrefix !== lang) {
      // Replace language prefix with new language
      // e.g., /en/blog/slug → /fr/blog/slug
      targetPath = `/${lang}/${pathSegments.slice(1).join('/')}`;
    } else if (!hasLangPrefix) {
      // Add language prefix to non-prefixed URLs
      // e.g., /blog/slug → /en/blog/slug
      targetPath = `/${lang}${pathname}`;
    } else {
      // URL already matches current language
      return;
    }

    navigate(targetPath, { replace: true });
  }, [lang, location.pathname, navigate]);
}
