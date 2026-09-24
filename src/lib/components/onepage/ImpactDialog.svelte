<script lang="ts">
	import ImpactFigureList from './ImpactFigureList.svelte';

	let dialog: HTMLDialogElement;
	let hasOpened = $state(false);

	export function open() {
		hasOpened = true;
		dialog.showModal();
	}

	function closeOnBackdropClick(event: MouseEvent) {
		if (event.target === dialog) dialog.close();
	}
</script>

<dialog
	bind:this={dialog}
	onclick={closeOnBackdropClick}
	aria-labelledby="impact-title"
	class="m-auto w-[calc(100%-2rem)] max-w-md rounded-md bg-white p-0 text-black shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] backdrop:bg-black/30 backdrop:backdrop-blur-sm dark:bg-neutral-900 dark:text-white"
>
	<div class="p-6">
		<header class="mb-4 flex items-center justify-between gap-4">
			<h2 id="impact-title" class="text-sm font-normal tracking-[0.08em]">Impact</h2>
			<button
				type="button"
				onclick={() => dialog.close()}
				aria-label="Close"
				class="cursor-pointer p-1 opacity-50 transition-opacity hover:opacity-100"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					aria-hidden="true"
					class="h-4 w-4"
				>
					<path d="M6 6l12 12M18 6 6 18" />
				</svg>
			</button>
		</header>
		{#if hasOpened}
			<ImpactFigureList />
		{/if}
	</div>
</dialog>
