import type { Attachment } from 'svelte/attachments';

const VISIBLE_THRESHOLD = 0.1;

export const reveal = (delayMs = 0): Attachment<HTMLElement> => {
	return (element) => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		element.classList.add('reveal-hidden');
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						element.style.transitionDelay = `${delayMs}ms`;
						element.classList.add('reveal-visible');
						observer.disconnect();
					}
				}
			},
			{ threshold: VISIBLE_THRESHOLD }
		);
		observer.observe(element);

		return () => observer.disconnect();
	};
};
