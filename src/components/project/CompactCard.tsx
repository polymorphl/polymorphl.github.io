import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useCardTransition } from '@hooks/useMotionTransition';
import { cardScaleIn } from '@config/motion';
import TechPill from '@components/tech/TechPill';
import { getTech } from '@config/techs';
import type { ProjectConfig } from '@domain/project';

export default function CompactCard({
  p,
  isExpanded,
  onPointerEnter,
  onClick,
}: {
  p: ProjectConfig;
  isExpanded: boolean;
  onPointerEnter: () => void;
  onClick: () => void;
}) {
  const { t } = useLanguage();
  const transition = useCardTransition();

  return (
    <m.a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card group flex flex-col overflow-hidden rounded-xl bg-surface border border-border shadow-[var(--shadow-soft)] transition-[border-color,box-shadow,transform] duration-300 hover:shadow-[var(--shadow-floating)] hover:border-accent/60 hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      aria-label={p.title}
      variants={cardScaleIn}
      transition={transition}
      onPointerEnter={onPointerEnter}
      onClick={onClick}
    >
      <div
        className="relative w-full shrink-0 overflow-hidden rounded-t-xl"
        style={{
          aspectRatio: isExpanded ? '16/9' : '2/1',
          transition: 'aspect-ratio 0.38s ease',
        }}
      >
        {p.image && (
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-cover opacity-60 transition-[opacity,transform] duration-300 group-hover:scale-105 group-hover:opacity-75"
            loading="lazy"
            width={300}
            height={169}
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 10%, var(--color-background) 100%)' }}
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col gap-1.5 p-2.5 md:p-3 min-w-0">
        <h3
          className="font-semibold text-text-primary text-xs md:text-sm leading-snug"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {p.title}
        </h3>
        <AnimatePresence>
          {isExpanded && (
            <m.p
              key="desc"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 2 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="text-xs text-text-secondary line-clamp-3 overflow-hidden"
            >
              {t(`projects.${p.id}.description`)}
            </m.p>
          )}
        </AnimatePresence>
        <div className="flex flex-wrap gap-1">
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
    </m.a>
  );
}
