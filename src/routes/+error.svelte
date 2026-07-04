<script lang="ts">
	import { page } from '$app/state';
	import { reveal } from '$lib/attachments/reveal';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Page not found' : 'Something went wrong'} — Liam Melkersson</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-24">
	<div {@attach reveal()} class="sleeve-scene mb-12" aria-hidden="true">
		<div class="empty-sleeve relative h-40 w-40 rounded-r-sm bg-neutral-100 dark:bg-neutral-900">
			<span class="sleeve-spine"></span>
			<span
				class="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-200 dark:border-neutral-800"
			></span>
			<span
				class="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-200 dark:border-neutral-800"
			></span>
		</div>
	</div>
	<p
		{@attach reveal(80)}
		class="text-xs font-normal tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400"
	>
		{page.status} — {notFound ? 'Not found' : 'Something went wrong'}
	</p>
	<h1 {@attach reveal(140)} class="mt-4 text-3xl font-normal tracking-tight sm:text-4xl">
		{#if notFound}
			This page slipped out of its sleeve.
		{:else}
			The needle skipped.
		{/if}
	</h1>
	<p {@attach reveal(200)} class="mt-4 max-w-md leading-relaxed opacity-60">
		{#if notFound}
			Nothing is filed under this address. Maybe it moved, maybe it never existed.
		{:else}
			{page.error?.message ?? 'An unexpected error occurred.'}
		{/if}
	</p>
	<p {@attach reveal(260)} class="mt-8">
		<a
			href="/"
			class="text-sm underline underline-offset-2 opacity-60 transition-opacity hover:opacity-100"
		>
			← Back to the collection
		</a>
	</p>
</main>

<style>
	/* Same construction as the vinyl shelf: per-item perspective, spine at the
	   left edge extending backward */
	.empty-sleeve {
		transform: perspective(450px) rotateY(55deg);
		transform-origin: left center;
		transform-style: preserve-3d;
	}

	.sleeve-spine {
		position: absolute;
		inset: 0 auto 0 0;
		width: 4px;
		transform: rotateY(90deg);
		transform-origin: left center;
		background: rgba(0, 0, 0, 0.18);
	}

	:global(.dark) .sleeve-spine {
		background: rgba(255, 255, 255, 0.14);
	}
</style>
