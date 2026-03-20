/**
 * Aurora background: color palettes and animation config
 */

import type { AuroraPalette } from '@domain/aurora';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16);
  return { r: n >> 16, g: (n >> 8) & 0xff, b: n & 0xff };
}

/** Color collections – each has dark + light variants */
export const AURORA_PALETTES: AuroraPalette[] = [
  {
    dark: [hexToRgb('#2563eb'), hexToRgb('#dc2626'), hexToRgb('#7c3aed')],
    light: [hexToRgb('#2563eb'), hexToRgb('#ea580c'), hexToRgb('#7c3aed')],
  },
  {
    dark: [hexToRgb('#0ea5e9'), hexToRgb('#06b6d4'), hexToRgb('#8b5cf6')],
    light: [hexToRgb('#0284c7'), hexToRgb('#0891b2'), hexToRgb('#7c3aed')],
  },
  {
    dark: [hexToRgb('#22c55e'), hexToRgb('#14b8a6'), hexToRgb('#3b82f6')],
    light: [hexToRgb('#16a34a'), hexToRgb('#0d9488'), hexToRgb('#2563eb')],
  },
  {
    dark: [hexToRgb('#f97316'), hexToRgb('#eab308'), hexToRgb('#ef4444')],
    light: [hexToRgb('#ea580c'), hexToRgb('#ca8a04'), hexToRgb('#dc2626')],
  },
];

export function getAuroraPalette(excludeIndex?: number): AuroraPalette {
  const indices = AURORA_PALETTES.map((_, i) => i).filter((i) => i !== excludeIndex);
  const idx = indices[Math.floor(Math.random() * indices.length)] ?? 0;
  return AURORA_PALETTES[idx];
}

export const AURORA_CONFIG = {
  transitionDuration: 800,
  paletteRotationInterval: 30_000,
  paletteTransitionDuration: 2000,
  orbCount: { min: 5, max: 12, areaPerOrb: 400000 },
  alpha: { dark: { from: 0.25, to: 0.4 }, light: { from: 0.5, to: 0.55 } },
  gradientMidStop: 0.4,
} as const;
