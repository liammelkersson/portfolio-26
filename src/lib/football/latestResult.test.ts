import { describe, expect, test } from 'vitest';
import { latestCompletedMatch, smallLogoUrl, type EspnEvent } from './latestResult';

function matchOn(date: string, completed: boolean, [homeGoals, awayGoals]: [string, string]): EspnEvent {
	return {
		date,
		competitions: [
			{
				status: { type: { completed } },
				competitors: [
					{
						homeAway: 'home',
						score: { displayValue: homeGoals },
						team: {
							displayName: 'Millwall',
							abbreviation: 'MIL',
							logos: [{ href: 'https://a.espncdn.com/i/teamlogos/soccer/500/391.png' }]
						}
					},
					{
						homeAway: 'away',
						score: { displayValue: awayGoals },
						team: { displayName: 'West Ham United', abbreviation: 'WHU' }
					}
				]
			}
		]
	};
}

describe('latest west ham result', () => {
	test('picks the most recent finished match across every competition, skipping fixtures', () => {
		const league = { events: [matchOn('2026-09-19T11:30Z', true, ['2', '2']), matchOn('2026-10-09T19:00Z', false, ['0', '0'])] };
		const cup = { events: [matchOn('2026-08-25T18:45Z', true, ['1', '4'])] };

		const result = latestCompletedMatch([cup, league]);

		expect(result?.playedOn).toBe('2026-09-19T11:30Z');
		expect(result?.home).toMatchObject({ name: 'Millwall', goals: '2' });
		expect(result?.away).toMatchObject({ name: 'West Ham United', goals: '2' });
	});

	test('has no result when nothing has been played yet', () => {
		expect(latestCompletedMatch([{ events: [] }, {}])).toBeNull();
	});

	test('asks the logo CDN for a small version of the crest', () => {
		expect(smallLogoUrl('https://a.espncdn.com/i/teamlogos/soccer/500/391.png')).toBe(
			'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/391.png&h=64&w=64'
		);
	});
});
