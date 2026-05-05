import { useState, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useCardTransition } from '@hooks/useMotionTransition';
import { useTracking } from '@hooks/useTracking';
import { containerStagger08, cardScaleIn } from '@config/motion';
import TechPill from '@components/TechPill';
import { PROJECTS } from '@config/projects';
import { getTech } from '@config/techs';
import type { ProjectConfig } from '@domain/project';

const featuredProjects = PROJECTS.filter((p) => p.featured);
const compactProjects = PROJECTS.filter((p) => !p.featured);

// Fixed image heights drive the height-conservation math:
// Normal featured:   240px image + ~120px content = ~360px row
// Compressed featured: 110px image +  ~60px content = ~170px row  (−190px)
// Expanded compact at 2.5fr (~390px wide): 16/9 = 219px image + ~120px content = ~339px row (+172px)
// Normal compact: 107px image + ~60px content = ~167px row
// Net delta on hover: −18px — imperceptible on a ~547px bento.
const IMG_FEATURED_DEFAULT = 240;
const IMG_FEATURED_COMPRESSED = 110;

function FeaturedCard({
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

function CompactCard({
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

export default function ProjectsGrid() {
  const { trackProjectClicked } = useTracking();
  const [hoveredCompactId, setHoveredCompactId] = useState<string | null>(null);
  const isCompactHovered = hoveredCompactId !== null;
  const bentoRef = useRef<HTMLDivElement>(null);
  const [lockedHeight, setLockedHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Delay until CSS layout (aspect-ratio, flex sizing) has fully settled
    const timer = setTimeout(() => {
      if (bentoRef.current) {
        setLockedHeight(bentoRef.current.offsetHeight);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const compactGridStyle = useMemo(() => {
    if (!hoveredCompactId) return {};
    const idx = compactProjects.findIndex((p) => p.id === hoveredCompactId);
    if (idx === -1) return {};
    const cols = compactProjects.map((_, i) => (i === idx ? '2.5fr' : '1fr'));
    return { gridTemplateColumns: cols.join(' ') };
  }, [hoveredCompactId]);

  return (
    <m.div
      ref={bentoRef}
      className="flex flex-col gap-4 md:gap-5 w-full max-w-4xl mx-auto overflow-hidden"
      style={{ height: lockedHeight }}
      variants={containerStagger08}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -50px 0px' }}
    >
      {featuredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {featuredProjects.map((p) => (
            <FeaturedCard
              key={p.id}
              p={p}
              isCompressed={isCompactHovered}
              onClick={() => trackProjectClicked(p.id, p.title, p.url)}
            />
          ))}
        </div>
      )}
      {compactProjects.length > 0 && (
        <div
          className="grid grid-cols-2 md:grid-cols-4 items-start gap-3 md:gap-4"
          style={{
            transition: 'grid-template-columns 0.35s ease',
            ...compactGridStyle,
          }}
          onPointerLeave={() => setHoveredCompactId(null)}
        >
          {compactProjects.map((p) => (
            <CompactCard
              key={p.id}
              p={p}
              isExpanded={hoveredCompactId === p.id}
              onPointerEnter={() => setHoveredCompactId(p.id)}
              onClick={() => trackProjectClicked(p.id, p.title, p.url)}
            />
          ))}
        </div>
      )}
    </m.div>
  );
}
