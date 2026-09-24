<script lang="ts">
	import type { Book } from '$lib/data/readingList';
	import BookBox from '$lib/components/books/BookBox.svelte';

	let {
		book,
		bookIndex,
		isCurrent,
		isAway,
		onOpen
	}: {
		book: Book;
		bookIndex: number;
		isCurrent: boolean;
		isAway: boolean;
		onOpen: (spine: HTMLElement) => void;
	} = $props();

	let button: HTMLButtonElement;
</script>

<button
	bind:this={button}
	type="button"
	onclick={() => onOpen(button)}
	aria-label="Open {book.title} by {book.author}"
	data-book-index={bookIndex}
	class="shelf-book cursor-pointer"
	class:is-away={isAway}
	style="--thickness: {book.thicknessCm}; --height: {book.heightCm}; --width: {book.widthCm}"
>
	<span class="pull">
		<span class="turn">
			<BookBox {book} {isCurrent} />
		</span>
	</span>
</button>

<style>
	/* Flat, still hit area the size of the spine (never thinner than a fingertip) */
	.shelf-book {
		position: relative;
		display: block;
		width: max(calc(var(--thickness) * var(--cm)), 14px);
		height: calc(var(--height) * var(--cm));
		transform-style: preserve-3d;
	}

	.pull {
		position: absolute;
		inset: 0;
		display: block;
		pointer-events: none;
		transform-style: preserve-3d;
		transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.shelf-book:hover .pull,
	.shelf-book:focus-visible .pull {
		transform: translateZ(calc(4 * var(--cm))) translateY(calc(-0.6 * var(--cm)));
	}

	/* The book stands with its spine turned towards the room */
	.turn {
		position: absolute;
		bottom: 0;
		left: 50%;
		display: block;
		width: calc(var(--width) * var(--cm));
		translate: -50% 0;
		transform: rotateY(90deg);
		transform-style: preserve-3d;
	}

	.is-away {
		visibility: hidden;
	}

	@media (prefers-reduced-motion: reduce) {
		.pull {
			transition: none;
		}
	}
</style>
