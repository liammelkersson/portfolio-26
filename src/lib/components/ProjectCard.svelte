<script lang="ts">
	import type { Project } from '$lib/data/projects';
	import { projectCardHover } from '$lib/attachments/projectCardHover';

	let { project }: { project: Project } = $props();
</script>

{#snippet cardContent()}
	<div
		class="project-card flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-white/10"
		style="--card-tint: {project.tint}"
	>
		<div class="flex aspect-[4/3] items-center justify-center px-8 pt-8">
			{#if project.image}
				<img
					src={project.image}
					alt="{project.title} interface"
					loading="lazy"
					class="max-h-full max-w-full rounded-lg object-contain shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)]"
				/>
			{/if}
		</div>
		<div class="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-3 p-6">
			<div class="min-w-0">
				<h3 class="text-base font-semibold">{project.title}</h3>
				<p class="mt-1 text-sm leading-snug opacity-60">{project.description}</p>
			</div>
			{#if project.badges?.length}
				<ul class="flex shrink-0 gap-2">
					{#each project.badges as badge (badge)}
						<li
							class="rounded-full bg-white px-3.5 py-1.5 text-sm whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:bg-neutral-800"
						>
							{badge}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/snippet}

{#if project.url}
	<a
		href={project.url}
		target="_blank"
		rel="noopener noreferrer"
		class="block h-full"
		{@attach projectCardHover()}
	>
		{@render cardContent()}
	</a>
{:else}
	<div class="h-full" {@attach projectCardHover()}>
		{@render cardContent()}
	</div>
{/if}

<style>
	.project-card {
		background:
			radial-gradient(120% 80% at 90% 0%, color-mix(in srgb, var(--card-tint) 22%, transparent), transparent 70%),
			#fafafa;
	}

	:global(html.dark) .project-card {
		background:
			radial-gradient(120% 80% at 90% 0%, color-mix(in srgb, var(--card-tint) 18%, transparent), transparent 70%),
			#222;
	}
</style>
