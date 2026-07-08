export type PurchaseState = {
	lastPurchaseMonth: string | null;
	purchasesThisMonth: number;
};

export function purchasesThisMonthCount(state: PurchaseState | null, currentMonth: string): number {
	if (!state || state.lastPurchaseMonth !== currentMonth) return 0;
	return state.purchasesThisMonth;
}

export function shouldPurchaseTree(owedTrees: number, purchasesThisMonth: number): boolean {
	const MONTHLY_CAP = 1;
	return owedTrees >= 1 && purchasesThisMonth < MONTHLY_CAP;
}
