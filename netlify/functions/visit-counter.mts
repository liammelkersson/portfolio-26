import { getStore } from '@netlify/blobs';
import { VISITS_STORE, VISITS_KEY } from '../../src/lib/impact/config';

export default async (request: Request) => {
	const store = getStore(VISITS_STORE);

	if (request.method === 'GET') {
		const count = ((await store.get(VISITS_KEY, { type: 'json' })) as number | null) ?? 0;
		return new Response(JSON.stringify({ count }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	if (request.method === 'POST') {
		const current = ((await store.get(VISITS_KEY, { type: 'json' })) as number | null) ?? 0;
		const next = current + 1;
		await store.setJSON(VISITS_KEY, next);
		return new Response(JSON.stringify({ count: next }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response('method not allowed', { status: 405 });
};
