<script lang="ts">
	import { page } from '$app/state';
	import TattooBackground from '$lib/components/onepage/TattooBackground.svelte';

	const NOT_FOUND_STATUS = 404;

	const notFound = $derived(page.status === NOT_FOUND_STATUS);
</script>

<svelte:head>
	<title>{notFound ? 'Page not found' : 'Something went wrong'} — Liam Melkersson</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<TattooBackground />

<main class="mx-auto flex min-h-screen w-full max-w-[40rem] flex-col items-center justify-center px-6 py-16 text-center">
	{#if notFound}
		<video
			autoplay
			muted
			loop
			playsinline
			poster="/404/speed-poster.webp"
			width="498"
			height="324"
			aria-label="IShowSpeed closing his eyes, unimpressed"
			class="w-full max-w-sm rounded-sm"
		>
			<source src="/404/speed-fast.webm" type="video/webm" />
			<source src="/404/speed-fast.mp4" type="video/mp4" />
		</video>
		<h1 class="mt-6 text-2xl font-normal tabular-nums">404</h1>
	{:else}
		<p class="text-sm tracking-[0.08em] tabular-nums opacity-40">{page.status}</p>
		<h1 class="mt-3 text-2xl font-normal">something broke</h1>
		<p class="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
			{page.error?.message ?? 'an unexpected error happened on my end.'}
		</p>
	{/if}
	<a
		href="/"
		class="mt-3 w-fit text-sm underline underline-offset-2 opacity-60 transition-opacity hover:opacity-100"
		>back home</a
	>
</main>
