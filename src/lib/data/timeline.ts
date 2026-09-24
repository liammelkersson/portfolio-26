export interface TimelineEntry {
	title: string;
	description: string;
	/** Empty string = entry renders without link */
	url: string;
	startYear: number;
	endYear?: number;
	ongoing?: true;
	logoUrl?: string;
}

export interface TimelineGroup<Entry extends TimelineEntry> {
	label: string;
	current: boolean;
	entries: Entry[];
}

const CURRENT_GROUP_LABEL = 'now';

function isCurrent(entry: TimelineEntry) {
	return entry.ongoing === true;
}

function pastEntriesByStartYear<Entry extends TimelineEntry>(entries: Entry[]): TimelineGroup<Entry>[] {
	const past = entries.filter((entry) => !isCurrent(entry));
	const years = [...new Set(past.map((entry) => entry.startYear))].sort((a, b) => b - a);
	return years.map((year) => ({
		label: `${year}`,
		current: false,
		entries: past.filter((entry) => entry.startYear === year)
	}));
}

export function timelineGroups<Entry extends TimelineEntry>(entries: Entry[]): TimelineGroup<Entry>[] {
	const current = entries.filter(isCurrent);
	const currentGroup = current.length ? [{ label: CURRENT_GROUP_LABEL, current: true, entries: current }] : [];
	return [...currentGroup, ...pastEntriesByStartYear(entries)];
}

export function multiYearSpanLabel(entry: TimelineEntry): string | undefined {
	if (entry.ongoing) return `since ${entry.startYear}`;
	if (entry.endYear) return `${entry.startYear}–${entry.endYear}`;
	return undefined;
}
