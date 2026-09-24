<script lang="ts">
	import type { Snippet } from 'svelte';

	let { label, children }: { label: string; children: Snippet } = $props();

	const SCROLL_END_TOLERANCE_PX = 1;

	let scroller: HTMLUListElement;
	let canScrollBack = $state(false);
	let canScrollForward = $state(false);
	const overflows = $derived(canScrollBack || canScrollForward);

	function syncScrollState() {
		const visibleRight = scroller.scrollLeft + scroller.clientWidth;
		canScrollBack = scroller.scrollLeft > 0;
		canScrollForward = visibleRight < scroller.scrollWidth - SCROLL_END_TOLERANCE_PX;
	}

	function scrollBack() {
		scroller.scrollBy({ left: -scroller.clientWidth, behavior: 'smooth' });
	}

	function scrollForward() {
		scroller.scrollBy({ left: scroller.clientWidth, behavior: 'smooth' });
	}

	$effect(() => {
		syncScrollState();
		const resizeObserver = new ResizeObserver(syncScrollState);
		resizeObserver.observe(scroller);
		return () => resizeObserver.disconnect();
	});
</script>

<ul
	bind:this={scroller}
	onscroll={syncScrollState}
	aria-label={label}
	class="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>li]:w-[calc((100%-2rem)/3)] [&>li]:shrink-0 [&>li]:snap-start sm:[&>li]:w-[calc((100%-4rem)/5)]"
>
	{@render children()}
</ul>

{#if overflows}
	<div class="mt-3 flex justify-end gap-2">
		{#snippet arrowButton(ariaLabel: string, enabled: boolean, onclick: () => void, path: string)}
			<button
				type="button"
				aria-label={ariaLabel}
				disabled={!enabled}
				{onclick}
				class="flex h-8 w-8 cursor-pointer items-center justify-center border border-black/15 transition-opacity hover:opacity-70 disabled:cursor-default disabled:opacity-30 dark:border-white/20"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="h-4 w-4"
				>
					<path d={path} />
				</svg>
			</button>
		{/snippet}
		{@render arrowButton('Scroll back', canScrollBack, scrollBack, 'm15 6-6 6 6 6')}
		{@render arrowButton('Scroll forward', canScrollForward, scrollForward, 'm9 6 6 6-6 6')}
	</div>
{/if}
