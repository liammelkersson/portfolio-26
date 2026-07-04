<script lang="ts">
	const MEASURED_URL = 'https://liammelkersson.xyz/';
	const CACHE_KEY = 'carbon-badge';
	const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

	type CarbonResult = { c: number; p: number };

	let result = $state<CarbonResult | null>(null);
	let failed = $state(false);

	const readCache = (): CarbonResult | null => {
		try {
			const raw = localStorage.getItem(CACHE_KEY);
			if (!raw) return null;
			const cached = JSON.parse(raw);
			if (Date.now() - cached.t > CACHE_TTL_MS) return null;
			return cached.v;
		} catch {
			return null;
		}
	};

	$effect(() => {
		const cached = readCache();
		if (cached) {
			result = cached;
			return;
		}
		const controller = new AbortController();
		fetch(`https://api.websitecarbon.com/b?url=${encodeURIComponent(MEASURED_URL)}`, {
			signal: controller.signal
		})
			.then((response) => (response.ok ? response.json() : null))
			.then((data) => {
				if (data && typeof data.c === 'number' && typeof data.p === 'number') {
					result = data;
					localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), v: data }));
				} else {
					failed = true;
				}
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
