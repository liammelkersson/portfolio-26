<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import RecordShelf from '$lib/components/shelf/RecordShelf.svelte';
	import RecordIndex from '$lib/components/shelf/RecordIndex.svelte';
	import FocusedRecord from '$lib/components/shelf/FocusedRecord.svelte';
	import BookShelf from '$lib/components/books/BookShelf.svelte';
	import FocusedBook from '$lib/components/books/FocusedBook.svelte';
	import { booksOnShelf, readingList } from '$lib/data/readingList';
	import { vinyls, type Vinyl } from '$lib/data/vinyls';
	import { musicLinks } from '$lib/data/playlists';

	type FocusedObject =
		| { kind: 'record'; recordIndex: number; origin: HTMLElement }
		| { kind: 'book'; bookIndex: number; origin: HTMLElement };

	const books = booksOnShelf(readingList);

	let focused = $state<FocusedObject | null>(null);
	let highlightedIndex = $state<number | null>(null);

	const awayRecordIndex = $derived(focused?.kind === 'record' ? focused.recordIndex : null);
	const awayBookIndex = $derived(focused?.kind === 'book' ? focused.bookIndex : null);

	function focusRecord(recordIndex: number, origin: HTMLElement) {
		highlightedIndex = null;
		focused = { kind: 'record', recordIndex, origin };
	}

	function focusBook(bookIndex: number, origin: HTMLElement) {
		focused = { kind: 'book', bookIndex, origin };
	}

	function focusRecordFromIndex(vinyl: Vinyl) {
		const recordIndex = vinyls.indexOf(vinyl);
		const origin = document.querySelector<HTMLElement>(`[data-record-index="${recordIndex}"]`);
		if (origin) focusRecord(recordIndex, origin);
	}

	function returnToShelf() {
		focused = null;
	}

	function highlightRecord(recordIndex: number | null) {
		highlightedIndex = recordIndex;
	}
</script>

<svelte:head>
	<title>Personal — Liam Melkersson</title>
	<meta
		name="description"
		content="The records on Liam Melkersson's shelf: albums on rotation, the full vinyl collection and playlists."
	/>
	<link rel="canonical" href="https://liammelkersson.xyz/personal" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://liammelkersson.xyz/personal" />
	<meta property="og:title" content="Personal — Liam Melkersson" />
	<meta property="og:description" content="The records on my shelf." />
	<meta property="og:image" content="https://liammelkersson.xyz/portrait.jpg" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Personal — Liam Melkersson" />
	<meta name="twitter:description" content="The records on my shelf." />
	<meta name="twitter:image" content="https://liammelkersson.xyz/portrait.jpg" />
</svelte:head>

<div class="record-room">
	<Header />

	<main class="mx-auto w-full max-w-6xl px-6 pb-20">
		<h1 class="sr-only">Personal — Liam Melkersson</h1>
		<p class="pt-4 leading-snug text-neutral-600 dark:text-neutral-400">
			Records and books on my shelves.<br />
			Over 90 records at home, these are on rotation.
		</p>

		<RecordShelf
			records={vinyls}
			{highlightedIndex}
			awayIndex={awayRecordIndex}
			onOpen={focusRecord}
		/>

		<section aria-label="Bookshelf" class="mt-4">
			<BookShelf {books} awayIndex={awayBookIndex} onOpen={focusBook} />
		</section>

		<section aria-label="All records" class="mt-8 border-t border-black/10 pt-8 dark:border-white/10">
			<RecordIndex records={vinyls} onHighlight={highlightRecord} onOpen={focusRecordFromIndex} />

			<div class="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
				<a
					href={musicLinks.collectionUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="rounded-full bg-neutral-900 px-4 py-2 text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-neutral-900"
				>
					Full collection on Discogs
				</a>
				{#each musicLinks.playlists as playlist (playlist.title)}
					<a
						href={playlist.url}
						target="_blank"
						rel="noopener noreferrer"
						class="underline underline-offset-2 transition-opacity hover:opacity-60"
						class:opacity-50={playlist.placeholder}
					>
						{playlist.title}
					</a>
				{/each}
			</div>
		</section>
	</main>
</div>

{#if focused?.kind === 'record'}
	<FocusedRecord vinyl={vinyls[focused.recordIndex]} origin={focused.origin} onClosed={returnToShelf} />
{:else if focused?.kind === 'book'}
	<FocusedBook
		book={books[focused.bookIndex]}
		isCurrent={focused.bookIndex === 0}
		origin={focused.origin}
		onClosed={returnToShelf}
	/>
{/if}

<style>
	/* Pale gallery wall with a soft spotlight behind the shelves */
	.record-room {
		min-height: 100svh;
		background:
			radial-gradient(ellipse 70% 55% at 50% 42%, #fbfbfb, rgba(251, 251, 251, 0) 70%),
			#e3e3e3;
	}

	:global(html.dark) .record-room {
		background:
			radial-gradient(ellipse 70% 55% at 50% 42%, #2b2b2b, rgba(43, 43, 43, 0) 70%),
			#171717;
	}
</style>
