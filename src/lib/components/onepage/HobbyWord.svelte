<script lang="ts">
	type Hobby = 'climbing' | 'running' | 'concerts';

	const easterEggs: Record<Hobby, string[]> = {
		climbing: ['🧗'],
		running: ['🏃'],
		concerts: ['🎵', '🎶']
	};

	let { hobby }: { hobby: Hobby } = $props();
</script>

<span class="hobby {hobby}"
	>{hobby}{#each easterEggs[hobby] as egg, eggIndex (egg)}<span
			class="egg"
			style="--egg-index: {eggIndex}"
			aria-hidden="true">{egg}</span
		>{/each}</span
>

<style>
	.hobby {
		position: relative;
		display: inline-block;
		cursor: default;
	}

	.egg {
		position: absolute;
		font-size: 0.9em;
		line-height: 1;
		opacity: 0;
		pointer-events: none;
	}

	.climbing .egg {
		right: -0.9em;
		bottom: 0;
	}

	.climbing:hover .egg {
		animation: climb-up 1.4s ease-out forwards;
	}

	.running .egg {
		bottom: -0.55em;
		left: 0;
		transform: scaleX(-1);
	}

	.running:hover .egg {
		animation: run-across 0.9s linear forwards;
	}

	.concerts .egg {
		top: -0.6em;
		left: calc(30% + var(--egg-index) * 35%);
	}

	.concerts:hover .egg {
		animation: float-note 1.3s ease-out forwards;
		animation-delay: calc(var(--egg-index) * 0.25s);
	}

	@keyframes climb-up {
		0% {
			opacity: 0;
			transform: translateY(0.3em);
		}
		20% {
			opacity: 1;
		}
		80% {
			opacity: 1;
			transform: translateY(-1.1em) rotate(-4deg);
		}
		100% {
			opacity: 0;
			transform: translateY(-1.3em);
		}
	}

	@keyframes run-across {
		0% {
			opacity: 0;
			left: -0.4em;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			left: 100%;
		}
	}

	@keyframes float-note {
		0% {
			opacity: 0;
			transform: translateY(0.4em) rotate(0deg);
		}
		25% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(-1.2em) rotate(15deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hobby:hover .egg {
			animation: none;
			opacity: 1;
		}
	}
</style>
