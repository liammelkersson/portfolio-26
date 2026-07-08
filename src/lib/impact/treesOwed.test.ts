import { describe, expect, it } from 'vitest';
import { treesOwed } from './treesOwed';

describe('treesOwed', () => {
	it('owes 0 when there are no emissions yet', () => {
		expect(treesOwed(0, 0, 22000)).toBe(0);
	});

	it('rounds up: any emissions short of a full tree still owe one', () => {
		expect(treesOwed(10000, 0, 22000)).toBe(1);
	});

	it('owes exactly the whole-tree count on an exact multiple', () => {
		expect(treesOwed(66000, 1, 22000)).toBe(2);
	});

	it('rounds the remainder up past a whole multiple', () => {
		expect(treesOwed(66001, 1, 22000)).toBe(3);
	});

	it('never returns negative when purchases are ahead of emissions', () => {
		expect(treesOwed(1000, 5, 22000)).toBe(0);
	});
});
