<script lang="ts">
	import type { Snippet } from 'svelte';
	import { applyDarkScheme, isDarkSchemeActive } from '$lib/theme/colorScheme';

	let isDark = $state(false);

	$effect(() => {
		isDark = isDarkSchemeActive();
	});

	function toggleDarkScheme() {
		isDark = !isDark;
		applyDarkScheme(isDark);
	}
</script>

<button
	type="button"
	onclick={toggleDarkScheme}
	aria-label="Dark mode"
	aria-pressed={isDark}
	class="cursor-pointer p-1 opacity-60 transition-opacity hover:opacity-100"
>
	<span class="relative block h-4.5 w-4.5">
		{#snippet schemeIcon(iconClass: string, content: Snippet)}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class="absolute inset-0 h-4.5 w-4.5 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none {iconClass}"
			>
				{@render content()}
			</svg>
		{/snippet}
		{#snippet moon()}
			<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
		{/snippet}
		{#snippet sun()}
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
			/>
		{/snippet}
		{@render schemeIcon('dark:scale-50 dark:-rotate-90 dark:opacity-0', moon)}
		{@render schemeIcon('scale-50 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100', sun)}
	</span>
</button>
