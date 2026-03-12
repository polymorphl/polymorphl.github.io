/**
 * Motion animation config – variants, easing, and transition helpers.
 * Centralizes all animation constants to avoid polluting components.
 */

/** Cubic-bezier easing: ease-out-expo – smooth deceleration at end */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Ease-out-cubic – gentler deceleration, better for 3D rotations */
export const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1] as const;

/** No-op transition when prefers-reduced-motion */
export const NO_MOTION = { duration: 0 } as const;

/** Page transition duration in ms – used for scroll delays (e.g. HomePage scroll-to-section) */
export const PAGE_TRANSITION_DURATION_MS = 450;

/** Build transition with custom duration (respects EASE) */
export function createTransition(duration: number, ease: readonly [number, number, number, number] = EASE) {
  return { duration, ease } as const;
}

/* ========================================================================== */
/* VARIANTS – fade, scale, stagger containers                                 */
/* ========================================================================== */

/** Fade in + slide up (20px) – hero, blog post header */
export const fadeInUp20 = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const;

/** Fade in + slide up (30px) – sections, lists */
export const fadeInUp30 = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
} as const;

/** Fade in + rotate on Y axis – project cards (flip-in effect) */
export const cardRotateIn = {
  hidden: { opacity: 0, rotateY: -35 },
  visible: { opacity: 1, rotateY: 0 },
} as const;

/** Fade in + scale – project cards (no position change) */
export const cardScaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
} as const;

/** Scale in – hero profile image */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
} as const;

/** Underline draw-in – bar under name (scaleX from left) */
export const underlineDrawIn = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: { opacity: 1, scaleX: 1 },
} as const;

/** Status dot ping – subtle ring pulse for availability indicator */
export const statusDotPing = {
  hidden: { opacity: 0.6, scale: 1 },
  visible: {
    opacity: [0.6, 0],
    scale: [1, 1.8],
    transition: { duration: 1.5, repeat: Infinity, repeatDelay: 1.2 },
  },
};

/** Logo entrance – career timeline company logos */
export const logoIn = {
  hidden: { opacity: 0, scale: 0.8, x: -8 },
  visible: { opacity: 1, scale: 1, x: 0 },
} as const;

/** Stagger container factory */
function staggerContainer(staggerChildren: number, delayChildren = 0) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren, delayChildren },
    },
  } as const;
}

/** Hero section – tight stagger */
export const containerHero = staggerContainer(0.05, 0);

/** Career timeline – medium stagger */
export const containerCareer = staggerContainer(0.1, 0);

/** Projects grid – medium stagger with delay */
export const containerStagger08 = staggerContainer(0.08, 0.1);

/** Blog list – snappier stagger, minimal delay */
export const containerBlogList = staggerContainer(0.04, 0.02);

/** Blog post, tech stack – tighter stagger */
export const containerStagger06 = staggerContainer(0.06, 0.05);

/** Tech stack categories – stagger with initial delay */
export const containerTechStack = staggerContainer(0.06, 0.1);

/* ========================================================================== */
/* PAGE TRANSITION – route change animation                                  */
/* ========================================================================== */

/** Page enter/exit – fade + slide + subtle blur for depth */
export const pageTransition = {
  initial: { opacity: 0, y: 12, filter: 'blur(2px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(2px)' },
} as const;
