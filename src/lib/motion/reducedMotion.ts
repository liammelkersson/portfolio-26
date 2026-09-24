const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const prefersReducedMotion = () =>
	typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches;

/** Swaps a spring transition for an instant one when the user prefers reduced motion. */
export const motionTransition = <T extends object>(transition: T): T | { duration: 0 } =>
	prefersReducedMotion() ? { duration: 0 } : transition;
