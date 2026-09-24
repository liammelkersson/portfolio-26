<script lang="ts">
	import type { TravelPhoto } from '$lib/data/travelMemories';
	import { depthFromFront } from '$lib/data/photoStack';

	let { photos, caption }: { photos: TravelPhoto[]; caption: string } = $props();

	const POSES_FROM_FRONT = ['rotate-3 translate-x-2 translate-y-3', '-rotate-6 -translate-x-3'];

	let frontIndex = $state(0);
	const hasMorePhotos = $derived(photos.length > 1);

	function depthOf(photoIndex: number) {
		return depthFromFront(photoIndex, frontIndex, photos.length);
	}

	function poseFor(photoIndex: number) {
		return POSES_FROM_FRONT[depthOf(photoIndex) % POSES_FROM_FRONT.length];
	}

	function bringNextPhotoForward() {
		frontIndex = (frontIndex + 1) % photos.length;
	}
</script>

<button
	type="button"
	onclick={bringNextPhotoForward}
	disabled={!hasMorePhotos}
	aria-label="Show next photo"
	class="mt-4 grid w-[80%] max-w-40 cursor-pointer disabled:cursor-default"
>
	{#each photos as photo, photoIndex (photo.url)}
		<figure
			class="bg-white p-1.5 pb-2 shadow-md transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [grid-area:1/1] motion-reduce:transition-none sm:p-2 {poseFor(
				photoIndex
			)}"
			style="z-index: {photos.length - depthOf(photoIndex)}"
		>
			<img
				src={photo.url}
				alt={photo.alt}
				width="320"
				height="320"
				loading="lazy"
				class="aspect-square w-full object-cover"
			/>
			<figcaption class="mt-1.5 text-center text-[0.65rem] text-black sm:text-xs">
				{depthOf(photoIndex) === 0 ? caption : '\u00a0'}
			</figcaption>
		</figure>
	{/each}
</button>
