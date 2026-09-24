// Downloads cover art into static/ so the site never hotlinks (CSP img-src 'self').
//   node --env-file=.env scripts/fetch-media.js movie <imdbId>
//   node scripts/fetch-media.js playlist <spotifyPlaylistId> <slug>
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TMDB_FIND_URL = 'https://api.themoviedb.org/3/find';
const TMDB_POSTER_URL = 'https://image.tmdb.org/t/p/w342';
const SPOTIFY_OEMBED_URL = 'https://open.spotify.com/oembed';
const WEBP_QUALITY = '80';
const COVER_WIDTH_PX = '240';

async function jsonFrom(url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${response.status} ${url}`);
	return response.json();
}

async function saveAsWebp(imageUrl, outputPath) {
	const response = await fetch(imageUrl);
	if (!response.ok) throw new Error(`${response.status} ${imageUrl}`);
	const sourcePath = `${outputPath}.source`;
	writeFileSync(sourcePath, Buffer.from(await response.arrayBuffer()));
	execFileSync('cwebp', ['-quiet', '-q', WEBP_QUALITY, '-resize', COVER_WIDTH_PX, '0', sourcePath, '-o', outputPath]);
	rmSync(sourcePath);
	console.log(`saved ${outputPath}`);
}

async function fetchMoviePoster(imdbId) {
	const apiKey = process.env.TMDB_API_KEY;
	if (!apiKey) throw new Error('TMDB_API_KEY missing — add it to .env');
	const found = await jsonFrom(`${TMDB_FIND_URL}/${imdbId}?external_source=imdb_id&api_key=${apiKey}`);
	const [title] = [...found.movie_results, ...found.tv_results];
	if (!title?.poster_path) throw new Error(`no TMDB poster for ${imdbId}`);
	mkdirSync('static/movies', { recursive: true });
	await saveAsWebp(`${TMDB_POSTER_URL}${title.poster_path}`, join('static/movies', `${imdbId}.webp`));
}

async function fetchPlaylistCover(playlistId, slug) {
	const playlistUrl = `https://open.spotify.com/playlist/${playlistId}`;
	const embed = await jsonFrom(`${SPOTIFY_OEMBED_URL}?url=${encodeURIComponent(playlistUrl)}`);
	mkdirSync('static/playlists', { recursive: true });
	await saveAsWebp(embed.thumbnail_url, join('static/playlists', `${slug}.webp`));
}

const mediaFetchers = { movie: fetchMoviePoster, playlist: fetchPlaylistCover };
const [kind, ...fetchArgs] = process.argv.slice(2);
const fetchMedia = mediaFetchers[kind];
if (!fetchMedia) throw new Error(`usage: fetch-media.js <${Object.keys(mediaFetchers).join('|')}> <id> [slug]`);
await fetchMedia(...fetchArgs);
