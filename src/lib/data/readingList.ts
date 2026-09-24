export interface Book {
	title: string;
	author: string;
	/** Small cover for the homepage row */
	thumbnailUrl?: string;
	/** Full cover for the bookshelf; without one the cover is typeset from the title */
	coverUrl?: string;
	widthCm: number;
	heightCm: number;
	thicknessCm: number;
	spineColor: string;
	spineTextColor: string;
	note?: string;
	startedOn?: string;
}

export interface ReadingList {
	current: Book;
	finished: Book[];
}

/** ISO date, YYYY-MM-DD — bump when the list changes */
export const READING_LIST_UPDATED_ON = '2026-09-24';

export const readingList: ReadingList = {
	current: {
		title: 'The Count of Monte Cristo',
		author: 'Alexandre Dumas',
		thumbnailUrl: '/books/the-count-of-monte-cristo.webp',
		coverUrl: '/books/the-count-of-monte-cristo-480.webp',
		widthCm: 12.9,
		heightCm: 19.8,
		thicknessCm: 5.2,
		spineColor: '#141414',
		spineTextColor: '#f4f1ea',
		startedOn: 'September 2026'
	},
	finished: [
		{
			title: 'The Stranger',
			author: 'Albert Camus',
			coverUrl: '/books/the-stranger-vintage.webp',
			widthCm: 13.2,
			heightCm: 20.3,
			thicknessCm: 1.1,
			spineColor: '#152247',
			spineTextColor: '#f1ece0',
			note: 'My favorite book ever.'
		},
		{
			title: 'The Metamorphosis',
			author: 'Franz Kafka',
			coverUrl: '/books/the-metamorphosis.webp',
			widthCm: 15.2,
			heightCm: 22.9,
			thicknessCm: 0.6,
			spineColor: '#b89b79',
			spineTextColor: '#2a2016'
		},
		{
			title: 'Frankenstein',
			author: 'Mary Shelley',
			coverUrl: '/books/frankenstein-1818.webp',
			widthCm: 12.9,
			heightCm: 19.8,
			thicknessCm: 2.3,
			spineColor: '#151515',
			spineTextColor: '#f1ece0'
		},
		{
			title: 'The Creative Act',
			author: 'Rick Rubin',
			coverUrl: '/books/the-creative-act.webp',
			widthCm: 14.6,
			heightCm: 21.6,
			thicknessCm: 3.3,
			spineColor: '#bbbec5',
			spineTextColor: '#1a1a1a'
		},
		{
			title: 'The Practice of Not Thinking',
			author: 'Ryunosuke Koike',
			coverUrl: '/books/the-practice-of-not-thinking.webp',
			widthCm: 12.9,
			heightCm: 19.8,
			thicknessCm: 1.4,
			spineColor: '#f1eee7',
			spineTextColor: '#2d4a78'
		}
	]
};

/** The book being read now stands first on the shelf, then finished books in listed order. */
export function booksOnShelf(list: ReadingList): Book[] {
	return [list.current, ...list.finished];
}
