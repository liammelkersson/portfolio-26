<script lang="ts">
	import type { Project } from '$lib/data/projects';
	import { projects } from '$lib/data/projects';
	import { reveal } from '$lib/attachments/reveal';

	const CARD_GRADIENTS = [
		'from-slate-100 to-blue-50 dark:from-neutral-800 dark:to-neutral-900',
		'from-rose-50 to-orange-50 dark:from-neutral-800 dark:to-neutral-900',
		'from-fuchsia-50 to-pink-50 dark:from-neutral-800 dark:to-neutral-900',
		'from-indigo-50 to-violet-50 dark:from-neutral-800 dark:to-neutral-900'
	];

	function gradientFor(index: number): string {
		return CARD_GRADIENTS[index % CARD_GRADIENTS.length];
	}
</script>

{#snippet cardContent(project: Project)}
	<div class="aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-neutral-950">
		{#if project.image}
			<img
				src={project.image}
				alt="{project.title} interface"
				loading="lazy"
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
			/>
		{/if}
	</div>
	<div class="mt-5 flex items-end justify-between gap-4">
		<div>
			<h3 class="text-lg font-medium">{project.title}</h3>
			<p class="mt-1 text-sm leading-snug opacity-60">{project.description}</p>
		</div>
		{#if project.tags}
			<div class="flex shrink-0 flex-wrap justify-end gap-2">
				{#each project.tags as tag (tag)}
					<span class="rounded-full bg-white/70 px-3 py-1 text-xs opacity-70 dark:bg-black/20">{tag}</span>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

<section class="mx-auto max-w-5xl px-6 pb-24">
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
		{#each projects as project, index (project.title)}
			{@const cardClass =
				'group block overflow-hidden rounded-3xl bg-gradient-to-br p-6 ' + gradientFor(index)}
			{#if project.url}
				<a
					href={project.url}
					target="_blank"
					rel="noopener noreferrer"
					{@attach reveal(index * 80)}
					class={cardClass}
				>
					{@render cardContent(project)}
				</a>
			{:else}
				<div {@attach reveal(index * 80)} class={cardClass}>
					{@render cardContent(project)}
				</div>
			{/if}
		{/each}
	</div>
</section>
