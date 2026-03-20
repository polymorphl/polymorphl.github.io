/**
 * Domain types for tech definitions and experience
 */

export type TechDefinition = {
  id: string;
  displayName: string;
  icon: string;
  viewBox?: string;
  invert?: boolean;
  iconClass?: string;
};

/** Icon config shape for TechPill (subset of TechDefinition). */
export type TechIconConfig = {
  icon: string;
  viewBox?: string;
  invert?: boolean;
  iconClass?: string;
};

export type TechExperience = {
  years: number;
  companies: Array<{ name: string; website?: string }>;
  projectIds: string[];
};
