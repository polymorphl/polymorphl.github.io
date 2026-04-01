import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useCardTransition } from '@hooks/useMotionTransition';
import { useTracking } from '@hooks/useTracking';
import { containerStagger08, cardScaleIn } from '@config/motion';
import TechPill from '@components/TechPill';
import { PROJECTS } from '@config/projects';
import { getTech } from '@config/techs';

export default function ProjectsGrid() {
  const { trackProjectClicked } = useTracking();
  const { t } = useLanguage();
  const transition = useCardTransition();

  return (
    <m.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl mx-auto"
      variants={containerStagger08}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -50px 0px' }}
    >
      {PROJECTS.map((p) => (
        <m.a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card group flex flex-col overflow-hidden rounded-xl bg-surface border border-border shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-floating)] hover:border-accent hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          aria-label={p.title}
          variants={cardScaleIn}
          transition={transition}
          onClick={() => trackProjectClicked(p.id, p.title, p.url)}
        >
          <div className="project-card-image w-full h-40 md:h-auto rounded-t-xl aspect-[16/9] md:aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-accent/30 via-primary/15 to-transparent flex items-center justify-center">
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                fetchPriority={p.id === 'orcrux' ? 'high' : undefined}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80"
                loading={p.id === 'orcrux' ? undefined : 'lazy'}
                width={400}
                height={300}
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050509]/90 via-transparent to-transparent" aria-hidden="true" />
            <div className="project-card-overlay absolute inset-0 bg-[#09090b]/90 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-semibold text-sm">{t('projects.viewProject')}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center min-w-0 flex-1 p-3 md:p-4">
            <div className="flex items-start justify-between gap-2 min-w-0">
              <h3
                className="font-semibold text-text-primary text-sm md:text-lg leading-snug pr-1"
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
            <p className="text-xs md:text-sm text-text-secondary mt-2 line-clamp-4 md:line-clamp-5">
              {t(`projects.${p.id}.description`)}
            </p>
          </div>
          <span className="self-center mr-3 md:hidden text-text-secondary/60 shrink-0" aria-hidden="true">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </span>
        </m.a>
      ))}
    </m.div>
  );
}
