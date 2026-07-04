<script lang="ts">
	import { fade } from 'svelte/transition';
	import LinkList from '$lib/components/LinkList.svelte';
	import VinylRack from '$lib/components/VinylRack.svelte';
	import { reveal } from '$lib/attachments/reveal';

	const funFacts = [
		'My favorite movie is Good Will Hunting (1997), closely followed by The Green Mile (1999).',
		'When I was younger I wanted to be an architect.',
		"In 2024 I went to London and saw West Ham come back against Luton (3-1, David Moyes' last home game).",
		'I can do a handstand pretty well.',
		'Since going vegan, my favorite restaurant is probably Mahalo in Stockholm.',
		'I collect vinyl (as shown above) and have over 90 records.',
		'My favorite animes are One Piece, Attack on Titan and Elfen Lied.',
		'My favorite color is green. More specifically #466D44.',
		'My favorite book ever is The Stranger by Albert Camus.',
		'My favorite F1 driver is Oscar Piastri.',
		'My favorite wine is Cabernet Sauvignon.'
	];

	const pipLayouts: Record<number, Array<{ cx: number; cy: number }>> = {
		1: [{ cx: 12, cy: 12 }],
		2: [
			{ cx: 8.5, cy: 8.5 },
			{ cx: 15.5, cy: 15.5 }
		],
		3: [
			{ cx: 8.5, cy: 8.5 },
			{ cx: 12, cy: 12 },
			{ cx: 15.5, cy: 15.5 }
		],
		4: [
			{ cx: 8.5, cy: 8.5 },
			{ cx: 15.5, cy: 8.5 },
			{ cx: 8.5, cy: 15.5 },
			{ cx: 15.5, cy: 15.5 }
		],
		5: [
			{ cx: 8.5, cy: 8.5 },
			{ cx: 15.5, cy: 8.5 },
			{ cx: 12, cy: 12 },
			{ cx: 8.5, cy: 15.5 },
			{ cx: 15.5, cy: 15.5 }
		],
		6: [
			{ cx: 8.5, cy: 8 },
			{ cx: 15.5, cy: 8 },
			{ cx: 8.5, cy: 12 },
			{ cx: 15.5, cy: 12 },
			{ cx: 8.5, cy: 16 },
			{ cx: 15.5, cy: 16 }
		]
	};

	const hexColorPattern = /(#[0-9a-fA-F]{6})\b/;

	let currentFact: string | null = $state(null);
	let diceFace = $state(5);
	let rollCount = $state(0);

	const factSegments = $derived((currentFact ?? '').split(hexColorPattern));

	function isHexColor(segment: string) {
		return hexColorPattern.test(segment) && segment.startsWith('#');
	}

	function rollFunFact() {
		let nextFact = currentFact;
		while (nextFact === currentFact) {
			nextFact = funFacts[Math.floor(Math.random() * funFacts.length)];
		}
		let nextFace = diceFace;
		while (nextFace === diceFace) {
			nextFace = Math.floor(Math.random() * 6) + 1;
		}
		currentFact = nextFact;
		diceFace = nextFace;
		rollCount += 1;
	}

	const interests = [
		{
			label: 'West Ham',
			iconPath:
				'<circle cx="9.5" cy="10" r="5.5"/><circle cx="17.5" cy="6.5" r="2.5"/><circle cx="16" cy="17.5" r="3.5"/><path d="M7 8.2a3 3 0 0 1 1.6-1.6"/>'
		},
		{
			label: 'Frank Ocean',
			iconPath:
				'<circle cx="7" cy="18" r="2.5" /><path d="M9.5 18V5.5L19 4v11" /><circle cx="16.5" cy="15" r="2.5" />'
		},
		{
			label: 'Running',
			iconPath:
				'<g stroke-width="2"><circle cx="14.8" cy="4.2" r="1.9" fill="currentColor" stroke="none" /><path d="M13.8 7.5 11.8 12.5" /><path d="M13.8 7.5l3.4 1.7 2.3-.6" /><path d="M13.8 7.5 10 8.7 8.2 11" /><path d="M11.8 12.5l3 2.5-.7 4.5" /><path d="M11.8 12.5l-3.3 2.8-3.3.5" /></g>'
		},
		{
			label: 'Concerts',
			iconPath:
				'<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a2.5 2.5 0 0 0 0 5V16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a2.5 2.5 0 0 0 0-5z" /><path d="M14.5 6.3v1.9M14.5 11v2M14.5 15.8v1.9" />'
		},
		{
			label: 'Formula One',
			iconPath:
				'<path fill="currentColor" stroke="none" d="M9.6 11.24h7.91L19.75 9H9.39c-2.85 0-3.62.34-5.17 1.81C2.71 12.3 0 15 0 15h3.38c.77-.75 2.2-2.13 2.85-2.75.92-.87 1.37-1.01 3.37-1.01zM20.39 9l-6 6H18l6-6h-3.61zm-3.25 2.61H9.88c-2.22 0-2.6.12-3.55 1.07C5.44 13.57 4 15 4 15h3.15l.75-.75c.49-.49.75-.55 1.78-.55h5.37l2.09-2.09z" />'
		},
		{
			label: 'Plants',
			iconPath:
				'<path d="M12 13V8.5" /><path d="M12 10.5C12 7.5 9.8 5 6.8 5c0 3 2.2 5.5 5.2 5.5z" /><path d="M12 8.5c0-3 2.2-5.5 5.2-5.5 0 3-2.2 5.5-5.2 5.5z" /><path d="M7 13h10l-1 6.2a1.5 1.5 0 0 1-1.5 1.3h-5a1.5 1.5 0 0 1-1.5-1.3z" />'
		}
	];

	const links = [
		{
			label: 'Instagram',
			href: 'https://www.instagram.com/liammelkersson',
			icon: '/icons/instagram.svg'
		},
		{
			label: 'Pinterest',
			href: 'https://www.pinterest.com/liammelkersson',
			icon: '/icons/pinterest.svg'
		},
		{
			label: 'Spotify',
			href: 'https://open.spotify.com/user/liammelkersson',
			icon: '/icons/spotify.svg'
		},
		{
			label: 'IMDb',
			href: 'https://www.imdb.com/user/p.m5offwgsw6skfk2i24rwgspupi',
			icon: '/icons/imdb.svg'
		},
		{
			label: 'MyAnimeList',
			href: 'https://myanimelist.net/animelist/altgirlsimp?status=7',
			icon: '/icons/myanimelist.svg'
		},
		{
			label: 'Discogs',
			href: 'https://www.discogs.com/user/altgirlsimp',
			icon: '/icons/discogs.svg'
		},
		{
			label: 'Strava',
			href: 'https://www.strava.com/athletes/40641208',
			icon: '/icons/strava.svg'
		},
		{
			label: 'Setlist.fm',
			href: 'https://www.setlist.fm/user/liammelkersson',
			icon: '/icons/setlist.png'
		}
	];
</script>

<section id="personal" class="mx-auto max-w-3xl px-6 pb-24">
	<h2 {@attach reveal()} class="mb-6 text-xs font-normal tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400">Personal</h2>
	<div {@attach reveal(60)} class="mb-6">
		<VinylRack />
	</div>
	<div
		{@attach reveal(140)}
		class="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-500 dark:text-neutral-400"
	>
		<span>Interests:</span>
		<ul class="contents">
		{#each interests as interest (interest.label)}
			<li class="flex items-center gap-2">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="h-4 w-4 shrink-0"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- static icon paths defined above -->
					{@html interest.iconPath}
				</svg>
				{interest.label}
			</li>
		{/each}
		</ul>
	</div>
	<div
		{@attach reveal(170)}
		class="mb-10 flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400"
	>
		<button
			type="button"
			onclick={rollFunFact}
			aria-label="Roll the dice for a fun fact"
			class="shrink-0 cursor-pointer rounded-md p-1 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
		>
			{#key rollCount}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="h-5 w-5"
					class:dice-roll={rollCount > 0}
				>
					<rect x="3" y="3" width="18" height="18" rx="4" />
					{#each pipLayouts[diceFace] as pip (pip.cx + '-' + pip.cy)}
						<circle cx={pip.cx} cy={pip.cy} r="0.5" fill="currentColor" />
					{/each}
				</svg>
			{/key}
		</button>
		<div aria-live="polite">
			{#key currentFact}
				<p in:fade={{ duration: 200 }}>
					{#if currentFact === null}
						Roll the dice for a fun fact
					{:else}
						{#each factSegments as segment, segmentIndex (segmentIndex)}
							{#if isHexColor(segment)}
								<span
									aria-hidden="true"
									class="inline-block h-3 w-3 rounded-sm align-baseline"
									style="background-color: {segment}"
								></span>
								{segment}
							{:else}
								{segment}
							{/if}
						{/each}
					{/if}
				</p>
			{/key}
		</div>
	</div>
	<div {@attach reveal(200)}>
		<LinkList {links} />
	</div>
</section>

<style>
	.dice-roll {
		animation: dice-roll 0.4s ease;
	}

	@keyframes dice-roll {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
