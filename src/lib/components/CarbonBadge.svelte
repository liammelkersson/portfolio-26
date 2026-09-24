<script lang="ts">
	import { fetchCarbonStats, type CarbonStats } from '$lib/impact/websiteCarbon';

	let { onOpenImpact }: { onOpenImpact: () => void } = $props();

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

<button
	type="button"
	onclick={onOpenImpact}
	class="cursor-pointer text-sm underline underline-offset-2 opacity-60 transition-colors hover:text-[#34C759] hover:opacity-100"
>
	{#if result}
		{result.c}g CO₂/view · cleaner than {result.p}% of pages
	{:else if failed}
		website carbon report
	{:else}
		measuring CO₂…
	{/if}
</button>
