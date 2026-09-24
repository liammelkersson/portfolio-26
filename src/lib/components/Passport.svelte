<script lang="ts">
	import { travelStamps } from '$lib/data/travelStamps';
	import { paginateStamps, spreadCountFor, spreadOfStampPage } from '$lib/passport/passportPages';
	import PassportPage from '$lib/components/PassportPage.svelte';
	import PassportIdentityPage from '$lib/components/PassportIdentityPage.svelte';
	import PassportCoverArt from '$lib/components/PassportCoverArt.svelte';

	const SWIPE_THRESHOLD_PX = 40;
	const CLOSED = 0;

	const stampPages = paginateStamps(travelStamps);
	const spreadCount = spreadCountFor(stampPages);
	const innerLeaves = Array.from({ length: spreadCount - 1 }, (_, index) => index + 1);
	const baseStampPageIndex = stampPages.length - 1;

	let openSpread = $state(CLOSED);
	let furthestSpread = $state(CLOSED);
	let pagesRequested = $state(false);
	let swipeStartX: number | null = null;

	const isOpen = $derived(openSpread !== CLOSED);

	function requestPages() {
		pagesRequested = true;
	}

	function showSpread(spread: number) {
		requestPages();
		openSpread = spread;
		furthestSpread = Math.max(furthestSpread, spread);
	}

	function closePassport() {
		openSpread = CLOSED;
	}

	function showNextSpread() {
		if (openSpread < spreadCount) showSpread(openSpread + 1);
	}

	function showPreviousSpread() {
		if (openSpread > 1) showSpread(openSpread - 1);
	}

	function isTurned(leaf: number): boolean {
		return leaf < openSpread;
	}

	// Turned leaves stack on the left with the latest on top; unturned leaves
	// stack on the right with the front cover on top
	function stackOrder(leaf: number): number {
		return isTurned(leaf) ? leaf + 1 : spreadCount * 2 - leaf;
	}

	function isStampPageLoaded(stampPageIndex: number): boolean {
		return pagesRequested && spreadOfStampPage(stampPageIndex) <= furthestSpread + 1;
	}

	function startSwipe(event: PointerEvent) {
		swipeStartX = event.clientX;
	}

	function finishSwipe(event: PointerEvent) {
		if (swipeStartX === null || !isOpen) return;
		const distance = event.clientX - swipeStartX;
		swipeStartX = null;
		if (distance <= -SWIPE_THRESHOLD_PX) showNextSpread();
		if (distance >= SWIPE_THRESHOLD_PX) showPreviousSpread();
	}
</script>

