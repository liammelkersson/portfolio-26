/**
 * Picks a random index that differs from the previous one, so every roll
 * visibly changes. `previousIndex` is null before the first roll.
 */
export function pickDifferentIndex(
	count: number,
	previousIndex: number | null,
	random: () => number = Math.random
): number {
	if (previousIndex === null || count < 2) return Math.floor(random() * count);
	const offset = 1 + Math.floor(random() * (count - 1));
	return (previousIndex + offset) % count;
}
