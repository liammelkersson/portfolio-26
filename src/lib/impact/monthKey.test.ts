import { describe, expect, it } from 'vitest';
import { monthKey } from './monthKey';

describe('monthKey', () => {
	it('formats as YYYY-MM using UTC', () => {
		expect(monthKey(new Date('2026-07-08T00:00:00Z'))).toBe('2026-07');
	});

	it('zero-pads single-digit months', () => {
		expect(monthKey(new Date('2026-01-15T12:00:00Z'))).toBe('2026-01');
	});
});
