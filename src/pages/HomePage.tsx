import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@hooks/useLanguage';
import { useInViewAnimation } from '@hooks/useInViewAnimation';
import ProjectsGrid from '@components/ProjectsGrid';
import TechStack from '@components/TechStack';
import type { AboutCard } from '@domain/blog';

export default function HomePage() {
  const location = useLocation();
  const { ref: projectsRef, isInView: projectsInView } = useInViewAnimation();
  const { ref: aboutRef, isInView: aboutInView } = useInViewAnimation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);
  const { t, tObject } = useLanguage();
  const aboutCards = (tObject<AboutCard[]>('about.cards') ?? []) as AboutCard[];

  const aboutIcons = [
    <path key="0" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    <path key="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    <path key="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    <path key="3" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ];

  return (
    <>
      <section className="hero md:col-span-2 w-full flex flex-col items-center md:items-stretch gap-6 text-center md:text-left animate-fade-in-up overflow-hidden md:flex-row md:items-center md:gap-12 lg:gap-16">
        <div className="profile-card flex justify-center shrink-0 animate-scale-in overflow-hidden rounded-[24px]" style={{ animationDelay: '0.05s' }}>
          <picture>
            <source srcSet="/profile.webp" type="image/webp" />
            <img
              src="/profile.png"
              alt="Luc TERRACHER"
              fetchPriority="high"
              className="profile-image w-44 h-[180px] sm:w-52 sm:h-[200px] md:w-64 md:h-[240px] lg:w-72 lg:h-[260px] rounded-[24px] object-cover shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-floating)]"
              width={288}
              height={260}
            />
          </picture>
        </div>

        <div className="hero-content flex flex-col items-center md:items-stretch gap-4 flex-1 min-w-0 w-full">
          <h1 className="hero-title text-text-primary text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold leading-tight tracking-tight animate-fade-in-up relative" style={{ animationDelay: '0.1s' }}>
            Luc <span className="relative inline-block">TERRACHER<span className="absolute -bottom-1 left-0 w-3/4 h-0.5 bg-accent/70 rounded-full" aria-hidden="true" /></span>
          </h1>
          <p className="hero-subtitle text-lg lg:text-xl font-medium text-text-secondary animate-fade-in-up" style={{ animationDelay: '0.15s' }}>{t('hero.subtitle')}</p>
          <p className="hero-tagline text-base lg:text-lg text-text-secondary/90 w-full lg:max-w-[480px] leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{t('hero.tagline')}</p>
          <div className="hero-status flex items-center justify-center md:justify-start gap-2 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <span className="status-dot w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span className="text-sm font-medium text-text-secondary">{t('hero.status')}</span>
          </div>

          <div className="actions flex flex-row flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 gap-y-4 sm:gap-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <a
              href={t('resume.file')}
              className="btn-primary inline-flex items-center justify-center bg-accent text-white px-6 py-3 rounded-full font-medium text-sm no-underline shadow-[var(--shadow-button)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:opacity-90 active:translate-y-0 shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              download
            >
              {t('resume.text')}
            </a>
            <div className="social-links flex gap-3">
              <a href="https://www.linkedin.com/in/lucterracher/" className="social-link flex items-center justify-center w-11 h-11 bg-surface border border-border rounded-full transition-all duration-200 shadow-[var(--shadow-soft)] text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                <svg className="social-icon w-5 h-5 text-text-primary transition-transform duration-200 [fill:currentColor]" width="20" height="20" viewBox="0 0 24 24">
                  <use href="/assets/icons/sprite.svg#linkedin" />
                </svg>
              </a>
              <a href="https://github.com/polymorphl" className="social-link flex items-center justify-center w-11 h-11 bg-surface border border-border rounded-full transition-all duration-200 shadow-[var(--shadow-soft)] text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                <svg className="social-icon w-5 h-5 text-text-primary transition-transform duration-200 [fill:currentColor]" width="20" height="20" viewBox="0 0 24 24">
                  <use href="/assets/icons/sprite.svg#github" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section ref={projectsRef} id="projects" className={`md:col-span-2 w-full max-w-full min-w-0 self-start text-left scroll-mt-28 ${projectsInView ? 'in-view' : 'in-view-hidden'}`}>
        <h2 className={`section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight ${projectsInView ? 'in-view' : 'in-view-hidden'}`}>{t('projects.title')}</h2>
        <ProjectsGrid />
      </section>

      <section ref={aboutRef} id="about" className={`md:col-span-2 w-full text-left scroll-mt-28 ${aboutInView ? 'in-view' : 'in-view-hidden'}`}>
        <h2 className={`section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight ${aboutInView ? 'in-view' : 'in-view-hidden'}`}>{t('sections.about')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 w-full">
          {aboutCards.map((card, index) => (
            <article key={card.label} className={`about-card group flex flex-row md:flex-col gap-3 md:gap-4 p-3 md:p-6 rounded-xl md:rounded-2xl bg-surface border border-border shadow-[var(--shadow-soft)] transition-all duration-200 hover:border-accent/50 hover:shadow-[var(--shadow-floating)] hover:-translate-y-0.5 cursor-default ${aboutInView ? 'in-view' : 'in-view-hidden'}`}>
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

      <TechStack />
    </>
  );
}
