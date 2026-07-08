import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { isPlausibleByteCount } from '../../src/lib/impact/pageWeightValidation';
import { PAGE_WEIGHT_STORE, PAGE_WEIGHT_KEY, REPORT_PAGE_WEIGHT_PATH } from '../../src/lib/impact/config';

export default async (request: Request) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return new Response('invalid JSON', { status: 400 });
	}

	const bytes = (body as { bytes?: unknown } | null)?.bytes;
	if (!isPlausibleByteCount(bytes)) {
		return new Response('invalid bytes', { status: 400 });
	}

	const store = getStore(PAGE_WEIGHT_STORE);
	await store.setJSON(PAGE_WEIGHT_KEY, { bytes: Math.round(bytes) });

	return new Response('recorded', { status: 200 });
};

export const config: Config = {
	path: REPORT_PAGE_WEIGHT_PATH
};
