import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useMotionTransition } from '@hooks/useMotionTransition';
import { useHomeScroll } from '@hooks/useHomeScroll';
import { fadeInUp30 } from '@config/motion';
import ProjectsGrid from '@components/ProjectsGrid';
import HeroSection from '@components/HeroSection';
import TechStack from '@components/TechStack';
import CareerTimeline from '@components/CareerTimeline';
import LatestPostTeaser from '@components/blog/LatestPostTeaser';

export default function HomePage() {
  const { t } = useLanguage();
  const transition = useMotionTransition(0.6);
  useHomeScroll();

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

      <LatestPostTeaser />
    </div>
  );
}
