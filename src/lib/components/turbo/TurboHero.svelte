<script lang="ts">
	import { reveal } from '$lib/attachments/reveal';
	import { pressScale } from '$lib/attachments/pressScale';
	import AboutModal from '$lib/components/turbo/AboutModal.svelte';
</script>

<section id="about" class="intro">
	<h1 {@attach reveal()}>I design and build for the web</h1>
	<p {@attach reveal(80)}>
		I’m a designer who codes, happiest where the two meet: when something well-designed is also
		well-built and using it feels effortless.
	</p>
	<div class="actions" {@attach reveal(140)}>
		<a class="primary micro-control" href="mailto:liam@awaio.com" {@attach pressScale()}>
			<span class="micro-label" data-label="Let’s chat"><span>Let’s chat</span></span>
		</a>
		<AboutModal />
	</div>
</section>

<style>
	.intro {
		margin-top: clamp(3.25rem, 6.4vh, 5.75rem);
	}

	h1 {
		max-width: 7.1em;
		font-size: clamp(2.9rem, 3.3vw, 4rem);
		font-weight: 400;
		line-height: 1.04;
		letter-spacing: -0.055em;
	}

	p {
		max-width: 25rem;
		margin-top: 1.6rem;
		color: #8b8c91;
		font-size: clamp(1.1rem, 1.45vw, 1.5rem);
		line-height: 1.28;
		letter-spacing: -0.025em;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 2rem;
	}

	a {
		display: inline-flex;
		align-items: center;
		min-height: 3.25rem;
		border-radius: 999px;
		padding: 0 1.35rem;
		font-size: 1rem;
		text-decoration: none;
		transition: transform 180ms ease, background-color 180ms ease;
	}

	a:hover,
	a:focus-visible {
		transform: translateY(-2px);
	}

	.primary {
		background: #f7f7f6;
		color: #0a0b0e;
	}

	:global(html:not(.dark)) .primary {
		background: #0a0b0e;
		color: #f7f7f6;
	}
</style>
