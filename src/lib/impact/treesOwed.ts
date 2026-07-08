export function treesOwed(cumulativeGrams: number, treesPurchased: number, gramsPerTree: number): number {
	const treesEarned = Math.floor(cumulativeGrams / gramsPerTree);
	return Math.max(0, treesEarned - treesPurchased);
}
