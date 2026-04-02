import { Link } from "react-router-dom";
import { useLanguage } from "@hooks/useLanguage";
import { useHomeScroll } from "@hooks/useHomeScroll";
import { useTracking } from "@hooks/useTracking";
import ProjectsGrid from "@components/ProjectsGrid";
import HeroSection from "@components/HeroSection";
import FeaturedPosts from "@components/blog/FeaturedPosts";

export default function HomePage() {
  const { t } = useLanguage();
  useHomeScroll();

  return (
    <div className="flex flex-col gap-10 md:gap-14 lg:gap-20">
      <HeroSection />

      <section id="projects" className="flex flex-col gap-4">
        <h2 className="section-title text-xl md:text-2xl font-bold text-text-primary tracking-tight text-left">
          {t("projects.title")}
        </h2>
        <p className="text-sm md:text-base text-text-secondary/80">
          {t("home.projectsIntro")}
        </p>
        <ProjectsGrid />
      </section>

      <section
        id="latest-article"
        className="flex flex-col gap-4 border-t border-border/60 pt-8 md:pt-10"
      >
        <h2 className="section-title text-xl md:text-2xl font-bold text-text-primary tracking-tight text-left">
          {t("sections.latestPost")}
        </h2>
        <p className="text-sm md:text-base text-text-secondary/80">
          {t("home.blogIntro")}
        </p>
        <FeaturedPosts />
        <div>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 border border-border bg-surface/80 px-5 py-2.5 rounded-full font-medium text-xs md:text-sm no-underline shadow-[var(--shadow-soft)] text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            {t("home.allArticlesCta")}
            <span aria-hidden className="text-xs md:text-sm">→</span>
          </Link>
        </div>
      </section>

      <ActionBar t={t} />
    </div>
  );
}

function ActionBar({ t }: { t: (key: string) => string }) {
  const { trackResumeDownloaded, trackSocialLinkClicked } = useTracking();

  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface/70 px-6 py-4 shadow-[var(--shadow-soft)]">
      <a
        href={t("resume.file")}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium no-underline text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        download
        onClick={() => trackResumeDownloaded("home-action-bar")}
      >
        {t("resume.text")}
      </a>
      <div className="flex gap-2">
        <a
          href="https://www.linkedin.com/in/lucterracher/"
          className="social-link flex items-center justify-center w-9 h-9 bg-surface border border-border rounded-full transition-all duration-200 text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          onClick={() => trackSocialLinkClicked("linkedin", "home-action-bar")}
        >
          <svg
            className="w-4 h-4 text-text-primary [fill:currentColor]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <use href="/assets/icons/sprite.svg#linkedin" />
          </svg>
        </a>
        <a
          href="https://github.com/polymorphl"
          className="social-link flex items-center justify-center w-9 h-9 bg-surface border border-border rounded-full transition-all duration-200 text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          onClick={() => trackSocialLinkClicked("github", "home-action-bar")}
        >
          <svg
            className="w-4 h-4 text-text-primary [fill:currentColor]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <use href="/assets/icons/sprite.svg#github" />
          </svg>
        </a>
      </div>
    </div>
  );
}
