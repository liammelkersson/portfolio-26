import { MEASURED_URL } from './config';

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

export async function fetchCarbonStats(signal?: AbortSignal): Promise<CarbonStats> {
	const cached = readCache();
	if (cached) return cached;

	const response = await fetch(`https://api.websitecarbon.com/b?url=${encodeURIComponent(MEASURED_URL)}`, {
		signal
	});
	if (!response.ok) {
		throw new Error(`websitecarbon request failed: ${response.status}`);
	}
	const data = await response.json();
	if (typeof data.c !== 'number' || typeof data.p !== 'number') {
		throw new Error('unexpected websitecarbon response shape');
	}
	writeCache(data);
	return data;
}
