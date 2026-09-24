<script lang="ts">
	import { reveal } from '$lib/attachments/reveal';
	import { companyLogos } from '$lib/data/companyLogos';

	const LOGO_SCALE = 0.65;
</script>

<section class="blind-hero mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
	<h1 {@attach reveal()} class="text-5xl font-medium tracking-tight sm:text-6xl">
		Liam Melkersson
	</h1>
	<p {@attach reveal(100)} class="mt-4 text-lg opacity-60">
		The only thing that matters is how it makes them feel.
	</p>
	<ul {@attach reveal(200)} class="mt-8 flex flex-wrap items-center justify-center gap-3">
		{#each companyLogos as logo (logo.name)}
			<li>
				<a
					href={logo.href}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm opacity-70 transition-opacity hover:opacity-100 dark:border-neutral-700"
				>
					<img
						src={logo.src}
						alt=""
						class="brightness-0 dark:invert"
						style="height: {logo.heightPx * LOGO_SCALE}px; width: {logo.widthPx * LOGO_SCALE}px"
					/>
					<span>{logo.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.blind-hero {
		background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
		background-size: 16px 16px;
	}

	:global(.dark) .blind-hero {
		background-image: radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
	}
</style>
