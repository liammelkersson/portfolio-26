<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { fetchCarbonStats } from '$lib/impact/websiteCarbon';
	import { getCounterCount } from '$lib/impact/counterApi';
	import { fetchTreesPlanted } from '$lib/impact/ecologiReporting';
	import { VISITS_COUNTER, GRAMS_PER_TREE } from '$lib/impact/config';
	import { treesOwed } from '$lib/impact/treesOwed';
	import Footer from '$lib/components/Footer.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import CountUp from '$lib/components/CountUp.svelte';

	let gramsPerView = $state<number | null>(null);
	let visits = $state<number | null>(null);
	let treesPurchased = $state<number | null>(null);
	let failed = $state(false);

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
		Promise.all([
			fetchCarbonStats(controller.signal),
			getCounterCount(VISITS_COUNTER),
			env.PUBLIC_ECOLOGI_USERNAME
				? fetchTreesPlanted(env.PUBLIC_ECOLOGI_USERNAME, controller.signal)
				: Promise.resolve(0)
		])
			.then(([carbon, visitCount, treeCount]) => {
				gramsPerView = carbon.c;
				visits = visitCount;
				treesPurchased = treeCount;
			})
			.catch(() => {
				failed = true;
			});
		return () => controller.abort();
	});
</script>

<svelte:head>
	<title>Carbon impact — Liam Melkersson</title>
	<script src="https://unpkg.com/website-carbon-badges@1.1.3/b.min.js" defer></script>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-24">
	<div class="flex items-center justify-between">
		<a href="/" class="text-base opacity-60 transition-opacity hover:opacity-100">
			<span style="font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif">←</span> back
		</a>
		<ThemeToggle />
	</div>

	{#if failed}
		<p class="mt-6 text-base opacity-60">Couldn't load impact data right now.</p>
	{:else if gramsPerView === null}
		<p class="mt-6 text-base opacity-60">Measuring…</p>
	{:else}
		<div class="mt-12 grid gap-12 sm:grid-cols-2">
			<div>
				<p class="text-base opacity-60">This website consumes</p>
				<p class="mt-2 text-7xl font-semibold"><CountUp value={gramsPerView ?? 0} decimals={2} /></p>
				<p class="mt-2 text-base opacity-60">grams of CO₂ per view</p>
			</div>
			<div>
				<p class="text-base opacity-60">Since this website's first publish</p>
				<p class="mt-2 text-7xl font-semibold"><CountUp value={treesPurchased ?? 0} /></p>
				<p class="mt-2 text-base opacity-60">trees have been planted to offset CO₂ use</p>
				<p class="mt-4 text-sm opacity-50">
					Trees planted through
					<a
						href="https://ecologi.com"
						target="_blank"
						rel="noopener noreferrer"
						class="underline underline-offset-2"
					>
						Ecologi
					</a>. Full report on
					<a
						href="https://www.websitecarbon.com/website/liammelkersson-xyz/"
						target="_blank"
						rel="noopener noreferrer"
						class="underline underline-offset-2"
					>
						Website Carbon
					</a>.
				</p>
			</div>
		</div>

		<div class="mt-12">
			<p class="text-base opacity-60">Total CO₂ emitted across {visits} visits</p>
			<p class="mt-2 text-5xl font-semibold"><CountUp value={totalKg ?? 0} decimals={2} />kg</p>
			{#if treesStillOwed !== null && treesStillOwed > 0}
				<p class="mt-1 text-base opacity-60">{treesStillOwed} tree(s) owed, queued for the next offset run</p>
			{/if}
		</div>

		<div id="wcb" class="carbonbadge mt-12"></div>
	{/if}
</div>
<Footer showCarbonBadge={false} />
