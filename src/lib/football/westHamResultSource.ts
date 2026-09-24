import { ESPN_COMPETITIONS, WEST_HAM_ESPN_TEAM_ID } from './footballConfig';
import { latestCompletedMatch, type EspnSchedule, type MatchResult, type TeamScore } from './latestResult';

const ESPN_SCHEDULE_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

async function scheduleFor(competition: string): Promise<EspnSchedule> {
	const response = await fetch(`${ESPN_SCHEDULE_BASE}/${competition}/teams/${WEST_HAM_ESPN_TEAM_ID}/schedule`);
	if (!response.ok) throw new Error(`ESPN ${competition} schedule failed: ${response.status}`);
	return response.json();
}

async function logoAsDataUri(logoUrl: string): Promise<string | undefined> {
	const response = await fetch(logoUrl);
	if (!response.ok) return undefined;
	const bytes = Buffer.from(await response.arrayBuffer()).toString('base64');
	return `data:${response.headers.get('content-type') ?? 'image/png'};base64,${bytes}`;
}

async function withInlineLogo(team: TeamScore): Promise<TeamScore> {
	return { ...team, logoUrl: team.logoUrl ? await logoAsDataUri(team.logoUrl) : undefined };
}

/** Logos are inlined because the site's CSP only allows `self` and `data:` images */
export async function fetchLatestWestHamResult(): Promise<MatchResult | null> {
	const schedules = await Promise.allSettled(ESPN_COMPETITIONS.map(scheduleFor));
	const loaded = schedules.flatMap((schedule) => (schedule.status === 'fulfilled' ? [schedule.value] : []));
	if (!loaded.length) throw new Error('every ESPN schedule request failed');
	const match = latestCompletedMatch(loaded);
	if (!match) return null;
	const [home, away] = await Promise.all([withInlineLogo(match.home), withInlineLogo(match.away)]);
	return { ...match, home, away };
}
