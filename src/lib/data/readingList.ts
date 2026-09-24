export interface Book {
	title: string;
	author: string;
	coverUrl: string;
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
		coverUrl: '/books/the-count-of-monte-cristo-200.webp'
	},
	finished: [
		{
			title: 'The Stranger',
			author: 'Albert Camus',
			coverUrl: '/books/the-stranger-vintage-200.webp'
		},
		{
			title: 'The Metamorphosis',
			author: 'Franz Kafka',
			coverUrl: '/books/the-metamorphosis-200.webp'
		},
		{
			title: 'Frankenstein',
			author: 'Mary Shelley',
			coverUrl: '/books/frankenstein-1818-200.webp'
		},
		{
			title: 'The Creative Act',
			author: 'Rick Rubin',
			coverUrl: '/books/the-creative-act-200.webp'
		},
		{
			title: 'The Practice of Not Thinking',
			author: 'Ryunosuke Koike',
			coverUrl: '/books/the-practice-of-not-thinking-200.webp'
		}
	]
};

/** The book being read now comes first, then finished books in listed order. */
export function recentBooks(list: ReadingList): Book[] {
	return [list.current, ...list.finished];
}
