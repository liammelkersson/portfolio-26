import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchGco2eForBytes } from './websiteCarbonData';

describe('fetchGco2eForBytes', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('requests the /data endpoint with bytes and green flag', async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ gco2e: 0.05, cleanerThan: 0.91 }), { status: 200 })
		);

		const result = await fetchGco2eForBytes(500000, false);

		expect(result).toEqual({ gco2e: 0.05, cleanerThan: 0.91 });
		expect(fetch).toHaveBeenCalledWith(
			'https://api.websitecarbon.com/data?bytes=500000&green=0',
			expect.anything()
		);
	});

	it('sends green=1 when isGreen is true', async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ gco2e: 0.04, cleanerThan: 0.95 }), { status: 200 })
		);

		await fetchGco2eForBytes(500000, true);

		expect(fetch).toHaveBeenCalledWith(
			'https://api.websitecarbon.com/data?bytes=500000&green=1',
			expect.anything()
		);
	});

	it('throws when the response is not ok', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response('', { status: 500 }));

		await expect(fetchGco2eForBytes(500000, false)).rejects.toThrow('websitecarbon request failed');
	});

	it('throws when the response shape is unexpected', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

		await expect(fetchGco2eForBytes(500000, false)).rejects.toThrow('unexpected websitecarbon response');
	});
});
