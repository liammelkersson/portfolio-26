<script lang="ts">
	import { getLatestWestHamResult } from '$lib/football/latestResultClient';
	import type { MatchResult, TeamScore } from '$lib/football/latestResult';

	let result = $state<MatchResult | null>(null);

	const playedOnLabel = $derived(
		result
			? new Date(result.playedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
			: ''
	);

	$effect(() => {
		const controller = new AbortController();
		getLatestWestHamResult(controller.signal)
			.then((latest) => {
				result = latest;
			})
			.catch(() => {
				result = null;
			});
		return () => controller.abort();
	});
</script>

{#snippet crest(team: TeamScore)}
	{#if team.logoUrl}
		<img src={team.logoUrl} alt={team.name} width="16" height="16" class="h-4 w-4 object-contain" />
	{:else}
		<span class="text-xs">{team.abbreviation}</span>
	{/if}
{/snippet}

{#if result}, bully me: <span
		class="inline-flex items-center gap-1.5 align-middle text-black tabular-nums dark:text-white"
		title="Last result: {result.home.name} {result.home.goals}–{result.away.goals} {result.away.name}, {playedOnLabel}"
	>
		{@render crest(result.home)}
		<span>{result.home.goals}–{result.away.goals}</span>
		{@render crest(result.away)}
	</span>
{/if}
