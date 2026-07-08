<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { getCounterCount } from '$lib/impact/counterApi';
	import { fetchTreesPlanted } from '$lib/impact/ecologiReporting';
	import { VISITS_COUNTER } from '$lib/impact/config';

	let visits = $state<number | null>(null);
	let treesPurchased = $state<number | null>(null);
	let failed = $state(false);

	$effect(() => {
		const controller = new AbortController();
		Promise.all([
			getCounterCount(VISITS_COUNTER),
			env.PUBLIC_ECOLOGI_USERNAME
				? fetchTreesPlanted(env.PUBLIC_ECOLOGI_USERNAME, controller.signal)
				: Promise.resolve(0)
		])
			.then(([visitCount, treeCount]) => {
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
	{#if failed}
		<p class="mt-6 text-sm opacity-60">Couldn't load impact data right now.</p>
	{:else if visits === null}
		<p class="mt-6 text-sm opacity-60">Measuring…</p>
	{:else}
		<div class="mt-12 grid gap-12 sm:grid-cols-2">
			<div>
				<p class="text-sm opacity-60">Total visits since launch</p>
				<p class="mt-2 text-6xl font-semibold">{visits}</p>
			</div>
			<div>
				<p class="text-sm opacity-60">Since this website's first publish</p>
				<p class="mt-2 text-6xl font-semibold">{treesPurchased}</p>
				<p class="mt-2 text-sm opacity-60">trees have been planted to offset CO2 use</p>
			</div>
		</div>

		<p class="mt-12 text-xs opacity-50">
			Offsets purchased automatically through
			<a
				href="https://ecologi.com"
				target="_blank"
				rel="noopener noreferrer"
				class="underline underline-offset-2"
			>
				Ecologi
			</a>. For an independent per-page carbon rating, see the
			<a
				href="https://www.websitecarbon.com/website/liammelkersson-xyz/"
				target="_blank"
				rel="noopener noreferrer"
				class="underline underline-offset-2"
			>
				Website Carbon report
			</a>.
		</p>
	{/if}
</div>
