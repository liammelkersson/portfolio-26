import { describe, expect, it } from 'vitest';
import { treesOwed } from './treesOwed';

describe('treesOwed', () => {
	it('returns 0 when cumulative CO2 is below one tree', () => {
		expect(treesOwed(10000, 0, 22000)).toBe(0);
	});

	it('returns the number of whole trees owed beyond what has been purchased', () => {
		expect(treesOwed(66000, 1, 22000)).toBe(2);
	});

	it('never returns negative when purchases are ahead of emissions', () => {
		expect(treesOwed(1000, 5, 22000)).toBe(0);
	});
});
