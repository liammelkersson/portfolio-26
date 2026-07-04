<script lang="ts">
	import { reveal } from '$lib/attachments/reveal';
	import CarbonBadge from '$lib/components/CarbonBadge.svelte';

	const year = new Date().getFullYear();
</script>

<footer {@attach reveal()} class="mx-auto flex max-w-3xl items-center justify-between px-6 pb-12">
	<p class="text-sm opacity-60">© {year} Liam Melkersson</p>
	<CarbonBadge />
	<p class="text-sm opacity-60" style="font-family: 'Times New Roman', Times, serif">
		111 <span style="font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif">♡</span> 222
	</p>
</footer>
