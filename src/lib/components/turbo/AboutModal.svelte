<script lang="ts">
	import { pressScale } from '$lib/attachments/pressScale';

	let dialog: HTMLDialogElement;

	function openAbout() {
		dialog.showModal();
	}

	function closeAbout() {
		dialog.close();
	}

	function closeFromBackdrop(event: MouseEvent) {
		if (event.target === dialog) closeAbout();
	}

	function registerDialog(node: HTMLDialogElement) {
		dialog = node;
	}
</script>

<button
	class="trigger micro-control"
	type="button"
	onclick={openAbout}
	aria-haspopup="dialog"
	{@attach pressScale()}
>
	<span class="micro-label" data-label="About"><span>About</span></span>
</button>

<dialog
	{@attach registerDialog}
	tabindex="-1"
	autofocus
	aria-labelledby="about-modal-title"
	onclick={closeFromBackdrop}
>
	<article>
		<img class="portrait" src="/portrait-160.webp" alt="" width="160" height="160" />

		<h2 id="about-modal-title">About Liam</h2>
		<p class="lead">
			I’m a designer who codes—happiest where design and development meet and ideas become
			clear, useful experiences.
		</p>

		<div class="body-copy">
			<p>
				I work full time at Awaio across marketing, design, web and growth. My work spans
				product interfaces, websites, campaigns and the systems that hold them together.
			</p>
			<p>
				Before Awaio, I worked with Papaja on projects for Awaio, Mitigater and Stammy,
				redesigned JonWest Consulting’s website, and taught Web &amp; User Interface Design at
				Jönköping University.
			</p>
			<p>
				Outside work, you’ll usually find me collecting records, running, watching Formula One
				or following West Ham.
			</p>
		</div>

		<button class="close" type="button" onclick={closeAbout} {@attach pressScale()}>Close</button>
	</article>
</dialog>

<style>
	.trigger,
	.close {
		border: 0;
		font: inherit;
		cursor: pointer;
	}

	.trigger {
		display: inline-flex;
		min-height: 3.25rem;
		align-items: center;
		border-radius: 999px;
		background: #1c1d22;
		padding: 0 1.35rem;
		color: #f5f5f4;
		font-size: 1rem;
		transition: transform 180ms ease, background-color 180ms ease;
	}

	.trigger:hover,
	.trigger:focus-visible {
		transform: translateY(-2px);
	}

	:global(html:not(.dark)) .trigger {
		background: #dededb;
		color: #141519;
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
		width: min(100%, 42rem);
		max-height: calc(100svh - 2rem);
		overflow-y: auto;
		border: 1px solid rgba(255, 255, 255, 0.32);
		border-radius: 1.45rem;
		background: rgba(148, 158, 168, 0.18);
		padding: clamp(1.5rem, 2.6vw, 2.2rem);
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

	.portrait {
		display: block;
		width: 3.9rem;
		height: 3.9rem;
		border: 2px solid rgba(255, 255, 255, 0.62);
		border-radius: 50%;
		object-fit: cover;
	}

	h2 {
		margin-top: clamp(2rem, 4.5vh, 3rem);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		opacity: 0.66;
	}

	.lead {
		max-width: 21em;
		margin-top: 0.75rem;
		font-size: clamp(1.65rem, 2.2vw, 2.1rem);
		line-height: 1.08;
		letter-spacing: -0.04em;
	}

	.body-copy {
		display: grid;
		gap: 1.1rem;
		margin-top: clamp(2rem, 4.5vh, 3rem);
		font-size: clamp(0.95rem, 1.05vw, 1.05rem);
		line-height: 1.4;
		letter-spacing: -0.018em;
	}

	.close {
		width: 100%;
		min-height: 3.35rem;
		margin-top: clamp(2rem, 4.5vh, 3rem);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.13);
		color: inherit;
		font-size: 1rem;
		transition: background-color 180ms ease;
	}

	.close:hover,
	.close:focus-visible {
		background: rgba(255, 255, 255, 0.24);
	}

	@media (max-width: 600px) {
		dialog {
			padding: 0.5rem;
		}

		article {
			max-height: calc(100svh - 1rem);
			border-radius: 1.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.trigger,
		.close,
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
