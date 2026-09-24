<script lang="ts">
	import type { Vinyl } from '$lib/data/vinyls';
	import ShelfRecord from '$lib/components/shelf/ShelfRecord.svelte';

	let {
		records,
		highlightedIndex,
		awayIndex,
		onOpen
	}: {
		records: Vinyl[];
		highlightedIndex: number | null;
		awayIndex: number | null;
		onOpen: (recordIndex: number, sleeve: HTMLElement) => void;
	} = $props();
</script>

<div class="shelf-wall">
	<ul class="shelf">
		{#each records as vinyl, recordIndex (vinyl.title)}
			<li>
				<ShelfRecord
					{vinyl}
					{recordIndex}
					isHighlighted={highlightedIndex === recordIndex}
					isAway={awayIndex === recordIndex}
					onOpen={(sleeve) => onOpen(recordIndex, sleeve)}
				/>
			</li>
		{/each}
	</ul>
</div>

<style>
	.shelf-wall {
		container-type: inline-size;
	}

	/*
	 * Every row of covers stands on a floating shelf. The shelves are painted
	 * as a background that repeats once per row, so a half-full last row still
	 * gets a full-width shelf.
	 */
	.shelf {
		--cols: 3;
		--gap: 4cqw;
		--row-gap: 14cqw;
		--cover: calc((86cqw - (var(--cols) - 1) * var(--gap)) / var(--cols));
		--shelf-top: calc(var(--cover) - 0.4cqw);
		--shelf-front: calc(var(--cover) + 0.9cqw);
		--shelf-shadow: calc(var(--cover) + 6cqw);
		--shelf-surface: #fbfbfb;
		--shelf-edge: #ffffff;
		--shelf-underside: rgba(0, 0, 0, 0.16);

		display: grid;
		grid-template-columns: repeat(var(--cols), var(--cover));
		justify-content: center;
		column-gap: var(--gap);
		row-gap: var(--row-gap);
		padding-top: 10cqw;
		perspective: 1100px;
		perspective-origin: 50% 25%;
		background:
			linear-gradient(
				to bottom,
				transparent 0 var(--shelf-top),
				var(--shelf-surface) var(--shelf-top) var(--cover),
				var(--shelf-edge) var(--cover) var(--shelf-front),
				var(--shelf-underside) var(--shelf-front),
				transparent var(--shelf-shadow)
			)
			0 0 / 100% calc(var(--cover) + var(--row-gap)) repeat-y;
		background-origin: content-box;
		background-clip: content-box;
	}

	/* List items pass the shared camera through, so every cover is seen from one viewpoint */
	.shelf > li {
		transform-style: preserve-3d;
	}

	.shelf > li:hover,
	.shelf > li:focus-within {
		z-index: 1;
	}

	/* Empty last row gives the bottom shelf and its shadow room inside the content box */
	.shelf::after {
		content: '';
		grid-column: 1 / -1;
		height: 0;
	}

	:global(html.dark) .shelf {
		--shelf-surface: #3a3a3a;
		--shelf-edge: #474747;
		--shelf-underside: rgba(0, 0, 0, 0.45);
	}

	@media (min-width: 640px) {
		.shelf {
			--cols: 4;
			--gap: 3cqw;
			--row-gap: 11cqw;
			padding-top: 8cqw;
		}
	}

	@media (min-width: 1024px) {
		.shelf {
			--cols: 5;
			--gap: 2.6cqw;
			--row-gap: 9cqw;
			padding-top: 7cqw;
		}
	}
</style>
