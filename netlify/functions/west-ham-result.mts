import { fetchLatestWestHamResult } from '../../src/lib/football/westHamResultSource';

const CDN_CACHE = 'public, durable, s-maxage=3600, stale-while-revalidate=86400';
const BROWSER_CACHE = 'public, max-age=600';

export default async () => {
	try {
		const result = await fetchLatestWestHamResult();
		return new Response(JSON.stringify({ result }), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': BROWSER_CACHE,
				'Netlify-CDN-Cache-Control': CDN_CACHE
			}
		});
	} catch (error) {
		console.error('west-ham-result:', error);
		return new Response(JSON.stringify({ result: null }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
