import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchCarbonStats } from './websiteCarbon';

function createMemoryStorage(): Storage {
	const store = new Map<string, string>();
	return {
		getItem: (key) => store.get(key) ?? null,
		setItem: (key, value) => void store.set(key, value),
		removeItem: (key) => void store.delete(key),
		clear: () => store.clear(),
		key: (index) => Array.from(store.keys())[index] ?? null,
		get length() {
			return store.size;
		}
	};
}

describe('fetchCarbonStats', () => {
	beforeEach(() => {
		vi.stubGlobal('localStorage', createMemoryStorage());
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('fetches by real bytes and caches the result on a cold cache', async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ gco2e: 1.39, cleanerThan: 0.17 }), { status: 200 })
		);

		const result = await fetchCarbonStats(500000);

		expect(result).toEqual({ c: 1.39, p: 17 });
		expect(fetch).toHaveBeenCalledWith(
			'https://api.websitecarbon.com/data?bytes=500000&green=0',
			expect.anything()
		);
		expect(JSON.parse(localStorage.getItem('carbon-badge')!).v).toEqual({ c: 1.39, p: 17 });
	});

	it('returns the cached value without fetching when the cache is warm', async () => {
		localStorage.setItem(
			'carbon-badge',
			JSON.stringify({ t: Date.now(), v: { c: 2.5, p: 30 } })
		);

		const result = await fetchCarbonStats(500000);

		expect(result).toEqual({ c: 2.5, p: 30 });
		expect(fetch).not.toHaveBeenCalled();
	});

	it('throws when the response shape is unexpected', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

		await expect(fetchCarbonStats(500000)).rejects.toThrow('unexpected websitecarbon response');
	});
});
