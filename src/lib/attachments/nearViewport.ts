import type { Attachment } from 'svelte/attachments';

const PRELOAD_MARGIN = '400px';

export const nearViewport = (onNear: () => void): Attachment<HTMLElement> => {
	return (element) => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					onNear();
					observer.disconnect();
				}
			},
			{ rootMargin: PRELOAD_MARGIN }
		);
		observer.observe(element);

		return () => observer.disconnect();
	};
};
