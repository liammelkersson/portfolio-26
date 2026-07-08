<script lang="ts">
	import { fetchCarbonStats, type CarbonStats } from '$lib/impact/websiteCarbon';
	import { getCachedPageBytes } from '$lib/impact/pageWeight';

	let result = $state<CarbonStats | null>(null);
	let failed = $state(false);

	$effect(() => {
		const bytes = getCachedPageBytes();
		if (bytes === null) {
			failed = true;
			return;
		}
		const controller = new AbortController();
		fetchCarbonStats(bytes, controller.signal)
			.then((data) => {
				result = data;
			})
			.catch(() => {
				failed = true;
			});
		return () => controller.abort();
	});
</script>

<a href="/impact" class="text-xs opacity-60 transition-opacity hover:opacity-100">
	{#if result}
		{result.c}g CO₂/view · cleaner than {result.p}% of pages
	{:else if failed}
		website carbon report
	{:else}
		measuring CO₂…
	{/if}
</a>
