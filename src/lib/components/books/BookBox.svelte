<script lang="ts">
	import type { Book } from '$lib/data/readingList';

	let { book, isCurrent }: { book: Book; isCurrent: boolean } = $props();

	const depthPercent = $derived((book.thicknessCm / book.widthCm) * 100);
</script>

<!--
	A book as a solid block: covers front and back, the spine on the left,
	page edges on the other three sides. Sized by its parent; depth follows
	the real thickness-to-width ratio.
-->
<span
	class="book-box"
	style="--depth: {depthPercent}cqw; --spine: {book.spineColor}; --spine-text: {book.spineTextColor}; aspect-ratio: {book.widthCm} / {book.heightCm}"
>
	<span class="face cover-front">
		{#if book.coverUrl}
			<img src={book.coverUrl} alt="" loading="lazy" draggable="false" />
		{:else}
			<span class="typeset-cover">
				<span class="typeset-author">{book.author}</span>
				<span class="typeset-rule"></span>
				<span class="typeset-title">{book.title}</span>
			</span>
		{/if}
	</span>
	<span class="face cover-back">
		<span class="back-title">{book.title}</span>
		<span class="back-author">{book.author}</span>
	</span>
	<span class="face spine">
		<span class="spine-text">
			<span class="spine-title">{book.title}</span>
			<span class="spine-author">{book.author}</span>
		</span>
		{#if isCurrent}
			<span class="bookmark" aria-hidden="true"></span>
		{/if}
	</span>
	<span class="face pages pages-side"></span>
	<span class="face pages pages-top"></span>
	<span class="face pages pages-bottom"></span>
</span>

<style>
	.book-box {
		container-type: inline-size;
		position: relative;
		display: block;
		width: 100%;
		transform-style: preserve-3d;
	}

	.face {
		position: absolute;
		display: block;
		backface-visibility: hidden;
	}

	.cover-front,
	.cover-back {
		inset: 0;
		overflow: hidden;
	}

	.cover-front {
		background: var(--spine);
		transform: translateZ(calc(var(--depth) / 2));
		box-shadow: var(--book-shadow, none);
	}

	.cover-front img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Light catching the laminated cover */
	.cover-front::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(150deg, rgba(255, 255, 255, 0.14), transparent 40%, rgba(0, 0, 0, 0.08));
	}

	.typeset-cover {
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		gap: 5cqw;
		padding: 0 12cqw;
		font-family: Georgia, 'Times New Roman', serif;
		color: var(--spine-text);
	}

	.typeset-author {
		font-size: 6cqw;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.typeset-rule {
		width: 18cqw;
		height: 1px;
		background: currentColor;
		opacity: 0.5;
	}

	.typeset-title {
		font-size: 13cqw;
		line-height: 1.05;
	}

	.cover-back {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 2cqw;
		padding: 12cqw;
		background: var(--spine);
		color: var(--spine-text);
		transform: rotateY(180deg) translateZ(calc(var(--depth) / 2));
		font-family: Georgia, 'Times New Roman', serif;
	}

	.back-title {
		font-size: 7cqw;
	}

	.back-author {
		font-size: 4.5cqw;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.7;
	}

	.spine {
		top: 0;
		left: calc(var(--depth) / -2);
		width: var(--depth);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background:
			linear-gradient(to right, rgba(0, 0, 0, 0.18), transparent 25%, transparent 75%, rgba(0, 0, 0, 0.18)),
			var(--spine);
		color: var(--spine-text);
		transform: rotateY(-90deg);
	}

	.spine-text {
		display: flex;
		align-items: center;
		gap: 6cqw;
		max-height: 88%;
		overflow: hidden;
		writing-mode: vertical-rl;
		white-space: nowrap;
		font-size: min(calc(var(--depth) * 0.42), 5.5cqw);
		letter-spacing: 0.04em;
	}

	.spine-author {
		opacity: 0.7;
		text-transform: uppercase;
		font-size: 0.8em;
	}

	/* Ribbon marking the book being read now */
	.bookmark {
		position: absolute;
		top: -6cqw;
		left: 50%;
		width: 3.5cqw;
		height: 22cqw;
		translate: -50% 0;
		background: #a3262f;
		clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%);
	}

	.pages {
		background: repeating-linear-gradient(var(--grain, to right), #f3eee2 0 1px, #e2dccd 1px 2px);
	}

	.pages-side {
		--grain: to right;
		top: 1.5%;
		left: calc(100% - var(--depth) / 2);
		width: var(--depth);
		height: 97%;
		transform: rotateY(90deg);
	}

	.pages-top,
	.pages-bottom {
		--grain: to bottom;
		left: 0;
		width: 98%;
		height: var(--depth);
	}

	.pages-top {
		top: calc(var(--depth) / -2);
		transform: rotateX(90deg);
	}

	.pages-bottom {
		top: calc(100% - var(--depth) / 2);
		transform: rotateX(-90deg);
	}
</style>
