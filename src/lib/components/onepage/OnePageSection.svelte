<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		updatedOn,
		action,
		children
	}: { title: string; updatedOn?: string; action?: Snippet; children: Snippet } = $props();
</script>

<section class="py-8">
	<header class="mb-5 flex items-center justify-between gap-4">
		<h2 class="text-sm font-normal tracking-[0.08em]">
			{title}
			{#if updatedOn}
				<span class="ml-2 text-[11px] tracking-normal opacity-40">
					last updated <time datetime={updatedOn} class="tabular-nums">{updatedOn}</time>
				</span>
			{/if}
		</h2>
		{@render action?.()}
	</header>
	{@render children()}
</section>
