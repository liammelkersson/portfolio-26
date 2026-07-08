<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<header class="mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
	<a
		href="https://awaio.com"
		target="_blank"
		rel="noopener noreferrer"
		class="flex items-center gap-2 text-sm tracking-tight"
	>
		Working at
		<img src="/awaio-logo.svg" alt="Awaio" class="h-3.5" />
	</a>
	<nav class="flex items-center gap-6 text-sm">
		<a href="/#work" class="opacity-60 transition-opacity hover:opacity-100">Work</a>
		<a href="/#links" class="opacity-60 transition-opacity hover:opacity-100">Contact</a>
		<ThemeToggle />
	</nav>
</header>
