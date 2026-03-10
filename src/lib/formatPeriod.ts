import type { CareerPeriod } from '@domain/career';

const PRESENT_VARIANTS = ['present', 'présent', "aujourd'hui", 'today', 'now'];

export function isPresent(value: string): boolean {
  return PRESENT_VARIANTS.includes(value.trim().toLowerCase());
}

/** Format [start, end] for display, e.g. "01/2015 – 09/2016" or "01/2015 – présent". */
export function formatPeriodForDisplay(period: CareerPeriod, presentLabel: string): string {
  const [start, end] = period;
  const endDisplay = isPresent(end) ? presentLabel : end;
  return `${start} – ${endDisplay}`;
}

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

/** Format experience duration for display (e.g. "Plus de 2 ans", "1 an", "Moins d'un an"). */
export function formatExperienceDuration(years: number, t: TranslateFn): string {
  if (years < 1) return t('tech.experienceLessThanOneYear');
  if (years % 1 >= 0.1) return t('tech.experienceMoreThanYears', { count: Math.floor(years) });
  return t('tech.experienceYears', { count: Math.round(years) });
}
