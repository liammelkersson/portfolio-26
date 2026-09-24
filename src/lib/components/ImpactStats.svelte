<script lang="ts">
	import type { Snippet } from 'svelte';
	import { env } from '$env/dynamic/public';
	import {
		loadImpactFigures,
		totalKgEmitted,
		treesStillOwed as treesStillOwedFor,
		type ImpactFigures
	} from '$lib/impact/impactFigures';
	import CountUp from '$lib/components/CountUp.svelte';

	let { cardFooter }: { cardFooter?: Snippet } = $props();

	let figures = $state<ImpactFigures | null>(null);
	const loaded = $derived(figures !== null);
	const gramsPerView = $derived(figures?.gramsPerView ?? null);
	const visits = $derived(figures?.visits ?? null);
	const treesPurchased = $derived(figures?.treesPlanted ?? null);
	const totalKg = $derived(figures ? totalKgEmitted(figures) : null);
	const treesStillOwed = $derived(figures ? treesStillOwedFor(figures) : null);

	$effect(() => {
		const controller = new AbortController();
		loadImpactFigures(env.PUBLIC_ECOLOGI_USERNAME, controller.signal).then((loadedFigures) => {
			figures = loadedFigures;
		});
		return () => controller.abort();
	});
</script>

{#if !loaded}
	<p class="mt-6 text-base opacity-60">Measuring…</p>
{:else}
	<div
		class="mt-8 rounded-2xl border border-black/10 bg-white/55 p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] backdrop-blur-md sm:p-10 dark:border-white/10 dark:bg-neutral-900/55 dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]"
	>
		<div class="grid gap-12 sm:grid-cols-2">
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

				{@render cardFooter?.()}
	</div>
{/if}
