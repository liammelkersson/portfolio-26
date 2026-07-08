const CACHE_KEY = 'carbon-badge';
const CACHE_TTL_MS = 60 * 60 * 1000;

// Checked via https://api.thegreenwebfoundation.org/greencheck/liammelkersson.xyz
// — update if hosting ever moves to a green-certified provider.
const IS_GREEN_HOSTED = false;

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

// Website Carbon deprecated public access to their auto-crawl badge API in
// July 2025 — /data is the only endpoint they still support, and it requires
// the caller to supply real transferred bytes rather than crawling a URL itself.
export async function fetchCarbonStats(bytes: number, signal?: AbortSignal): Promise<CarbonStats> {
	const cached = readCache();
	if (cached) return cached;

	const green = IS_GREEN_HOSTED ? 1 : 0;
	const response = await fetch(`https://api.websitecarbon.com/data?bytes=${bytes}&green=${green}`, {
		signal
	});
	if (!response.ok) {
		throw new Error(`websitecarbon request failed: ${response.status}`);
	}
	const data = await response.json();
	if (typeof data.gco2e !== 'number' || typeof data.cleanerThan !== 'number') {
		throw new Error('unexpected websitecarbon response shape');
	}
	const stats: CarbonStats = { c: data.gco2e, p: Math.round(data.cleanerThan * 100) };
	writeCache(stats);
	return stats;
}
