import { describe, expect, it } from 'vitest';
import { isPlausibleGramsPerView, isPlausiblePercentile } from './carbonStatsValidation';

describe('isPlausibleGramsPerView', () => {
	it('accepts a realistic value', () => {
		expect(isPlausibleGramsPerView(1.39)).toBe(true);
	});

	it('rejects zero, negative, and implausibly large values', () => {
		expect(isPlausibleGramsPerView(0)).toBe(false);
		expect(isPlausibleGramsPerView(-1)).toBe(false);
		expect(isPlausibleGramsPerView(5000)).toBe(false);
	});

	it('rejects non-finite and non-number values', () => {
		expect(isPlausibleGramsPerView(NaN)).toBe(false);
		expect(isPlausibleGramsPerView('1.39')).toBe(false);
	});
});

describe('isPlausiblePercentile', () => {
	it('accepts values within 0-100', () => {
		expect(isPlausiblePercentile(0)).toBe(true);
		expect(isPlausiblePercentile(17)).toBe(true);
		expect(isPlausiblePercentile(100)).toBe(true);
	});

	it('rejects values outside 0-100', () => {
		expect(isPlausiblePercentile(-1)).toBe(false);
		expect(isPlausiblePercentile(101)).toBe(false);
	});
});
