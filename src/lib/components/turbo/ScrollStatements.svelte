<script lang="ts">
	import { getActiveStatementIndex } from './scrollStatements';

	const statements = [
		'Good products begin with clear ideas',
		'Design gives those ideas shape',
		'Code turns them into something tangible',
		'The best work happens where both meet',
		'Every interaction should feel effortless',
		'That’s the work I care about'
	];

	let section: HTMLElement;
	let activeIndex = $state(0);

	function updateActiveStatement() {
		if (!section) return;

		const rect = section.getBoundingClientRect();
		const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
		const progress = -rect.top / scrollableDistance;
		activeIndex = getActiveStatementIndex(progress, statements.length);
	}

	function trackSection(node: HTMLElement) {
		section = node;
		updateActiveStatement();

		const observer = new ResizeObserver(updateActiveStatement);
		observer.observe(node);

		return () => observer.disconnect();
	}
</script>

<svelte:window onscroll={updateActiveStatement} onresize={updateActiveStatement} />

<section
	class="scroll-statements"
	aria-label="Design principles"
	{@attach trackSection}
>
	<div class="sticky-copy">
		<div class="statements">
			{#each statements as statement, index (statement)}
				<p
					class={{ statement: true, active: index === activeIndex }}
					aria-current={index === activeIndex ? 'true' : undefined}
				>
					{statement}
				</p>
			{/each}
		</div>
	</div>
</section>

<style>
	.scroll-statements {
		height: 360svh;
		margin-top: 1.25rem;
		border-radius: 0.85rem;
		background: #f3f3f0;
		color: #101115;
	}

	:global(.dark) .scroll-statements {
		background: #0a0b0e;
		color: #f5f5f3;
	}

	.sticky-copy {
		position: sticky;
		top: 0;
		display: grid;
		min-height: 100svh;
		place-items: center;
		padding: clamp(2rem, 6vw, 7rem);
	}

	.statements {
		width: min(100%, 67rem);
	}

	.statement {
		color: currentColor;
		font-size: clamp(2rem, 4.35vw, 5.1rem);
		font-weight: 400;
		line-height: 1.08;
		letter-spacing: -0.052em;
		opacity: 0.2;
		transition: opacity 260ms ease;
	}

	.statement.active {
		opacity: 1;
	}

	@media (max-width: 900px) {
		.scroll-statements {
			height: 320svh;
		}

		.sticky-copy {
			padding: clamp(1.5rem, 8vw, 4rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-statements {
			height: auto;
		}

		.sticky-copy {
			position: relative;
			min-height: auto;
			padding-block: clamp(5rem, 12vw, 9rem);
		}

		.statement {
			opacity: 0.72;
			transition: none;
		}
	}
</style>
