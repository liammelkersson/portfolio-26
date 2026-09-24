<script lang="ts">
	let { photoLoaded, stampCount }: { photoLoaded: boolean; stampCount: number } = $props();
</script>

<div class="flex h-full w-full flex-col justify-between bg-[#f4eee0] p-3 text-[#2f3b2e]">
	<div class="flex gap-2.5">
		<div class="aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-sm bg-[#e4dccb]">
			{#if photoLoaded}
				<img
					src="/portrait-160.webp"
					alt=""
					draggable="false"
					class="h-full w-full object-cover grayscale-[40%]"
				/>
			{/if}
		</div>
		<dl class="min-w-0 space-y-1.5 text-[0.55rem] leading-tight">
			<div>
				<dt class="opacity-50">Surname</dt>
				<dd class="font-semibold tracking-wide uppercase">Melkersson</dd>
			</div>
			<div>
				<dt class="opacity-50">Given name</dt>
				<dd class="font-semibold tracking-wide uppercase">Liam</dd>
			</div>
			<div>
				<dt class="opacity-50">Stamps</dt>
				<dd class="font-semibold">{stampCount}</dd>
			</div>
		</dl>
	</div>
	<p class="font-mono text-[0.5rem] leading-snug tracking-wider break-all opacity-60">
		P&lt;&lt;MELKERSSON&lt;&lt;LIAM&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
	</p>
</div>
