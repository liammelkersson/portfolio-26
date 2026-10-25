import { describe, expect, test } from 'vitest';
import { recentBooks, type Book, type ReadingList } from './readingList';

function bookTitled(title: string): Book {
	return { title, author: 'Author', coverUrl: '/books/cover.webp' };
}

describe('recent books order', () => {
	test('shows the books being read first, then finished books in their listed order', () => {
		const list: ReadingList = {
			current: [bookTitled('Now'), bookTitled('Also now')],
			finished: [bookTitled('First'), bookTitled('Second')]
		};

		expect(recentBooks(list).map((book) => book.title)).toEqual(['Now', 'Also now', 'First', 'Second']);
	});
});
