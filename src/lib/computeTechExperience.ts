import type { CareerEntryBase } from '@domain/career';
import type { ProjectConfig } from '@config/projects';
import { isPresent } from '@lib/formatPeriod';

export interface TechExperience {
  years: number;
  companies: Array<{ name: string; website?: string }>;
  projectIds: string[];
}

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

/** Build a map of tech ID → TechExperience from career and projects. */
export function computeTechExperience(
  careerEntries: CareerEntryBase[],
  projects: ReadonlyArray<ProjectConfig>
): Map<string, TechExperience> {
  const map = new Map<string, TechExperience>();

  for (const entry of careerEntries) {
    const years = getPeriodDurationInYears(entry.period);
    for (const techId of entry.stack) {
      const existing = map.get(techId);
      if (existing) {
        existing.years += years;
        if (!existing.companies.some((c) => c.name === entry.company)) {
          existing.companies.push({ name: entry.company, website: entry.website });
        }
      } else {
        map.set(techId, {
          years,
          companies: [{ name: entry.company, website: entry.website }],
          projectIds: [],
        });
      }
    }
  }

  for (const project of projects) {
    for (const techId of project.techIds) {
      const existing = map.get(techId);
      if (existing) {
        if (!existing.projectIds.includes(project.id)) {
          existing.projectIds.push(project.id);
        }
      } else {
        map.set(techId, {
          years: 0,
          companies: [],
          projectIds: [project.id],
        });
      }
    }
  }

  // Merge vanillajs experience into javascript (Vanilla JS is JavaScript)
  const vanillajs = map.get('vanillajs');
  if (vanillajs) {
    const js = map.get('javascript');
    if (js) {
      js.years += vanillajs.years;
      for (const c of vanillajs.companies) {
        if (!js.companies.some((x) => x.name === c.name)) js.companies.push(c);
      }
      for (const pid of vanillajs.projectIds) {
        if (!js.projectIds.includes(pid)) js.projectIds.push(pid);
      }
    } else {
      map.set('javascript', {
        years: vanillajs.years,
        companies: [...vanillajs.companies],
        projectIds: [...vanillajs.projectIds],
      });
    }
  }

  return map;
}
