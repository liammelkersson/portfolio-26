<script lang="ts">
	import type { Project } from '$lib/data/projects';

	let { project }: { project: Project } = $props();
</script>

{#snippet cardContent()}
	<div class="aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
		{#if project.image}
			<img
				src={project.image}
				alt="{project.title} interface"
				loading="lazy"
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
			/>
		{/if}
	</div>
	<h3 class="mt-3 text-sm font-medium">{project.title}</h3>
	<p class="mt-0.5 text-sm leading-snug opacity-60">{project.description}</p>
{/snippet}

{#if project.url}
	<a href={project.url} target="_blank" rel="noopener noreferrer" class="group block">
		{@render cardContent()}
	</a>
{:else}
	<div class="group">
		{@render cardContent()}
	</div>
{/if}
