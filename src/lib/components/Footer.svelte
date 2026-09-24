<script lang="ts">
	import { reveal } from '$lib/attachments/reveal';
	import CarbonBadge from '$lib/components/CarbonBadge.svelte';

	let { onOpenImpact }: { onOpenImpact: () => void } = $props();

	const year = new Date().getFullYear();

	const supportBadges = [
		{
			src: '/badges/clean-creatives.avif',
			alt: 'Clean Creatives pledge signatory',
			href: 'https://cleancreatives.org',
			width: 48,
			height: 48,
			imageClass: 'h-9 w-9 max-w-none object-contain invert dark:invert-0'
		},
		{
			src: '/badges/giving-1-to-humanity.svg',
			alt: 'Giving 1% to Humanity',
			href: '',
			width: 45,
			height: 48,
			imageClass: 'h-9 w-auto max-w-none object-contain invert dark:invert-0'
		},
		{
			src: '/badges/hjarnfonden-jag-stodjer.svg',
			alt: 'Hjärnfonden Jag Stödjer',
			href: 'https://www.hjarnfonden.se',
			width: 192,
			height: 20,
			imageClass: 'h-4 w-auto max-w-none object-contain dark:invert'
		},
		{
			src: '/badges/ace.webp',
			alt: 'Animal Charity Evaluators',
			href: 'https://animalcharityevaluators.org',
			width: 211,
			height: 48,
			imageClass: 'h-6 w-auto max-w-none object-contain dark:brightness-0 dark:invert'
		}
	];
</script>

<footer
	{@attach reveal()}
	class="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-y-3 px-6 pb-12"
>
	<p class="order-1 text-sm whitespace-nowrap opacity-60">©{year} Liam Melkersson</p>
	<div class="order-3 w-full sm:order-2 sm:w-auto">
		<CarbonBadge {onOpenImpact} />
	</div>
	<p
		class="order-2 text-sm whitespace-nowrap opacity-60 sm:order-3"
		style="font-family: 'Times New Roman', Times, serif"
	>
		111 <span style="font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif">♡</span> 222
	</p>
	<ul class="order-4 flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-60 grayscale">
		{#each supportBadges as badge (badge.alt)}
			<li class="shrink-0">
				{#snippet badgeImage()}
					<img
						src={badge.src}
						alt={badge.alt}
						width={badge.width}
						height={badge.height}
						loading="lazy"
						class={badge.imageClass}
					/>
				{/snippet}
				{#if badge.href}
					<a
						href={badge.href}
						target="_blank"
						rel="noopener noreferrer"
						class="block transition-opacity hover:opacity-70">{@render badgeImage()}</a
					>
				{:else}
					{@render badgeImage()}
				{/if}
			</li>
		{/each}
	</ul>
</footer>
