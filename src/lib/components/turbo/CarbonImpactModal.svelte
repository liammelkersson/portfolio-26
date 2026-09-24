<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { pressScale } from '$lib/attachments/pressScale';
	import { fetchTreesPlanted } from '$lib/impact/ecologiReporting';
	import { getVisitCount } from '$lib/impact/visitCounter';
	import { fetchCarbonStats, type CarbonStats } from '$lib/impact/websiteCarbon';

	const FALLBACK_STATS: CarbonStats = { c: 0.08, p: 92 };
	const FALLBACK_VISITS = 96;
	const FALLBACK_TREES = 1;

	let dialog: HTMLDialogElement;
	let stats = $state<CarbonStats>(FALLBACK_STATS);
	let visits = $state(FALLBACK_VISITS);
	let treesPlanted = $state(FALLBACK_TREES);

	const totalKg = $derived((stats.c * visits) / 1000);
	const gramsLabel = $derived(stats.c.toFixed(2));
	const percentileLabel = $derived(Math.round(stats.p));

	$effect(() => {
		const controller = new AbortController();
		Promise.allSettled([
			fetchCarbonStats(controller.signal),
			getVisitCount(controller.signal),
			env.PUBLIC_ECOLOGI_USERNAME
				? fetchTreesPlanted(env.PUBLIC_ECOLOGI_USERNAME, controller.signal)
				: Promise.resolve({ total: FALLBACK_TREES, pending: 0 })
		]).then(([carbonResult, visitsResult, treesResult]) => {
			if (carbonResult.status === 'fulfilled') stats = carbonResult.value;
			if (visitsResult.status === 'fulfilled') visits = visitsResult.value;
			if (treesResult.status === 'fulfilled') {
				treesPlanted = treesResult.value.total + treesResult.value.pending;
			}
		});
		return () => controller.abort();
	});

	function registerDialog(node: HTMLDialogElement) {
		dialog = node;
	}

	function openImpact() {
		dialog.showModal();
	}

	function closeImpact() {
		dialog.close();
	}

	function closeFromBackdrop(event: MouseEvent) {
		if (event.target === dialog) closeImpact();
	}
</script>

<button
	class="summary"
	type="button"
	onclick={openImpact}
	aria-haspopup="dialog"
	{@attach pressScale(0.985)}
>
	{gramsLabel}g CO₂/view · cleaner than {percentileLabel}% of pages
</button>

<dialog
	{@attach registerDialog}
	tabindex="-1"
	autofocus
	aria-labelledby="carbon-modal-title"
	onclick={closeFromBackdrop}
>
	<article>
		<p class="eyebrow" id="carbon-modal-title">Carbon impact</p>

		<div class="metrics">
			<section>
				<p class="label">This website consumes</p>
				<p class="number">{gramsLabel}</p>
				<p class="unit">grams of CO₂ per view</p>
			</section>

			<section>
				<p class="label">Since this website's first publish</p>
				<p class="number">{treesPlanted}</p>
				<p class="unit">trees have been planted to offset CO₂ use</p>
				<p class="reports">
					Trees planted through
					<a href="https://ecologi.com" target="_blank" rel="noopener noreferrer">Ecologi</a>.
					Full report on
					<a
						href="https://www.websitecarbon.com/website/liammelkersson-xyz/"
						target="_blank"
						rel="noopener noreferrer">Website Carbon</a
					>.
				</p>
			</section>

			<section class="total">
				<p class="label">Total CO₂ emitted across {visits} visits</p>
				<p class="total-number">{totalKg.toFixed(5)}kg</p>
			</section>
		</div>

		<button class="close" type="button" onclick={closeImpact} {@attach pressScale()}>Close</button>
	</article>
</dialog>

