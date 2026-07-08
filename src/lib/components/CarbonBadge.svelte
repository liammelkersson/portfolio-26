<script lang="ts">
	import { fetchCarbonStats, type CarbonStats } from '$lib/impact/websiteCarbon';

	let result = $state<CarbonStats | null>(null);
	let failed = $state(false);

	$effect(() => {
		const controller = new AbortController();
		fetchCarbonStats(controller.signal)
			.then((data) => {
				result = data;
			})
			.catch(() => {
				failed = true;
			});
		return () => controller.abort();
	});
</script>

<a
	href="https://www.websitecarbon.com/website/liammelkersson-xyz/"
	target="_blank"
	rel="noopener noreferrer"
	class="text-xs opacity-60 transition-opacity hover:opacity-100"
>
	{#if result}
		{result.c}g CO₂/view · cleaner than {result.p}% of pages
	{:else if failed}
		website carbon report
	{:else}
		measuring CO₂…
	{/if}
</a>
