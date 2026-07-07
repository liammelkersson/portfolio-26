<script lang="ts">
	import LinkList from '$lib/components/LinkList.svelte';
	import { reveal } from '$lib/attachments/reveal';

	const links = [
		{
			label: 'liam@awaio.com',
			href: 'mailto:liam@awaio.com',
			icon: '/awaio-icon.png'
		},
		{
			label: 'liammelkersson@live.se',
			href: 'mailto:liammelkersson@live.se',
			icon: '/icons/email.svg'
		},
		{
			label: 'LinkedIn',
			href: 'https://www.linkedin.com/in/liammelkersson',
			icon: '/icons/linkedin.svg'
		},
		{
			label: 'Dribbble',
			href: 'https://dribbble.com/liammelkersson',
			icon: '/icons/dribbble.svg'
		},
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

<section id="links" class="mx-auto max-w-3xl px-6 pb-24">
	<div {@attach reveal()}>
		<h2
			class="mb-6 text-xs font-normal tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400"
		>
			Links
		</h2>
		<LinkList {links} />
		<p class="mt-4 text-xs opacity-40">
			causes I care about:
			<a
				href="https://djurensratt.se/"
				target="_blank"
				rel="noopener noreferrer"
				class="underline opacity-100 transition-opacity hover:opacity-70">Djurens Rätt</a
			>
			&
			<a
				href="https://www.hjarnfonden.se/"
				target="_blank"
				rel="noopener noreferrer"
				class="underline opacity-100 transition-opacity hover:opacity-70">Hjärnfonden</a
			>
		</p>
	</div>
</section>
