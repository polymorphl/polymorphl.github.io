/** Period as [start, end] in MM/YYYY format. End can be "present" for ongoing. */
export type CareerPeriod = [string, string];

import type { TechId } from '@config/techs';

/** Shared data (company, period, stack, logo, website) — from config. */
export type CareerEntryBase = {
  company: string;
  /** [start, end] in MM/YYYY format. End can be "present" for ongoing. */
  period: CareerPeriod;
  /** Tech IDs from TECH_REGISTRY (e.g. 'react', 'nodejs') */
  stack: TechId[];
  /** Sprite symbol ID for company logo (e.g. paradox-institute) */
  logoId?: string;
  /** When true, logo is light/white and needs dark background for contrast */
  logoLight?: boolean;
  /** Company website URL */
  website?: string;
};

/** Translatable fields — from i18n. */
export type CareerEntryI18n = {
  role: string;
  location: string;
  highlights: string[];
};

/** Full entry = base + i18n merged. */
export type CareerEntry = CareerEntryBase & CareerEntryI18n;

export type CertificationBase = {
  id: string;
  image: string;
  pdf: string;
  verifyUrl?: string;
};

export type CertificationI18n = {
  id: string;
  name: string;
  issuer: string;
  date: string;
};

export type Certification = CertificationBase & CertificationI18n;
