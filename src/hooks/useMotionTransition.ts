import { useMemo } from 'react';
import { useReducedMotion } from 'motion/react';
import { createTransition, EASE_OUT_CUBIC, NO_MOTION } from '@config/motion';

/** Returns transition respecting prefers-reduced-motion. Pass duration in seconds (e.g. 0.6). */
export function useMotionTransition(duration: number, ease?: readonly [number, number, number, number]) {
  const prefersReducedMotion = useReducedMotion();
  return useMemo(
    () => (prefersReducedMotion ? NO_MOTION : createTransition(duration, ease)),
    [prefersReducedMotion, duration, ease]
  );
}

/** Snappier transition for 3D rotations (cards, flips) – shorter duration, gentler easing */
export function useCardTransition() {
  return useMotionTransition(0.32, EASE_OUT_CUBIC);
}

/** Logo entrance – career timeline company logos */
export function useLogoTransition() {
  return useMotionTransition(0.5);
}
