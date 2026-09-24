<script lang="ts">
	import { travelMemories, upcomingTrips } from '$lib/data/travelMemories';
	import OnePageSection from './OnePageSection.svelte';
	import PolaroidStack from './PolaroidStack.svelte';

	const PASSPORT_GREEN = '#466d44';
</script>

<OnePageSection title="Travel memories">
	<ul class="space-y-10">
		{#each travelMemories as memory, memoryIndex (memory.place + memory.date)}
			<li
				class="rounded-lg p-1.5 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.45)]"
				style="background: {PASSPORT_GREEN}"
			>
				<div class="grid grid-cols-2 overflow-hidden rounded-md text-neutral-800">
					<div class="visa-paper relative flex flex-col items-center px-3 pt-6 pb-8 sm:px-5">
						<span class="text-[0.55rem] tracking-[0.3em] uppercase" style="color: {PASSPORT_GREEN}"
							>{memory.place}</span
						>
						<PolaroidStack photos={memory.photos} caption={memory.date.toLowerCase()} />
						<span class="absolute bottom-2 left-3 text-[0.55rem] text-neutral-500/70"
							>{memoryIndex * 2 + 1}</span
						>
						<span
							class="pointer-events-none absolute inset-y-0 right-0 w-6 bg-linear-to-l from-black/15 to-transparent"
							aria-hidden="true"
						></span>
					</div>
					<div class="visa-paper relative flex flex-col items-center justify-center gap-4 px-3 py-8">
						{#each memory.stamps as stamp (stamp.imageUrl)}
							<img
								src={stamp.imageUrl}
								alt="{stamp.place} stamp, {stamp.date}"
								width="320"
								loading="lazy"
								class="w-[80%] max-w-40 opacity-90"
								style="transform: rotate({stamp.tiltDeg}deg)"
							/>
						{/each}
						<span class="absolute right-3 bottom-2 text-[0.55rem] text-neutral-500/70"
							>{memoryIndex * 2 + 2}</span
						>
						<span
							class="pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r from-black/15 to-transparent"
							aria-hidden="true"
						></span>
					</div>
				</div>
			</li>
		{/each}
	</ul>
	{#if upcomingTrips.length}
		<p class="mt-6 text-sm opacity-60">
			next up:
			{upcomingTrips.map((trip) => `${trip.place.toLowerCase()} · ${trip.date.toLowerCase()}`).join(', ')}
		</p>
	{/if}
</OnePageSection>
