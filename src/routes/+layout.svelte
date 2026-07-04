<script lang="ts">
	import '../app.css';
	import AsciiBackground from '$lib/components/AsciiBackground.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" type="image/png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<div class="min-h-screen font-sans text-black antialiased dark:text-white">
	<AsciiBackground />
	{@render children()}
</div>
