<span class="cover-art">
	<span class="cover-title">Passport</span>
	<svg viewBox="0 0 48 48" aria-hidden="true" class="cover-emblem">
		<circle cx="24" cy="24" r="19" />
		<ellipse cx="24" cy="24" rx="8" ry="19" />
		<path d="M5 24h38M8 14h32M8 34h32" />
	</svg>
	<span class="cover-name">Liam Melkersson</span>
</span>

<style>
	.cover-art {
		container-type: inline-size;
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 18cqw 10cqw;
		border-radius: inherit;
		color: #d8c38a;
		background:
			linear-gradient(to right, rgba(0, 0, 0, 0.25), transparent 8%),
			radial-gradient(120% 90% at 30% 20%, #56805a, #466d44 55%, #35533a);
	}

	.cover-title {
		font-size: 8cqw;
		letter-spacing: 0.35em;
		text-transform: uppercase;
	}

	.cover-emblem {
		width: 36cqw;
		height: 36cqw;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.4;
	}

	.cover-name {
		font-size: 6cqw;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		opacity: 0.85;
	}
</style>
