<span class="now-playing" aria-hidden="true">
	<span class="now-playing-text">Now<br />playing</span>
</span>

<style>
	/* Holographic foil sticker, stuck on at a slight angle */
	.now-playing {
		position: absolute;
		top: 5%;
		left: 5%;
		display: grid;
		place-items: center;
		width: 22%;
		aspect-ratio: 1;
		border-radius: 50%;
		background:
			radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.85), transparent 45%),
			conic-gradient(from 40deg, #f5c6ff, #c6e2ff, #c8ffe4, #fff3c2, #ffc9d9, #f5c6ff);
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.25),
			inset 0 0 0 1px rgba(255, 255, 255, 0.6);
		rotate: -14deg;
	}

	.now-playing-text {
		font-size: 3.4cqw;
		font-weight: 600;
		line-height: 1;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #1a1a1a;
	}
</style>
