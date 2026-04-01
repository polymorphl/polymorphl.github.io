import { Link } from "react-router-dom";
import { useLanguage } from "@hooks/useLanguage";
import { useHomeScroll } from "@hooks/useHomeScroll";
import ProjectsGrid from "@components/ProjectsGrid";
import HeroSection from "@components/HeroSection";
import LatestPostTeaser from "@components/blog/LatestPostTeaser";

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
        <LatestPostTeaser />
        <div>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 border border-border bg-surface/80 px-5 py-2.5 rounded-full font-medium text-xs md:text-sm no-underline shadow-[var(--shadow-soft)] text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            {t("home.allArticlesCta")}
            <span aria-hidden className="text-xs md:text-sm">
              →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
