<footer>
	<div>
		<p class="label">Follow</p>
		<nav aria-label="Social links">
			<a href="https://www.linkedin.com/in/liammelkersson" target="_blank" rel="noopener noreferrer">LinkedIn</a>
			<a href="https://dribbble.com/liammelkersson" target="_blank" rel="noopener noreferrer">Dribbble</a>
			<a href="https://www.instagram.com/liammelkersson" target="_blank" rel="noopener noreferrer">Instagram</a>
		</nav>
	</div>

	<div>
		<p class="label">Get in touch</p>
		<a href="mailto:liam@awaio.com">liam@awaio.com</a>
	</div>

	<div class="closing">
		<p>Designing and building clear digital experiences.</p>
		<p>© 2026 Liam Melkersson</p>
	</div>
</footer>

<style>
	footer {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(2rem, 6vw, 7rem);
		border-top: 1px solid rgba(16, 17, 21, 0.15);
		padding: clamp(3rem, 6vw, 6rem) 0;
	}

	:global(.dark) footer {
		border-color: rgba(255, 255, 255, 0.12);
	}

	.label {
		margin-bottom: 1.5rem;
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		opacity: 0.38;
		text-transform: uppercase;
	}

	nav,
	.closing {
		display: grid;
		gap: 0.8rem;
	}

	a,
	.closing p {
		color: inherit;
		font-size: 0.88rem;
		line-height: 1.4;
		opacity: 0.58;
		text-decoration: none;
	}

	a {
		width: fit-content;
		transition: filter 300ms var(--micro-ease), opacity 300ms ease, transform 300ms var(--micro-ease);
	}

	a:hover,
	a:focus-visible {
		opacity: 1;
		transform: translateX(0.2rem);
	}

	nav:has(a:hover) a:not(:hover),
	nav:has(a:focus-visible) a:not(:focus-visible) {
		filter: blur(1.5px);
		opacity: 0.22;
	}

	.closing p:first-child {
		max-width: 17rem;
		opacity: 0.82;
	}

	@media (max-width: 650px) {
		footer {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.closing {
			grid-column: 1 / -1;
			margin-top: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		a {
			transition: none;
		}

	nav:has(a:hover) a:not(:hover),
	nav:has(a:focus-visible) a:not(:focus-visible) {
		filter: none;
	}
	}
</style>
