<script lang="ts">
	import CarbonImpactModal from '$lib/components/turbo/CarbonImpactModal.svelte';
	import { companyLogos } from '$lib/data/companyLogos';
</script>

<section class="trust" aria-labelledby="trust-heading">
	<h2 id="trust-heading">Worked with</h2>
	<ul>
		{#each companyLogos as company (company.name)}
			<li>
				<a
					href={company.href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={company.name}
					style:--brand-color={company.color}
					style:--logo-width={`${company.widthPx}px`}
					style:--logo-height={`${company.heightPx}px`}
					style:--logo-image={`url("${company.src}")`}
				>
					<span class="logo" aria-hidden="true"></span>
				</a>
			</li>
		{/each}
	</ul>
	<div class="impact">
		<CarbonImpactModal />
	</div>
</section>

<style>
	.trust {
		margin-top: auto;
		padding-top: 3rem;
	}

	h2 {
		color: #65666b;
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: center;
		gap: 1.5rem 2rem;
		max-width: 21rem;
		margin-top: 1.45rem;
	}

	li {
		display: flex;
		min-height: 2.75rem;
		align-items: center;
	}

	a {
		display: flex;
		width: var(--logo-width);
		height: var(--logo-height);
		align-items: center;
		justify-content: flex-start;
		color: #77787d;
		opacity: 0.62;
		transition: color 360ms var(--micro-ease), opacity 280ms ease, transform 420ms var(--micro-ease);
	}

	a:hover,
	a:focus-visible {
		color: var(--brand-color);
		opacity: 1;
		transform: translateY(-1px);
	}

	.logo {
		display: block;
		width: 100%;
		height: 100%;
		background: currentColor;
		-webkit-mask: var(--logo-image) left center / contain no-repeat;
		mask: var(--logo-image) left center / contain no-repeat;
	}

	.impact {
		margin-top: 2.2rem;
		color: #77787d;
		font-size: 0.77rem;
		line-height: 1.55;
	}

	@media (max-height: 760px) and (min-width: 900px) {
		.trust {
			padding-top: 2rem;
		}

		ul {
			gap: 1rem 1.5rem;
		}

		.impact {
			margin-top: 1.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		a {
			transition: none;
		}
	}
</style>
