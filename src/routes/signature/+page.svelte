<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { emailSignatureHtml, emailSignaturePlainText } from '$lib/signature/buildEmailSignature';
	import { copyRichSignature } from '$lib/signature/copySignature';
	import { pressScale } from '$lib/attachments/pressScale';
	import { iconSwap } from '$lib/attachments/iconSwap';

	const COPIED_RESET_MS = 1500;

	let copied = $state(false);
	let copyFailed = $state(false);
	let resetTimeoutId: ReturnType<typeof setTimeout> | undefined;

	async function copySignature() {
		try {
			const mode = await copyRichSignature(emailSignatureHtml, emailSignaturePlainText);
			copyFailed = mode === 'plain';
		} catch {
			copyFailed = true;
		}
		copied = true;
		clearTimeout(resetTimeoutId);
		resetTimeoutId = setTimeout(() => {
			copied = false;
			copyFailed = false;
		}, COPIED_RESET_MS);
	}

	$effect(() => () => clearTimeout(resetTimeoutId));
</script>

<svelte:head>
	<title>Email signature — Liam Melkersson</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />

	<div class="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
		<a href="/" class="text-base opacity-60 transition-opacity hover:opacity-100">
			<span style="font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif">←</span> back
		</a>

		<h1 class="mt-8 text-3xl font-semibold">Email signature</h1>
		<p class="mt-2 max-w-xl opacity-60">
			Copy this and paste it into your email client's signature settings — formatting comes
			along with it.
		</p>

		<div
			class="mt-10 rounded-2xl border border-neutral-100 bg-white p-8 dark:border-neutral-700/60 dark:bg-neutral-900"
		>
			{@html emailSignatureHtml}
		</div>

		<button
			type="button"
			onclick={copySignature}
			class="mt-6 flex items-center gap-3 rounded-xl border border-neutral-100 px-4 py-2.5 text-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700/60 dark:hover:bg-neutral-800/60"
			{@attach pressScale()}
		>
			<span class="relative h-4 w-4 shrink-0" {@attach iconSwap(copied ? 'check' : 'copy')}>
				<svg
					data-icon="check"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="absolute inset-0 h-4 w-4 text-green-600 dark:text-green-500"
				>
					<path d="m5 13 4 4L19 7" />
				</svg>
				<svg
					data-icon="copy"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="absolute inset-0 h-4 w-4"
				>
					<rect x="9" y="9" width="12" height="12" rx="2" />
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
				</svg>
			</span>
			{#if copied}
				{copyFailed ? 'Copied as plain text' : 'Copied — paste it in'}
			{:else}
				Copy signature
			{/if}
		</button>
	</div>

	<Footer showCarbonBadge={false} />
</div>
