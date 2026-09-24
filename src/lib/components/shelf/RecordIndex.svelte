<script lang="ts">
	import type { Vinyl } from '$lib/data/vinyls';

	let {
		records,
		onHighlight,
		onOpen
	}: {
		records: Vinyl[];
		onHighlight: (recordIndex: number | null) => void;
		onOpen: (vinyl: Vinyl) => void;
	} = $props();
</script>

<ol class="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-6">
	{#each records as vinyl, recordIndex (vinyl.title)}
		<li>
			<button
				type="button"
				onclick={() => onOpen(vinyl)}
				onpointerenter={() => onHighlight(recordIndex)}
				onpointerleave={() => onHighlight(null)}
				onfocus={() => onHighlight(recordIndex)}
				onblur={() => onHighlight(null)}
				class="group w-full cursor-pointer text-left text-sm leading-snug"
			>
				<span class="block text-neutral-500 dark:text-neutral-400">{vinyl.artist}</span>
				<span class="block transition-opacity group-hover:opacity-60">{vinyl.title}</span>
			</button>
		</li>
	{/each}
</ol>
