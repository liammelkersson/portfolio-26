const BYTES_CACHE_KEY = 'homepage-bytes';

// Only the homepage's weight is measured — it's the canonical "this website
// consumes X grams" figure; measuring every route would give inconsistent
// numbers depending on which page a visitor happened to land on.
export function recordHomepageWeight(): void {
	if (location.pathname !== '/') return;
	if (typeof performance === 'undefined') return;

	window.addEventListener('load', () => {
		const resourceBytes = performance
			.getEntriesByType('resource')
			.reduce((sum, entry) => sum + (entry as PerformanceResourceTiming).transferSize, 0);
		const navigationEntry = performance.getEntriesByType('navigation')[0] as
			| PerformanceNavigationTiming
			| undefined;
		const totalBytes = resourceBytes + (navigationEntry?.transferSize ?? 0);
		if (totalBytes > 0) {
			localStorage.setItem(BYTES_CACHE_KEY, String(Math.round(totalBytes)));
		}
	});
}

export function getCachedPageBytes(): number | null {
	const raw = localStorage.getItem(BYTES_CACHE_KEY);
	return raw ? Number(raw) : null;
}
