import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useMotionTransition, useLogoTransition } from '@hooks/useMotionTransition';
import { containerCareer, fadeInUp30 } from '@config/motion';
import CareerLogo from '@components/CareerLogo';
import TechPill from '@components/TechPill';
import { CAREER_ENTRIES_BASE } from '@config/career';
import { getTech, toIconConfig } from '@config/techs';
import { getPeriodDurationInYears } from '@lib/computeTechExperience';
import { formatPeriodForDisplay, formatExperienceDuration } from '@lib/formatPeriod';
import { parseTextWithLinks } from '@lib/parseLinks';
import SurfaceCard from '@components/SurfaceCard';
import type { CareerEntry, CareerEntryI18n } from '@domain/career';

function mergeCareerEntries(
  base: typeof CAREER_ENTRIES_BASE,
  i18n: CareerEntryI18n[]
): CareerEntry[] {
  return base.map((b, i) => ({ ...b, ...(i18n[i] ?? { role: '', location: '', highlights: [] }) }));
}

export default function CareerTimeline() {
  const { t, tObject } = useLanguage();
  const i18nEntries = (tObject<CareerEntryI18n[]>('career.entries') ?? []) as CareerEntryI18n[];
  const entries = mergeCareerEntries(CAREER_ENTRIES_BASE, i18nEntries);
  const transition = useMotionTransition(0.6);
  const logoTransition = useLogoTransition();

  return (
    <m.section
      id="career"
      className="md:col-span-2 w-full text-left scroll-mt-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      variants={fadeInUp30}
      transition={transition}
    >
      <h2
        id="career-timeline"
        className="section-title section-title-underline text-2xl md:text-3xl font-black text-text-primary mb-6 md:mb-8 tracking-[-0.04em] scroll-mt-28"
      >
        {t('sections.career')}
      </h2>

      <m.div
        className="relative flex flex-col gap-6 md:gap-8"
        variants={containerCareer}
      >
        {entries.map((entry, index) => (
          <m.div
            key={`${entry.company}-${entry.period.join('-')}`}
            className="group relative flex gap-4 md:gap-6 career-entry"
            variants={fadeInUp30}
            transition={transition}
          >
            {/* Left column: logo + timeline */}
            <div className="flex flex-col items-center shrink-0">
              <CareerLogo
                entry={entry}
                transition={logoTransition}
                visitWebsiteLabel={t('career.visitWebsite')}
              />
              <div className="flex flex-col items-center flex-1 min-h-0 self-stretch">
                <div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0 mt-3 ring-2 ring-background transition-transform duration-300 group-hover:scale-125 group-hover:ring-accent/30" />
                {index < entries.length - 1 && (
                  <div className="flex-1 w-0.5 min-h-[2rem] -mb-6 md:-mb-8 bg-gradient-to-b from-accent/70 via-accent/40 to-border mt-1" />
                )}
              </div>
            </div>

            <SurfaceCard variant="bento" className="bento-card-glow career-card flex-1 min-w-0 pl-4 md:pl-5 pr-4 md:pr-5 py-4 md:py-5 border-l-[3px] border-l-accent border-[var(--bento-tech-border)] transition-all duration-300 ease-out hover:[box-shadow:var(--bento-card-hover-shadow)] hover:-translate-y-[2px] hover:border-accent">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                <span className="text-xs font-mono text-accent-on-surface shrink-0 tabular-nums">
                  {formatPeriodForDisplay(entry.period, t('career.periodPresent'))}
                </span>
                <h3 className="text-base md:text-lg font-bold text-text-primary leading-snug">{entry.role}</h3>
              </div>
              <p className="text-sm text-text-secondary mb-3 flex items-center gap-2 flex-wrap">
                {entry.website ? (
                  <a
                    href={entry.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary hover:text-accent-on-surface font-medium transition-colors underline-offset-2 hover:underline"
                  >
                    {entry.company}
                  </a>
                ) : (
                  <span className="font-medium text-text-primary">{entry.company}</span>
                )}
                <span aria-hidden="true" className="text-border mx-1">·</span>
                <span>{entry.location}</span>
                <span aria-hidden="true" className="text-border mx-1">·</span>
                <span>{formatExperienceDuration(getPeriodDurationInYears(entry.period), t)}</span>
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {entry.stack.map((techId) => {
                  const tech = getTech(techId);
                  return (
                    <TechPill
                      key={techId}
                      name={tech?.displayName ?? techId}
                      compact
                      iconConfig={tech ? toIconConfig(tech) : null}
                    />
                  );
                })}
              </div>
              <ul className="flex flex-col gap-1">
                {entry.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
                    <span aria-hidden="true" className="text-accent-on-surface shrink-0 mt-0.5">•</span>
                    <span>{parseTextWithLinks(highlight)}</span>
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          </m.div>
        ))}
      </m.div>
    </m.section>
  );
}
