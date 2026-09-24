<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import CompanyLogos from '$lib/components/CompanyLogos.svelte';
	import { projects } from '$lib/data/projects';
	import { reveal } from '$lib/attachments/reveal';
</script>

<section id="work" class="mx-auto max-w-3xl px-6 pb-24">
	<h2 {@attach reveal()} class="mb-8 text-xs font-normal tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400">
		Selected work
	</h2>
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
		{#each projects as project, index (project.title)}
			<div {@attach reveal(index * 80)} class="h-full">
				<ProjectCard {project} />
			</div>
		{/each}
	</div>
	<div class="mt-16">
		<CompanyLogos />
	</div>
</section>
