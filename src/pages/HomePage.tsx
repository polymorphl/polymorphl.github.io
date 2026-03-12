import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useMotionTransition } from '@hooks/useMotionTransition';
import { fadeInUp30, PAGE_TRANSITION_DURATION_MS } from '@config/motion';
import ProjectsGrid from '@components/ProjectsGrid';
import HeroSection from '@components/HeroSection';
import TechStack from '@components/TechStack';
import CareerTimeline from '@components/CareerTimeline';

export default function HomePage() {
  const location = useLocation();
  const isFirstRenderRef = useRef(true);
  const { t } = useLanguage();
  const transition = useMotionTransition(0.6);

  useEffect(() => {
    const scrollToSection = (id: string) => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      if (scrollTo) {
        // Navigation from another page with scroll target: wait for page transition, then scroll
        const t = setTimeout(() => scrollToSection(scrollTo), PAGE_TRANSITION_DURATION_MS);
        return () => clearTimeout(t);
      }
      // No scroll target: cancel browser's automatic scroll to anchor on page reload
      setTimeout(() => window.scrollTo(0, 0), 0);
      return;
    }

    // State changed during navigation on same page
    if (scrollTo) {
      scrollToSection(scrollTo);
    } else {
      // Logo clicked or nav to / without scroll target: scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state]);

  return (
    <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
      <HeroSection />

      <m.section
        id="projects"
        className="md:col-span-2 w-full max-w-full min-w-0 self-start text-left scroll-mt-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -100px 0px' }}
        variants={fadeInUp30}
        transition={transition}
      >
        <h2 className="section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight">
          {t('projects.title')}
        </h2>
        <ProjectsGrid />
      </m.section>

      <CareerTimeline />

      <TechStack />
    </div>
  );
}
