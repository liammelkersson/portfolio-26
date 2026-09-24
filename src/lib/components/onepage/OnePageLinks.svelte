<script lang="ts">
	import { profileLinks } from '$lib/data/profileLinks';
	import OnePageSection from './OnePageSection.svelte';

	const EMAIL_SCHEME = 'mailto:';

	function newTabTargetFor(href: string) {
		return href.startsWith(EMAIL_SCHEME) ? undefined : '_blank';
	}
</script>

<OnePageSection title="Links">
	<ul class="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-3">
		{#each profileLinks as link (link.label)}
			<li class="min-w-0">
				<a
					href={link.href}
					target={newTabTargetFor(link.href)}
					rel="noopener noreferrer"
					class="group flex items-center gap-2 opacity-70 transition-opacity hover:opacity-100"
				>
					<img src={link.icon} alt="" width="14" height="14" loading="lazy" class="h-3.5 w-3.5 object-contain" />
					<span class="truncate underline-offset-2 group-hover:underline">{link.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</OnePageSection>
