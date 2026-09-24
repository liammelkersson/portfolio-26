<script lang="ts">
	const tattoos = [
		{ src: '/tattoos/frank.webp', width: 237, height: 360, placement: 'top-[14%] left-[5%] w-44 -rotate-6' },
		{ src: '/tattoos/hammers.webp', width: 195, height: 179, placement: 'top-[12%] right-[9%] w-24 rotate-6' },
		{ src: '/tattoos/tree.webp', width: 166, height: 202, placement: 'top-[52%] right-[6%] w-28' },
		{
			src: '/tattoos/angel-numbers.webp',
			width: 480,
			height: 88,
			placement: 'bottom-[14%] left-[6%] w-48 -rotate-3'
		}
	];
</script>

<div class="pointer-events-none fixed inset-0 -z-10 hidden lg:block" aria-hidden="true">
	{#each tattoos as tattoo (tattoo.src)}
		<img
			src={tattoo.src}
			alt=""
			width={tattoo.width}
			height={tattoo.height}
			loading="lazy"
			class="absolute h-auto opacity-[0.08] dark:invert {tattoo.placement}"
		/>
	{/each}
</div>
