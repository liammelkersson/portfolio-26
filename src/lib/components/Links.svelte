<script lang="ts">
	import LinkList from '$lib/components/LinkList.svelte';
	import { reveal } from '$lib/attachments/reveal';
	import { profileLinks } from '$lib/data/profileLinks';
</script>

<section id="links" class="mx-auto max-w-3xl px-6 pb-24">
	<div {@attach reveal()}>
		<h2
			class="mb-6 text-xs font-normal tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400"
		>
			Links
		</h2>
		<LinkList links={profileLinks} />
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
