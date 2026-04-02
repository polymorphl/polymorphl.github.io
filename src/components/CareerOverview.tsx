import * as m from 'motion/react-m';
import { useMemo } from 'react';
import { useLanguage } from '@hooks/useLanguage';
import { useMotionTransition } from '@hooks/useMotionTransition';
import { containerCareer, fadeInUp30 } from '@config/motion';
import { CAREER_ENTRIES_BASE } from '@config/career';
import { getPeriodDurationInYears } from '@lib/computeTechExperience';

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <polyline points="8,4.5 8,8 10.5,9.5" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1.5" y="2" width="9" height="13" />
      <path d="M10.5 5.5H14.5V15H10.5" />
      <line x1="4.5" y1="5.5" x2="4.5" y2="6.5" />
      <line x1="7" y1="5.5" x2="7" y2="6.5" />
      <line x1="4.5" y1="8.5" x2="4.5" y2="9.5" />
      <line x1="7" y1="8.5" x2="7" y2="9.5" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <line x1="1.5" y1="8" x2="14.5" y2="8" />
      <ellipse cx="8" cy="8" rx="2.5" ry="6.5" />
    </svg>
  );
}

export default function CareerOverview() {
  const { t, tObject } = useLanguage();
  const transition = useMotionTransition(0.5);

  const { yearsTotal, companyCount } = useMemo(() => {
    const companies = CAREER_ENTRIES_BASE.filter((e) => !!e.website);
    const parseMonthYear = (s: string): number => {
      const [mm, yyyy] = s.split('/');
      return parseInt(yyyy, 10) * 12 + parseInt(mm, 10);
    };
    const earliest = CAREER_ENTRIES_BASE.reduce((min, e) => {
      return parseMonthYear(e.period[0]) < parseMonthYear(min.period[0]) ? e : min;
    }, CAREER_ENTRIES_BASE[0]).period[0];
    const years = Math.floor(getPeriodDurationInYears([earliest, 'present']));
    return { yearsTotal: years, companyCount: companies.length };
  }, []);

  const tags = tObject<string[]>('career.overview.tags') ?? [];

  return (
    <m.div
      className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      variants={containerCareer}
    >
      {/* Availability cell — green tinted, spans full width on mobile */}
      <m.div
        className="col-span-2 md:col-span-1 relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4"
        variants={fadeInUp30}
        transition={transition}
      >
        <div
          className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(74,222,128,0.12), transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="flex items-center gap-2 mb-1.5">
          <span className="relative inline-flex w-2.5 h-2.5">
            <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" aria-hidden="true" />
            <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-bold text-emerald-400">{t('career.overview.available')}</span>
        </div>
        <p className="text-xs text-text-secondary mb-2.5">{t('career.overview.availableDetail')}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </m.div>

      {/* Years cell */}
      <m.div
        className="bento-card-glow rounded-xl border border-border p-4 [background:var(--bento-card-gradient)] flex flex-col"
        variants={fadeInUp30}
        transition={transition}
      >
        <ClockIcon className="w-3.5 h-3.5 text-text-secondary" />
        <div className="mt-auto">
          <div className="text-2xl font-black text-accent tracking-[-0.05em] leading-none">
            {yearsTotal}
            <span className="text-base font-semibold opacity-60">+</span>
          </div>
          <p className="text-xs text-text-secondary mt-2">{t('career.overview.yearsLabel')}</p>
        </div>
      </m.div>

      {/* Companies cell */}
      <m.div
        className="bento-card-glow rounded-xl border border-border p-4 [background:var(--bento-card-gradient)] flex flex-col"
        variants={fadeInUp30}
        transition={transition}
      >
        <BuildingIcon className="w-3.5 h-3.5 text-text-secondary" />
        <div className="mt-auto">
          <div className="text-2xl font-black text-accent tracking-[-0.05em] leading-none">
            {companyCount}
          </div>
          <p className="text-xs text-text-secondary mt-2">{t('career.overview.companiesLabel')}</p>
        </div>
      </m.div>

      {/* Bilingual cell — spans full width on mobile */}
      <m.div
        className="col-span-2 md:col-span-1 bento-card-glow rounded-xl border border-border p-4 [background:var(--bento-card-gradient)] flex flex-col"
        variants={fadeInUp30}
        transition={transition}
      >
        <GlobeIcon className="w-3.5 h-3.5 text-text-secondary" />
        <div className="mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent">FR</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent">EN</span>
          </div>
          <p className="text-xs text-text-secondary mt-2">{t('career.overview.bilingualLabel')}</p>
        </div>
      </m.div>
    </m.div>
  );
}
