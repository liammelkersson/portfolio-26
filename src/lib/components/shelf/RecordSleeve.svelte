<script lang="ts">
	import type { Vinyl } from '$lib/data/vinyls';
	import NowPlayingSticker from '$lib/components/shelf/NowPlayingSticker.svelte';

	let { vinyl, recordOut }: { vinyl: Vinyl; recordOut: boolean } = $props();
</script>

<!-- A printed sleeve with real thickness; the record slides out of its right-hand side -->
<span class="sleeve-box" class:record-out={recordOut} style="--cover: url({vinyl.coverUrl})">
	<span class="record" aria-hidden="true">
		<span class="record-label" style="background-image: url({vinyl.coverUrl})"></span>
	</span>
	<span class="face front">
		<img src={vinyl.coverUrl} alt="" loading="lazy" draggable="false" width="384" height="384" />
		{#if vinyl.nowPlaying}
			<NowPlayingSticker />
		{/if}
	</span>
	<span class="face back">
		<span class="back-art" style="background-image: url({vinyl.coverUrl})"></span>
		<span class="back-text">
			<span class="back-artist">{vinyl.artist}</span>
			<span class="back-title">{vinyl.title}</span>
			<span class="back-sides">Side A · Side B · 33⅓ RPM</span>
		</span>
		<span class="barcode"></span>
	</span>
	<span class="face edge edge-left"></span>
	<span class="face edge edge-right"></span>
	<span class="face edge edge-top"></span>
	<span class="face edge edge-bottom"></span>
</span>

<style>
	.sleeve-box {
		--t: var(--sleeve-thickness, 6px);
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
	}

	.face {
		position: absolute;
		display: block;
		backface-visibility: hidden;
	}

	.front,
	.back {
		container-type: inline-size;
		inset: 0;
		overflow: hidden;
		background: #ddd;
	}

	.front {
		transform: translateZ(calc(var(--t) / 2));
		box-shadow: var(--sleeve-shadow, none);
	}

	.front img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Printed card catches a little light from above */
	.front::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(160deg, rgba(255, 255, 255, 0.14), transparent 42%, rgba(0, 0, 0, 0.06));
		pointer-events: none;
	}

	.back {
		transform: rotateY(180deg) translateZ(calc(var(--t) / 2));
		background: #1c1c1c;
	}

	.back-art {
		position: absolute;
		inset: -10%;
		background: center / cover;
		filter: blur(18px) saturate(1.2) brightness(0.55);
	}

	.back-text {
		position: absolute;
		inset: 10cqw 9cqw auto;
		display: flex;
		flex-direction: column;
		gap: 2cqw;
		color: #f4f1ea;
	}

	.back-artist {
		font-size: 3.4cqw;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		opacity: 0.75;
	}

	.back-title {
		font-size: 7cqw;
		font-weight: 600;
		line-height: 1.05;
	}

	.back-sides {
		margin-top: 4cqw;
		font-size: 3cqw;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.6;
	}

	.barcode {
		position: absolute;
		right: 9cqw;
		bottom: 9cqw;
		width: 20cqw;
		height: 9cqw;
		background: repeating-linear-gradient(
			to right,
			#f4f1ea 0 1px,
			transparent 1px 3px,
			#f4f1ea 3px 5px,
			transparent 5px 6px
		);
		opacity: 0.8;
	}

	/* Each edge is printed with the matching strip of the cover, shaded by which way it faces */
	.edge {
		background-size: cover;
		background-repeat: no-repeat;
	}

	.edge-left,
	.edge-right {
		top: 0;
		width: var(--t);
		height: 100%;
	}

	.edge-left {
		left: calc(var(--t) / -2);
		background-image: linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.28)), var(--cover);
		background-position: left center;
		transform: rotateY(-90deg);
	}

	.edge-right {
		left: calc(100% - var(--t) / 2);
		background-image: linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12)), var(--cover);
		background-position: right center;
		transform: rotateY(90deg);
	}

	.edge-top,
	.edge-bottom {
		left: 0;
		width: 100%;
		height: var(--t);
	}

	.edge-top {
		top: calc(var(--t) / -2);
		background-image: linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12)), var(--cover);
		background-position: center top;
		transform: rotateX(90deg);
	}

	.edge-bottom {
		top: calc(100% - var(--t) / 2);
		background-image: linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), var(--cover);
		background-position: center bottom;
		transform: rotateX(-90deg);
	}

	.record {
		position: absolute;
		inset: 2.5%;
		border-radius: 50%;
		background:
			conic-gradient(from 30deg, rgba(255, 255, 255, 0.12), transparent 14%, rgba(255, 255, 255, 0.07) 50%, transparent 64%),
			repeating-radial-gradient(closest-side, #0f0f0f 0 1px, #1b1b1b 1px 2px);
		transition: translate 0.8s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.record-out .record {
		translate: var(--record-slide, 40%) 0;
	}

	.record-label {
		position: absolute;
		inset: 33%;
		border-radius: 50%;
		background: #555 center / cover;
	}

	.record-label::after {
		content: '';
		position: absolute;
		inset: 46%;
		border-radius: 50%;
		background: #0a0a0a;
	}

	@media (prefers-reduced-motion: reduce) {
		.record {
			transition: none;
		}
	}
</style>
