import { LATEST_RESULT_PATH } from './footballConfig';
import type { MatchResult } from './latestResult';

export async function getLatestWestHamResult(signal: AbortSignal): Promise<MatchResult | null> {
	const response = await fetch(LATEST_RESULT_PATH, { signal });
	if (!response.ok) throw new Error(`latest result request failed: ${response.status}`);
	const body: { result: MatchResult | null } = await response.json();
	return body.result;
}
