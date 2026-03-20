export type Rgb = {
  r: number;
  g: number;
  b: number;
};

export type Orb = {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  vx: number;
  vy: number;
  pulse: number;
  pulseSpeed: number;
};

export type AuroraPalette = {
  dark: readonly [Rgb, ...Rgb[]];
  light: readonly [Rgb, ...Rgb[]];
};
