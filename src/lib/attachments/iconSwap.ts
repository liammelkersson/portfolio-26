import { animate } from 'motion';
import type { Attachment } from 'svelte/attachments';
import { motionTransition } from '$lib/motion/reducedMotion';

const ICON_SELECTOR = '[data-icon]';
const SWAP_SPRING = { type: 'spring', stiffness: 400, damping: 28 } as const;
const INACTIVE_SCALE = 0.5;

// Elements are keyed by reference so each gets its own "already painted once"
// memory — the first swap after mount should snap instantly, not animate in.
const paintedElements = new WeakSet<HTMLElement>();

/**
 * Morphs between sibling `[data-icon]` elements inside `element`, showing the
 * one whose `data-icon` matches `activeKey` and hiding the rest.
 */
export const iconSwap = (activeKey: string): Attachment<HTMLElement> => {
	return (element) => {
		const icons = element.querySelectorAll<HTMLElement>(ICON_SELECTOR);
		const isFirstPaint = !paintedElements.has(element);
		paintedElements.add(element);
		const transition = isFirstPaint ? { duration: 0 } : motionTransition(SWAP_SPRING);

		for (const icon of icons) {
			const isActive = icon.dataset.icon === activeKey;
			animate(
				icon,
				{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : INACTIVE_SCALE },
				transition
			);
		}
	};
};
