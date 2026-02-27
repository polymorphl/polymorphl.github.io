import { usePostHog } from 'posthog-js/react';
import { useLanguage } from '@hooks/useLanguage';

export default function Footer() {
  const posthog = usePostHog();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer w-full shrink-0 border-t border-border/50 bg-surface/50">
      <div className="max-w-[1000px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between gap-6 md:gap-8 mb-8">
          {/* Left: Info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm font-medium text-text-primary">Luc Terracher</p>
            <p className="text-xs text-text-secondary">{t('footer.text')}</p>
          </div>

          {/* Right: Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/lucterracher/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-border text-text-secondary hover:text-accent hover:border-accent transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              aria-label={t('footer.socials.linkedin')}
              onClick={() => posthog?.capture('footer_social_link_clicked', { platform: 'linkedin', source: 'footer' })}
            >
              <svg className="w-5 h-5 [fill:currentColor]" viewBox="0 0 24 24">
                <use href="/assets/icons/sprite.svg#linkedin" />
              </svg>
            </a>
            <a
              href="https://github.com/polymorphl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-border text-text-secondary hover:text-accent hover:border-accent transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              aria-label={t('footer.socials.github')}
              onClick={() => posthog?.capture('footer_social_link_clicked', { platform: 'github', source: 'footer' })}
            >
              <svg className="w-5 h-5 [fill:currentColor]" viewBox="0 0 24 24">
                <use href="/assets/icons/sprite.svg#github" />
              </svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/30 mb-6" />

        {/* Copyright */}
        <div className="text-center text-xs text-text-secondary">
          <p className="m-0">
            {t('footer.copyright').replace('{year}', currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
}
