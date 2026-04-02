import { useMemo } from "react";
import * as m from "motion/react-m";
import { useLanguage } from "@hooks/useLanguage";
import { useMotionTransition } from "@hooks/useMotionTransition";
import { containerTechStack, fadeInUp30 } from "@config/motion";
import { TechListRow } from "@components/tech/TechListRow";
import SurfaceCard from "@components/SurfaceCard";
import { CAREER_ENTRIES_BASE } from "@config/career";
import { PROJECTS } from "@config/projects";
import { getTech } from "@config/techs";
import { computeTechExperience } from "@lib/computeTechExperience";
import type {
  TechCategoryItem,
  TechCategoryWithIds,
  TechCategoryListProps,
} from "@ui/components";
import type { TechExperience } from "@domain/tech";

function sortByExperience(
  items: TechCategoryItem[],
  experienceMap: Map<string, TechExperience>,
): TechCategoryItem[] {
  return [...items].sort((a, b) => {
    const expA = experienceMap.get(a.techId);
    const expB = experienceMap.get(b.techId);
    const scoreA = expA
      ? expA.years + (expA.companies.length + expA.projectIds.length) * 0.01
      : -1;
    const scoreB = expB
      ? expB.years + (expB.companies.length + expB.projectIds.length) * 0.01
      : -1;
    return scoreB - scoreA;
  });
}

function TechCategoryList({
  category,
  experienceMap,
  projectsById,
  transition,
  t,
}: TechCategoryListProps) {
  return (
    <m.div
      className="break-inside-avoid mb-4"
      variants={fadeInUp30}
      transition={transition}
    >
      <SurfaceCard
        variant="bento"
        className="overflow-hidden border-[var(--bento-tech-border)] transition-[border-color,transform,box-shadow] duration-200 hover:border-[var(--bento-tech-border-hover)] hover:-translate-y-[1px] hover:[box-shadow:var(--bento-card-hover-shadow)]"
      >
        <div className="px-4 pt-3.5 pb-2 border-b border-[var(--bento-tech-border-divider)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--bento-category-label)]">
            {t(category.labelKey)}
          </h3>
        </div>
        <div className="py-1">
          {sortByExperience(category.items, experienceMap).map((item) => (
            <TechListRow
              key={item.techId}
              item={item}
              experience={experienceMap.get(item.techId)}
              projectsById={projectsById}
              t={t}
            />
          ))}
        </div>
      </SurfaceCard>
    </m.div>
  );
}

const ALL_CATEGORY_IDS: { labelKey: string; techIds: readonly string[] }[] = [
  {
    labelKey: "tech.runtime",
    techIds: ["nodejs"],
  },
  {
    labelKey: "tech.languages",
    techIds: ["typescript", "javascript", "php", "go", "rust", "python"],
  },
  {
    labelKey: "tech.frameworks",
    techIds: ["react", "nextjs", "nestjs", "vuejs", "angular", "jquery"],
  },
  {
    labelKey: "tech.database",
    techIds: ["postgresql", "mysql", "mongodb", "aerospike"],
  },
  {
    labelKey: "tech.cacheBrokers",
    techIds: ["redis", "zeromq"],
  },
  {
    labelKey: "tech.devops",
    techIds: ["docker", "vercel", "gcp", "aws", "ansible", "nginx"],
  },
  {
    labelKey: "tech.integrations",
    techIds: ["stripe", "chargebee", "keycloak", "clerk", "ethereum"],
  },
];

function techIdsToCategory(idList: {
  labelKey: string;
  techIds: readonly string[];
}): TechCategoryWithIds {
  return {
    labelKey: idList.labelKey,
    items: idList.techIds
      .map((techId) => {
        const tech = getTech(techId);
        if (!tech) return null;
        return {
          techId,
          name: tech.displayName,
          icon: tech.icon,
          viewBox: tech.viewBox,
          invert: tech.invert,
          iconClass: tech.iconClass,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item != null),
  };
}

export default function TechStack() {
  const { t } = useLanguage();

  const experienceMap = useMemo(
    () => computeTechExperience(CAREER_ENTRIES_BASE, PROJECTS),
    [],
  );

  const projectsById = useMemo(
    () => new Map(PROJECTS.map((p) => [p.id, p])),
    [],
  );

  const transition = useMotionTransition(0.6);
  const allCategories = useMemo(
    () => ALL_CATEGORY_IDS.map(techIdsToCategory),
    [],
  );

  return (
    <m.section
      id="tech"
      className="md:col-span-2 w-full max-w-full min-w-0 self-start text-left scroll-mt-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      variants={fadeInUp30}
      transition={transition}
    >
      <h2
        id="tech-stack"
        className="section-title section-title-underline text-2xl md:text-3xl font-black text-text-primary mb-4 md:mb-6 tracking-[-0.04em] scroll-mt-28"
      >
        {t("sections.tech")}
      </h2>

      <m.div
        className="columns-1 sm:columns-2 lg:columns-3 gap-4"
        variants={containerTechStack}
      >
        {allCategories.map((category) => (
          <TechCategoryList
            key={category.labelKey}
            category={category}
            experienceMap={experienceMap}
            projectsById={projectsById}
            transition={transition}
            t={t}
          />
        ))}
      </m.div>
    </m.section>
  );
}
