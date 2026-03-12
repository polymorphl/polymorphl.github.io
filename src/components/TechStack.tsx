import { useMemo } from 'react';
import * as m from 'motion/react-m';
import { useLanguage } from '@hooks/useLanguage';
import { useMotionTransition } from '@hooks/useMotionTransition';
import { containerTechStack, fadeInUp30 } from '@config/motion';
import TechStackPill from '@components/TechStackPill';
import { CAREER_ENTRIES_BASE } from '@config/career';
import { PROJECTS } from '@config/projects';
import { getTech } from '@config/techs';
import { computeTechExperience, type TechExperience } from '@lib/computeTechExperience';
import type { TechCategoryItem, TechCategoryWithIds } from '@ui/components';

function sortByExperience(
  items: TechCategoryItem[],
  experienceMap: Map<string, TechExperience>
): TechCategoryItem[] {
  return [...items].sort((a, b) => {
    const expA = experienceMap.get(a.techId);
    const expB = experienceMap.get(b.techId);
    const scoreA = expA ? expA.years + (expA.companies.length + expA.projectIds.length) * 0.01 : -1;
    const scoreB = expB ? expB.years + (expB.companies.length + expB.projectIds.length) * 0.01 : -1;
    return scoreB - scoreA;
  });
}

interface TechCategoryProps {
  category: TechCategoryWithIds;
  experienceMap: Map<string, TechExperience>;
  transition: ReturnType<typeof useMotionTransition>;
  t: (key: string) => string;
  /** When false, omit md:col-span-2 (for inline layout e.g. runtime + database row) */
  fullWidth?: boolean;
}

function TechCategory({ category, experienceMap, transition, t, fullWidth = true }: TechCategoryProps) {
  return (
    <m.div
      className={`tech-category flex flex-col gap-2 md:gap-3 ${fullWidth ? 'md:col-span-2' : ''}`}
      variants={fadeInUp30}
      transition={transition}
    >
      <h3 className="tech-category-title text-[10px] md:text-xs font-semibold uppercase tracking-widest text-text-secondary opacity-90">
        {t(category.labelKey)}
      </h3>
      <div className="tech-items flex flex-wrap gap-2 md:gap-3">
        {sortByExperience(category.items, experienceMap).map((item) => (
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
    </m.div>
  );
}

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
  const experienceMap = useMemo(
    () => computeTechExperience(CAREER_ENTRIES_BASE, PROJECTS),
    []
  );
  const transition = useMotionTransition(0.6);

  const categories = CATEGORY_IDS.map(techIdsToCategory);
  const runtimeCategory = techIdsToCategory(RUNTIME_IDS);
  const databaseCategory = techIdsToCategory(DATABASE_IDS);
  const cacheBrokersCategory = techIdsToCategory(CACHE_BROKERS_IDS);
  const devopsCategory = techIdsToCategory(DEVOPS_IDS);
  const integrationsCategory = techIdsToCategory(INTEGRATIONS_IDS);

  return (
    <m.section
      id="tech"
      className="md:col-span-2 w-full max-w-full min-w-0 self-start text-left scroll-mt-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      variants={fadeInUp30}
      transition={transition}
    >
      <h2 className="section-title text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6 tracking-tight">
        {t('sections.tech')}
      </h2>

      <m.div
        className="tech-categories-wrapper grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 w-full"
        variants={containerTechStack}
      >
        {categories.map((category) => (
          <TechCategory
            key={category.labelKey}
            category={category}
            experienceMap={experienceMap}
            transition={transition}
            t={t}
          />
        ))}

        <m.div
          className="tech-category-group md:col-span-2 flex flex-col md:flex-row md:flex-wrap md:gap-x-10 md:gap-y-0 gap-5 w-full"
          variants={fadeInUp30}
          transition={transition}
        >
          <TechCategory
            category={runtimeCategory}
            experienceMap={experienceMap}
            transition={transition}
            t={t}
            fullWidth={false}
          />
          <TechCategory
            category={databaseCategory}
            experienceMap={experienceMap}
            transition={transition}
            t={t}
            fullWidth={false}
          />
        </m.div>

        <TechCategory
          key={cacheBrokersCategory.labelKey}
          category={cacheBrokersCategory}
          experienceMap={experienceMap}
          transition={transition}
          t={t}
        />
        <TechCategory
          key={integrationsCategory.labelKey}
          category={integrationsCategory}
          experienceMap={experienceMap}
          transition={transition}
          t={t}
        />
        <TechCategory
          key={devopsCategory.labelKey}
          category={devopsCategory}
          experienceMap={experienceMap}
          transition={transition}
          t={t}
        />
      </m.div>
    </m.section>
  );
}
