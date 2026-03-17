import { Link } from 'react-router-dom';
import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { fadeInUp20, containerHero } from '@config/motion';
import { useMotionTransition } from '@hooks/useMotionTransition';

export default function NotFoundPage() {
  const { t, lang } = useLanguage();
  const transition = useMotionTransition(0.6);
  const homeUrl = lang === 'fr' ? '/fr' : '/en';

  return (
    <m.section
      className="flex flex-col items-center justify-center gap-8 text-center py-12"
      variants={containerHero}
      initial="hidden"
      animate="visible"
    >
      <m.div
        className="flex flex-col items-center gap-4"
        variants={containerHero}
      >
        <m.div
          variants={fadeInUp20}
          transition={transition}
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent/60 to-accent">
            {t('notFound.code')}
          </h1>
        </m.div>

        <m.h2
          className="text-2xl sm:text-3xl font-bold text-text-primary"
          variants={fadeInUp20}
          transition={transition}
        >
          {t('notFound.title')}
        </m.h2>

        <m.p
          className="text-base sm:text-lg text-text-secondary max-w-lg"
          variants={fadeInUp20}
          transition={{ ...transition, delay: 0.1 }}
        >
          {t('notFound.description')}
        </m.p>
      </m.div>

      <m.div
        variants={fadeInUp20}
        transition={transition}
      >
        <Link
          to={homeUrl}
          className="inline-flex items-center justify-center bg-accent text-white px-8 py-3 rounded-full font-medium text-base no-underline shadow-[var(--shadow-button)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:opacity-90 active:translate-y-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          {t('notFound.backHome')}
        </Link>
      </m.div>
    </m.section>
  );
}
