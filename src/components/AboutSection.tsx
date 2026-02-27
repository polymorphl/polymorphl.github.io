import { useLanguage } from '@hooks/useLanguage';
import { useInViewAnimation } from '@hooks/useInViewAnimation';
import type { AboutCard } from '@domain/blog';

export default function AboutSection() {
  const { ref, isInView } = useInViewAnimation();
  const { t, tObject } = useLanguage();
  const aboutCards = (tObject<AboutCard[]>('about.cards') ?? []) as AboutCard[];

  const aboutIcons = [
    <path key="0" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    <path key="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    <path key="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    <path key="3" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  ];

  return (
    <section ref={ref} id="about" className={`md:col-span-2 w-full text-left scroll-mt-28 ${isInView ? 'in-view' : 'in-view-hidden'}`}>
      <h2 className={`section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight ${isInView ? 'in-view' : 'in-view-hidden'}`}>{t('sections.about')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 w-full">
        {aboutCards.map((card, index) => (
          <article key={card.label} className={`about-card group flex flex-row md:flex-col gap-3 md:gap-4 p-3 md:p-6 rounded-xl md:rounded-2xl bg-surface border border-border shadow-[var(--shadow-soft)] transition-all duration-200 hover:border-accent/50 hover:shadow-[var(--shadow-floating)] hover:-translate-y-0.5 cursor-default ${isInView ? 'in-view' : 'in-view-hidden'}`}>
            <div className="about-card-icon flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent-on-surface/15 text-accent-on-surface shrink-0 transition-colors duration-200 group-hover:bg-accent-on-surface/25">
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{aboutIcons[index]}</svg>
            </div>
            <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 flex-1">
              <h3 className="about-card-label text-xs md:text-sm font-semibold uppercase tracking-wider text-accent-on-surface">{card.label}</h3>
              <p className="about-card-text text-sm md:text-[1rem] text-text-secondary leading-relaxed">{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
