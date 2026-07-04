<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import AsciiBackground from '$lib/components/AsciiBackground.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen font-sans text-black antialiased dark:text-white">
	<AsciiBackground />
	{@render children()}
</div>
