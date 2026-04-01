import * as m from "motion/react-m";
import { Link } from "react-router-dom";
import { useLanguage } from "@hooks/useLanguage";
import { useMotionTransition } from "@hooks/useMotionTransition";
import { useTracking } from "@hooks/useTracking";
import {
  containerHero,
  fadeInUp20,
  scaleIn,
  underlineDrawIn,
} from "@config/motion";
import HeroPhoto from "@components/HeroPhoto";
import TechPill from "@components/TechPill";
import type { HeroActionsProps, HeroStatusBadgeProps } from "@ui/components";

export default function HeroSection() {
  const { trackResumeDownloaded, trackSocialLinkClicked } = useTracking();
  const { t } = useLanguage();
  const transition = useMotionTransition(0.6);

  return (
    <m.section
      className="hero-section w-full min-h-[60vh] md:min-h-[66vh] flex flex-col items-center justify-center px-4 pt-6 md:pt-10 pb-4 md:pb-6 gap-5 text-center"
      variants={containerHero}
      initial="hidden"
      animate="visible"
    >
      <m.div
        className={`profile-card shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36`}
        variants={scaleIn}
        transition={transition}
      >
        <HeroPhoto />
      </m.div>

      <m.div
        className="hero-content flex flex-col items-center gap-4 flex-1 min-w-0 w-full max-w-2xl"
        variants={containerHero}
      >
        <m.h1
          className="hero-title text-text-primary text-3xl sm:text-4xl lg:text-[2.9rem] xl:text-[3.4rem] font-extrabold leading-tight tracking-tight relative"
          variants={fadeInUp20}
          transition={transition}
        >
          Luc{" "}
          <span className="relative inline-block">
            TERRACHER
            <m.span
              variants={underlineDrawIn}
              initial="hidden"
              animate="visible"
              transition={{ ...transition, delay: 0.15 }}
              aria-hidden
            />
          </span>
        </m.h1>
        <m.p
          className="text-sm md:text-base font-medium text-text-secondary mt-1 flex flex-wrap items-center justify-center gap-2"
          variants={fadeInUp20}
          transition={transition}
        >
          <span>{t("hero.subtitle")}</span>
          <span className="text-text-secondary/50">•</span>
          <span className="text-text-secondary/80">{t("hero.experience")}</span>
        </m.p>
        <m.p
          className="hero-tagline text-base lg:text-lg text-text-secondary/90 w-full lg:max-w-[480px] leading-relaxed mt-1"
          variants={fadeInUp20}
          transition={transition}
        >
          {t("hero.tagline")}
        </m.p>
        <m.div
          className="mt-3 flex flex-wrap items-center justify-center gap-2"
          variants={fadeInUp20}
          transition={transition}
        >
          <TechPill name="React" icon="react" />
          <TechPill name="TypeScript" icon="typescript" />
          <TechPill name="Node.js" icon="nodejs" />
        </m.div>
        <m.div
          className="flex flex-col items-center gap-2 mt-4"
          variants={fadeInUp20}
          transition={transition}
        >
          <Link
            to="/career"
            className="cta-primary inline-flex items-center justify-center px-6 py-2.5 rounded-full font-medium text-xs sm:text-sm no-underline shadow-[var(--shadow-button)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            {t("projects.viewCareerCta")}
            <span aria-hidden className="ml-1 text-xs sm:text-sm">
              →
            </span>
          </Link>
        </m.div>
        <HeroStatusBadge transition={transition} t={t} />

        <HeroActions
          transition={transition}
          t={t}
          trackResumeDownloaded={trackResumeDownloaded}
          trackSocialLinkClicked={trackSocialLinkClicked}
        />
      </m.div>
    </m.section>
  );
}

function HeroStatusBadge({ transition, t }: HeroStatusBadgeProps) {
  return (
    <m.div className="mt-3" variants={fadeInUp20} transition={transition}>
      <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full bg-surface/70 px-4 py-2 text-[11px] font-medium text-text-secondary/90">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative inline-flex w-2.5 h-2.5">
            <span
              className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping"
              aria-hidden
            />
            <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </span>
          <span>{t("hero.status")}</span>
        </span>
        <span className="text-text-secondary/50">•</span>
        <a
          href="https://blent.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-accent-on-surface hover:text-accent-on-surface/80 no-underline"
        >
          {t("hero.training")}
        </a>
      </div>
    </m.div>
  );
}

function HeroActions({
  transition,
  t,
  trackResumeDownloaded,
  trackSocialLinkClicked,
}: HeroActionsProps) {
  return (
    <m.div
      className="actions mt-3"
      variants={fadeInUp20}
      transition={transition}
    >
      <div className="inline-flex items-center justify-center gap-3 rounded-full bg-surface/70 px-4 py-2 shadow-[var(--shadow-soft)]">
        <a
          href={t("resume.file")}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium no-underline text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          download
          onClick={() => trackResumeDownloaded("hero")}
        >
          {t("resume.text")}
        </a>
        <div className="social-links flex gap-2">
          <a
            href="https://www.linkedin.com/in/lucterracher/"
            className="social-link flex items-center justify-center w-9 h-9 bg-surface border border-border rounded-full transition-all duration-200 text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            onClick={() => trackSocialLinkClicked("linkedin", "hero")}
          >
            <svg
              className="social-icon w-4 h-4 text-text-primary transition-transform duration-200 [fill:currentColor]"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <use href="/assets/icons/sprite.svg#linkedin" />
            </svg>
          </a>
          <a
            href="https://github.com/polymorphl"
            className="social-link flex items-center justify-center w-9 h-9 bg-surface border border-border rounded-full transition-all duration-200 text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            onClick={() => trackSocialLinkClicked("github", "hero")}
          >
            <svg
              className="social-icon w-4 h-4 text-text-primary transition-transform duration-200 [fill:currentColor]"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <use href="/assets/icons/sprite.svg#github" />
            </svg>
          </a>
        </div>
      </div>
    </m.div>
  );
}
