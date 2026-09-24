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

<main class="mx-auto flex min-h-screen w-full max-w-[40rem] flex-col justify-center px-6 py-16">
	<p class="text-sm tracking-[0.08em] tabular-nums opacity-40">{page.status}</p>
	<h1 class="mt-3 text-2xl font-normal">
		{notFound ? 'this page doesn’t exist' : 'something broke'}
	</h1>
	<p class="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
		{#if notFound}
			maybe it moved, maybe it never did. either way, nothing lives here.
		{:else}
			{page.error?.message ?? 'an unexpected error happened on my end.'}
		{/if}
	</p>
	<a
		href="/"
		class="mt-8 inline-flex w-fit items-center gap-2 text-sm opacity-60 transition-opacity hover:opacity-100"
	>
		<span aria-hidden="true">←</span>
		<span class="underline underline-offset-2">back home</span>
	</a>
</main>
