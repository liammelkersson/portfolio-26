<span class="selection-frame">
	<span class="designer">designer</span>
	<span class="handle top-left" aria-hidden="true"></span>
	<span class="handle top-right" aria-hidden="true"></span>
	<span class="handle bottom-left" aria-hidden="true"></span>
	<span class="handle bottom-right" aria-hidden="true"></span>
	<svg class="pointer" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
		<path
			d="M1 1 L14 6.5 L8 8 L6.5 14 Z"
			fill="currentColor"
			stroke="white"
			stroke-width="1.5"
			stroke-linejoin="round"
		/>
	</svg>
</span>

<style>
	.selection-frame {
		--frame-blue: #3b82f6;
		--pointer-black: #000;
		--handle-size: 6px;
		position: relative;
		display: inline-block;
		margin: 0 0.35em;
		padding: 0.15em 0.5em;
		border: 1px solid var(--frame-blue);
		line-height: 1;
		vertical-align: middle;
	}

	.designer {
		font-family: 'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', cursive;
		font-size: 1.15em;
		color: #34c759;
	}

	.handle {
		position: absolute;
		width: var(--handle-size);
		height: var(--handle-size);
		border: 1px solid var(--frame-blue);
		background: white;
	}

	.top-left {
		top: calc(var(--handle-size) / -2);
		left: calc(var(--handle-size) / -2);
	}

	.top-right {
		top: calc(var(--handle-size) / -2);
		right: calc(var(--handle-size) / -2);
	}

	.bottom-left {
		bottom: calc(var(--handle-size) / -2);
		left: calc(var(--handle-size) / -2);
	}

	.bottom-right {
		right: calc(var(--handle-size) / -2);
		bottom: calc(var(--handle-size) / -2);
	}

	.pointer {
		position: absolute;
		right: -15px;
		bottom: -14px;
		color: var(--pointer-black);
		pointer-events: none;
	}

	:global(.dark) .handle {
		background: #171717;
	}
</style>
