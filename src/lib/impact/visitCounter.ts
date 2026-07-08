import { VISIT_COUNTER_PATH } from './config';

export async function getVisitCount(signal?: AbortSignal): Promise<number> {
	const response = await fetch(VISIT_COUNTER_PATH, { signal });
	if (!response.ok) {
		throw new Error(`visit counter request failed: ${response.status}`);
	}
	const data = await response.json();
	return data.count;
}

export async function incrementVisitCount(): Promise<void> {
	const response = await fetch(VISIT_COUNTER_PATH, { method: 'POST' });
	if (!response.ok) {
		throw new Error(`visit counter request failed: ${response.status}`);
	}
}
