import { AURORA_CONFIG } from '@config/aurora';
import type { Orb } from '@domain/aurora';

export function getOrbCount(width: number, height: number): number {
  const { min, max, areaPerOrb } = AURORA_CONFIG.orbCount;
  const area = width * height;
  return Math.min(max, Math.max(min, Math.ceil(area / areaPerOrb)));
}

export function createOrbs(width: number, height: number): Orb[] {
  const orbCount = getOrbCount(width, height);
  const orbs: Orb[] = [];
  for (let i = 0; i < orbCount; i++) {
    const r = Math.random() * (width * 0.25) + width * 0.15;
    orbs.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: r,
      baseRadius: r,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    });
  }
  return orbs;
}

export function updateOrbs(
  orbs: Orb[],
  width: number,
  height: number,
  reducedMotion: boolean
): void {
  orbs.forEach((orb) => {
    if (!reducedMotion) {
      orb.x += orb.vx;
      orb.y += orb.vy;
      orb.pulse += orb.pulseSpeed;
      orb.radius = orb.baseRadius + Math.sin(orb.pulse) * 20;

      if (orb.x < -orb.radius) orb.vx = Math.abs(orb.vx);
      if (orb.x > width + orb.radius) orb.vx = -Math.abs(orb.vx);
      if (orb.y < -orb.radius) orb.vy = Math.abs(orb.vy);
      if (orb.y > height + orb.radius) orb.vy = -Math.abs(orb.vy);
    } else {
      orb.radius = orb.baseRadius;
    }
  });
}

export function scaleOrbsOnResize(
  orbs: Orb[],
  oldWidth: number,
  oldHeight: number,
  newWidth: number,
  newHeight: number
): void {
  const scaleX = newWidth / oldWidth;
  const scaleY = newHeight / oldHeight;
  const scaleR = (scaleX + scaleY) / 2;
  orbs.forEach((orb) => {
    orb.x *= scaleX;
    orb.y *= scaleY;
    orb.radius *= scaleR;
    orb.baseRadius *= scaleR;
    orb.vx *= scaleX;
    orb.vy *= scaleY;
  });
}
