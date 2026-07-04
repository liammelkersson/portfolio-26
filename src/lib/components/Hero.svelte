<script lang="ts">
	import { reveal } from '$lib/attachments/reveal';

	const companyLogos = [
		{
			name: 'Awaio',
			src: '/logos/awaio.svg',
			heightPx: 19,
			widthPx: 90.1,
			role: 'Full time.',
			description: 'Working with marketing, design, web, growth.'
		},
		{
			name: 'Papaja',
			src: '/logos/papaja.png',
			heightPx: 34,
			widthPx: 87.8,
			role: 'Internship.',
			description: 'Worked on projects for Awaio, Mitigater and Stammy.'
		},
		{
			name: 'JonWest Consulting',
			src: '/logos/jonwest.png',
			heightPx: 42,
			widthPx: 84,
			role: 'Web design project.',
			description: "Short web project redesigning JonWest Consulting's website."
		},
		{
			name: 'Jönköping University',
			src: '/logos/ju.png',
			heightPx: 27,
			widthPx: 108.5,
			role: 'Teaching Assistant.',
			description: 'Teaching assistant for the course Web & User Interface Design.'
		},
		{
			name: 'Liberalerna',
			src: '/logos/liberalerna.png',
			heightPx: 27,
			widthPx: 97,
			role: 'Media designer.',
			description: 'Digital design for a political campaign in 2022.'
		}
	];
</script>

<section class="mx-auto max-w-3xl px-6 pt-20 pb-24">
	<div {@attach reveal()} class="flex items-center gap-5">
		<img
			src="/portrait-160.webp"
			alt="Liam Melkersson"
			width="160"
			height="160"
			fetchpriority="high"
			class="h-20 w-20 shrink-0 rounded-full object-cover"
		/>
		<div>
			<h1 class="text-4xl font-normal tracking-tight sm:text-5xl">Liam Melkersson</h1>
			<p class="mt-2 text-lg opacity-60">Design &amp; Web</p>
		</div>
	</div>
	<p {@attach reveal(100)} class="mt-8 max-w-xl leading-relaxed">
		I'm a designer who codes, happiest where the two meet: when something well-designed is also
		well-built and using it feels effortless. I do that at Awaio, where I'm responsible for
		design, marketing and web.
	</p>
	<ul {@attach reveal(200)} class="mt-10 flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-4">
		{#each companyLogos as logo, index (logo.name)}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex (tooltip trigger must be focusable so keyboard users can reveal it) -->
			<li class="group relative" tabindex="0" aria-describedby="logo-tooltip-{index}">
				<img
					src={logo.src}
					alt={logo.name}
					style="height: {logo.heightPx}px; width: {logo.widthPx}px"
					class="opacity-40 brightness-0 transition-opacity duration-200 group-hover:opacity-70 dark:invert"
				/>
				<div
					role="tooltip"
					id="logo-tooltip-{index}"
					class="pointer-events-none absolute top-full left-1/2 z-10 mt-3 w-56 -translate-x-1/2 -translate-y-1 rounded-lg bg-neutral-900 px-3.5 py-2.5 text-xs leading-relaxed text-neutral-300 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 dark:bg-neutral-100 dark:text-neutral-600"
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
</section>
