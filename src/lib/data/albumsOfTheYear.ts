export interface AlbumsOfTheYearPlaylist {
	year: number;
	url: string;
	coverUrl: string;
}

/** ISO date, YYYY-MM-DD — bump when the list changes */
export const ALBUMS_OF_THE_YEAR_UPDATED_ON = '2026-09-24';

export const albumsOfTheYear: AlbumsOfTheYearPlaylist[] = [
	{
		year: 2026,
		url: 'https://open.spotify.com/playlist/5gBu1OcSjHbRl4zfZunHVW',
		coverUrl: '/playlists/albums-of-the-year-2026.webp'
	},
	{
		year: 2025,
		url: 'https://open.spotify.com/playlist/4Dz9lVOvHCdGPVq0AQ98TS',
		coverUrl: '/playlists/albums-of-the-year-2025.webp'
	},
	{
		year: 2024,
		url: 'https://open.spotify.com/playlist/4hMd7ay1cJDzUbJgBOG9SI',
		coverUrl: '/playlists/albums-of-the-year-2024.webp'
	}
];
