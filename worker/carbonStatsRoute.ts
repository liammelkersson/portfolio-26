import { isPlausibleGramsPerView, isPlausiblePercentile } from '../src/lib/impact/carbonStatsValidation';
import { writeCarbonStats } from './impactStateStore';

export async function respondToCarbonStatsReport(request: Request, db: D1Database): Promise<Response> {
	if (request.method !== 'POST') return new Response('method not allowed', { status: 405 });

	const body = (await request.json().catch(() => null)) as { c?: unknown; p?: unknown } | null;
	const { c, p } = body ?? {};
	if (!isPlausibleGramsPerView(c) || !isPlausiblePercentile(p)) {
		return new Response('invalid carbon stats', { status: 400 });
	}

	await writeCarbonStats(db, { c, p });
	return new Response('recorded', { status: 200 });
}
