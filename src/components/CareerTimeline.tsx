import { usePostHog } from 'posthog-js/react';
import { useLanguage } from '@hooks/useLanguage';
import { useInViewAnimation } from '@hooks/useInViewAnimation';
import TechPill from '@components/TechPill';
import { CAREER_ENTRIES_BASE } from '@config/career';
import { getTechIconConfigs } from '@config/techIcons';
import { parseTextWithLinks } from '@lib/parseLinks';
import type { CareerEntry, CareerEntryI18n } from '@domain/career';

function mergeCareerEntries(
  base: typeof CAREER_ENTRIES_BASE,
  i18n: CareerEntryI18n[]
): CareerEntry[] {
  return base.map((b, i) => ({ ...b, ...(i18n[i] ?? { role: '', location: '', highlights: [] }) }));
}

export default function CareerTimeline() {
  const posthog = usePostHog();
  const { ref, isInView } = useInViewAnimation();
  const { t, tObject } = useLanguage();
  const i18nEntries = (tObject<CareerEntryI18n[]>('career.entries') ?? []) as CareerEntryI18n[];
  const entries = mergeCareerEntries(CAREER_ENTRIES_BASE, i18nEntries);
  const techConfigCache = getTechIconConfigs(entries.flatMap((e) => e.stack));

  return (
    <section ref={ref} id="career" className={`md:col-span-2 w-full text-left scroll-mt-28 ${isInView ? 'in-view' : 'in-view-hidden'}`}>
      <h2 className={`section-title text-xl md:text-2xl font-bold text-text-primary mb-6 md:mb-8 tracking-tight ${isInView ? 'in-view' : 'in-view-hidden'}`}>
        {t('sections.career')}
      </h2>

      <div className="relative flex flex-col gap-6 md:gap-8">
        {entries.map((entry, index) => (
          <div
            key={`${entry.company}-${entry.period}`}
            className={`group relative flex gap-4 md:gap-6 career-entry ${isInView ? 'in-view' : 'in-view-hidden'}`}
            style={{ animationDelay: isInView ? `${index * 100}ms` : undefined }}
          >
            {/* Left column: logo + timeline */}
            <div className="flex flex-col items-center shrink-0">
              {/* Company logo — clickable when website exists, opens in new tab + PostHog tracking */}
              {entry.website ? (
                <a
                  href={entry.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${entry.company} - ${t('career.visitWebsite')}`}
                  onClick={() =>
                    posthog?.capture('career_company_clicked', {
                      company: entry.company,
                      website: entry.website,
                      source: 'logo'
                    })
                  }
                  className={`career-logo shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden p-1.5 flex items-center justify-center border border-border shadow-[var(--shadow-soft)] transition-all duration-300 hover:scale-105 hover:shadow-[var(--shadow-floating)] cursor-pointer block ${
                    entry.logoLight ? 'bg-zinc-800 dark:bg-zinc-700' : 'bg-white dark:bg-zinc-200'
                  }`}
                >
                  {entry.logoId ? (
                    <svg className="w-full h-full object-contain" preserveAspectRatio="xMidYMid meet" aria-hidden>
                      <use href={`/assets/companies/sprite.svg#${entry.logoId}`} />
                    </svg>
                  ) : (
                    <span className="w-full h-full rounded bg-zinc-200 dark:bg-zinc-400" aria-hidden />
                  )}
                </a>
              ) : (
                <div
                  className={`career-logo shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden p-1.5 flex items-center justify-center border border-border shadow-[var(--shadow-soft)] transition-all duration-300 hover:scale-105 hover:shadow-[var(--shadow-floating)] ${
                    entry.logoLight ? 'bg-zinc-800 dark:bg-zinc-700' : 'bg-white dark:bg-zinc-200'
                  }`}
                >
                  {entry.logoId ? (
                    <svg className="w-full h-full object-contain" preserveAspectRatio="xMidYMid meet" aria-hidden>
                      <use href={`/assets/companies/sprite.svg#${entry.logoId}`} />
                    </svg>
                  ) : (
                    <span className="w-full h-full rounded bg-zinc-200 dark:bg-zinc-400" aria-hidden />
                  )}
                </div>
              )}
              {/* Timeline dot + connector line */}
              <div className="flex flex-col items-center flex-1 min-h-0 self-stretch">
                <div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0 mt-3 ring-2 ring-background transition-transform duration-300 group-hover:scale-125 group-hover:ring-accent/30" />
                {index < entries.length - 1 && (
                  <div className="flex-1 w-0.5 min-h-[2rem] -mb-6 md:-mb-8 bg-gradient-to-b from-accent/70 via-accent/40 to-border mt-1" />
                )}
              </div>
            </div>

            {/* Content card — subtle elevation, accent border, hover lift */}
            <div className="career-card flex-1 min-w-0 rounded-xl border border-border bg-surface/60 dark:bg-surface/40 pl-4 md:pl-5 pr-4 md:pr-5 py-4 md:py-5 border-l-4 border-l-accent transition-all duration-300 ease-out hover:shadow-soft hover:-translate-y-1 hover:border-accent/30">
              {/* Header: period + role */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                <span className="text-xs font-mono text-accent-on-surface shrink-0 tabular-nums">{entry.period}</span>
                <h3 className="text-base md:text-lg font-bold text-text-primary leading-snug">{entry.role}</h3>
              </div>
              {/* Company + location */}
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
                <span className="text-border mx-1">·</span>
                <span>{entry.location}</span>
              </p>

              {/* Stack pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {entry.stack.map((tech) => (
                  <TechPill
                    key={tech}
                    name={tech}
                    compact
                    iconConfig={techConfigCache.get(tech.trim().toLowerCase()) ?? null}
                  />
                ))}
              </div>

              {/* Highlights */}
              <ul className="flex flex-col gap-1">
                {entry.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
                    <span className="text-accent-on-surface shrink-0 mt-0.5">•</span>
                    <span>{parseTextWithLinks(highlight)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
