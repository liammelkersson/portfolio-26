import { getStore } from '@netlify/blobs';
import { isPlausibleGramsPerView, isPlausiblePercentile } from '../../src/lib/impact/carbonStatsValidation';
import { CARBON_STATS_STORE, CARBON_STATS_KEY } from '../../src/lib/impact/config';

export default async (request: Request) => {
	if (request.method !== 'POST') {
		return new Response('method not allowed', { status: 405 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return new Response('invalid JSON', { status: 400 });
	}

	const { c, p } = (body as { c?: unknown; p?: unknown } | null) ?? {};
	if (!isPlausibleGramsPerView(c) || !isPlausiblePercentile(p)) {
		return new Response('invalid carbon stats', { status: 400 });
	}

	const store = getStore(CARBON_STATS_STORE);
	await store.setJSON(CARBON_STATS_KEY, { c, p });

	return new Response('recorded', { status: 200 });
};
