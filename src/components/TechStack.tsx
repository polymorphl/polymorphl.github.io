import { useMemo } from 'react';
import { useLanguage } from '@hooks/useLanguage';
import { useInViewAnimation } from '@hooks/useInViewAnimation';
import TechStackPill from '@components/TechStackPill';
import type { TechCategoryData } from '@domain/tech';
import { CAREER_ENTRIES_BASE } from '@config/career';
import { PROJECTS } from '@config/projects';
import { computeTechExperience } from '@lib/computeTechExperience';

const CATEGORIES: TechCategoryData[] = [
  {
    labelKey: 'tech.frameworks',
    items: [
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextjs', invert: true },
      { name: 'NestJS', icon: 'nestjs' },
      { name: 'Vue.js', icon: 'vuejs' },
      { name: 'Angular', icon: 'angular' },
      { name: 'jQuery', icon: 'jquery' },
    ],
  },
  {
    labelKey: 'tech.languages',
    items: [
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'PHP', icon: 'php' },
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
  items: [
    { name: 'PostgreSQL', icon: 'postgresql' },
    { name: 'MySQL', icon: 'mysql' },
    { name: 'MongoDB', icon: 'mongodb' },
    { name: 'Aerospike', icon: 'aerospike' },
  ],
};

const CACHE_BROKERS_ITEMS: TechCategoryData = {
  labelKey: 'tech.cacheBrokers',
  items: [
    { name: 'Redis', icon: 'redis' },
    { name: 'ZeroMQ', icon: 'zeromq' },
  ],
};

const DEVOPS_ITEMS: TechCategoryData = {
  labelKey: 'tech.devops',
  items: [
    { name: 'Docker', icon: 'docker' },
    { name: 'Vercel', icon: 'vercel', invert: true },
    { name: 'GCP', icon: 'googlecloud' },
    { name: 'AWS', icon: 'aws' },
    { name: 'Ansible', icon: 'ansible' },
    { name: 'Nginx', icon: 'nginx' },
  ],
};

const INTEGRATIONS_ITEMS: TechCategoryData = {
  labelKey: 'tech.integrations',
  items: [
    { name: 'Stripe', icon: 'stripe' },
    { name: 'Chargebee', icon: 'chargebee' },
    { name: 'Keycloak', icon: 'keycloak' },
    { name: 'Clerk', icon: 'clerk' },
    { name: 'Ethereum', icon: 'ethereum' },
  ],
};

function normalizeTech(name: string): string {
  return name.trim().toLowerCase();
}

export default function TechStack() {
  const { t } = useLanguage();
  const { ref: techRef, isInView: techInView } = useInViewAnimation();
  const experienceMap = useMemo(
    () => computeTechExperience(CAREER_ENTRIES_BASE, PROJECTS),
    []
  );

  const renderCategory = (category: TechCategoryData) => (
    <div key={category.labelKey} className="tech-category flex flex-col gap-2 md:gap-3 md:col-span-2">
      <h3 className="tech-category-title text-[10px] md:text-xs font-semibold uppercase tracking-widest text-text-secondary opacity-90">
        {t(category.labelKey)}
      </h3>
      <div className="tech-items flex flex-wrap gap-2 md:gap-3">
        {category.items.map((item) => (
          <TechStackPill
            key={item.name}
            name={item.name}
            icon={item.icon}
            viewBox={item.viewBox}
            invert={item.invert}
            iconClass={item.iconClass}
            experience={experienceMap.get(normalizeTech(item.name))}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section ref={techRef} id="tech" className={`md:col-span-2 w-full max-w-full min-w-0 self-start text-left scroll-mt-28 ${techInView ? 'in-view' : 'in-view-hidden'}`}>
      <h2 className={`section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight ${techInView ? 'in-view' : 'in-view-hidden'}`}>
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
                <TechStackPill
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  viewBox={item.viewBox}
                  invert={item.invert}
                  iconClass={item.iconClass}
                  experience={experienceMap.get(normalizeTech(item.name))}
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
                <TechStackPill
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  viewBox={item.viewBox}
                  invert={item.invert}
                  iconClass={item.iconClass}
                  experience={experienceMap.get(normalizeTech(item.name))}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cache & Brokers */}
        {renderCategory(CACHE_BROKERS_ITEMS)}

        {/* Integrations */}
        {renderCategory(INTEGRATIONS_ITEMS)}

        {/* DevOps */}
        {renderCategory(DEVOPS_ITEMS)}
      </div>
    </section>
  );
}
