export interface EspnCompetitor {
	homeAway: 'home' | 'away';
	score?: { displayValue: string };
	team: { displayName: string; abbreviation: string; logos?: { href: string }[] };
}

export interface EspnEvent {
	date: string;
	competitions: { status: { type: { completed: boolean } }; competitors: EspnCompetitor[] }[];
}

export interface EspnSchedule {
	events?: EspnEvent[];
}

export interface TeamScore {
	name: string;
	abbreviation: string;
	goals: string;
	/** Absent when ESPN has no crest; the server swaps this for an inline data URI */
	logoUrl?: string;
}

export interface MatchResult {
	playedOn: string;
	home: TeamScore;
	away: TeamScore;
}

const ESPN_LOGO_HOST = 'https://a.espncdn.com';
const SMALL_LOGO_PX = 64;

export function smallLogoUrl(logoHref: string): string {
	const logoPath = logoHref.replace(ESPN_LOGO_HOST, '');
	return `${ESPN_LOGO_HOST}/combiner/i?img=${logoPath}&h=${SMALL_LOGO_PX}&w=${SMALL_LOGO_PX}`;
}

function isFinished(event: EspnEvent) {
	return event.competitions[0]?.status.type.completed === true;
}

function newestFirst(a: EspnEvent, b: EspnEvent) {
	return b.date.localeCompare(a.date);
}

function teamScoreFrom(competitor: EspnCompetitor): TeamScore {
	const logoHref = competitor.team.logos?.[0]?.href;
	return {
		name: competitor.team.displayName,
		abbreviation: competitor.team.abbreviation,
		goals: competitor.score?.displayValue ?? '0',
		logoUrl: logoHref ? smallLogoUrl(logoHref) : undefined
	};
}

function sideOf(event: EspnEvent, homeAway: EspnCompetitor['homeAway']): TeamScore {
	const competitor = event.competitions[0].competitors.find((entry) => entry.homeAway === homeAway);
	if (!competitor) throw new Error(`ESPN event ${event.date} has no ${homeAway} team`);
	return teamScoreFrom(competitor);
}

export function latestCompletedMatch(schedules: EspnSchedule[]): MatchResult | null {
	const [latest] = schedules
		.flatMap((schedule) => schedule.events ?? [])
		.filter(isFinished)
		.sort(newestFirst);
	if (!latest) return null;
	return { playedOn: latest.date, home: sideOf(latest, 'home'), away: sideOf(latest, 'away') };
}
