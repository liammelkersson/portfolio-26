<script lang="ts">
	import { readingList } from '$lib/data/readingList';

	const currentBook = readingList.current;
</script>

<div class="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
	<img
		src={currentBook.thumbnailUrl}
		alt="{currentBook.title} book cover"
		width="32"
		height="49"
		loading="lazy"
		class="h-12 w-auto rounded-xs shadow-md"
	/>
	<p>
		Currently reading
		<span class="text-neutral-800 dark:text-neutral-200">{currentBook.title}</span>
		by {currentBook.author}
	</p>
</div>
