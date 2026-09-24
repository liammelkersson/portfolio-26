import { animate, press } from 'motion';
import type { Attachment } from 'svelte/attachments';
import { motionTransition } from '$lib/motion/reducedMotion';

const PRESS_SCALE = 0.97;
const PRESS_SPRING = { type: 'spring', stiffness: 500, damping: 30 } as const;

/** Scales an element down on press, springing back on release. */
export const pressScale = (scale = PRESS_SCALE): Attachment<HTMLElement> => {
	return (element) => {
		return press(element, () => {
			animate(element, { scale }, motionTransition(PRESS_SPRING));
			return () => {
				animate(element, { scale: 1 }, motionTransition(PRESS_SPRING));
			};
		});
	};
};
