
import { Link } from 'react-router-dom';
import { useLanguage } from '@hooks/useLanguage';
import { useHomeScroll } from '@hooks/useHomeScroll';
import ProjectsGrid from '@components/ProjectsGrid';
import HeroSection from '@components/HeroSection';
import LatestPostTeaser from '@components/blog/LatestPostTeaser';

export default function HomePage() {
  const { t } = useLanguage();
  useHomeScroll();

  return (
    <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
      <HeroSection />

      <div className="flex justify-center md:justify-start">
        <Link
          to="/career"
          className="inline-flex items-center justify-center gap-2 border border-border bg-surface/80 px-5 py-2.5 rounded-full font-medium text-xs md:text-sm no-underline shadow-[var(--shadow-soft)] text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          {t('projects.viewCareerCta')}
          <span aria-hidden className="text-xs md:text-sm">→</span>
        </Link>
      </div>

      <h2 className="section-title text-xl md:text-2xl font-bold text-text-primary tracking-tight">
        {t('projects.title')}
      </h2>
      <ProjectsGrid />

      <LatestPostTeaser />
    </div>
  );
}
