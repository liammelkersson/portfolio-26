import { describe, expect, test } from 'vitest';
import { depthFromFront } from './photoStack';

describe('photo stack', () => {
	test('puts the front photo at depth 0, with the next photo right behind it', () => {
		const depthsWhenSecondIsFront = [0, 1, 2].map((photoIndex) => depthFromFront(photoIndex, 1, 3));

		expect(depthsWhenSecondIsFront).toEqual([2, 0, 1]);
	});
});
