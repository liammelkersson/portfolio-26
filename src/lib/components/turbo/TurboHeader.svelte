<script lang="ts">
	import { resolve } from '$app/paths';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<header class="header">
	<a class="wordmark" href={resolve('/turbo')} aria-label="Liam Melkersson, home">LIAM MELKERSSON</a>
	<ThemeToggle />
</header>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.wordmark {
		color: inherit;
		font-size: clamp(0.9rem, 1.05vw, 1.1rem);
		font-weight: 400;
		font-style: normal;
		line-height: 1;
		letter-spacing: 0.02em;
		text-decoration: none;
	}
</style>
