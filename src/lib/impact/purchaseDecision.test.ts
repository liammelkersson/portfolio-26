import { describe, expect, it } from 'vitest';
import { purchasesThisMonthCount, shouldPurchaseTree, type PurchaseState } from './purchaseDecision';

describe('purchasesThisMonthCount', () => {
	it('returns 0 when there is no prior state', () => {
		expect(purchasesThisMonthCount(null, '2026-07')).toBe(0);
	});

	it('returns 0 when the stored month does not match the current month', () => {
		const state: PurchaseState = { lastPurchaseMonth: '2026-06', purchasesThisMonth: 1 };
		expect(purchasesThisMonthCount(state, '2026-07')).toBe(0);
	});

	it('returns the stored count when the month matches', () => {
		const state: PurchaseState = { lastPurchaseMonth: '2026-07', purchasesThisMonth: 1 };
		expect(purchasesThisMonthCount(state, '2026-07')).toBe(1);
	});
});

describe('shouldPurchaseTree', () => {
	it('is true when trees are owed and the monthly cap is not reached', () => {
		expect(shouldPurchaseTree(1, 0)).toBe(true);
	});

	it('is false when no trees are owed', () => {
		expect(shouldPurchaseTree(0, 0)).toBe(false);
	});

	it('is false when the monthly cap is already reached', () => {
		expect(shouldPurchaseTree(3, 1)).toBe(false);
	});
});
