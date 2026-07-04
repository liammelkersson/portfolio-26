<script lang="ts">
	import { crossfade, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { vinyls } from '$lib/data/vinyls';

	// Fallback plays when a send has no matching receive (e.g. the panel cover
	// on close): slide left toward the shelf and fade, instead of flying to a
	// target inside the clipping scroll container
	const [sendRecord, receiveRecord] = crossfade({
		duration: 400,
		easing: cubicOut,
		fallback: (node, params, intro) => ({
			duration: 300,
			easing: cubicOut,
			css: (t, u) => `transform: translateX(${(intro ? 1 : -1) * 120 * u}px); opacity: ${t}`
		})
	});

	// Placeholder: repeat the collection to fill the shelf until more albums are added
	const minShelfSize = 8;
	const shelfVinyls =
		vinyls.length >= minShelfSize
			? vinyls
			: Array.from({ length: minShelfSize }, (_, index) => vinyls[index % vinyls.length]);

	let selectedIndex: number | null = $state(null);
	const selectedVinyl = $derived(selectedIndex === null ? null : shelfVinyls[selectedIndex]);

	function toggleVinyl(index: number) {
		selectedIndex = selectedIndex === index ? null : index;
	}

	function closeVinyl() {
		selectedIndex = null;
	}

	// Animates the panel's width so the shelf and its edge fade resize
	// smoothly instead of snapping; margin-left cancels the flex gap at t=0
	function panelSlide(node: HTMLElement) {
		const width = node.scrollWidth;
		return {
			duration: 300,
			easing: cubicOut,
			css: (t: number) =>
				`width: ${t * width}px; min-width: 0; overflow: hidden; margin-left: ${(t - 1) * 1.5}rem; opacity: ${Math.min(1, t * 2)};`
		};
	}
</script>

<div class="flex flex-col gap-6 sm:flex-row sm:items-end">
	<div class="shelf-scroll min-w-0 flex-1 overflow-x-auto pt-4">
		<ul class="flex w-max items-end pr-40 pl-4">
		{#each shelfVinyls as vinyl, index (index)}
			<li class="vinyl-slot relative shrink-0" class:z-10={selectedIndex === index}>
				{#if selectedIndex !== index}
					<!-- Flight transforms live on this unstyled wrapper: the button's own
					     CSS transition on transform would fight the animation frames -->
					<div out:sendRecord={{ key: index }} in:receiveRecord={{ key: index }}>
						<button
							type="button"
							onclick={() => toggleVinyl(index)}
							aria-label="{vinyl.title} by {vinyl.artist}"
							class="vinyl-cover relative block cursor-pointer"
						>
						<span
							aria-hidden="true"
							class="vinyl-spine"
							style="background-image: url({vinyl.coverUrl})"
						></span>
						<img
							src={vinyl.coverUrl}
							alt="{vinyl.title} album cover"
							width="160"
							height="160"
							loading="lazy"
							draggable="false"
							class="h-40 w-40 max-w-none rounded-r-sm object-cover shadow-lg"
						/>
							<span aria-hidden="true" class="vinyl-shade rounded-r-sm"></span>
						</button>
					</div>
				{/if}
			</li>
			{/each}
		</ul>
	</div>
	{#if selectedVinyl}
		<div
			class="flex shrink-0 gap-4 text-sm text-neutral-500 dark:text-neutral-400"
			transition:panelSlide
		>
			<!-- Fixed-size box with stacked covers: the outgoing cover would otherwise
			     sit beside the incoming one mid-flight and shove the layout -->
			<div class="relative h-40 w-40 shrink-0">
				{#each [selectedIndex] as panelIndex (panelIndex)}
					<img
						src={selectedVinyl.coverUrl}
						alt="{selectedVinyl.title} album cover"
						width="160"
						height="160"
						draggable="false"
						class="absolute inset-0 h-40 w-40 rounded-md object-cover shadow-xl"
						in:receiveRecord|global={{ key: panelIndex }}
						out:sendRecord|global={{ key: panelIndex }}
					/>
				{/each}
			</div>
			<div class="flex h-40 shrink-0 flex-col" transition:fade|global={{ duration: 200 }}>
				<button
					type="button"
					onclick={closeVinyl}
					aria-label="Put the record back on the shelf"
					class="cursor-pointer self-end rounded-md p-1 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						aria-hidden="true"
						class="h-4 w-4"
					>
						<path d="M6 6l12 12M18 6L6 18" />
					</svg>
				</button>
				<div class="mt-auto">
					<p class="text-base text-neutral-800 dark:text-neutral-200">{selectedVinyl.title}</p>
					<p>{selectedVinyl.artist}</p>
					<a
						href={selectedVinyl.spotifyUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="mt-1 inline-block underline underline-offset-2 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
					>
						Open on Spotify
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Records fade out toward the right edge instead of being cut off hard
	   where the scroll container ends */
	.shelf-scroll {
		mask-image: linear-gradient(to right, black calc(100% - 3rem), transparent);
		-webkit-mask-image: linear-gradient(to right, black calc(100% - 3rem), transparent);
	}

	/* Each slot is only as wide as the visible spine; the rotated cover overflows to the right */
	.vinyl-slot {
		width: 1.5rem;
	}

	/* perspective() lives on the item itself: ancestors (scroll container, ul, li)
	   flatten 3D, so a perspective property higher up never reaches the covers */
	.vinyl-cover {
		transform: perspective(450px) rotateY(70deg);
		transform-origin: left center;
		transform-style: preserve-3d;
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.vinyl-cover:hover {
		transform: perspective(450px) translateY(-0.5rem) rotateY(70deg);
	}

	/* Sleeve spine: the side of the box, rotated 90° at the left edge so it
	   extends backward with real thickness */
	.vinyl-spine {
		position: absolute;
		inset: 0 auto 0 0;
		width: 4px;
		transform: rotateY(90deg);
		transform-origin: left center;
		background-size: cover;
		background-position: left center;
		filter: brightness(0.5) saturate(0.8);
	}

	/* Light falls from the left; the receding side of the cover sits in shade */
	.vinyl-shade {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.4));
		transition: opacity 0.4s;
	}

	.vinyl-cover:hover .vinyl-shade {
		opacity: 0.55;
	}
</style>
