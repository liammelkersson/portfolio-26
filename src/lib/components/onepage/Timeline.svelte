<script lang="ts">
	import { projects } from '$lib/data/projects';
	import { experience } from '$lib/data/experience';
	import { multiYearSpanLabel, timelineGroups } from '$lib/data/timeline';

	const groups = timelineGroups([...projects, ...experience]);
</script>

<details class="group py-8">
	<summary
		class="flex cursor-pointer list-none items-center justify-between gap-4 select-none [&::-webkit-details-marker]:hidden"
	>
		<h2 class="text-sm font-normal tracking-[0.08em]">Timeline</h2>
		<span
			class="text-sm opacity-40 transition-transform duration-200 group-open:rotate-45"
			aria-hidden="true">+</span
		>
	</summary>
	<ol class="mt-6 ml-1 border-l border-black/15 dark:border-white/15">
		{#each groups as group (group.label)}
			<li class="relative pb-8 pl-7 last:pb-0">
				{#if !group.current}
					<h3 class="mb-4 text-xl font-normal tracking-tight tabular-nums">{group.label}</h3>
				{/if}
				<ul class="space-y-5">
					{#each group.entries as entry (entry.title + entry.description)}
						<li>
							<p class="flex items-center gap-2">
								{#if entry.logoUrl}
									<img
										src={entry.logoUrl}
										alt=""
										width="16"
										height="16"
										loading="lazy"
										class="h-4 w-4 rounded-xs"
									/>
								{/if}
								{#if entry.url}
									<a
										href={entry.url}
										target="_blank"
										rel="noopener noreferrer"
										class="underline-offset-2 transition-opacity hover:opacity-70 hover:underline"
										>{entry.title}</a
									>
								{:else}
									{entry.title}
								{/if}
								{#if multiYearSpanLabel(entry)}
									<span class="text-xs tabular-nums opacity-50">{multiYearSpanLabel(entry)}</span>
								{/if}
							</p>
							<p class="mt-1 text-sm leading-relaxed opacity-70">{entry.description}</p>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ol>
</details>
