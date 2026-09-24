<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ImpactStats from '$lib/components/ImpactStats.svelte';
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

	<script src="/vendor/website-carbon-badges-1.1.3.min.js" defer></script>
</svelte:head>

<div class="pointer-events-none fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
	<img
		src="/impact/impact-bg.jpg"
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

		<ImpactStats>
			{#snippet cardFooter()}
				<div id="wcb" class="carbonbadge mt-12"></div>
			{/snippet}
		</ImpactStats>
	</div>
	<Footer showCarbonBadge={false} />
</div>
