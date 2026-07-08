import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getVisitCount, incrementVisitCount } from './visitCounter';

describe('visitCounter', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('getVisitCount reads the count via GET', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ count: 42 }), { status: 200 }));

		const count = await getVisitCount();

		expect(count).toBe(42);
		expect(fetch).toHaveBeenCalledWith('/api/visit-counter', expect.objectContaining({ signal: undefined }));
	});

	it('incrementVisitCount POSTs to the counter endpoint', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ count: 43 }), { status: 200 }));

		await incrementVisitCount();

		expect(fetch).toHaveBeenCalledWith('/api/visit-counter', { method: 'POST' });
	});

	it('throws when the response is not ok', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response('', { status: 500 }));

		await expect(getVisitCount()).rejects.toThrow('visit counter request failed');
	});
});
