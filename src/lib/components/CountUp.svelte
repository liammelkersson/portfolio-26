<script lang="ts">
	let { value, decimals = 0, durationMs = 1800 }: { value: number; decimals?: number; durationMs?: number } = $props();

	let displayed = $state(0);
	let previousValue = 0;

	$effect(() => {
		const target = value;
		const start = previousValue;
		const startTime = performance.now();

		let rafId: number;
		const tick = (now: number) => {
			const elapsed = now - startTime;
			const t = Math.min(1, elapsed / durationMs);
			const eased = 1 - Math.pow(1 - t, 5);
			displayed = start + (target - start) * eased;
			if (t < 1) {
				rafId = requestAnimationFrame(tick);
			} else {
				displayed = target;
				previousValue = target;
			}
		};
		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	});
</script>

{displayed.toFixed(decimals)}
