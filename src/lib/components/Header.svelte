<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { underlineHover } from '$lib/attachments/underlineHover';

	type HeaderTone = 'page' | 'overImage';

	const HEADER_CLEARANCE_PX = 80;

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/impact', label: 'Impact' },
		{ href: '/personal', label: 'Personal' }
	];

	const positionFor: Record<HeaderTone, string> = {
		page: 'sticky top-0',
		overImage: 'fixed inset-x-0 top-0'
	};

	let { tone = 'page' }: { tone?: HeaderTone } = $props();

	let scrollY = $state(0);
	let innerHeight = $state(0);
	const scrolledPastImage = $derived(scrollY > innerHeight - HEADER_CLEARANCE_PX);
	const isOnImage = $derived(tone === 'overImage' && !scrolledPastImage);
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div
	class="z-20 w-full transition-[background-color,color,backdrop-filter] duration-300 {positionFor[
		tone
	]}"
	class:text-white={isOnImage}
	class:solid-bar={!isOnImage}
>
	<header
		class="mx-auto flex w-full max-w-3xl items-center justify-between px-6 transition-[padding] duration-300"
		class:py-8={isOnImage}
		class:py-4={!isOnImage}
	>
		<nav class="flex items-center gap-4 text-sm sm:gap-6">
			{#each navLinks as navLink (navLink.href)}
				<a
					href={navLink.href}
					class="relative opacity-60 transition-opacity hover:opacity-100"
					{@attach underlineHover()}
				>
					{navLink.label}
					<span
						class="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current"
						data-underline
						aria-hidden="true"
					></span>
				</a>
			{/each}
			<ThemeToggle />
		</nav>
		<a
			href="https://awaio.com"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2 text-sm tracking-tight"
		>
			<span class="hidden sm:inline">Working at</span>
			<img
				src="/awaio-logo.svg"
				alt="Awaio"
				class="h-3.5 transition-[filter] duration-300"
				class:logo-on-image={isOnImage}
			/>
		</a>
	</header>
</div>

<style>
	.solid-bar {
		background-color: rgb(255 255 255 / 0.8);
		backdrop-filter: blur(12px);
	}

	:global(html.dark) .solid-bar {
		background-color: rgb(26 26 26 / 0.8);
	}

	.logo-on-image {
		filter: brightness(0) invert(1);
	}
</style>
