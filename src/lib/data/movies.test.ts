import { describe, expect, test } from 'vitest';
import { recentlyRatedMovies, type Movie } from './movies';

function movieTitled(title: string): Movie {
	return { title, year: 2000, rating: 7, imdbId: 'tt0000000' };
}

describe('recently rated movies', () => {
	test('shows the first ten listed, keeping newest-rated first', () => {
		const movies = Array.from({ length: 12 }, (_, listIndex) => movieTitled(`Movie ${listIndex + 1}`));

		const titles = recentlyRatedMovies(movies).map((movie) => movie.title);

		expect(titles).toHaveLength(10);
		expect(titles[0]).toBe('Movie 1');
		expect(titles.at(-1)).toBe('Movie 10');
	});
});
