import type { TravelStamp } from '$lib/data/travelStamps';

const STAMPS_PER_PAGE = 2;
const PAGES_PER_SPREAD = 2;
const MIN_SPREADS = 3;

export type StampPage = TravelStamp[];

/**
 * Stamp pages follow the identity page, which sits inside the front cover.
 * Returns an odd page count so that together with the identity page every
 * spread is full.
 */
export function paginateStamps(stamps: TravelStamp[]): StampPage[] {
	const filledPages: StampPage[] = [];
	for (let start = 0; start < stamps.length; start += STAMPS_PER_PAGE) {
		filledPages.push(stamps.slice(start, start + STAMPS_PER_PAGE));
	}
	const spreads = Math.max(MIN_SPREADS, Math.ceil((filledPages.length + 1) / PAGES_PER_SPREAD));
	const stampPageCount = spreads * PAGES_PER_SPREAD - 1;
	return Array.from({ length: stampPageCount }, (_, pageIndex) => filledPages[pageIndex] ?? []);
}

export function spreadCountFor(stampPages: StampPage[]): number {
	return (stampPages.length + 1) / PAGES_PER_SPREAD;
}

/** Spread 1 shows the identity page and stamp page 0; each later spread shows two stamp pages. */
export function spreadOfStampPage(stampPageIndex: number): number {
	return Math.floor((stampPageIndex + 1) / PAGES_PER_SPREAD) + 1;
}
