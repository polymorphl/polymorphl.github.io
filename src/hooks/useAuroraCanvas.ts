import { useEffect, type RefObject } from 'react';
import {
  AURORA_CONFIG,
  AURORA_PALETTES,
  getAuroraPalette,
  type AuroraPalette,
} from '@config/aurora';
import type { Rgb } from '@domain/aurora';
import { getEffectivePalette, getOrbColors, lerp } from '@lib/aurora/auroraUtils';
import {
  createOrbs,
  scaleOrbsOnResize,
  updateOrbs,
} from '@lib/aurora/auroraOrbs';
import type { Orb } from '@domain/aurora';

export function useAuroraCanvas(canvasRef: RefObject<HTMLCanvasElement | null>): void {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let orbs: Orb[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let targetDark = document.documentElement.getAttribute('data-theme') === 'dark';
    let transitionStart = 0;
    let transitionActive = false;
    let currentPalette = getAuroraPalette();
    let targetPalette: AuroraPalette = currentPalette;
    let paletteTransitionStart = 0;
    let paletteTransitionActive = false;
    const dpr = Math.min(window.devicePixelRatio, 2);
    let animationId: number | null = null;

    const prefersReducedMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      if (orbs.length > 0) {
        scaleOrbsOnResize(orbs, width, height, newWidth, newHeight);
      } else {
        orbs = createOrbs(newWidth, newHeight);
      }

      width = newWidth;
      height = newHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const getColors = (themeProgress: number, paletteProgress: number): Rgb[] => {
      const effective =
        paletteProgress < 1
          ? getEffectivePalette(currentPalette, targetPalette, paletteProgress)
          : {
              dark: [...targetPalette.dark] as Rgb[],
              light: [...targetPalette.light] as Rgb[],
            };
      return getOrbColors(effective, targetDark, themeProgress);
    };

    const animate = (now: number) => {
      if (!ctx) return;
      if (document.hidden || document.visibilityState === 'hidden') {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const reducedMotion = prefersReducedMotion();

      let themeProgress = 1;
      if (transitionActive) {
        themeProgress = Math.min((now - transitionStart) / AURORA_CONFIG.transitionDuration, 1);
        if (themeProgress >= 1) transitionActive = false;
      }
      let paletteProgress = 1;
      if (paletteTransitionActive) {
        paletteProgress = Math.min(
          (now - paletteTransitionStart) / AURORA_CONFIG.paletteTransitionDuration,
          1
        );
        if (paletteProgress >= 1) {
          currentPalette = targetPalette;
          paletteTransitionActive = false;
        }
      }
      const colors = getColors(themeProgress, paletteProgress);
      const blendProgress = themeProgress;

      updateOrbs(orbs, width, height, reducedMotion);

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, width, height);
      if (!targetDark) {
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.globalCompositeOperation = targetDark ? 'screen' : 'multiply';

      orbs.forEach((orb, index) => {
        const baseColor = colors[index % colors.length];
        const gradient = ctx!.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        const alphaCfg = targetDark ? AURORA_CONFIG.alpha.dark : AURORA_CONFIG.alpha.light;
        const alpha = lerp(alphaCfg.from, alphaCfg.to, blendProgress);
        gradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`);
        gradient.addColorStop(
          0.5,
          `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha * AURORA_CONFIG.gradientMidStop})`
        );
        gradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx!.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const nextDark = document.documentElement.getAttribute('data-theme') === 'dark';
          if (nextDark !== targetDark) {
            targetDark = nextDark;
            transitionStart = performance.now();
            transitionActive = !prefersReducedMotion();
          }
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    let paletteInterval: ReturnType<typeof setInterval> | null = null;
    if (!prefersReducedMotion()) {
      paletteInterval = setInterval(() => {
        const idx = AURORA_PALETTES.indexOf(currentPalette);
        targetPalette = getAuroraPalette(idx >= 0 ? idx : undefined);
        paletteTransitionStart = performance.now();
        paletteTransitionActive = true;
      }, AURORA_CONFIG.paletteRotationInterval);
    }

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    };

    resize();
    animationId = requestAnimationFrame(animate);

    window.addEventListener('resize', debouncedResize);

    return () => {
      if (paletteInterval) clearInterval(paletteInterval);
      if (animationId !== null) cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('resize', debouncedResize);
    };
  }, [canvasRef]);
}
