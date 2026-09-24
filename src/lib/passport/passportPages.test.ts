import { describe, expect, test } from 'vitest';
import type { TravelStamp } from '$lib/data/travelStamps';
import { paginateStamps, spreadCountFor, spreadOfStampPage } from './passportPages';

function stampFor(place: string): TravelStamp {
	return { place, date: 'May 2025', imageUrl: `/stamps/${place}.webp`, tiltDeg: 0 };
}

describe('passport pagination', () => {
	test('places two stamps per page in travel order', () => {
		const pages = paginateStamps(['a', 'b', 'c'].map(stampFor));

		expect(pages[0].map((stamp) => stamp.place)).toEqual(['a', 'b']);
		expect(pages[1].map((stamp) => stamp.place)).toEqual(['c']);
	});

	test('keeps a sparse passport at three full spreads of blank visa pages', () => {
		const pages = paginateStamps([stampFor('a')]);

		expect(spreadCountFor(pages)).toBe(3);
		expect(pages.slice(1).every((page) => page.length === 0)).toBe(true);
	});

	test('grows by whole spreads when stamps outgrow the minimum', () => {
		const stamps = Array.from({ length: 11 }, (_, index) => stampFor(`place-${index}`));

		expect(spreadCountFor(paginateStamps(stamps))).toBe(4);
	});

	test('shows the first stamp page opposite the identity page', () => {
		expect(spreadOfStampPage(0)).toBe(1);
		expect(spreadOfStampPage(1)).toBe(2);
		expect(spreadOfStampPage(2)).toBe(2);
	});
});
