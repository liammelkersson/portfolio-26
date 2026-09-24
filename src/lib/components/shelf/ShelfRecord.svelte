<script lang="ts">
	import type { Vinyl } from '$lib/data/vinyls';
	import RecordSleeve from '$lib/components/shelf/RecordSleeve.svelte';

	let {
		vinyl,
		recordIndex,
		isHighlighted,
		isAway,
		onOpen
	}: {
		vinyl: Vinyl;
		recordIndex: number;
		isHighlighted: boolean;
		isAway: boolean;
		onOpen: (sleeve: HTMLElement) => void;
	} = $props();

	let button: HTMLButtonElement;
</script>

<button
	bind:this={button}
	type="button"
	onclick={() => onOpen(button)}
	aria-label="Open {vinyl.title} by {vinyl.artist}"
	data-record-index={recordIndex}
	class="shelf-record cursor-pointer"
	class:is-highlighted={isHighlighted}
	class:is-away={isAway}
>
	<span class="lean">
		<RecordSleeve {vinyl} recordOut={isHighlighted} />
	</span>
</button>

<style>
	/* The button stays flat and still so its hit area never moves; only the sleeve inside leans and lifts */
	.shelf-record {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 1;
		transform-style: preserve-3d;
	}

	/* Leans back against the wall from its bottom edge, which rests on the shelf */
	.lean {
		--sleeve-thickness: 1.3cqw;
		--record-slide: 22%;
		--sleeve-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 12px 18px -4px rgba(0, 0, 0, 0.3);
		position: absolute;
		inset: 0;
		display: block;
		pointer-events: none;
		transform-origin: 50% 100%;
		transform: rotateX(9deg);
		transform-style: preserve-3d;
		transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.shelf-record:hover .lean,
	.shelf-record:focus-visible .lean,
	.shelf-record.is-highlighted .lean {
		transform: rotateX(3deg) translateZ(1.5cqw);
	}

	.shelf-record:hover :global(.record),
	.shelf-record:focus-visible :global(.record) {
		translate: var(--record-slide) 0;
	}

	.is-away {
		visibility: hidden;
	}

	@media (prefers-reduced-motion: reduce) {
		.lean {
			transition: none;
		}
	}
</style>
