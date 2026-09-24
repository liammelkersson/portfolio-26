import { describe, expect, test } from 'vitest';
import { multiYearSpanLabel, timelineGroups, withStartYear, type TimelineEntry } from './timeline';

function entryFrom(title: string, years: Pick<TimelineEntry, 'startYear' | 'endYear' | 'ongoing'>): TimelineEntry {
	return { title, description: '', url: '', ...years };
}

function groupTitles(entries: TimelineEntry[]) {
	return timelineGroups(entries).map((group) => [group.label, group.entries.map((entry) => entry.title)]);
}

describe('timeline', () => {
	test('shows current work under "now", then past work under the year it started, newest first', () => {
		const entries = [
			entryFrom('Old', { startYear: 2021 }),
			entryFrom('Studies', { startYear: 2022, endYear: 2025 }),
			entryFrom('Awaio', { startYear: 2024, ongoing: true }),
			entryFrom('Internship', { startYear: 2024 })
		];

		expect(groupTitles(entries)).toEqual([
			['now', ['Awaio']],
			['2024', ['Internship']],
			['2022', ['Studies']],
			['2021', ['Old']]
		]);
	});

	test('keeps listed order within a year and omits "now" when nothing is current', () => {
		const entries = [entryFrom('First', { startYear: 2024 }), entryFrom('Second', { startYear: 2024 })];

		expect(groupTitles(entries)).toEqual([['2024', ['First', 'Second']]]);
	});

	test('leaves projects without a start year off the timeline', () => {
		const projects = [{ title: 'Dated', startYear: 2024 }, { title: 'Concept' }];

		expect(withStartYear(projects).map((project) => project.title)).toEqual(['Dated']);
	});

	test('labels ranges and current work, but not single years', () => {
		expect(multiYearSpanLabel(entryFrom('Stammy', { startYear: 2024 }))).toBeUndefined();
		expect(multiYearSpanLabel(entryFrom('Studies', { startYear: 2022, endYear: 2025 }))).toBe('2022–2025');
		expect(multiYearSpanLabel(entryFrom('Awaio', { startYear: 2024, ongoing: true }))).toBe('since 2024');
	});
});
