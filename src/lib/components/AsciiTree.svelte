<script lang="ts">
	const STAGES = [
		' .',
		' |\n .',
		' Y\n |',
		' YY\n |',
		'YYY\n |'
	];

	let { progress = 0 }: { progress: number } = $props();

	const stage = $derived(STAGES[Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length))]);
</script>

<pre
	class="ascii-tree font-mono text-lg leading-tight opacity-60 select-none"
	aria-hidden="true"
>{stage}</pre>

<style>
	.ascii-tree {
		display: inline-block;
		transform-origin: bottom center;
		animation: sway 3.5s ease-in-out infinite;
	}

	@keyframes sway {
		0%,
		100% {
			transform: rotate(-2deg);
		}
		50% {
			transform: rotate(2deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ascii-tree {
			animation: none;
		}
	}
</style>
