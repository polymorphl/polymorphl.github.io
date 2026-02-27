import { usePostHog } from 'posthog-js/react';
import { useLanguage } from '@hooks/useLanguage';

export default function HeroSection() {
  const posthog = usePostHog();
  const { t } = useLanguage();

  return (
    <section className="hero md:col-span-2 w-full flex flex-col items-center md:items-stretch gap-6 text-center md:text-left animate-fade-in-up overflow-hidden md:flex-row md:items-center md:gap-12 lg:gap-16">
      <div className="profile-card flex justify-center shrink-0 animate-scale-in overflow-hidden rounded-[24px]" style={{ animationDelay: '0.05s' }}>
        <picture>
          <source srcSet="/profile.webp" type="image/webp" />
          <img
            src="/profile.png"
            alt="Luc TERRACHER"
            fetchPriority="high"
            className="profile-image w-44 h-[180px] sm:w-52 sm:h-[200px] md:w-64 md:h-[240px] lg:w-72 lg:h-[260px] rounded-[24px] object-cover shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-floating)]"
            width={288}
            height={260}
          />
        </picture>
      </div>

      <div className="hero-content flex flex-col items-center md:items-stretch gap-4 flex-1 min-w-0 w-full">
        <h1 className="hero-title text-text-primary text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold leading-tight tracking-tight animate-fade-in-up relative" style={{ animationDelay: '0.1s' }}>
          Luc <span className="relative inline-block">TERRACHER<span className="absolute -bottom-1 left-0 w-3/4 h-0.5 bg-accent/70 rounded-full" aria-hidden="true" /></span>
        </h1>
        <p className="hero-subtitle text-lg lg:text-xl font-medium text-text-secondary animate-fade-in-up" style={{ animationDelay: '0.15s' }}>{t('hero.subtitle')}</p>
        <p className="hero-tagline text-base lg:text-lg text-text-secondary/90 w-full lg:max-w-[480px] leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{t('hero.tagline')}</p>
        <div className="hero-status flex items-center justify-center md:justify-start gap-2 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <span className="status-dot w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="text-sm font-medium text-text-secondary">{t('hero.status')}</span>
        </div>

        <div className="actions flex flex-row flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 gap-y-4 sm:gap-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <a
            href={t('resume.file')}
            className="btn-primary inline-flex items-center justify-center bg-accent text-white px-6 py-3 rounded-full font-medium text-sm no-underline shadow-[var(--shadow-button)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:opacity-90 active:translate-y-0 shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            download
            onClick={() => posthog?.capture('resume_downloaded', { source: 'hero' })}
          >
            {t('resume.text')}
          </a>
          <div className="social-links flex gap-3">
            <a
              href="https://www.linkedin.com/in/lucterracher/"
              className="social-link flex items-center justify-center w-11 h-11 bg-surface border border-border rounded-full transition-all duration-200 shadow-[var(--shadow-soft)] text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              onClick={() => posthog?.capture('social_link_clicked', { platform: 'linkedin', source: 'hero' })}
            >
              <svg className="social-icon w-5 h-5 text-text-primary transition-transform duration-200 [fill:currentColor]" width="20" height="20" viewBox="0 0 24 24">
                <use href="/assets/icons/sprite.svg#linkedin" />
              </svg>
            </a>
            <a
              href="https://github.com/polymorphl"
              className="social-link flex items-center justify-center w-11 h-11 bg-surface border border-border rounded-full transition-all duration-200 shadow-[var(--shadow-soft)] text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              onClick={() => posthog?.capture('social_link_clicked', { platform: 'github', source: 'hero' })}
            >
              <svg className="social-icon w-5 h-5 text-text-primary transition-transform duration-200 [fill:currentColor]" width="20" height="20" viewBox="0 0 24 24">
                <use href="/assets/icons/sprite.svg#github" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
