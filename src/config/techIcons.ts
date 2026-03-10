/**
 * Mapping of tech names (from career stack, etc.) to sprite icon config.
 * Used by TechPill when rendering tech badges.
 */

export interface TechIconConfig {
  icon: string;
  viewBox?: string;
  invert?: boolean;
  iconClass?: string;
}

/** Tech name → icon config. Keys are normalized (lowercase, trimmed). */
const TECH_ICON_MAP: Record<string, TechIconConfig> = {
  react: { icon: 'react' },
  'next.js': { icon: 'nextjs', invert: true },
  nestjs: { icon: 'nestjs' },
  typescript: { icon: 'typescript' },
  javascript: { icon: 'javascript' },
  'node.js': { icon: 'nodejs' },
  go: { icon: 'go' },
  rust: { icon: 'rust', viewBox: '0 0 32 32', iconClass: 'tech-icon-rust' },
  postgresql: { icon: 'postgresql' },
  docker: { icon: 'docker' },
  vercel: { icon: 'vercel', invert: true },
  gcp: { icon: 'googlecloud' },
  aws: { icon: 'aws' },
  'vanilla js': { icon: 'javascript' },
  'vue.js': { icon: 'vuejs' },
  vuejs: { icon: 'vuejs' },
  aerospike: { icon: 'aerospike' },
  angular: { icon: 'angular' },
  keycloak: { icon: 'keycloak' },
  stripe: { icon: 'stripe' },
  ansible: { icon: 'ansible' },
  nginx: { icon: 'nginx' },
  ethereum: { icon: 'ethereum' },
  chargebee: { icon: 'chargebee' },
  clerk: { icon: 'clerk' },
  php: { icon: 'php' },
  mysql: { icon: 'mysql' },
  jquery: { icon: 'jquery' },
  mongodb: { icon: 'mongodb' },
  redis: { icon: 'redis' },
  zeromq: { icon: 'zeromq' },
};

export function getTechIconConfig(techName: string): TechIconConfig | undefined {
  const key = techName.trim().toLowerCase();
  return TECH_ICON_MAP[key];
}

/** Batch lookup: O(unique techs) instead of O(total). Returns Map keyed by normalized name. */
export function getTechIconConfigs(techNames: string[]): Map<string, TechIconConfig | undefined> {
  const map = new Map<string, TechIconConfig | undefined>();
  const seen = new Set<string>();
  for (const name of techNames) {
    const key = name.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    map.set(key, TECH_ICON_MAP[key]);
  }
  return map;
}
