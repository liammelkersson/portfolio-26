<script lang="ts">
	import { onMount } from 'svelte';
	import { animate } from 'motion';
	import type { Snippet } from 'svelte';
	import { motionTransition, prefersReducedMotion } from '$lib/motion/reducedMotion';

	interface Tilt {
		x: number;
		y: number;
	}

	let {
		label,
		origin,
		startTilt = { x: 0, y: 0 },
		restingTilt = { x: -8, y: -28 },
		onClosed,
		object,
		info,
		actions
	}: {
		label: string;
		origin: HTMLElement;
		startTilt?: Tilt;
		restingTilt?: Tilt;
		onClosed: () => void;
		object: Snippet<[boolean]>;
		info: Snippet;
		actions: Snippet;
	} = $props();

	const FLIGHT_SPRING = { type: 'spring', stiffness: 150, damping: 22 } as const;
	const DRAG_DEG_PER_PX = 0.45;
	const MAX_TILT_DEG = 40;
	const INERTIA_DECAY = 0.94;
	const INERTIA_STOP_DEG = 0.05;
	const KEY_TURN_DEG = 20;

	let dialog: HTMLDialogElement;
	let stage: HTMLDivElement;

	// svelte-ignore state_referenced_locally
	let tiltX = $state(startTilt.x);
	// svelte-ignore state_referenced_locally
	let turnY = $state(startTilt.y);
	let isRevealed = $state(false);
	let isDragging = $state(false);
	let isCoasting = $state(false);
	let isClosing = false;

	let lastPointerX = 0;
	let lastPointerY = 0;
	let spinVelocity = 0;
	let inertiaFrame = 0;

	// Offsets that make the centred stage sit exactly on top of the object on the shelf
	function offsetsToOrigin() {
		const from = origin.getBoundingClientRect();
		const to = stage.getBoundingClientRect();
		return {
			x: from.left + from.width / 2 - (to.left + to.width / 2),
			y: from.top + from.height / 2 - (to.top + to.height / 2),
			scale: Math.max(from.width / to.width, from.height / to.height)
		};
	}

	async function flyIn() {
		const start = offsetsToOrigin();
		const flight = animate(
			stage,
			{ x: [start.x, 0], y: [start.y, 0], scale: [start.scale, 1] },
			motionTransition(FLIGHT_SPRING)
		);
		tiltX = restingTilt.x;
		turnY = restingTilt.y;
		await flight;
		isRevealed = true;
	}

	async function putBack() {
		if (isClosing) return;
		isClosing = true;
		cancelAnimationFrame(inertiaFrame);
		isCoasting = false;
		isRevealed = false;
		tiltX = startTilt.x;
		turnY = startTilt.y + Math.round((turnY - startTilt.y) / 360) * 360;
		const end = offsetsToOrigin();
		await animate(stage, { x: end.x, y: end.y, scale: end.scale }, motionTransition(FLIGHT_SPRING));
		dialog.close();
		onClosed();
	}

	function clampTilt(degrees: number): number {
		return Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, degrees));
	}

	function startSpin(event: PointerEvent) {
		cancelAnimationFrame(inertiaFrame);
		isCoasting = false;
		isDragging = true;
		spinVelocity = 0;
		lastPointerX = event.clientX;
		lastPointerY = event.clientY;
		stage.setPointerCapture(event.pointerId);
	}

	function spin(event: PointerEvent) {
		if (!isDragging) return;
		spinVelocity = (event.clientX - lastPointerX) * DRAG_DEG_PER_PX;
		turnY += spinVelocity;
		tiltX = clampTilt(tiltX - (event.clientY - lastPointerY) * DRAG_DEG_PER_PX);
		lastPointerX = event.clientX;
		lastPointerY = event.clientY;
	}

	function coast() {
		spinVelocity *= INERTIA_DECAY;
		turnY += spinVelocity;
		if (Math.abs(spinVelocity) > INERTIA_STOP_DEG) inertiaFrame = requestAnimationFrame(coast);
		else isCoasting = false;
	}

	function endSpin() {
		if (!isDragging) return;
		isDragging = false;
		if (prefersReducedMotion()) return;
		isCoasting = true;
		inertiaFrame = requestAnimationFrame(coast);
	}

	function turnWithKeys(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') turnY -= KEY_TURN_DEG;
		if (event.key === 'ArrowRight') turnY += KEY_TURN_DEG;
	}

	function closeFromBackdrop(event: MouseEvent) {
		if (event.target === dialog) putBack();
	}

	function closeFromEscape(event: Event) {
		event.preventDefault();
		putBack();
	}

	onMount(() => {
		dialog.showModal();
		flyIn();
		return () => cancelAnimationFrame(inertiaFrame);
	});
</script>

<!-- Clicks on the empty area land on the dialog itself; Esc and the close button cover keyboard users -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclick={closeFromBackdrop}
	oncancel={closeFromEscape}
	onkeydown={turnWithKeys}
	aria-label={label}
	class="focus-room"
>
	<div class="object-info">
		{@render info()}
	</div>

	<div
		bind:this={stage}
		class="stage"
		class:is-dragging={isDragging}
		role="img"
		aria-label="{label}, drag to spin"
		onpointerdown={startSpin}
		onpointermove={spin}
		onpointerup={endSpin}
		onpointercancel={endSpin}
	>
		<div class="spinner" class:is-free={isDragging || isCoasting} style="transform: rotateX({tiltX}deg) rotateY({turnY}deg)">
			{@render object(isRevealed)}
		</div>
	</div>

	<div class="object-actions">
		{@render actions()}
		<p class="text-xs opacity-60">Drag to spin · Esc to put back</p>
	</div>

	<button type="button" onclick={putBack} aria-label="Put it back" class="close-button cursor-pointer">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" class="h-5 w-5">
			<path d="M6 6l12 12M18 6L6 18" />
		</svg>
	</button>
</dialog>

<style>
	.focus-room {
		--size: min(56svh, 78vw, 540px);
		width: 100vw;
		max-width: 100vw;
		height: 100svh;
		max-height: 100svh;
		margin: 0;
		padding: 0;
		overflow: hidden;
		border: 0;
		background: transparent;
		color: #111;
	}

	:global(html.dark) .focus-room {
		color: #f2f2f2;
	}

	.focus-room::backdrop {
		background: rgba(232, 232, 232, 0.35);
		backdrop-filter: blur(14px);
	}

	:global(html.dark) .focus-room::backdrop {
		background: rgba(18, 18, 18, 0.45);
	}

	/* Centred with auto margins, so motion's x / y / scale own the transform */
	.stage {
		position: absolute;
		inset: 0;
		width: var(--size);
		height: var(--size);
		margin: auto;
		perspective: 1400px;
		cursor: grab;
		touch-action: none;
		user-select: none;
	}

	.stage.is-dragging {
		cursor: grabbing;
	}

	.spinner {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.spinner.is-free {
		transition: none;
	}

	.object-info {
		position: absolute;
		top: 5.5rem;
		left: 1.5rem;
		right: 1.5rem;
	}

	.object-actions {
		position: absolute;
		left: 0;
		right: 0;
		top: calc(50% + var(--size) / 2 + 2rem);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.close-button {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		padding: 0.5rem;
		border-radius: 999px;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.close-button:hover {
		opacity: 1;
	}

	@media (min-width: 1024px) {
		.object-info {
			top: 50%;
			left: 3rem;
			right: auto;
			translate: 0 -50%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner {
			transition: none;
		}
	}
</style>
