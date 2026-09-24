<script lang="ts">
	import type { Book } from '$lib/data/readingList';
	import ShelfBook from '$lib/components/books/ShelfBook.svelte';

	let {
		books,
		awayIndex,
		onOpen
	}: {
		books: Book[];
		awayIndex: number | null;
		onOpen: (bookIndex: number, spine: HTMLElement) => void;
	} = $props();
</script>

<div class="book-wall">
	<ul class="book-row">
		{#each books as book, bookIndex (book.title)}
			<li>
				<ShelfBook
					{book}
					{bookIndex}
					isCurrent={bookIndex === 0}
					isAway={awayIndex === bookIndex}
					onOpen={(spine) => onOpen(bookIndex, spine)}
				/>
			</li>
		{/each}
		<li class="bookend" aria-hidden="true"></li>
	</ul>
	<div class="ledge" aria-hidden="true"></div>
</div>

<style>
	/*
	 * Same scale as the record shelf above: a 31.4 cm sleeve fills one record
	 * column, so --cm is that column width divided by 31.4.
	 */
	.book-wall {
		container-type: inline-size;
		--cm: calc((86cqw - 2 * 4cqw) / 3 / 31.4);
		--shelf-surface: #fbfbfb;
		--shelf-edge: #ffffff;
		padding-top: 6cqw;
	}

	@media (min-width: 640px) {
		.book-wall {
			--cm: calc((86cqw - 3 * 3cqw) / 4 / 31.4);
		}
	}

	@media (min-width: 1024px) {
		.book-wall {
			--cm: calc((86cqw - 4 * 2.6cqw) / 5 / 31.4);
		}
	}

	.book-row {
		display: flex;
		align-items: flex-end;
		gap: 0.08cqw;
		padding: 0 7cqw 0 9cqw;
		perspective: 1100px;
		perspective-origin: 50% 25%;
	}

	.book-row > li {
		transform-style: preserve-3d;
	}

	.bookend {
		width: calc(1.2 * var(--cm));
		height: calc(15 * var(--cm));
		margin-left: calc(0.4 * var(--cm));
		border-radius: calc(0.6 * var(--cm)) calc(0.6 * var(--cm)) 0 0;
		background: linear-gradient(to right, #2c2c2c, #4a4a4a 40%, #2a2a2a);
		box-shadow: 0 6px 10px -4px rgba(0, 0, 0, 0.35);
	}

	.ledge {
		height: 1.3cqw;
		margin-top: -0.4cqw;
		background: linear-gradient(to bottom, var(--shelf-surface) 0 0.4cqw, var(--shelf-edge) 0.4cqw);
		box-shadow: 0 3cqw 3.5cqw -2.6cqw rgba(0, 0, 0, 0.3);
	}

	:global(html.dark) .book-wall {
		--shelf-surface: #3a3a3a;
		--shelf-edge: #474747;
	}
</style>
