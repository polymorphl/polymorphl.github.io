import { useRef } from 'react';
import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useLanguageNavigation } from '@hooks/useLanguageNavigation';
import { useMotionTransition } from '@hooks/useMotionTransition';
import { containerCareer, fadeInUp30 } from '@config/motion';
import TableOfContents from '@components/blog/TableOfContents';
import CareerOverview from '@components/CareerOverview';
import CareerTimeline from '@components/CareerTimeline';
import TechStack from '@components/TechStack';
import Certifications from '@components/Certifications';

export default function CareerPage() {
  const { lang, t } = useLanguage();
  const transition = useMotionTransition(0.4);
   const contentRef = useRef<HTMLDivElement | null>(null);

  useLanguageNavigation(lang);

  return (
    <m.div
      className="md:col-span-2 w-full lg:grid lg:grid-cols-[1fr_200px] lg:gap-12 lg:items-start"
      initial="hidden"
      animate="visible"
      variants={containerCareer}
    >
      <div className="w-full min-w-0 max-w-3xl mx-auto lg:mx-0">
        <m.h1
          className="sr-only"
          variants={fadeInUp30}
          transition={transition}
        >
          {t('sections.career')}
        </m.h1>
        <div
          ref={contentRef}
          className="flex flex-col gap-10 md:gap-14"
        >
          <CareerOverview />
          <CareerTimeline />
          <Certifications />
          <div className="pt-6 md:pt-8 border-t border-border/50">
            <TechStack />
          </div>
        </div>
      </div>
      <TableOfContents contentRef={contentRef} slug="career" lang={lang} />
    </m.div>
  );
}

