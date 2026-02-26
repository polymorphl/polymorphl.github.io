import { useLanguage } from '@hooks/useLanguage';
import TechPill from '@components/TechPill';
import type { TechCategoryData } from '@domain/tech';

const CATEGORIES: TechCategoryData[] = [
  {
    labelKey: 'tech.frameworks',
    items: [
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextjs', invert: true },
      { name: 'NestJS', icon: 'nestjs' },
    ],
  },
  {
    labelKey: 'tech.languages',
    items: [
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'Go', icon: 'go' },
      { name: 'Rust', icon: 'rust', viewBox: '0 0 32 32', iconClass: 'tech-icon-rust' },
    ],
  },
];

const RUNTIME_ITEMS: TechCategoryData = {
  labelKey: 'tech.runtime',
  items: [{ name: 'Node.js', icon: 'nodejs' }],
};

const DATABASE_ITEMS: TechCategoryData = {
  labelKey: 'tech.database',
  items: [{ name: 'PostgreSQL', icon: 'postgresql' }],
};

const DEVOPS_ITEMS: TechCategoryData = {
  labelKey: 'tech.devops',
  items: [
    { name: 'Docker', icon: 'docker' },
    { name: 'Vercel', icon: 'vercel', invert: true },
    { name: 'GCP', icon: 'googlecloud' },
    { name: 'AWS', icon: 'aws' },
  ],
};

export default function TechStack() {
  const { t } = useLanguage();

  const renderCategory = (category: TechCategoryData) => (
    <div key={category.labelKey} className="tech-category flex flex-col gap-2 md:gap-3 md:col-span-2">
      <h3 className="tech-category-title text-[10px] md:text-xs font-semibold uppercase tracking-widest text-text-secondary opacity-90">
        {t(category.labelKey)}
      </h3>
      <div className="tech-items flex flex-wrap gap-2 md:gap-3">
        {category.items.map((item) => (
          <TechPill
            key={item.name}
            name={item.name}
            icon={item.icon}
            viewBox={item.viewBox}
            invert={item.invert}
            iconClass={item.iconClass}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section id="tech" className="tech-section md:col-span-2 w-full max-w-full min-w-0 self-start text-left animate-fade-in-up scroll-mt-28">
      <h2 className="section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight">
        {t('sections.tech')}
      </h2>

      <div className="tech-categories-wrapper grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 w-full">
        {/* Full-width categories: Frameworks, Languages */}
        {CATEGORIES.map(renderCategory)}

        {/* Runtime + Database side by side */}
        <div className="tech-category-group md:col-span-2 flex flex-col md:flex-row md:flex-wrap md:gap-x-10 md:gap-y-0 gap-5 w-full">
          <div className="tech-category flex flex-col gap-2 md:gap-3">
            <h3 className="tech-category-title text-[10px] md:text-xs font-semibold uppercase tracking-widest text-text-secondary opacity-90">
              {t(RUNTIME_ITEMS.labelKey)}
            </h3>
            <div className="tech-items flex flex-wrap gap-2 md:gap-3">
              {RUNTIME_ITEMS.items.map((item) => (
                <TechPill
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  viewBox={item.viewBox}
                  invert={item.invert}
                  iconClass={item.iconClass}
                />
              ))}
            </div>
          </div>
          <div className="tech-category flex flex-col gap-2 md:gap-3">
            <h3 className="tech-category-title text-[10px] md:text-xs font-semibold uppercase tracking-widest text-text-secondary opacity-90">
              {t(DATABASE_ITEMS.labelKey)}
            </h3>
            <div className="tech-items flex flex-wrap gap-2 md:gap-3">
              {DATABASE_ITEMS.items.map((item) => (
                <TechPill
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  viewBox={item.viewBox}
                  invert={item.invert}
                  iconClass={item.iconClass}
                />
              ))}
            </div>
          </div>
        </div>

        {/* DevOps: Full-width */}
        {renderCategory(DEVOPS_ITEMS)}
      </div>
    </section>
  );
}