<style>
	.summary,
	.close {
		border: 0;
		font: inherit;
		cursor: pointer;
	}

	.summary {
		background: transparent;
		padding: 0;
		color: inherit;
		font-size: inherit;
		line-height: inherit;
		text-align: left;
		transition: color 180ms ease;
	}

	.summary:hover,
	.summary:focus-visible {
		color: #f1f1ef;
	}

	:global(html:not(.dark)) .summary:hover,
	:global(html:not(.dark)) .summary:focus-visible {
		color: #111216;
	}

	dialog {
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
		border: 0;
		background: transparent;
		padding: 1rem;
		color: #f8f8f6;
		opacity: 0;
		transition:
			opacity 240ms ease,
			display 240ms allow-discrete,
			overlay 240ms allow-discrete;
	}

	dialog[open] {
		display: grid;
		place-items: center;
		opacity: 1;
	}

	dialog::backdrop {
		background: transparent;
		backdrop-filter: blur(2px);
		transition:
			background-color 240ms ease,
			display 240ms allow-discrete,
			overlay 240ms allow-discrete;
	}

	dialog[open]::backdrop {
		background: rgba(4, 5, 7, 0.28);
	}

	article {
		width: min(100%, 40rem);
		max-height: calc(100svh - 2rem);
		overflow-y: auto;
		border: 1px solid rgba(255, 255, 255, 0.32);
		border-radius: 1.45rem;
		background: rgba(72, 82, 76, 0.17);
		padding: clamp(1.5rem, 2.7vw, 2.4rem);
		box-shadow:
			0 1.5rem 5rem rgba(0, 0, 0, 0.24),
			inset 0 1px 0 rgba(255, 255, 255, 0.3),
			inset 1px 0 0 rgba(255, 255, 255, 0.12),
			inset 0 -1px 0 rgba(255, 255, 255, 0.08);
		-webkit-backdrop-filter: blur(52px) saturate(1.55) contrast(1.05);
		backdrop-filter: blur(52px) saturate(1.55) contrast(1.05);
		overscroll-behavior: contain;
		filter: blur(8px);
		transform: translateY(0.8rem) scale(0.97);
		transition: filter 420ms var(--micro-ease), transform 420ms var(--micro-ease);
	}

	dialog[open] article {
		filter: blur(0);
		transform: translateY(0) scale(1);
	}

	@starting-style {
		dialog[open] {
			opacity: 0;
		}

		dialog[open]::backdrop {
			background: transparent;
		}

		dialog[open] article {
			filter: blur(8px);
			transform: translateY(0.8rem) scale(0.97);
		}
	}

	.eyebrow,
	.label,
	.unit,
	.reports {
		color: rgba(248, 248, 246, 0.58);
	}

	.eyebrow {
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.metrics {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(1.75rem, 3vw, 2.75rem);
		margin-top: clamp(1.5rem, 3vh, 2.2rem);
	}

	.label,
	.unit {
		font-size: clamp(0.88rem, 1.1vw, 1.02rem);
		line-height: 1.25;
		letter-spacing: -0.025em;
	}

	.number {
		margin-top: 1rem;
		font-size: clamp(3.1rem, 5vw, 4.2rem);
		font-weight: 500;
		line-height: 0.9;
		letter-spacing: -0.07em;
	}

	.unit {
		margin-top: 1rem;
	}

	.reports {
		max-width: 31rem;
		margin-top: 1.25rem;
		font-size: clamp(0.82rem, 0.95vw, 0.92rem);
		line-height: 1.35;
	}

	.reports a {
		color: inherit;
		text-underline-offset: 0.12em;
		transition: color 180ms ease;
	}

	.reports a:hover,
	.reports a:focus-visible {
		color: #f8f8f6;
	}

	.total {
		grid-column: 1 / -1;
	}

	.total-number {
		margin-top: 1rem;
		font-size: clamp(2.7rem, 4.2vw, 3.6rem);
		font-weight: 500;
		line-height: 0.95;
		letter-spacing: -0.06em;
	}

	.close {
		width: 100%;
		min-height: 3.35rem;
		margin-top: clamp(1.75rem, 3.5vh, 2.5rem);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		color: inherit;
		font-size: 1rem;
		transition: background-color 180ms ease;
	}

	.close:hover,
	.close:focus-visible {
		background: rgba(255, 255, 255, 0.22);
	}

	@media (max-width: 700px) {
		dialog {
			padding: 0.5rem;
		}

		article {
			max-height: calc(100svh - 1rem);
			border-radius: 1.1rem;
		}

		.metrics {
			grid-template-columns: 1fr;
			gap: 3.5rem;
		}

		.total {
			grid-column: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.summary,
		.close,
		.reports a,
		dialog,
		dialog::backdrop,
		article {
			transition: none;
		}

		article,
		dialog[open] article {
			filter: none;
			transform: none;
		}
	}
</style>
