<script lang="ts">
	type LinkRow = { label: string; href: string; icon: string };

	let { links }: { links: LinkRow[] } = $props();
</script>

<ul class="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-6">
	{#each links as link (link.label)}
		<li>
			<a
				href={link.href}
				target="_blank"
				rel="noopener noreferrer"
				class="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
			>
				<span
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-white dark:border-neutral-700/60 dark:bg-neutral-900"
				>
					<img src={link.icon} alt="" class="h-4.5 w-4.5 object-contain" loading="lazy" />
				</span>
				<span class="min-w-0 flex-1 truncate leading-relaxed">{link.label}</span>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="h-4 w-4 shrink-0 opacity-30 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
				>
					<path d="m9 6 6 6-6 6" />
				</svg>
			</a>
		</li>
	{/each}
</ul>
