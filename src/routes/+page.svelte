<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import ProjectGrid from '$lib/components/ProjectGrid.svelte';
	import Links from '$lib/components/Links.svelte';
	import Personal from '$lib/components/Personal.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Liam Melkersson',
		url: 'https://liammelkersson.xyz/',
		image: 'https://liammelkersson.xyz/portrait.jpg',
		jobTitle: 'Designer & Web Developer',
		worksFor: {
			'@type': 'Organization',
			name: 'Awaio',
			url: 'https://awaio.com'
		},
		email: 'mailto:liam@awaio.com',
		sameAs: [
			'https://www.linkedin.com/in/liammelkersson',
			'https://dribbble.com/liammelkersson',
			'https://www.instagram.com/liammelkersson'
		]
	};
</script>

<svelte:head>
	<title>Liam Melkersson — Design &amp; Web</title>
	<meta
		name="description"
		content="Portfolio of Liam Melkersson, designer and web developer at Awaio. A selection of website interfaces I've designed and built — awaio.com, jonwest.se, stammy.se and more."
	/>
	<link rel="canonical" href="https://liammelkersson.xyz/" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://liammelkersson.xyz/" />
	<meta property="og:title" content="Liam Melkersson — Design & Web" />
	<meta
		property="og:description"
		content="Portfolio of Liam Melkersson, designer and web developer at Awaio. A selection of website interfaces I've designed and built."
	/>
	<meta property="og:image" content="https://liammelkersson.xyz/portrait.jpg" />
	<meta property="og:image:width" content="640" />
	<meta property="og:image:height" content="640" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Liam Melkersson — Design & Web" />
	<meta
		name="twitter:description"
		content="Portfolio of Liam Melkersson, designer and web developer at Awaio."
	/>
	<meta name="twitter:image" content="https://liammelkersson.xyz/portrait.jpg" />

	{@html `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>`}
</svelte:head>

<Header />
<main>
	<Hero />
	<ProjectGrid />
	<Personal />
	<Links />
</main>
<Footer />
