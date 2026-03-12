import type { CareerPeriod } from '@domain/career';

const PRESENT_VARIANTS = ['present', 'présent', "aujourd'hui", 'today', 'now'];

export function isPresent(value: string): boolean {
  return PRESENT_VARIANTS.includes(value.trim().toLowerCase());
}

/** Format [start, end] for display, e.g. "01/2015 – 09/2016" or "01/2015 – present". */
export function formatPeriodForDisplay(period: CareerPeriod, presentLabel: string): string {
  const [start, end] = period;
  const endDisplay = isPresent(end) ? presentLabel : end;
  return `${start} – ${endDisplay}`;
}

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

/** Format experience duration for display (e.g. "2 ans et demi", "Plus de 2 ans", "1 an", "Moins d'un an"). */
export function formatExperienceDuration(years: number, t: TranslateFn): string {
  if (years < 1) return t('tech.experienceLessThanOneYear');
  const floor = Math.floor(years);
  const frac = years % 1;
  if (frac >= 0.4 && frac <= 0.6) return t('tech.experienceYearsAndHalf', { count: floor });
  if (frac >= 0.1) return t('tech.experienceMoreThanYears', { count: floor });
  return t('tech.experienceYears', { count: Math.round(years) });
}
