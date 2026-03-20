import type { AuroraPalette, Rgb } from '@domain/aurora';

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpColor(from: Rgb, to: Rgb, t: number): Rgb {
  return {
    r: Math.round(lerp(from.r, to.r, t)),
    g: Math.round(lerp(from.g, to.g, t)),
    b: Math.round(lerp(from.b, to.b, t)),
  };
}

export function ease(t: number): number {
  return t * t * (3 - 2 * t);
}

export function getEffectivePalette(
  current: AuroraPalette,
  target: AuroraPalette,
  progress: number
): { dark: Rgb[]; light: Rgb[] } {
  const t = ease(progress);
  const cd = [...current.dark] as Rgb[];
  const td = [...target.dark] as Rgb[];
  const cl = [...current.light] as Rgb[];
  const tl = [...target.light] as Rgb[];
  return {
    dark: cd.map((f, i) => lerpColor(f, td[i], t)),
    light: cl.map((f, i) => lerpColor(f, tl[i], t)),
  };
}

export function getOrbColors(
  effective: { dark: Rgb[]; light: Rgb[] },
  targetDark: boolean,
  themeProgress: number
): Rgb[] {
  const themeT = ease(themeProgress);
  const from = targetDark ? effective.light : effective.dark;
  const to = targetDark ? effective.dark : effective.light;
  return from.map((f, i) => lerpColor(f, to[i], themeT));
}
