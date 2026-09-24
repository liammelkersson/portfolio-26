<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import ThemeIconToggle from '$lib/components/onepage/ThemeIconToggle.svelte';
	import RecentBooks from '$lib/components/onepage/RecentBooks.svelte';
	import RecentMovies from '$lib/components/onepage/RecentMovies.svelte';
	import AlbumsOfTheYear from '$lib/components/onepage/AlbumsOfTheYear.svelte';
	import Timeline from '$lib/components/onepage/Timeline.svelte';
	import TravelMemories from '$lib/components/onepage/TravelMemories.svelte';
	import OnePageLinks from '$lib/components/onepage/OnePageLinks.svelte';
	import ImpactDialog from '$lib/components/onepage/ImpactDialog.svelte';
	import DesignerWord from '$lib/components/onepage/DesignerWord.svelte';
	import TattooBackground from '$lib/components/onepage/TattooBackground.svelte';
	import WestHamResult from '$lib/components/onepage/WestHamResult.svelte';

	let impactDialog: ImpactDialog;

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
		content="Liam Melkersson, designer at Awaio doing websites, apps and brands. Plus the movies, books, albums and trips I’m into, and a timeline of my work."
	/>
	<link rel="canonical" href="https://liammelkersson.xyz/" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://liammelkersson.xyz/" />
	<meta property="og:title" content="Liam Melkersson — Design & Web" />
	<meta property="og:description" content="Liam Melkersson, designer at Awaio. Websites, apps, brands, and the things I’m into." />
	<meta property="og:image" content="https://liammelkersson.xyz/portrait.jpg" />
	<meta property="og:image:width" content="640" />
	<meta property="og:image:height" content="640" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Liam Melkersson — Design & Web" />
	<meta name="twitter:description" content="Liam Melkersson, designer at Awaio. Websites, apps, brands, and the things I’m into." />
	<meta name="twitter:image" content="https://liammelkersson.xyz/portrait.jpg" />

	{@html `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>`}
</svelte:head>

<TattooBackground />

<main class="mx-auto w-full max-w-[40rem] px-6 pt-16 pb-8">
	<header class="mb-10 flex items-start justify-between gap-6">
		<div>
			<h1 class="text-2xl font-normal">Liam Melkersson</h1>
			<p class="mt-3 font-inter text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
				yo! this website is just for myself to compile a lot of things i enjoy and also some
				work/portfolio stuff. im working as a <DesignerWord />, doing websites,
				apps, brands and other digital design stuff. ive worked with design and development for
				years.
			</p>
			<p class="mt-3 font-inter text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
				design motto:
				<q class="font-indie-flower text-base text-black dark:text-white"
					>only thing that matters is how you make the user feel</q
				>
			</p>
			<p class="mt-3 font-inter text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
				outside of all of that i like bouldering, running and going to concerts. oh and also the
				football team i support is west ham<WestHamResult />
			</p>
		</div>
		<div class="flex items-center gap-1">
			<button
				type="button"
				onclick={() => impactDialog.open()}
				aria-label="Carbon impact"
				class="cursor-pointer p-1 opacity-60 transition-opacity hover:opacity-100"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="h-4.5 w-4.5"
				>
					<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" />
					<path d="M7 16v6" />
					<path d="M13 19v3" />
					<path
						d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"
					/>
				</svg>
			</button>
			<ThemeIconToggle />
		</div>
	</header>

	<RecentMovies />
	<RecentBooks />
	<AlbumsOfTheYear />
	<TravelMemories />
	<Timeline />
	<OnePageLinks />
</main>

<div class="mx-auto w-full max-w-[40rem]">
	<Footer onOpenImpact={() => impactDialog.open()} />
</div>
<ImpactDialog bind:this={impactDialog} />
