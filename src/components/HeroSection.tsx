import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useMotionTransition } from '@hooks/useMotionTransition';
import { useTracking } from '@hooks/useTracking';
import { PROFILE_PHOTO_SIZE } from '@config/constants';
import { containerHero, fadeInUp20, scaleIn, statusDotPing, underlineDrawIn } from '@config/motion';

export default function HeroSection() {
  const { trackResumeDownloaded, trackSocialLinkClicked } = useTracking();
  const { t } = useLanguage();
  const transition = useMotionTransition(0.6);

  return (
    <m.section
      className="hero md:col-span-2 w-full flex flex-col items-center md:items-stretch gap-6 text-center md:text-left md:flex-row md:items-center md:gap-12 lg:gap-16"
      variants={containerHero}
      initial="hidden"
      animate="visible"
    >
      <m.div
        className={`profile-card profile-border-wrapper shrink-0 ${PROFILE_PHOTO_SIZE}`}
        variants={scaleIn}
        transition={transition}
      >
        <span className="profile-border-ring" aria-hidden />
        <picture className="profile-photo-picture block relative z-10 size-full">
          <source srcSet="/profile.webp" type="image/webp" />
          <img
            src="/profile.png"
            alt="Luc TERRACHER"
            fetchPriority="high"
            className={`profile-image block size-full object-cover object-center rounded-[22px] shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-floating)]`}
            width={288}
            height={260}
          />
        </picture>
      </m.div>

      <m.div
        className="hero-content flex flex-col items-center md:items-stretch gap-4 flex-1 min-w-0 w-full"
        variants={containerHero}
      >
        <m.h1
          className="hero-title text-text-primary text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold leading-tight tracking-tight relative"
          variants={fadeInUp20}
          transition={transition}
        >
          Luc{' '}
          <span className="relative inline-block">
            TERRACHER
            <m.span
              className="absolute -bottom-1 left-0 w-3/4 h-0.5 bg-accent/70 rounded-full origin-left"
              variants={underlineDrawIn}
              initial="hidden"
              animate="visible"
              transition={{ ...transition, delay: 0.15 }}
              aria-hidden
            />
          </span>
        </m.h1>
        <m.p
          className="hero-subtitle text-lg lg:text-xl font-medium text-text-secondary"
          variants={fadeInUp20}
          transition={transition}
        >
          {t('hero.subtitle')}
        </m.p>
        <m.p
          className="hero-tagline text-base lg:text-lg text-text-secondary/90 w-full lg:max-w-[480px] leading-relaxed"
          variants={fadeInUp20}
          transition={transition}
        >
          {t('hero.tagline')}
        </m.p>
        <m.div
          className="hero-status flex items-center justify-center md:justify-start gap-2"
          variants={fadeInUp20}
          transition={transition}
        >
          <span className="relative inline-flex items-center justify-center w-6 h-6 shrink-0">
            <m.span
              className="absolute w-2 h-2 rounded-full border-2 border-emerald-500"
              variants={statusDotPing}
              initial="hidden"
              animate="visible"
              aria-hidden
            />
            <span className="status-dot w-2 h-2 rounded-full bg-emerald-500 animate-pulse relative z-10" aria-hidden />
          </span>
          <span className="text-sm font-medium text-text-secondary">{t('hero.status')}</span>
        </m.div>

        <m.div
          className="actions flex flex-row flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 gap-y-4 sm:gap-y-6"
          variants={fadeInUp20}
          transition={transition}
        >
          <a
            href={t('resume.file')}
            className="btn-primary inline-flex items-center justify-center bg-accent text-white px-6 py-3 rounded-full font-medium text-sm no-underline shadow-[var(--shadow-button)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:opacity-90 active:translate-y-0 shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            download
            onClick={() => trackResumeDownloaded('hero')}
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
              onClick={() => trackSocialLinkClicked('linkedin', 'hero')}
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
              onClick={() => trackSocialLinkClicked('github', 'hero')}
            >
              <svg className="social-icon w-5 h-5 text-text-primary transition-transform duration-200 [fill:currentColor]" width="20" height="20" viewBox="0 0 24 24">
                <use href="/assets/icons/sprite.svg#github" />
              </svg>
            </a>
          </div>
        </m.div>
      </m.div>
    </m.section>
  );
}
