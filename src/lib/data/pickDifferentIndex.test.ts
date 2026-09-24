import { describe, expect, test } from 'vitest';
import { pickDifferentIndex } from './pickDifferentIndex';

describe('fun fact rolls', () => {
	test('never repeat the fact that was just shown', () => {
		const factCount = 5;
		for (let previousIndex = 0; previousIndex < factCount; previousIndex++) {
			for (const roll of [0, 0.25, 0.5, 0.75, 0.999]) {
				expect(pickDifferentIndex(factCount, previousIndex, () => roll)).not.toBe(previousIndex);
			}
		}
	});

	test('stay within the list of facts', () => {
		expect(pickDifferentIndex(5, 4, () => 0.999)).toBeLessThan(5);
		expect(pickDifferentIndex(5, null, () => 0.999)).toBeLessThan(5);
	});
});
