<script lang="ts">
	type LinkRow = { label: string; href: string; icon: string };

	let { links }: { links: LinkRow[] } = $props();

	const COPIED_RESET_MS = 1500;

	let copiedLabel: string | null = $state(null);
	let resetTimeoutId: ReturnType<typeof setTimeout> | undefined;

	function isEmailLink(link: LinkRow) {
		return link.href.startsWith('mailto:');
	}

	function copyEmailAddress(link: LinkRow) {
		navigator.clipboard.writeText(link.href.replace('mailto:', '')).then(() => {
			copiedLabel = link.label;
			clearTimeout(resetTimeoutId);
			resetTimeoutId = setTimeout(() => {
				copiedLabel = null;
			}, COPIED_RESET_MS);
		});
	}

	$effect(() => () => clearTimeout(resetTimeoutId));
</script>

{#snippet rowBody(link: LinkRow)}
	<span
		class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-white dark:border-neutral-700/60 dark:bg-neutral-900"
	>
		<img src={link.icon} alt="" class="h-4.5 w-4.5 object-contain" loading="lazy" />
	</span>
	<span class="min-w-0 flex-1 truncate text-left leading-relaxed">{link.label}</span>
{/snippet}

<ul class="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-6">
	{#each links as link (link.label)}
		<li>
			{#if isEmailLink(link)}
				<button
					type="button"
					onclick={() => copyEmailAddress(link)}
					aria-label="Copy {link.href.replace('mailto:', '')}"
					class="group -mx-3 flex w-[calc(100%+1.5rem)] cursor-pointer items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
				>
					{@render rowBody(link)}
					{#if copiedLabel === link.label}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
							class="h-4 w-4 shrink-0 text-green-600 dark:text-green-500"
						>
							<path d="m5 13 4 4L19 7" />
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
							class="h-4 w-4 shrink-0 opacity-30 transition-opacity group-hover:opacity-100"
						>
							<rect x="9" y="9" width="12" height="12" rx="2" />
							<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
						</svg>
					{/if}
				</button>
			{:else}
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
				>
					{@render rowBody(link)}
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
			{/if}
		</li>
	{/each}
</ul>
