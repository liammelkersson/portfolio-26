<script lang="ts">
	import {
		IMDB_RATINGS_URL,
		MOVIES_UPDATED_ON,
		movies,
		recentlyRatedMovies
	} from '$lib/data/movies';
	import OnePageSection from './OnePageSection.svelte';
	import MoreLink from './MoreLink.svelte';
	import MediaCarousel from './MediaCarousel.svelte';
	import MediaCover from './MediaCover.svelte';

	const recentMovies = recentlyRatedMovies(movies);
</script>

<OnePageSection title="Recent movies" updatedOn={MOVIES_UPDATED_ON}>
	{#snippet action()}
		<MoreLink href={IMDB_RATINGS_URL} label="imdb" icon="/icons/imdb-badge.webp" />
	{/snippet}
	<MediaCarousel label="Recent movies">
		{#each recentMovies as movie (movie.imdbId)}
			<li class="text-sm">
				<a
					href="https://www.imdb.com/title/{movie.imdbId}/"
					target="_blank"
					rel="noopener noreferrer"
					class="block transition-opacity hover:opacity-80"
				>
					<MediaCover src={movie.posterUrl} alt="{movie.title} poster" fallbackTitle={movie.title} />
					<p class="mt-2 leading-snug">{movie.title} ({movie.year})</p>
					<p class="leading-snug opacity-50">★ {movie.rating}</p>
				</a>
			</li>
		{/each}
	</MediaCarousel>
</OnePageSection>
