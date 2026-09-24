<script lang="ts">
	let { src, alt, fallbackTitle }: { src?: string; alt: string; fallbackTitle: string } = $props();
</script>

{#if src}
	<img
		{src}
		{alt}
		width="96"
		height="144"
		loading="lazy"
		class="aspect-2/3 w-full rounded-xs object-cover shadow-md"
	/>
{:else}
	<div
		class="flex aspect-2/3 w-full items-end rounded-xs bg-neutral-200 p-2 text-xs shadow-md dark:bg-neutral-800"
	>
		{fallbackTitle}
	</div>
{/if}
