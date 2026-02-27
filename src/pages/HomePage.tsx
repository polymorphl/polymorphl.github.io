import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useInViewAnimation } from '@hooks/useInViewAnimation';
import { useLanguage } from '@hooks/useLanguage';
import ProjectsGrid from '@components/ProjectsGrid';
import HeroSection from '@components/HeroSection';
import AboutSection from '@components/AboutSection';
import TechStack from '@components/TechStack';

export default function HomePage() {
  const location = useLocation();
  const isFirstRenderRef = useRef(true);
  const { ref: projectsRef, isInView: projectsInView } = useInViewAnimation();
  const { t } = useLanguage();

  useEffect(() => {
    // Cancel browser's automatic scroll to anchor on page reload
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      // Small delay ensures browser scroll happens first, then we override it
      setTimeout(() => window.scrollTo(0, 0), 0);
      return;
    }

    // Only scroll when hash changes during navigation (user clicks a link)
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  return (
    <>
      <HeroSection />

      <section ref={projectsRef} id="projects" className={`md:col-span-2 w-full max-w-full min-w-0 self-start text-left scroll-mt-28 ${projectsInView ? 'in-view' : 'in-view-hidden'}`}>
        <h2 className={`section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight ${projectsInView ? 'in-view' : 'in-view-hidden'}`}>{t('projects.title')}</h2>
        <ProjectsGrid />
      </section>

      <AboutSection />

      <TechStack />
    </>
  );
}
