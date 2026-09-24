<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import AsciiBackground from '$lib/components/AsciiBackground.svelte';
	import { trackVisit } from '$lib/impact/visitTracking';

	const ONE_PAGE_ROUTE = '/v2';

	let { children } = $props();

	const showsAsciiBackground = $derived(page.route.id !== ONE_PAGE_ROUTE && !page.error);

	$effect(() => {
		if (browser) trackVisit();
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" type="image/png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<div class="min-h-screen font-sans text-black antialiased dark:text-white">
	{#if showsAsciiBackground}
		<AsciiBackground />
	{/if}
	{@render children()}
</div>
