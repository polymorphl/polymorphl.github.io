import { useLanguage } from '@hooks/useLanguage';
import TechPill from '@components/TechPill';
import type { TechItem } from '@domain/tech';

const projects: ReadonlyArray<{
  id: string;
  title: string;
  url: string;
  image: string;
  techs: TechItem[];
}> = [
  {
    id: 'orcrux',
    title: 'Orcrux',
    url: 'https://github.com/polymorphl/orcrux',
    image: '/assets/projects/orcrux.webp',
    techs: [
      { name: 'Go', icon: 'go' },
      { name: 'TypeScript', icon: 'typescript' },
    ],
  },
  {
    id: 'go-kv',
    title: 'Go-kv',
    url: 'https://github.com/polymorphl/go-kv',
    image: '/assets/projects/go-kv.webp',
    techs: [
      { name: 'Go', icon: 'go' },
    ],
  },
  {
    id: 'my-open-claude',
    title: 'My Open Claude',
    url: 'https://github.com/polymorphl/my-open-claude',
    image: '/assets/projects/my-open-claude.webp',
    techs: [
      { name: 'Rust', icon: 'rust', viewBox: '0 0 32 32', iconClass: 'tech-icon-rust' },
    ],
  },
] as const;

export default function ProjectsGrid() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 w-full">
      {projects.map((p) => (
        <a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card group flex flex-row md:flex-col overflow-hidden rounded-lg md:rounded-xl bg-surface border border-border shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-floating)] hover:border-accent hover:-translate-y-0.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          aria-label={p.title}
        >
          <div className="project-card-image w-20 h-20 md:w-full md:h-auto shrink-0 rounded-l-lg md:rounded-none md:rounded-t-xl aspect-square md:aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
            {p.image && <img src={p.image} alt={t(`projects.${p.id}.title`)} fetchPriority={p.id === 'orcrux' ? 'high' : undefined} className="w-full h-full object-cover md:object-contain transition-transform duration-300 group-hover:scale-105" loading={p.id === 'orcrux' ? undefined : 'lazy'} width={400} height={300} />}
            <div className="project-card-overlay absolute inset-0 bg-[#09090b]/90 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-semibold text-sm">{t('projects.viewProject')}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center min-w-0 flex-1 p-3 md:p-4">
            {/* Titre + techs inline */}
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-semibold text-text-primary text-sm md:text-lg truncate" style={{ fontFamily: 'var(--font-display)' }}>{p.title}</h3>
              <div className="flex items-center gap-1 shrink-0">
                {p.techs.map((tech) => (
                  <TechPill key={tech.name} {...tech} mini />
                ))}
              </div>
            </div>
            <p className="text-xs md:text-sm text-text-secondary mt-1.5 md:mt-2 line-clamp-4 md:line-clamp-6 hidden md:block">{t(`projects.${p.id}.description`)}</p>
          </div>
          <span className="self-center mr-3 md:hidden text-text-secondary/60 shrink-0" aria-hidden="true">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </span>
        </a>
      ))}
    </div>
  );
}
