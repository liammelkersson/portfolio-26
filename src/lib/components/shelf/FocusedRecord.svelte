<script lang="ts">
	import type { Vinyl } from '$lib/data/vinyls';
	import FocusStage from '$lib/components/shelf/FocusStage.svelte';
	import RecordSleeve from '$lib/components/shelf/RecordSleeve.svelte';

	let {
		vinyl,
		origin,
		onClosed
	}: { vinyl: Vinyl; origin: HTMLElement; onClosed: () => void } = $props();
</script>

<FocusStage label="{vinyl.title} by {vinyl.artist}" {origin} {onClosed}>
	{#snippet object(isRevealed)}
		<span class="focused-sleeve">
			<RecordSleeve {vinyl} recordOut={isRevealed} />
		</span>
	{/snippet}
	{#snippet info()}
		<h2 class="text-2xl font-normal tracking-tight sm:text-3xl">{vinyl.title}</h2>
		<p class="mt-2 opacity-70">{vinyl.artist}</p>
		{#if vinyl.note}
			<p class="mt-4 max-w-xs text-sm opacity-80">{vinyl.note}</p>
		{/if}
	{/snippet}
	{#snippet actions()}
		<a
			href={vinyl.spotifyUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="rounded-full bg-neutral-900 px-5 py-2.5 text-sm text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-neutral-900"
		>
			Listen on Spotify
		</a>
	{/snippet}
</FocusStage>

<style>
	.focused-sleeve {
		--sleeve-thickness: 4cqw;
		--record-slide: 42%;
		--sleeve-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.45);
		container-type: inline-size;
		display: block;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
	}
</style>
