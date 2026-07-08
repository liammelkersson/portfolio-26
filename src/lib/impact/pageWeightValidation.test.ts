import { describe, expect, it } from 'vitest';
import { isPlausibleByteCount } from './pageWeightValidation';

describe('isPlausibleByteCount', () => {
	it('accepts a realistic byte count', () => {
		expect(isPlausibleByteCount(500000)).toBe(true);
	});

	it('rejects zero and negative values', () => {
		expect(isPlausibleByteCount(0)).toBe(false);
		expect(isPlausibleByteCount(-1)).toBe(false);
	});

	it('rejects non-finite values', () => {
		expect(isPlausibleByteCount(NaN)).toBe(false);
		expect(isPlausibleByteCount(Infinity)).toBe(false);
	});

	it('rejects implausibly large values', () => {
		expect(isPlausibleByteCount(100_000_000)).toBe(false);
	});

	it('rejects non-number types', () => {
		expect(isPlausibleByteCount('500000')).toBe(false);
		expect(isPlausibleByteCount(null)).toBe(false);
		expect(isPlausibleByteCount(undefined)).toBe(false);
	});
});
