<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { fetchCarbonStats } from '$lib/impact/websiteCarbon';
	import { getVisitCount } from '$lib/impact/visitCounter';
	import { fetchTreesPlanted } from '$lib/impact/ecologiReporting';
	import { GRAMS_PER_TREE } from '$lib/impact/config';
	import { treesOwed } from '$lib/impact/treesOwed';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CountUp from '$lib/components/CountUp.svelte';

	let gramsPerView = $state<number | null>(null);
	let visits = $state<number | null>(null);
	let treesPurchased = $state<number | null>(null);
	let loaded = $state(false);

	const totalGrams = $derived(
		gramsPerView !== null && visits !== null ? gramsPerView * visits : null
	);
	const totalKg = $derived(totalGrams !== null ? totalGrams / 1000 : null);
	const treesStillOwed = $derived(
		totalGrams !== null && treesPurchased !== null
			? treesOwed(totalGrams, treesPurchased, GRAMS_PER_TREE)
			: null
	);

	$effect(() => {
		const controller = new AbortController();
		Promise.allSettled([
			fetchCarbonStats(controller.signal),
			getVisitCount(controller.signal),
			env.PUBLIC_ECOLOGI_USERNAME
				? fetchTreesPlanted(env.PUBLIC_ECOLOGI_USERNAME, controller.signal)
				: Promise.resolve({ total: 0, pending: 0 })
		]).then(([carbonResult, visitsResult, treesResult]) => {
			if (carbonResult.status === 'fulfilled') gramsPerView = carbonResult.value.c;
			if (visitsResult.status === 'fulfilled') visits = visitsResult.value;
			if (treesResult.status === 'fulfilled') {
				treesPurchased = treesResult.value.total + treesResult.value.pending;
			}
			loaded = true;
		});
		return () => controller.abort();
	});
</script>

<svelte:head>
	<title>Carbon impact — Liam Melkersson</title>
	<meta
		name="description"
		content="Live CO2 footprint of liammelkersson.xyz — grams emitted per view, total visits, and trees planted automatically through Ecologi to offset it."
	/>
	<link rel="canonical" href="https://liammelkersson.xyz/impact" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://liammelkersson.xyz/impact" />
	<meta property="og:title" content="Carbon impact — Liam Melkersson" />
	<meta
		property="og:description"
		content="Live CO2 footprint of liammelkersson.xyz, offset automatically through Ecologi."
	/>
	<meta property="og:image" content="https://liammelkersson.xyz/portrait.jpg" />
	<meta property="og:image:width" content="640" />
	<meta property="og:image:height" content="640" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Carbon impact — Liam Melkersson" />
	<meta
		name="twitter:description"
		content="Live CO2 footprint of liammelkersson.xyz, offset automatically through Ecologi."
	/>
	<meta name="twitter:image" content="https://liammelkersson.xyz/portrait.jpg" />

	<script src="https://unpkg.com/website-carbon-badges@1.1.3/b.min.js" defer></script>
</svelte:head>

<div class="pointer-events-none fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
	<img
		src="/impact/hillside.webp"
		alt=""
		class="h-full w-full scale-110 object-cover opacity-30 blur-lg dark:opacity-20 dark:blur-3xl"
	/>
</div>

<div class="flex min-h-screen flex-col">
	<Header />

	<div class="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
		<a href="/" class="text-base opacity-60 transition-opacity hover:opacity-100">
			<span style="font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif">←</span> back
		</a>

		{#if !loaded}
			<p class="mt-6 text-base opacity-60">Measuring…</p>
		{:else}
			<div class="mt-12 grid gap-12 sm:grid-cols-2">
				<div>
					<p class="text-base opacity-60">This website consumes</p>
					<p class="mt-2 text-7xl font-semibold">
						{#if gramsPerView !== null}
							<CountUp value={gramsPerView} decimals={2} />
						{:else}
							—
						{/if}
					</p>
					<p class="mt-2 text-base opacity-60">grams of CO₂ per view</p>
				</div>
				<div>
					<p class="text-base opacity-60">Since this website's first publish</p>
					<p class="mt-2 text-7xl font-semibold">
						{#if treesPurchased !== null}
							<CountUp value={treesPurchased} />
						{:else}
							—
						{/if}
					</p>
					<p class="mt-2 text-base opacity-60">trees have been planted to offset CO₂ use</p>
					<p class="mt-4 text-sm opacity-50">
						Trees planted through
						<a
							href="https://ecologi.com"
							target="_blank"
							rel="noopener noreferrer"
							class="underline underline-offset-2 transition-colors hover:text-[#34C759]"
						>
							Ecologi
						</a>. Full report on
						<a
							href="https://www.websitecarbon.com/website/liammelkersson-xyz/"
							target="_blank"
							rel="noopener noreferrer"
							class="underline underline-offset-2 transition-colors hover:text-[#34C759]"
						>
							Website Carbon
						</a>.
					</p>
				</div>
			</div>

			<div class="mt-12">
				<p class="text-base opacity-60">
					Total CO₂ emitted across {visits !== null ? visits : '—'} visits
				</p>
				<p class="mt-2 text-5xl font-semibold">
					{#if totalKg !== null}
						<CountUp value={totalKg} decimals={5} />kg
					{:else}
						—
					{/if}
				</p>
				{#if treesStillOwed !== null && treesStillOwed > 0}
					<p class="mt-1 text-base opacity-60">{treesStillOwed} tree(s) owed, queued for the next offset run</p>
				{/if}
			</div>

			<div id="wcb" class="carbonbadge mt-12"></div>
		{/if}
	</div>
	<Footer showCarbonBadge={false} />
</div>