{#snippet stampPage(stampPageIndex: number)}
	<PassportPage
		stamps={stampPages[stampPageIndex]}
		pageNumber={stampPageIndex + 1}
		stampsLoaded={isStampPageLoaded(stampPageIndex)}
	/>
{/snippet}

<div class="flex flex-col gap-3">
	<div
		class="passport"
		class:is-open={isOpen}
		role="group"
		aria-label="Travel passport"
		onpointerdown={startSwipe}
		onpointerup={finishSwipe}
		onpointerenter={requestPages}
	>
		<div class="book">
			<div class="page-block">{@render stampPage(baseStampPageIndex)}</div>

			{#each innerLeaves as leaf (leaf)}
				<div class="leaf" class:is-turned={isTurned(leaf)} style="z-index: {stackOrder(leaf)}">
					<div class="face face-front">{@render stampPage(leaf * 2 - 2)}</div>
					<div class="face face-back">{@render stampPage(leaf * 2 - 1)}</div>
				</div>
			{/each}

			<div class="leaf cover-leaf" class:is-turned={isTurned(0)} style="z-index: {stackOrder(0)}">
				<div class="face face-front cover-front">
					<PassportCoverArt />
					<button
						type="button"
						onclick={() => showSpread(1)}
						onfocus={requestPages}
						disabled={isOpen}
						aria-label="Open travel passport"
						class="absolute inset-0 cursor-pointer rounded-[inherit]"
					></button>
				</div>
				<div class="face face-back">
					<PassportIdentityPage photoLoaded={pagesRequested} stampCount={travelStamps.length} />
				</div>
			</div>
		</div>
	</div>

	<div class="flex h-7 items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
		{#if isOpen}
			<button
				type="button"
				onclick={showPreviousSpread}
				disabled={openSpread === 1}
				aria-label="Previous pages"
				class="cursor-pointer rounded-md px-1.5 transition-colors hover:text-neutral-800 disabled:cursor-default disabled:opacity-30 dark:hover:text-neutral-200"
			>
				←
			</button>
			<span aria-live="polite" class="tabular-nums">{openSpread} / {spreadCount}</span>
			<button
				type="button"
				onclick={showNextSpread}
				disabled={openSpread === spreadCount}
				aria-label="Next pages"
				class="cursor-pointer rounded-md px-1.5 transition-colors hover:text-neutral-800 disabled:cursor-default disabled:opacity-30 dark:hover:text-neutral-200"
			>
				→
			</button>
			<button
				type="button"
				onclick={closePassport}
				class="ml-2 cursor-pointer underline underline-offset-2 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
			>
				Close
			</button>
		{:else}
			<p>Travels · tap to open</p>
		{/if}
	</div>

	<ul class="sr-only">
		{#each travelStamps as stamp (stamp.imageUrl)}
			<li>{stamp.place}, {stamp.date}</li>
		{/each}
	</ul>
</div>

<style>
	.passport {
		--page-w: 10rem;
		--page-h: 14rem;
		--turn: 0.8s cubic-bezier(0.22, 1, 0.36, 1);
		width: calc(var(--page-w) * 2);
		height: var(--page-h);
		touch-action: pan-y;
	}

	@media (min-width: 640px) {
		.passport {
			--page-w: 12rem;
			--page-h: 16.5rem;
		}
	}

	.book {
		position: relative;
		width: 100%;
		height: 100%;
		perspective: 1600px;
		transform: translateX(calc(var(--page-w) * -1));
		transition: transform var(--turn);
	}

	.is-open .book {
		transform: translateX(0);
	}

	.page-block,
	.leaf {
		position: absolute;
		top: 0;
		left: var(--page-w);
		width: var(--page-w);
		height: 100%;
	}

	/* Stacked edge lines give the closed page block some thickness */
	.page-block {
		overflow: hidden;
		border-radius: 0 0.5rem 0.5rem 0;
		box-shadow:
			1px 0 0 #e7e0d0,
			2px 0 0 #d9d1bf,
			3px 0 0 #e7e0d0,
			4px 0 0 #cfc6b3,
			0 10px 30px -12px rgba(0, 0, 0, 0.35);
	}

	/* z-index swaps halfway through the turn, when the leaf stands upright */
	.leaf {
		transform-origin: left center;
		transform-style: preserve-3d;
		transition:
			transform var(--turn),
			z-index 0s linear 0.4s;
	}

	.leaf.is-turned {
		transform: rotateY(-180deg);
	}

	.cover-leaf:not(.is-turned):hover,
	.cover-leaf:not(.is-turned):has(:focus-visible) {
		transform: rotateY(-14deg);
	}

	.face {
		position: absolute;
		inset: 0;
		overflow: hidden;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.face-front {
		border-radius: 0 0.5rem 0.5rem 0;
	}

	.face-back {
		border-radius: 0.5rem 0 0 0.5rem;
		transform: rotateY(180deg);
	}

	.face-front::after,
	.face-back::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.face-front::after {
		background: linear-gradient(to right, rgba(0, 0, 0, 0.12), transparent 18%);
	}

	.face-back::after {
		background: linear-gradient(to left, rgba(0, 0, 0, 0.12), transparent 18%);
	}

	.cover-front {
		box-shadow: 0 14px 30px -10px rgba(0, 0, 0, 0.45);
	}

	@media (prefers-reduced-motion: reduce) {
		.book,
		.leaf {
			transition: none;
		}
	}
</style>
