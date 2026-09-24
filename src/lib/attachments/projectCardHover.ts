import { animate, hover } from 'motion';
import type { Attachment } from 'svelte/attachments';
import { motionTransition } from '$lib/motion/reducedMotion';

const IMAGE_SELECTOR = 'img';
const CARD_SPRING = { type: 'spring', stiffness: 300, damping: 24 } as const;
const LIFT_PX = -6;
const IMAGE_HOVER_SCALE = 1.03;

/** Lifts a project card and springs its thumbnail up in scale on hover. */
export const projectCardHover = (): Attachment<HTMLElement> => {
	return (element) => {
		const image = element.querySelector<HTMLElement>(IMAGE_SELECTOR);

		return hover(element, () => {
			const transition = motionTransition(CARD_SPRING);
			animate(element, { y: LIFT_PX }, transition);
			if (image) animate(image, { scale: IMAGE_HOVER_SCALE }, transition);

			return () => {
				const outTransition = motionTransition(CARD_SPRING);
				animate(element, { y: 0 }, outTransition);
				if (image) animate(image, { scale: 1 }, outTransition);
			};
		});
	};
};
