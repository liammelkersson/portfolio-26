<script lang="ts">
	import ProjectShowcase from '$lib/components/turbo/ProjectShowcase.svelte';
	import ScrollStatements from '$lib/components/turbo/ScrollStatements.svelte';
	import TurboFooter from '$lib/components/turbo/TurboFooter.svelte';
	import TurboHeader from '$lib/components/turbo/TurboHeader.svelte';
	import TurboHero from '$lib/components/turbo/TurboHero.svelte';
	import ValueProps from '$lib/components/turbo/ValueProps.svelte';
</script>

<svelte:head>
	<title>Liam Melkersson — Designer &amp; Web Developer</title>
	<meta
		name="description"
		content="Liam Melkersson is a designer and web developer creating clear, useful digital experiences."
	/>
	<link rel="canonical" href="https://liammelkersson.xyz/turbo" />
</svelte:head>

<div class="turbo-page">
	<aside>
		<div class="sidebar-inner">
			<TurboHeader />
			<TurboHero />
			<ValueProps />
		</div>
	</aside>

	<main aria-label="Project gallery">
		<ProjectShowcase />
		<ScrollStatements />
		<TurboFooter />
	</main>
</div>

<style>
	.turbo-page {
		display: grid;
		grid-template-columns: minmax(21rem, 26.8vw) minmax(0, 1fr);
		min-height: 100vh;
		background: #f0f0ed;
		color: #101115;
	}

	:global(.dark) .turbo-page {
		background: #0a0b0e;
		color: #f4f4f2;
	}

	aside {
		min-width: 0;
	}

	.sidebar-inner {
		position: sticky;
		top: 0;
		display: flex;
		height: 100vh;
		min-height: 42rem;
		flex-direction: column;
		padding: clamp(1.5rem, 2.1vw, 2.75rem) clamp(1.5rem, 2vw, 2.5rem);
	}

	main {
		min-width: 0;
		padding: clamp(1.5rem, 2.3vw, 2.85rem) clamp(1.5rem, 2.3vw, 2.85rem) 0 0;
	}

	@media (max-width: 900px) {
		.turbo-page {
			display: block;
		}

		.sidebar-inner {
			position: relative;
			height: auto;
			min-height: 100svh;
			padding: 1.5rem;
		}

		main {
			padding: 0 0.75rem;
		}
	}
</style>
