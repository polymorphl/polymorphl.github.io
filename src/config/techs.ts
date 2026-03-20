/**
 * Single source of truth for tech definitions.
 * Career and projects reference techs by ID. Display names and icon config come from here.
 */

import type { TechDefinition, TechIconConfig } from '@domain/tech';

export const TECH_REGISTRY = {
  react: { id: 'react', displayName: 'React', icon: 'react' },
  nextjs: { id: 'nextjs', displayName: 'Next.js', icon: 'nextjs', invert: true },
  nestjs: { id: 'nestjs', displayName: 'NestJS', icon: 'nestjs' },
  typescript: { id: 'typescript', displayName: 'TypeScript', icon: 'typescript' },
  javascript: { id: 'javascript', displayName: 'JavaScript', icon: 'javascript' },
  vanillajs: { id: 'vanillajs', displayName: 'Vanilla JS', icon: 'javascript' },
  nodejs: { id: 'nodejs', displayName: 'Node.js', icon: 'nodejs' },
  go: { id: 'go', displayName: 'Go', icon: 'go' },
  rust: { id: 'rust', displayName: 'Rust', icon: 'rust', viewBox: '0 0 32 32', iconClass: 'tech-icon-rust' },
  postgresql: { id: 'postgresql', displayName: 'PostgreSQL', icon: 'postgresql' },
  docker: { id: 'docker', displayName: 'Docker', icon: 'docker' },
  vercel: { id: 'vercel', displayName: 'Vercel', icon: 'vercel', invert: true },
  gcp: { id: 'gcp', displayName: 'GCP', icon: 'googlecloud' },
  aws: { id: 'aws', displayName: 'AWS', icon: 'aws' },
  vuejs: { id: 'vuejs', displayName: 'Vue.js', icon: 'vuejs' },
  aerospike: { id: 'aerospike', displayName: 'Aerospike', icon: 'aerospike' },
  angular: { id: 'angular', displayName: 'Angular', icon: 'angular' },
  keycloak: { id: 'keycloak', displayName: 'Keycloak', icon: 'keycloak' },
  stripe: { id: 'stripe', displayName: 'Stripe', icon: 'stripe' },
  ansible: { id: 'ansible', displayName: 'Ansible', icon: 'ansible' },
  nginx: { id: 'nginx', displayName: 'Nginx', icon: 'nginx' },
  ethereum: { id: 'ethereum', displayName: 'Ethereum', icon: 'ethereum' },
  chargebee: { id: 'chargebee', displayName: 'Chargebee', icon: 'chargebee' },
  clerk: { id: 'clerk', displayName: 'Clerk', icon: 'clerk' },
  php: { id: 'php', displayName: 'PHP', icon: 'php' },
  mysql: { id: 'mysql', displayName: 'MySQL', icon: 'mysql' },
  jquery: { id: 'jquery', displayName: 'jQuery', icon: 'jquery' },
  mongodb: { id: 'mongodb', displayName: 'MongoDB', icon: 'mongodb' },
  redis: { id: 'redis', displayName: 'Redis', icon: 'redis' },
  zeromq: { id: 'zeromq', displayName: 'ZeroMQ', icon: 'zeromq' },
} as const satisfies Record<string, TechDefinition>;

/** Tech ID — union of registry keys. E.g. 'react' | 'nextjs' | 'nodejs' | ... */
export type TechId = keyof typeof TECH_REGISTRY;

export function getTech(id: string): TechDefinition | undefined {
  return id in TECH_REGISTRY ? TECH_REGISTRY[id as TechId] : undefined;
}

/** Convert TechDefinition to TechIconConfig for TechPill. */
export function toIconConfig(def: TechDefinition): TechIconConfig {
  return {
    icon: def.icon,
    viewBox: def.viewBox,
    invert: def.invert,
    iconClass: def.iconClass,
  };
}
