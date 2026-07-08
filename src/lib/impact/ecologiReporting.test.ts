import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchTreesPlanted } from './ecologiReporting';

describe('fetchTreesPlanted', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns the total and pending counts from the reporting API', async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ total: 173104, pending: 1 }), { status: 200 })
		);

		const status = await fetchTreesPlanted('liammelkersson');

		expect(status).toEqual({ total: 173104, pending: 1 });
		expect(fetch).toHaveBeenCalledWith(
			'https://public.ecologi.com/users/liammelkersson/trees',
			expect.anything()
		);
	});

	it('throws when the response is not ok', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response('', { status: 404 }));

		await expect(fetchTreesPlanted('liammelkersson')).rejects.toThrow('ecologi reporting request failed');
	});

	it('throws when the response shape is unexpected', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

		await expect(fetchTreesPlanted('liammelkersson')).rejects.toThrow('unexpected ecologi reporting response');
	});
});
