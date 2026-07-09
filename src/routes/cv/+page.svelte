<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { reveal } from '$lib/attachments/reveal';

	const experience = [
		{
			company: 'Awaio',
			role: 'Design & Web',
			dates: 'Jun 2024 – Present',
			description: 'Marketing, design, web, growth.'
		},
		{
			company: 'JonWest Consulting AB',
			role: 'Web Designer',
			dates: 'Jun 2025 – Oct 2025',
			description: "Short web project redesigning JonWest Consulting's website."
		},
		{
			company: 'Papaja',
			role: 'Designer + Developer',
			dates: 'Mar 2024 – May 2024',
			description: 'Worked on projects for Awaio, Mitigater and Stammy.'
		},
		{
			company: 'OneOneOne.',
			role: 'Designer + Developer',
			dates: 'Jun 2018 – Mar 2024',
			description:
				'Freelance design work for different companies and people, including the largest West Ham fan account on Instagram (@Westhamlatest) — matchday designs for football matches.'
		},
		{
			company: 'Tekniska Högskolan i Jönköping (JTH)',
			role: 'Teaching Assistant',
			dates: 'Sep 2023 – Dec 2023',
			description: 'Teaching assistant for the course Web & User Interface Design.'
		}
	];
</script>

<svelte:head>
	<title>CV — Liam Melkersson</title>
	<meta
		name="description"
		content="Work history and education for Liam Melkersson, designer and web developer at Awaio."
	/>
	<link rel="canonical" href="https://liammelkersson.xyz/cv" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://liammelkersson.xyz/cv" />
	<meta property="og:title" content="CV — Liam Melkersson" />
	<meta
		property="og:description"
		content="Work history and education for Liam Melkersson, designer and web developer at Awaio."
	/>
	<meta property="og:image" content="https://liammelkersson.xyz/portrait.jpg" />
	<meta property="og:image:width" content="640" />
	<meta property="og:image:height" content="640" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="CV — Liam Melkersson" />
	<meta
		name="twitter:description"
		content="Work history and education for Liam Melkersson, designer and web developer at Awaio."
	/>
	<meta name="twitter:image" content="https://liammelkersson.xyz/portrait.jpg" />
</svelte:head>

<Header />
<main class="mx-auto max-w-3xl px-6 py-24">
	<section {@attach reveal()} class="mb-16">
		<h1 class="mb-2 text-2xl font-medium tracking-tight">Liam Melkersson</h1>
		<p class="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
			Design & Web @ Awaio · Jönköping, Sweden
		</p>
		<p class="max-w-xl text-neutral-700 dark:text-neutral-300">
			I design and develop intuitive digital experiences. By integrating aesthetics with
			front-end solutions, I create interactions that solve user needs.
		</p>
	</section>

	<section class="mb-16">
		<h2
			{@attach reveal()}
			class="mb-6 text-xs font-normal tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400"
		>
			Experience
		</h2>
		<ul class="space-y-8">
			{#each experience as job, index (job.company)}
				<li {@attach reveal(index * 60)}>
					<div class="flex flex-wrap items-baseline justify-between gap-x-4">
						<p class="font-medium">{job.role} · {job.company}</p>
						<p class="text-sm text-neutral-500 dark:text-neutral-400">{job.dates}</p>
					</div>
					<p class="mt-1 text-neutral-700 dark:text-neutral-300">{job.description}</p>
				</li>
			{/each}
		</ul>
	</section>

	<section {@attach reveal()}>
		<h2
			class="mb-6 text-xs font-normal tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400"
		>
			Education
		</h2>
		<div class="flex flex-wrap items-baseline justify-between gap-x-4">
			<p class="font-medium">Bachelor's degree, Grafisk Design & Webbutveckling (New Media Design)</p>
			<p class="text-sm text-neutral-500 dark:text-neutral-400">Aug 2022 – May 2025</p>
		</div>
		<p class="mt-1 text-neutral-700 dark:text-neutral-300">Jönköping University</p>
	</section>
</main>
<Footer />
