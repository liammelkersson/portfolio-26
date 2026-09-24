export interface Playlist {
	title: string;
	url: string;
	placeholder?: boolean;
}

export interface MusicLinks {
	collectionUrl: string;
	playlists: Playlist[];
}

export const musicLinks: MusicLinks = {
	collectionUrl: 'https://www.discogs.com/user/altgirlsimp/collection',
	playlists: [
		{ title: 'On repeat', url: 'https://open.spotify.com/user/liammelkersson', placeholder: true },
		{ title: 'Late nights', url: 'https://open.spotify.com/user/liammelkersson', placeholder: true }
	]
};
