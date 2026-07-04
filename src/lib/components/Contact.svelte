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
		}
	];
</script>

<section id="contact" class="mx-auto max-w-3xl px-6 pb-24">
	<div {@attach reveal()}>
		<h2 class="mb-6 text-xs font-normal tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400">Contact</h2>
		<LinkList {links} />
	</div>
</section>
