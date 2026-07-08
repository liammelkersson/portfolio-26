import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCounterCount, incrementCounter } from './counterApi';

describe('counterApi', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('getCounterCount reads the count from the base URL without incrementing', async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ count: 42 }), { status: 200 })
		);

		const count = await getCounterCount('carbon-visits');

		expect(count).toBe(42);
		expect(fetch).toHaveBeenCalledWith(
			'https://api.counterapi.dev/v1/liammelkersson-xyz/carbon-visits/'
		);
	});

	it('incrementCounter hits the /up endpoint and returns the new count', async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ count: 43 }), { status: 200 })
		);

		const count = await incrementCounter('carbon-visits');

		expect(count).toBe(43);
		expect(fetch).toHaveBeenCalledWith(
			'https://api.counterapi.dev/v1/liammelkersson-xyz/carbon-visits/up'
		);
	});

	it('throws when the response is not ok', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response('', { status: 500 }));

		await expect(getCounterCount('carbon-visits')).rejects.toThrow('counterapi request failed');
	});
});
