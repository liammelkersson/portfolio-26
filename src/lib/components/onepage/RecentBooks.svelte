<script lang="ts">
	import {
		booksOnShelf,
		readingList,
		READING_LIST_UPDATED_ON,
		type Book
	} from '$lib/data/readingList';
	import OnePageSection from './OnePageSection.svelte';
	import MoreLink from './MoreLink.svelte';
	import MediaCarousel from './MediaCarousel.svelte';
	import MediaCover from './MediaCover.svelte';

	const MARGINS_PROFILE_URL = 'https://margins.app/u/89b2e8838d1248fdacf0d1ebb7b1db1d';

	const books = booksOnShelf(readingList);

	function isBeingRead(book: Book) {
		return book === readingList.current;
	}
</script>

<OnePageSection title="Recent books" updatedOn={READING_LIST_UPDATED_ON}>
	{#snippet action()}
		<MoreLink href={MARGINS_PROFILE_URL} label="margins" icon="/icons/margins.webp" />
	{/snippet}
	<MediaCarousel label="Recent books">
		{#each books as book (book.title)}
			<li class="text-sm">
				<div class="relative">
					<MediaCover
						src={book.coverUrl ?? book.thumbnailUrl}
						alt="{book.title} cover"
						fallbackTitle={book.title}
					/>
					{#if isBeingRead(book)}
						<span
							class="absolute top-1.5 left-1.5 rounded-xs bg-white/90 px-1.5 py-0.5 text-[10px] leading-none text-black"
							>currently reading</span
						>
					{/if}
				</div>
				<p class="mt-2 leading-snug">{book.title}</p>
				<p class="leading-snug opacity-50">{book.author}</p>
			</li>
		{/each}
	</MediaCarousel>
</OnePageSection>
