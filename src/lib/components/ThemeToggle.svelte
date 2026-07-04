<script lang="ts">
	let isDark = $state(false);

	$effect(() => {
		isDark = document.documentElement.classList.contains('dark');
	});

	const toggleTheme = () => {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	};
</script>

<button
	onclick={toggleTheme}
	role="switch"
	aria-checked={isDark}
	aria-label="Dark mode"
	class="relative h-6 w-11 cursor-pointer rounded-full bg-neutral-200 transition-colors dark:bg-neutral-700"
>
	<span
		class="absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm transition-transform duration-200 dark:translate-x-5 dark:bg-neutral-800 dark:text-neutral-300"
	>
		{#if isDark}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class="h-3 w-3"
			>
				<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
			</svg>
		{:else}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				class="h-3 w-3"
			>
				<circle cx="12" cy="12" r="4" />
				<path
					d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
				/>
			</svg>
		{/if}
	</span>
</button>
