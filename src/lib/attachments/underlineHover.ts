import { animate, hover } from 'motion';
import type { Attachment } from 'svelte/attachments';
import { motionTransition } from '$lib/motion/reducedMotion';

const UNDERLINE_SELECTOR = '[data-underline]';
const UNDERLINE_SPRING = { type: 'spring', stiffness: 400, damping: 30 } as const;

/** Reveals a `[data-underline]` child span, scaling in from the left, on hover. */
export const underlineHover = (): Attachment<HTMLElement> => {
	return (element) => {
		const underline = element.querySelector<HTMLElement>(UNDERLINE_SELECTOR);
		if (!underline) return;

		return hover(element, () => {
			animate(underline, { scaleX: 1 }, motionTransition(UNDERLINE_SPRING));
			return () => {
				animate(underline, { scaleX: 0 }, motionTransition(UNDERLINE_SPRING));
			};
		});
	};
};
