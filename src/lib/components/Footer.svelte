<script lang="ts">
	import { reveal } from '$lib/attachments/reveal';
	import CarbonBadge from '$lib/components/CarbonBadge.svelte';

	const year = new Date().getFullYear();
</script>

<footer
	{@attach reveal()}
	class="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-y-3 px-6 pb-12"
>
	<p class="order-1 text-sm whitespace-nowrap opacity-60">© {year} Liam Melkersson</p>
	<div class="order-3 w-full sm:order-2 sm:w-auto">
		<CarbonBadge />
	</div>
	<p
		class="order-2 text-sm whitespace-nowrap opacity-60 sm:order-3"
		style="font-family: 'Times New Roman', Times, serif"
	>
		111 <span style="font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif">♡</span> 222
	</p>
</footer>
