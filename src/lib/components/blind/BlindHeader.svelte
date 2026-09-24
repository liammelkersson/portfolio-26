<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { underlineHover } from '$lib/attachments/underlineHover';
</script>

<header class="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-8">
	<nav class="flex items-center gap-6 text-sm">
		<a
			href="/impact"
			class="relative opacity-60 transition-opacity hover:opacity-100"
			{@attach underlineHover()}
		>
			Impact
			<span
				class="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current"
				data-underline
				aria-hidden="true"
			></span>
		</a>
		<ThemeToggle />
	</nav>
</header>
