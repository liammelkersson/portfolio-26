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
</script>

<svelte:head>
	<title>Liam Melkersson</title>
	<meta
		name="description"
		content="Liam Melkersson, designer and web developer at Awaio. Recent books, movies, albums of the year and a timeline of projects."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<TattooBackground />

<main class="mx-auto w-full max-w-xl px-6 pt-16 pb-8">
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

<div class="mx-auto w-full max-w-xl">
	<Footer onOpenImpact={() => impactDialog.open()} />
</div>
<ImpactDialog bind:this={impactDialog} />
