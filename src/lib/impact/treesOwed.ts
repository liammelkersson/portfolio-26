// Rounds up rather than down: any emissions past 0g already owe a tree, so the
// site is never carrying un-offset emissions while waiting to cross a full
// gramsPerTree threshold.
export function treesOwed(cumulativeGrams: number, treesPurchased: number, gramsPerTree: number): number {
	const treesEarned = Math.ceil(cumulativeGrams / gramsPerTree);
	return Math.max(0, treesEarned - treesPurchased);
}
