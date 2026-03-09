/** Shared data (company, period, stack, logo, website) — from config. */
export interface CareerEntryBase {
  company: string;
  period: string;
  stack: string[];
  /** Sprite symbol ID for company logo (e.g. paradox-institute) */
  logoId?: string;
  /** When true, logo is light/white and needs dark background for contrast */
  logoLight?: boolean;
  /** Company website URL */
  website?: string;
}

/** Translatable fields — from i18n. */
export interface CareerEntryI18n {
  role: string;
  location: string;
  highlights: string[];
}

/** Full entry = base + i18n merged. */
export interface CareerEntry extends CareerEntryBase, CareerEntryI18n {}
