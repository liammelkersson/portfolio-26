<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import BlindHeader from '$lib/components/blind/BlindHeader.svelte';
	import BlindHero from '$lib/components/blind/BlindHero.svelte';
	import BlindShowcase from '$lib/components/blind/BlindShowcase.svelte';
</script>

<svelte:head>
	<title>Blind — Liam Melkersson</title>
	<meta name="robots" content="noindex" />
	<link rel="canonical" href="https://liammelkersson.xyz/blind" />
</svelte:head>

<BlindHeader />
<main>
	<BlindHero />
	<BlindShowcase />
</main>
<Footer />
