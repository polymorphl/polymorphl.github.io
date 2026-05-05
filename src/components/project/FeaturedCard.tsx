import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useCardTransition } from '@hooks/useMotionTransition';
import { cardScaleIn } from '@config/motion';
import TechPill from '@components/tech/TechPill';
import { getTech } from '@config/techs';
import type { ProjectConfig } from '@domain/project';

// Fixed image heights drive the height-conservation math:
// Normal featured:   240px image + ~120px content = ~360px row
// Compressed featured: 110px image +  ~60px content = ~170px row  (−190px)
// Expanded compact at 2.5fr (~390px wide): 16/9 = 219px image + ~120px content = ~339px row (+172px)
// Normal compact: 107px image + ~60px content = ~167px row
// Net delta on hover: −18px — imperceptible on a ~547px bento.
export const IMG_FEATURED_DEFAULT = 240;
export const IMG_FEATURED_COMPRESSED = 110;

export default function FeaturedCard({
  p,
  isCompressed,
  onClick,
}: {
  p: ProjectConfig;
  isCompressed: boolean;
  onClick: () => void;
}) {
  const { t } = useLanguage();
  const transition = useCardTransition();

  return (
    <m.a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card group flex flex-col overflow-hidden rounded-2xl bg-surface border border-accent/30 shadow-[var(--shadow-soft)] transition-[border-color,box-shadow,transform] duration-300 hover:shadow-[var(--shadow-floating)] hover:border-accent/60 hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      aria-label={p.title}
      variants={cardScaleIn}
      transition={transition}
      onClick={onClick}
    >
      <div
        className="relative w-full shrink-0 overflow-hidden rounded-t-xl"
        style={{
          height: isCompressed ? `${IMG_FEATURED_COMPRESSED}px` : `${IMG_FEATURED_DEFAULT}px`,
          transition: 'height 0.38s ease',
        }}
      >
        {p.image && (
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80"
            loading="lazy"
            width={400}
            height={225}
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 30%, var(--color-background) 100%)' }}
          aria-hidden="true"
        />
        <div className="project-card-overlay absolute inset-0 bg-[#09090b]/90 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white font-semibold text-sm">{t('projects.viewProject')}</span>
        </div>
      </div>
      <div className="flex flex-col justify-center min-w-0 flex-1 overflow-hidden p-3 md:p-4">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <h3
            className="font-semibold text-text-primary text-sm md:text-base leading-snug pr-1 truncate"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {p.title}
          </h3>
          <div className="flex flex-wrap items-center gap-1 shrink-0 justify-end">
            {p.techIds.map((techId) => {
              const tech = getTech(techId);
              if (!tech) return null;
              return (
                <TechPill
                  key={techId}
                  name={tech.displayName}
                  icon={tech.icon}
                  viewBox={tech.viewBox}
                  invert={tech.invert}
                  iconClass={tech.iconClass}
                  mini
                />
              );
            })}
          </div>
        </div>
        <AnimatePresence>
          {!isCompressed && (
            <m.p
              key="desc"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="text-xs md:text-sm text-text-secondary line-clamp-3 overflow-hidden"
            >
              {t(`projects.${p.id}.description`)}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </m.a>
  );
}
