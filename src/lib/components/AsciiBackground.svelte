<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	const CELL_SIZE = 12;
	const FONT_SIZE = 8;
	const CHAR_RAMP = [' ', ' ', ' ', '·', '·', ':', '-', '+', '×'];
	const DRIFT_SPEED = 0.12;
	const INK = 'rgba(0, 0, 0, 0.16)';
	const INK_HOVER = 'rgba(0, 0, 0, 0.38)';
	const INK_DARK = 'rgba(255, 255, 255, 0.18)';
	const INK_HOVER_DARK = 'rgba(255, 255, 255, 0.42)';
	const HOVER_RADIUS = 130;
	const HOVER_BOOST = 0.55;
	const MOTIFS = ['111', '222', '♡', '111 ♡ 222'];
	const MOTIF_BLOCK_ROWS = 14;
	const MOTIF_CHANCE = 0.4;
	const MOTIF_MIN_INTENSITY = 0.3;
	// Half-width of the masked-out center strip — must match the 26rem in the
	// --fade mask below
	const MASK_CLEAR_HALF_PX = 416;
	const MAX_FPS = 30;
	const TOUCH_MAX_FPS = 15;
	const MS_PER_SECOND = 1000;

	const asciiField: Attachment<HTMLCanvasElement> = (canvas) => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const touchOnly = window.matchMedia('(hover: none)').matches;
		const frameIntervalMs = MS_PER_SECOND / (touchOnly ? TOUCH_MAX_FPS : MAX_FPS);

		let rafId = 0;
		let lastFrameMs = -Infinity;
		let mouseX = -9999;
		let mouseY = -9999;

		const fitCanvasToViewport = () => {
			const dpr = window.devicePixelRatio || 1;
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.font = `${FONT_SIZE}px monospace`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
		};

		const trackMouse = (event: MouseEvent) => {
			mouseX = event.clientX;
			mouseY = event.clientY;
		};

		const clearMouse = () => {
			mouseX = -9999;
			mouseY = -9999;
		};

		const waveIntensity = (col: number, row: number, t: number) => {
			const v =
				Math.sin(col * 0.35 + t) * Math.cos(row * 0.28 - t * 0.7) +
				Math.sin((col + row) * 0.18 + t * 0.5);
			return (v + 2) / 4;
		};

		// Deterministic per-cell hash so motifs stay put across frames
		const hash01 = (a: number, b: number) => {
			const raw = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
			return raw - Math.floor(raw);
		};

		// Motifs ("111", "♡", ...) only spawn inside the two side bands the mask
		// leaves visible; the center strip would swallow them. Each band is
		// sliced into row blocks, and some blocks host one motif at a hashed spot.
		const motifCharAt = (col: number, row: number): string | null => {
			const centerPx = window.innerWidth / 2;
			const leftBandEndCol = Math.floor((centerPx - MASK_CLEAR_HALF_PX) / CELL_SIZE);
			const rightBandStartCol = Math.ceil((centerPx + MASK_CLEAR_HALF_PX) / CELL_SIZE);
			let band: number;
			if (col < leftBandEndCol) {
				band = 0;
			} else if (col >= rightBandStartCol) {
				band = 1;
			} else {
				return null;
			}
			const blockY = Math.floor(row / MOTIF_BLOCK_ROWS);
			if (hash01(band * 97 + 1, blockY) > MOTIF_CHANCE) return null;
			const motif = MOTIFS[Math.floor(hash01(band * 97 + 2, blockY) * MOTIFS.length)];
			const anchorRow =
				blockY * MOTIF_BLOCK_ROWS + Math.floor(hash01(band * 97 + 3, blockY) * MOTIF_BLOCK_ROWS);
			if (row !== anchorRow) return null;
			const bandStartCol = band === 0 ? 0 : rightBandStartCol;
			const bandCols = band === 0 ? leftBandEndCol : Math.ceil(window.innerWidth / CELL_SIZE) - rightBandStartCol;
			const anchorCol =
				bandStartCol +
				Math.floor(hash01(band * 97 + 4, blockY) * Math.max(1, bandCols - motif.length));
			if (col < anchorCol || col >= anchorCol + motif.length) return null;
			return motif[col - anchorCol];
		};

		const mouseProximity = (x: number, y: number) => {
			const dx = x - mouseX;
			const dy = y - mouseY;
			return Math.exp(-(dx * dx + dy * dy) / (HOVER_RADIUS * HOVER_RADIUS));
		};

		const drawFrame = (timeSeconds: number) => {
			const t = timeSeconds * DRIFT_SPEED;
			const cols = Math.ceil(window.innerWidth / CELL_SIZE);
			const rows = Math.ceil(window.innerHeight / CELL_SIZE);
			const darkMode = document.documentElement.classList.contains('dark');
			const ink = darkMode ? INK_DARK : INK;
			const inkHover = darkMode ? INK_HOVER_DARK : INK_HOVER;
			ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
			for (let row = 0; row <= rows; row++) {
				for (let col = 0; col <= cols; col++) {
					const x = col * CELL_SIZE + CELL_SIZE / 2;
					const y = row * CELL_SIZE + CELL_SIZE / 2;
					const proximity = touchOnly ? 0 : mouseProximity(x, y);
					const intensity = Math.min(1, waveIntensity(col, row, t) + proximity * HOVER_BOOST);
					const motifChar = motifCharAt(col, row);
					if (motifChar !== null) {
						if (motifChar !== ' ' && intensity > MOTIF_MIN_INTENSITY) {
							ctx.fillStyle = proximity > 0.15 ? inkHover : ink;
							ctx.fillText(motifChar, x, y);
						}
						continue;
					}
					const char = CHAR_RAMP[Math.floor(intensity * (CHAR_RAMP.length - 1))];
					if (char !== ' ') {
						ctx.fillStyle = proximity > 0.15 ? inkHover : ink;
						ctx.fillText(char, x, y);
					}
				}
			}
		};

		const loop = (timeMs: number) => {
			rafId = requestAnimationFrame(loop);
			if (timeMs - lastFrameMs < frameIntervalMs) return;
			lastFrameMs = timeMs;
			drawFrame(timeMs / 1000);
		};

		const syncLoopWithVisibility = () => {
			cancelAnimationFrame(rafId);
			if (!document.hidden) {
				rafId = requestAnimationFrame(loop);
			}
		};

		fitCanvasToViewport();
		window.addEventListener('resize', fitCanvasToViewport);

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducedMotion) {
			drawFrame(0);
		} else {
			if (!touchOnly) {
				window.addEventListener('mousemove', trackMouse);
				window.addEventListener('mouseleave', clearMouse);
			}
			document.addEventListener('visibilitychange', syncLoopWithVisibility);
			syncLoopWithVisibility();
		}

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('resize', fitCanvasToViewport);
			window.removeEventListener('mousemove', trackMouse);
			window.removeEventListener('mouseleave', clearMouse);
			document.removeEventListener('visibilitychange', syncLoopWithVisibility);
		};
	};
</script>

<canvas
	{@attach asciiField}
	class="ascii-canvas pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
	aria-hidden="true"
></canvas>

<style>
	.ascii-canvas {
		--fade: linear-gradient(
			to right,
			black,
			transparent calc(50% - 26rem),
			transparent calc(50% + 26rem),
			black
		);
		-webkit-mask-image: var(--fade);
		mask-image: var(--fade);
	}
</style>
