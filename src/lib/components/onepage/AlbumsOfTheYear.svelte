<script lang="ts">
	import { albumsOfTheYear, ALBUMS_OF_THE_YEAR_UPDATED_ON } from '$lib/data/albumsOfTheYear';
	import OnePageSection from './OnePageSection.svelte';
	import MoreLink from './MoreLink.svelte';

	const SPOTIFY_PROFILE_URL = 'https://open.spotify.com/user/liammelkersson';
</script>

<OnePageSection title="Albums of the year" updatedOn={ALBUMS_OF_THE_YEAR_UPDATED_ON}>
	{#snippet action()}
		<MoreLink href={SPOTIFY_PROFILE_URL} label="spotify" icon="/icons/spotify.svg" />
	{/snippet}
	<ul class="grid grid-cols-3 gap-4" aria-label="Albums of the year playlists">
		{#each albumsOfTheYear as playlist (playlist.year)}
			<li class="text-sm">
				<a
					href={playlist.url}
					target="_blank"
					rel="noopener noreferrer"
					class="block transition-opacity hover:opacity-80"
				>
					<img
						src={playlist.coverUrl}
						alt="Albums of the year {playlist.year} playlist cover"
						width="240"
						height="240"
						loading="lazy"
						class="aspect-square w-full rounded-xs object-cover shadow-md"
					/>
					<p class="mt-2 leading-snug">{playlist.year}</p>
				</a>
			</li>
		{/each}
	</ul>
</OnePageSection>
