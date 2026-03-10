import type { CareerEntryBase } from '@domain/career';
import type { ProjectConfig } from '@config/projects';
import { isPresent } from '@lib/formatPeriod';

export interface TechExperience {
  years: number;
  companies: Array<{ name: string; website?: string }>;
  projectIds: string[];
}

/** Normalize tech name for matching (lowercase, trimmed). */
function normalizeTech(name: string): string {
  return name.trim().toLowerCase();
}

/** Map career stack names to canonical TechStack display names. */
const TECH_ALIASES: Record<string, string> = {
  'vanilla js': 'javascript',
};

/** Parse period [start, end] in MM/YYYY format to duration in years (fractional). Exported for CareerTimeline. */
export function getPeriodDurationInYears(period: [string, string]): number {
  const [startStr, endStr] = period;
  const startMatch = startStr.match(/^(\d{1,2})\/(\d{4})$/);
  if (!startMatch) return 0;
  const startMonth = parseInt(startMatch[1], 10) - 1;
  const startYear = parseInt(startMatch[2], 10);

  let endMonth: number;
  let endYear: number;
  if (isPresent(endStr)) {
    const now = new Date();
    endMonth = now.getMonth();
    endYear = now.getFullYear();
  } else {
    const endMatch = endStr.match(/^(\d{1,2})\/(\d{4})$/);
    if (!endMatch) return 0;
    endMonth = parseInt(endMatch[1], 10) - 1;
    endYear = parseInt(endMatch[2], 10);
  }

  /* Inclusive: Jan 2015 to Sep 2016 = 21 months */
  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  return Math.max(0, totalMonths) / 12;
}

/** Build a map of tech name (normalized) → TechExperience from career and projects. */
export function computeTechExperience(
  careerEntries: CareerEntryBase[],
  projects: ReadonlyArray<ProjectConfig>
): Map<string, TechExperience> {
  const map = new Map<string, TechExperience>();

  for (const entry of careerEntries) {
    const years = getPeriodDurationInYears(entry.period);
    for (const tech of entry.stack) {
      const normalized = normalizeTech(tech);
      const key = TECH_ALIASES[normalized] ?? normalized;
      const existing = map.get(key);
      if (existing) {
        existing.years += years;
        if (!existing.companies.some((c) => c.name === entry.company)) {
          existing.companies.push({ name: entry.company, website: entry.website });
        }
      } else {
        map.set(key, {
          years,
          companies: [{ name: entry.company, website: entry.website }],
          projectIds: [],
        });
      }
    }
  }

  for (const project of projects) {
    for (const tech of project.techs) {
      const normalized = normalizeTech(tech.name);
      const key = TECH_ALIASES[normalized] ?? normalized;
      const existing = map.get(key);
      if (existing) {
        if (!existing.projectIds.includes(project.id)) {
          existing.projectIds.push(project.id);
        }
      } else {
        map.set(key, {
          years: 0,
          companies: [],
          projectIds: [project.id],
        });
      }
    }
  }

  return map;
}
