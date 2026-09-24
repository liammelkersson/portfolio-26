<script lang="ts">
	import type { StampPage } from '$lib/passport/passportPages';

	let {
		stamps,
		pageNumber,
		stampsLoaded
	}: { stamps: StampPage; pageNumber: number; stampsLoaded: boolean } = $props();

	const isRightHand = $derived(pageNumber % 2 === 1);
</script>

<div class="visa-paper relative flex h-full w-full flex-col items-center justify-center gap-3 p-3">
	{#if stamps.length === 0}
		<span class="absolute top-4 text-[0.55rem] tracking-[0.3em] text-[#466d44]/40 uppercase">Visas</span>
	{:else if stampsLoaded}
		{#each stamps as stamp (stamp.imageUrl)}
			<img
				src={stamp.imageUrl}
				alt=""
				draggable="false"
				class="pointer-events-none max-h-[45%] max-w-[88%] object-contain select-none"
				style="transform: rotate({stamp.tiltDeg}deg)"
			/>
		{/each}
	{/if}
	<span
		class="absolute bottom-2 text-[0.55rem] text-neutral-500/70"
		class:right-3={isRightHand}
		class:left-3={!isRightHand}
	>
		{pageNumber}
	</span>
</div>
