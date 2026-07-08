import { COUNTERAPI_BASE } from './config';

async function readCount(url: string): Promise<number> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`counterapi request failed: ${response.status}`);
	}
	const data = await response.json();
	return data.count;
}

export function getCounterCount(counterName: string): Promise<number> {
	return readCount(`${COUNTERAPI_BASE}/${counterName}/`);
}

export function incrementCounter(counterName: string): Promise<number> {
	return readCount(`${COUNTERAPI_BASE}/${counterName}/up`);
}
