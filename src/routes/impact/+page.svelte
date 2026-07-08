<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { fetchCarbonStats } from '$lib/impact/websiteCarbon';
	import { getCounterCount } from '$lib/impact/counterApi';
	import { fetchTreesPlanted } from '$lib/impact/ecologiReporting';
	import { VISITS_COUNTER, GRAMS_PER_TREE } from '$lib/impact/config';
	import { treesOwed } from '$lib/impact/treesOwed';
	import Footer from '$lib/components/Footer.svelte';
	import AsciiTree from '$lib/components/AsciiTree.svelte';
	import AsciiBonsai from '$lib/components/AsciiBonsai.svelte';

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
	const progressToNextTree = $derived(
		totalGrams !== null ? (totalGrams % GRAMS_PER_TREE) / GRAMS_PER_TREE : null
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
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-24">
	<a href="/" class="text-base opacity-60 transition-opacity hover:opacity-100">
		<span style="font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif">←</span> back
	</a>

	<AsciiBonsai />

	{#if failed}
		<p class="mt-6 text-base opacity-60">Couldn't load impact data right now.</p>
	{:else if gramsPerView === null}
		<p class="mt-6 text-base opacity-60">Measuring…</p>
	{:else}
		<div class="mt-12 grid gap-12 sm:grid-cols-2">
			<div>
				<p class="text-base opacity-60">This website consumes</p>
				<p class="mt-2 text-7xl font-semibold">{gramsPerView}</p>
				<p class="mt-2 text-base opacity-60">grams of CO₂ per view</p>
			</div>
			<div>
				<p class="text-base opacity-60">Since this website's first publish</p>
				<p class="mt-2 text-7xl font-semibold">{treesPurchased}</p>
				<p class="mt-2 text-base opacity-60">trees have been planted to offset CO₂ use</p>
			</div>
		</div>

		<div class="mt-12">
			<p class="text-base opacity-60">Total CO₂ emitted across {visits} visits</p>
			<p class="mt-2 text-5xl font-semibold">{totalKg?.toFixed(2)}kg</p>
			{#if treesStillOwed !== null && treesStillOwed > 0}
				<p class="mt-1 text-base opacity-60">{treesStillOwed} tree(s) owed, queued for the next offset run</p>
			{/if}
		</div>

		<div class="mt-8 flex items-end gap-4">
			<div class="flex-1">
				<p class="text-base opacity-60">Progress to next tree</p>
				<div class="mt-2 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800">
					<div
						class="h-2 rounded-full bg-current"
						style="width: {(progressToNextTree ?? 0) * 100}%"
					></div>
				</div>
			</div>
			<AsciiTree progress={progressToNextTree ?? 0} />
		</div>

		<p class="mt-12 text-sm opacity-50">
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
	{/if}
</div>
<Footer showCarbonBadge={false} />
