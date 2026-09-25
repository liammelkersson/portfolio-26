import { incrementVisitCount, readVisitCount } from './impactStateStore';
import { jsonResponse } from './jsonResponse';

export async function respondToVisitCounter(request: Request, db: D1Database): Promise<Response> {
	if (request.method === 'GET') return jsonResponse({ count: await readVisitCount(db) });
	if (request.method === 'POST') return jsonResponse({ count: await incrementVisitCount(db) });
	return new Response('method not allowed', { status: 405 });
}
