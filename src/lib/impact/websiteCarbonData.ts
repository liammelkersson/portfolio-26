export type WebsiteCarbonData = { gco2e: number; cleanerThan: number };

// Website Carbon deprecated public access to their auto-crawl badge API in
// July 2025 — /data is the only endpoint they still support, and it requires
// the caller to supply real transferred bytes rather than crawling a URL itself.
export async function fetchGco2eForBytes(
	bytes: number,
	isGreen: boolean,
	signal?: AbortSignal
): Promise<WebsiteCarbonData> {
	const green = isGreen ? 1 : 0;
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
	return { gco2e: data.gco2e, cleanerThan: data.cleanerThan };
}
