<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import AsciiBackground from '$lib/components/AsciiBackground.svelte';
	import { trackVisit } from '$lib/impact/visitTracking';
	import { recordHomepageWeight } from '$lib/impact/pageWeight';

	let { children } = $props();

	$effect(() => {
		if (browser) {
			trackVisit();
			recordHomepageWeight();
		}
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" type="image/png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<div class="min-h-screen font-sans text-black antialiased dark:text-white">
	<AsciiBackground />
	{@render children()}
</div>
