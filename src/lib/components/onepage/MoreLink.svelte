<script lang="ts">
	let { href, label, icon }: { href: string; label: string; icon: string } = $props();
</script>

<a
	{href}
	target="_blank"
	rel="noopener noreferrer"
	class="inline-flex shrink-0 items-center gap-2 text-sm opacity-60 transition-opacity hover:opacity-100"
>
	<img src={icon} alt="" height="16" loading="lazy" class="h-4 w-auto rounded-xs" />
	<span class="underline underline-offset-2">{label}</span>
</a>
