<script lang="ts">
	import { reveal } from '$lib/attachments/reveal';
	import { companyLogos } from '$lib/data/companyLogos';
</script>

<ul {@attach reveal()} class="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-4">
	{#each companyLogos as logo, index (logo.name)}
		<li class="group relative">
			<a
				href={logo.href}
				target="_blank"
				rel="noopener noreferrer"
				aria-describedby="logo-tooltip-{index}"
			>
				<span
					class="relative inline-block"
					style="height: {logo.heightPx}px; width: {logo.widthPx}px"
				>
					<img
						src={logo.src}
						alt={logo.name}
						class="absolute inset-0 h-full w-full opacity-40 brightness-0 transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0 dark:invert"
					/>
					<span
						aria-hidden="true"
						class="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
						style="background-color: {logo.color}; mask-image: url({logo.src}); -webkit-mask-image: url({logo.src}); mask-size: contain; mask-repeat: no-repeat; mask-position: center;"
					></span>
				</span>
			</a>
			<div
				role="tooltip"
				id="logo-tooltip-{index}"
				class="pointer-events-none absolute top-full left-1/2 z-10 mt-3 w-56 -translate-x-1/2 -translate-y-1 rounded-lg bg-neutral-900 px-3.5 py-2.5 text-xs leading-relaxed text-neutral-300 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:bg-neutral-100 dark:text-neutral-600"
			>
				<span class="font-medium text-white dark:text-neutral-900">{logo.role}</span>
				{logo.description}
				<span
					class="absolute bottom-full left-1/2 -mb-px h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-neutral-900 dark:bg-neutral-100"
				></span>
			</div>
		</li>
	{/each}
</ul>
