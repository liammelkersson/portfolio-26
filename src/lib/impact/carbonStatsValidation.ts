const MAX_PLAUSIBLE_GRAMS_PER_VIEW = 1000;

export function isPlausibleGramsPerView(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= MAX_PLAUSIBLE_GRAMS_PER_VIEW;
}

export function isPlausiblePercentile(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100;
}
