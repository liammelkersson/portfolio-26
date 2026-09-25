import { ESPN_COMPETITIONS, WEST_HAM_ESPN_TEAM_ID } from './footballConfig';
import { latestCompletedMatch, type EspnSchedule, type MatchResult } from './latestResult';

const ESPN_SCHEDULE_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

async function scheduleFor(competition: string, signal: AbortSignal): Promise<EspnSchedule> {
	const response = await fetch(`${ESPN_SCHEDULE_BASE}/${competition}/teams/${WEST_HAM_ESPN_TEAM_ID}/schedule`, {
		signal
	});
	if (!response.ok) throw new Error(`ESPN ${competition} schedule failed: ${response.status}`);
	return response.json();
}

export async function getLatestWestHamResult(signal: AbortSignal): Promise<MatchResult | null> {
	const schedules = await Promise.allSettled(
		ESPN_COMPETITIONS.map((competition) => scheduleFor(competition, signal))
	);
	const loaded = schedules.flatMap((schedule) => (schedule.status === 'fulfilled' ? [schedule.value] : []));
	if (!loaded.length) throw new Error('every ESPN schedule request failed');
	return latestCompletedMatch(loaded);
}
