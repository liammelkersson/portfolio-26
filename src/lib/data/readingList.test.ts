import { describe, expect, test } from 'vitest';
import { booksOnShelf, type Book, type ReadingList } from './readingList';

function bookTitled(title: string): Book {
	return {
		title,
		author: 'Author',
		widthCm: 13,
		heightCm: 20,
		thicknessCm: 2,
		spineColor: '#000',
		spineTextColor: '#fff'
	};
}

describe('bookshelf order', () => {
	test('stands the book being read first, then finished books in their listed order', () => {
		const list: ReadingList = {
			current: bookTitled('Now'),
			finished: [bookTitled('First'), bookTitled('Second')]
		};

		expect(booksOnShelf(list).map((book) => book.title)).toEqual(['Now', 'First', 'Second']);
	});
});
