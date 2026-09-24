export interface Movie {
	title: string;
	year: number;
	/** IMDb rating, 1–10 */
	rating: number;
	imdbId: string;
	/** Fetched with `node --env-file=.env scripts/fetch-media.js movie <imdbId>` */
	posterUrl?: string;
}

export const IMDB_RATINGS_URL = 'https://www.imdb.com/user/p.m5offwgsw6skfk2i24rwgspupi/ratings/';

/** ISO date, YYYY-MM-DD — bump when the list changes */
export const MOVIES_UPDATED_ON = '2026-09-24';

const RECENT_MOVIE_COUNT = 10;

/** Newest rating first */
export const movies: Movie[] = [
	{
		title: 'Killers of the Flower Moon',
		year: 2023,
		rating: 5,
		imdbId: 'tt5537002',
		posterUrl: '/movies/tt5537002.webp'
	},
	{
		title: 'The King’s Speech',
		year: 2010,
		rating: 7,
		imdbId: 'tt1504320',
		posterUrl: '/movies/tt1504320.webp'
	},
	{
		title: 'The Fighter',
		year: 2010,
		rating: 7,
		imdbId: 'tt0964517',
		posterUrl: '/movies/tt0964517.webp'
	},
	{
		title: 'Parasite',
		year: 2019,
		rating: 6,
		imdbId: 'tt6751668',
		posterUrl: '/movies/tt6751668.webp'
	},
	{
		title: 'Black Swan',
		year: 2010,
		rating: 6,
		imdbId: 'tt0947798',
		posterUrl: '/movies/tt0947798.webp'
	},
	{
		title: 'The Grand Budapest Hotel',
		year: 2014,
		rating: 7,
		imdbId: 'tt2278388',
		posterUrl: '/movies/tt2278388.webp'
	},
	{
		title: 'Trainspotting',
		year: 1996,
		rating: 8,
		imdbId: 'tt0117951',
		posterUrl: '/movies/tt0117951.webp'
	},
	{
		title: 'The Revenant',
		year: 2015,
		rating: 8,
		imdbId: 'tt1663202',
		posterUrl: '/movies/tt1663202.webp'
	},
	{
		title: 'The Drama',
		year: 2026,
		rating: 6,
		imdbId: 'tt33071426',
		posterUrl: '/movies/tt33071426.webp'
	},
	{
		title: 'Neon Genesis Evangelion: The End of Evangelion',
		year: 1997,
		rating: 5,
		imdbId: 'tt0169858',
		posterUrl: '/movies/tt0169858.webp'
	}
];

export function recentlyRatedMovies(list: Movie[]): Movie[] {
	return list.slice(0, RECENT_MOVIE_COUNT);
}
