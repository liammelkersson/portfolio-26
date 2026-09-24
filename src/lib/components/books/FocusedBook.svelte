<script lang="ts">
	import type { Book } from '$lib/data/readingList';
	import FocusStage from '$lib/components/shelf/FocusStage.svelte';
	import BookBox from '$lib/components/books/BookBox.svelte';

	let {
		book,
		isCurrent,
		origin,
		onClosed
	}: { book: Book; isCurrent: boolean; origin: HTMLElement; onClosed: () => void } = $props();

	const SPINE_OUT = { x: 0, y: 90 };
	const COVER_ANGLED = { x: -6, y: -24 };
</script>

<FocusStage
	label="{book.title} by {book.author}"
	{origin}
	startTilt={SPINE_OUT}
	restingTilt={COVER_ANGLED}
	{onClosed}
>
	{#snippet object()}
		<span class="focused-book" style="width: {(book.widthCm / book.heightCm) * 100}%">
			<BookBox {book} {isCurrent} />
		</span>
	{/snippet}
	{#snippet info()}
		{#if isCurrent}
			<p class="mb-2 text-xs tracking-[0.15em] uppercase opacity-60">
				Reading now{book.startedOn ? ` · since ${book.startedOn}` : ''}
			</p>
		{/if}
		<h2 class="text-2xl font-normal tracking-tight sm:text-3xl">{book.title}</h2>
		<p class="mt-2 opacity-70">{book.author}</p>
		{#if book.note}
			<p class="mt-4 max-w-xs text-sm opacity-80">{book.note}</p>
		{/if}
	{/snippet}
	{#snippet actions()}{/snippet}
</FocusStage>

<style>
	.focused-book {
		--book-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.45);
		display: block;
		transform-style: preserve-3d;
	}
</style>
