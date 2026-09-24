<script lang="ts">
	import { env } from '$env/dynamic/public';
	import {
		loadImpactFigures,
		totalKgEmitted,
		treesStillOwed,
		type ImpactFigures
	} from '$lib/impact/impactFigures';

	const WEBSITE_CARBON_REPORT_URL = 'https://www.websitecarbon.com/website/liammelkersson-xyz/';
	const ECOLOGI_URL = 'https://ecologi.com';
	const MISSING_FIGURE = '—';
	const KG_DECIMALS = 3;

	let figures = $state<ImpactFigures | null>(null);

	function shown(figure: number | null | undefined, format: (knownFigure: number) => string) {
		return figure === null || figure === undefined ? MISSING_FIGURE : format(figure);
	}

	const rows = $derived([
		{ label: 'co₂ per view', figure: shown(figures?.gramsPerView, (grams) => `${grams} g`) },
		{ label: 'visits', figure: shown(figures?.visits, (count) => count.toLocaleString('en-GB')) },
		{
			label: 'total co₂ emitted',
			figure: shown(figures ? totalKgEmitted(figures) : null, (kg) => `${kg.toFixed(KG_DECIMALS)} kg`)
		},
		{ label: 'trees planted', figure: shown(figures?.treesPlanted, (trees) => `${trees}`) }
	]);

	const owed = $derived(figures ? treesStillOwed(figures) : null);

	$effect(() => {
		const controller = new AbortController();
		loadImpactFigures(env.PUBLIC_ECOLOGI_USERNAME, controller.signal).then((loadedFigures) => {
			figures = loadedFigures;
		});
		return () => controller.abort();
	});
</script>

<p class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
	every visit to this site uses a bit of electricity. i measure it and plant trees to offset it.
</p>

<dl class="mt-6 text-sm" aria-busy={figures === null}>
	{#each rows as row (row.label)}
		<div class="flex items-baseline justify-between gap-4 py-2">
			<dt class="text-neutral-600 dark:text-neutral-400">{row.label}</dt>
			<dd class="tabular-nums">{figures === null ? '…' : row.figure}</dd>
		</div>
	{/each}
</dl>

{#if owed !== null && owed > 0}
	<p class="mt-2 text-xs opacity-50">{owed} tree(s) owed, queued for the next offset run</p>
{/if}

<p class="mt-6 text-xs text-neutral-500">
	trees planted through
	<a href={ECOLOGI_URL} target="_blank" rel="noopener noreferrer" class="underline underline-offset-2"
		>ecologi</a
	>. full report on
	<a
		href={WEBSITE_CARBON_REPORT_URL}
		target="_blank"
		rel="noopener noreferrer"
		class="underline underline-offset-2">website carbon</a
	>.
</p>
