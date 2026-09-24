import { describe, expect, test } from 'vitest';
import { impactFiguresFrom, totalKgEmitted, treesStillOwed } from './impactFigures';
import { GRAMS_PER_TREE } from './config';

function loaded<Value>(value: Value): PromiseFulfilledResult<Value> {
	return { status: 'fulfilled', value };
}

const failed: PromiseRejectedResult = { status: 'rejected', reason: new Error('offline') };

describe('impact figures', () => {
	test('keeps the figures that loaded when another source fails', () => {
		const figures = impactFiguresFrom([loaded({ c: 0.08, p: 90 }), failed, loaded({ total: 3, pending: 1 })]);

		expect(figures).toEqual({ gramsPerView: 0.08, visits: null, treesPlanted: 4 });
		expect(totalKgEmitted(figures)).toBeNull();
	});

	test('totals emissions across all visits in kilograms', () => {
		const figures = { gramsPerView: 0.5, visits: 4000, treesPlanted: 0 };

		expect(totalKgEmitted(figures)).toBe(2);
	});

	test('owes a tree once emissions pass what planted trees offset', () => {
		const figures = { gramsPerView: 1, visits: GRAMS_PER_TREE + 1, treesPlanted: 0 };

		expect(treesStillOwed(figures)).toBeGreaterThan(0);
	});
});
