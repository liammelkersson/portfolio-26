import { IS_GREEN_HOSTED } from './config';
import { fetchGco2eForBytes } from './websiteCarbonData';

const CACHE_KEY = 'carbon-badge';
const CACHE_TTL_MS = 60 * 60 * 1000;

export type CarbonStats = { c: number; p: number };

function readCache(): CarbonStats | null {
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const cached = JSON.parse(raw);
		if (Date.now() - cached.t > CACHE_TTL_MS) return null;
		return cached.v;
	} catch {
		return null;
	}
}

function writeCache(value: CarbonStats): void {
	localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), v: value }));
}

export async function fetchCarbonStats(bytes: number, signal?: AbortSignal): Promise<CarbonStats> {
	const cached = readCache();
	if (cached) return cached;

	const data = await fetchGco2eForBytes(bytes, IS_GREEN_HOSTED, signal);
	const stats: CarbonStats = { c: data.gco2e, p: Math.round(data.cleanerThan * 100) };
	writeCache(stats);
	return stats;
}
