import { useMemo } from 'react';
import { useLanguage } from '@hooks/useLanguage';
import { useInViewAnimation } from '@hooks/useInViewAnimation';
import TechStackPill from '@components/TechStackPill';
import { CAREER_ENTRIES_BASE } from '@config/career';
import { PROJECTS } from '@config/projects';
import { getTech } from '@config/techs';
import { computeTechExperience } from '@lib/computeTechExperience';

const CATEGORY_IDS: { labelKey: string; techIds: string[] }[] = [
  {
    labelKey: 'tech.frameworks',
    techIds: ['react', 'nextjs', 'nestjs', 'vuejs', 'angular', 'jquery'],
  },
  {
    labelKey: 'tech.languages',
    techIds: ['typescript', 'javascript', 'php', 'go', 'rust'],
  },
];

const RUNTIME_IDS = { labelKey: 'tech.runtime', techIds: ['nodejs'] as const };
const DATABASE_IDS = { labelKey: 'tech.database', techIds: ['postgresql', 'mysql', 'mongodb', 'aerospike'] as const };
const CACHE_BROKERS_IDS = { labelKey: 'tech.cacheBrokers', techIds: ['redis', 'zeromq'] as const };
const DEVOPS_IDS = {
  labelKey: 'tech.devops',
  techIds: ['docker', 'vercel', 'gcp', 'aws', 'ansible', 'nginx'] as const,
};
const INTEGRATIONS_IDS = {
  labelKey: 'tech.integrations',
  techIds: ['stripe', 'chargebee', 'keycloak', 'clerk', 'ethereum'] as const,
};

interface TechCategoryWithIds {
  labelKey: string;
  items: Array<{
    techId: string;
    name: string;
    icon: string;
    viewBox?: string;
    invert?: boolean;
    iconClass?: string;
  }>;
}

function techIdsToCategory(idList: { labelKey: string; techIds: readonly string[] }): TechCategoryWithIds {
  return {
    labelKey: idList.labelKey,
    items: idList.techIds
      .map((techId) => {
        const t = getTech(techId);
        if (!t) return null;
        return {
          techId,
          name: t.displayName,
          icon: t.icon,
          viewBox: t.viewBox,
          invert: t.invert,
          iconClass: t.iconClass,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item != null),
  };
}

export default function TechStack() {
  const { t } = useLanguage();
  const { ref: techRef, isInView: techInView } = useInViewAnimation();
  const experienceMap = useMemo(
    () => computeTechExperience(CAREER_ENTRIES_BASE, PROJECTS),
    []
  );

  const renderCategory = (category: TechCategoryWithIds) => (
    <div key={category.labelKey} className="tech-category flex flex-col gap-2 md:gap-3 md:col-span-2">
      <h3 className="tech-category-title text-[10px] md:text-xs font-semibold uppercase tracking-widest text-text-secondary opacity-90">
        {t(category.labelKey)}
      </h3>
      <div className="tech-items flex flex-wrap gap-2 md:gap-3">
        {category.items.map((item) => (
          <TechStackPill
            key={item.techId}
            name={item.name}
            icon={item.icon}
            viewBox={item.viewBox}
            invert={item.invert}
            iconClass={item.iconClass}
            experience={experienceMap.get(item.techId)}
          />
        ))}
      </div>
    </div>
  );

  const categories = CATEGORY_IDS.map(techIdsToCategory);
  const runtimeCategory = techIdsToCategory(RUNTIME_IDS);
  const databaseCategory = techIdsToCategory(DATABASE_IDS);
  const cacheBrokersCategory = techIdsToCategory(CACHE_BROKERS_IDS);
  const devopsCategory = techIdsToCategory(DEVOPS_IDS);
  const integrationsCategory = techIdsToCategory(INTEGRATIONS_IDS);

  return (
    <section ref={techRef} id="tech" className={`md:col-span-2 w-full max-w-full min-w-0 self-start text-left scroll-mt-28 ${techInView ? 'animate-[in-view-fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]' : 'opacity-0 translate-y-[30px] will-change-[opacity,transform]'}`}>
      <h2 className={`section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight ${techInView ? 'animate-[in-view-fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]' : 'opacity-0 translate-y-[30px] will-change-[opacity,transform]'}`}>
        {t('sections.tech')}
      </h2>

      <div className="tech-categories-wrapper grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 w-full">
        {/* Full-width categories: Frameworks, Languages */}
        {categories.map(renderCategory)}

        {/* Runtime + Database side by side */}
        <div className="tech-category-group md:col-span-2 flex flex-col md:flex-row md:flex-wrap md:gap-x-10 md:gap-y-0 gap-5 w-full">
          <div className="tech-category flex flex-col gap-2 md:gap-3">
            <h3 className="tech-category-title text-[10px] md:text-xs font-semibold uppercase tracking-widest text-text-secondary opacity-90">
              {t(runtimeCategory.labelKey)}
            </h3>
            <div className="tech-items flex flex-wrap gap-2 md:gap-3">
              {runtimeCategory.items.map((item) => (
                <TechStackPill
                  key={item.techId}
                  name={item.name}
                  icon={item.icon}
                  viewBox={item.viewBox}
                  invert={item.invert}
                  iconClass={item.iconClass}
                  experience={experienceMap.get(item.techId)}
                />
              ))}
            </div>
          </div>
          <div className="tech-category flex flex-col gap-2 md:gap-3">
            <h3 className="tech-category-title text-[10px] md:text-xs font-semibold uppercase tracking-widest text-text-secondary opacity-90">
              {t(databaseCategory.labelKey)}
            </h3>
            <div className="tech-items flex flex-wrap gap-2 md:gap-3">
              {databaseCategory.items.map((item) => (
                <TechStackPill
                  key={item.techId}
                  name={item.name}
                  icon={item.icon}
                  viewBox={item.viewBox}
                  invert={item.invert}
                  iconClass={item.iconClass}
                  experience={experienceMap.get(item.techId)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cache & Brokers */}
        {renderCategory(cacheBrokersCategory)}

        {/* Integrations */}
        {renderCategory(integrationsCategory)}

        {/* DevOps */}
        {renderCategory(devopsCategory)}
      </div>
    </section>
  );
}
