# Carbon Offset Impact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/impact` page showing the site's live per-view carbon footprint, total visits, and cumulative CO2 since launch, backed by a Netlify Scheduled Function that automatically buys offset trees via Ecologi once enough CO2 has accumulated.

**Architecture:** A public `counterapi.dev` counter (`carbon-visits`) tracks visit count with no auth needed. The client increments/reads it for display. Trees-planted count is read directly from Ecologi's own public Reporting API (`GET /users/{username}/trees`, no auth) — ground truth, not a self-maintained proxy counter, so it can never drift out of sync. A Netlify Scheduled Function (cron, every 6h) independently reads the visit counter + Ecologi's reporting count, computes trees owed, and — gated by a monthly cap stored in Netlify Blobs — purchases a tree via Ecologi's Impact API using a server-only env var key. The display path and purchase path never touch each other directly, so concurrent page visitors can never race a purchase.

**Tech Stack:** SvelteKit 5 (runes), TypeScript, Vitest (new — for pure-function unit tests), Netlify Functions v2 (`@netlify/functions`), Netlify Blobs (`@netlify/blobs`).

## Global Constraints

- Grams-per-tree threshold: `22000` (22kg CO2/tree/year, generic estimate — spec section "Auto-purchase")
- Monthly purchase cap: exactly 1 purchase per calendar month, regardless of trees owed
- `DRY_RUN` env var defaults to `true` (anything other than the literal string `'false'` counts as dry-run) — must stay dormant until the user has an Ecologi account/key and confirms dry-run log output
- Ecologi API key (`ECOLOGI_API_KEY`) lives only in Netlify's env var store, read server-side, never bundled into client code
- Ecologi public username (`PUBLIC_ECOLOGI_USERNAME`) is **not secret** — build-time public env var (SvelteKit `PUBLIC_` prefix), used both client-side (page display) and server-side (offset function)
- counterapi.dev namespace: `liammelkersson-xyz`; counter: `carbon-visits` (no auth, public GET/`/up` endpoints, confirmed CORS-open)
- Ecologi Reporting API: `GET https://public.ecologi.com/users/{username}/trees` → `{ total: number, pending: number }`, no auth, confirmed CORS-open (`access-control-allow-origin: *`)
- Ecologi Impact API purchase endpoint: `POST https://public.ecologi.com/impact/trees`, header `Authorization: Bearer <key>`, header `Idempotency-Key: <key>` (a header, not a body field — confirmed against https://docs.ecologi.com/), JSON body `{ number, name }`
- Scheduled function cron: `0 */6 * * *` (every 6 hours)
- Visit counter increments once per browser session (sessionStorage-guarded), from the root layout so it reflects total site traffic, not just `/impact` visits
- Never change structure and behavior in the same commit — the CarbonBadge refactor (Task 6) is behavior-preserving; the CarbonBadge link change (Task 9) is separate

---

### Task 1: Shared config + `treesOwed` pure function

**Files:**
- Create: `src/lib/impact/config.ts`
- Create: `src/lib/impact/treesOwed.ts`
- Create: `src/lib/impact/treesOwed.test.ts`
- Modify: `package.json`
- Modify: `vite.config.ts`

**Interfaces:**
- Produces: `GRAMS_PER_TREE: number`, `MEASURED_URL: string`, `COUNTERAPI_BASE: string`, `VISITS_COUNTER: string` (all from `config.ts`); `treesOwed(cumulativeGrams: number, treesPurchased: number, gramsPerTree: number): number` (from `treesOwed.ts`)

- [ ] **Step 1: Add Vitest to the project**

Modify `package.json` — add to `"scripts"`:

```json
		"test": "vitest run",
```

Add to `"devDependencies"` (alphabetical, matching existing style):

```json
		"vitest": "^4.1.10",
```

- [ ] **Step 2: Wire Vitest into the Vite config**

Modify `vite.config.ts` — change the import and add a `test` block:

```ts
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter({ fallback: '404.html' })
		})
	],
	test: {
		include: ['src/**/*.test.ts']
	}
});
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`
Expected: `vitest` appears in `node_modules`, `package-lock.json` updated

- [ ] **Step 4: Write the shared config module**

Create `src/lib/impact/config.ts`:

```ts
export const MEASURED_URL = 'https://liammelkersson.xyz/';
export const COUNTERAPI_BASE = 'https://api.counterapi.dev/v1/liammelkersson-xyz';
export const VISITS_COUNTER = 'carbon-visits';
export const GRAMS_PER_TREE = 22000;
```

- [ ] **Step 5: Write the failing test for `treesOwed`**

Create `src/lib/impact/treesOwed.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { treesOwed } from './treesOwed';

describe('treesOwed', () => {
	it('returns 0 when cumulative CO2 is below one tree', () => {
		expect(treesOwed(10000, 0, 22000)).toBe(0);
	});

	it('returns the number of whole trees owed beyond what has been purchased', () => {
		expect(treesOwed(66000, 1, 22000)).toBe(2);
	});

	it('never returns negative when purchases are ahead of emissions', () => {
		expect(treesOwed(1000, 5, 22000)).toBe(0);
	});
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test -- treesOwed`
Expected: FAIL — `Cannot find module './treesOwed'`

- [ ] **Step 7: Implement `treesOwed`**

Create `src/lib/impact/treesOwed.ts`:

```ts
export function treesOwed(cumulativeGrams: number, treesPurchased: number, gramsPerTree: number): number {
	const treesEarned = Math.floor(cumulativeGrams / gramsPerTree);
	return Math.max(0, treesEarned - treesPurchased);
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test -- treesOwed`
Expected: PASS (3 tests)

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/lib/impact/config.ts src/lib/impact/treesOwed.ts src/lib/impact/treesOwed.test.ts
git commit -m "Add vitest and treesOwed pure function"
```

---

### Task 2: `monthKey` and `purchaseDecision` pure functions

**Files:**
- Create: `src/lib/impact/monthKey.ts`
- Create: `src/lib/impact/monthKey.test.ts`
- Create: `src/lib/impact/purchaseDecision.ts`
- Create: `src/lib/impact/purchaseDecision.test.ts`

**Interfaces:**
- Consumes: nothing from Task 1
- Produces: `monthKey(date: Date): string`; `type PurchaseState = { lastPurchaseMonth: string | null; purchasesThisMonth: number }`, `purchasesThisMonthCount(state: PurchaseState | null, currentMonth: string): number`, `shouldPurchaseTree(owedTrees: number, purchasesThisMonth: number): boolean` — all consumed by Task 10's Netlify function

- [ ] **Step 1: Write the failing test for `monthKey`**

Create `src/lib/impact/monthKey.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { monthKey } from './monthKey';

describe('monthKey', () => {
	it('formats as YYYY-MM using UTC', () => {
		expect(monthKey(new Date('2026-07-08T00:00:00Z'))).toBe('2026-07');
	});

	it('zero-pads single-digit months', () => {
		expect(monthKey(new Date('2026-01-15T12:00:00Z'))).toBe('2026-01');
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- monthKey`
Expected: FAIL — `Cannot find module './monthKey'`

- [ ] **Step 3: Implement `monthKey`**

Create `src/lib/impact/monthKey.ts`:

```ts
export function monthKey(date: Date): string {
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	return `${date.getUTCFullYear()}-${month}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- monthKey`
Expected: PASS (2 tests)

- [ ] **Step 5: Write the failing test for `purchaseDecision`**

Create `src/lib/impact/purchaseDecision.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { purchasesThisMonthCount, shouldPurchaseTree, type PurchaseState } from './purchaseDecision';

describe('purchasesThisMonthCount', () => {
	it('returns 0 when there is no prior state', () => {
		expect(purchasesThisMonthCount(null, '2026-07')).toBe(0);
	});

	it('returns 0 when the stored month does not match the current month', () => {
		const state: PurchaseState = { lastPurchaseMonth: '2026-06', purchasesThisMonth: 1 };
		expect(purchasesThisMonthCount(state, '2026-07')).toBe(0);
	});

	it('returns the stored count when the month matches', () => {
		const state: PurchaseState = { lastPurchaseMonth: '2026-07', purchasesThisMonth: 1 };
		expect(purchasesThisMonthCount(state, '2026-07')).toBe(1);
	});
});

describe('shouldPurchaseTree', () => {
	it('is true when trees are owed and the monthly cap is not reached', () => {
		expect(shouldPurchaseTree(1, 0)).toBe(true);
	});

	it('is false when no trees are owed', () => {
		expect(shouldPurchaseTree(0, 0)).toBe(false);
	});

	it('is false when the monthly cap is already reached', () => {
		expect(shouldPurchaseTree(3, 1)).toBe(false);
	});
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test -- purchaseDecision`
Expected: FAIL — `Cannot find module './purchaseDecision'`

- [ ] **Step 7: Implement `purchaseDecision`**

Create `src/lib/impact/purchaseDecision.ts`:

```ts
export type PurchaseState = {
	lastPurchaseMonth: string | null;
	purchasesThisMonth: number;
};

export function purchasesThisMonthCount(state: PurchaseState | null, currentMonth: string): number {
	if (!state || state.lastPurchaseMonth !== currentMonth) return 0;
	return state.purchasesThisMonth;
}

export function shouldPurchaseTree(owedTrees: number, purchasesThisMonth: number): boolean {
	const MONTHLY_CAP = 1;
	return owedTrees >= 1 && purchasesThisMonth < MONTHLY_CAP;
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test -- purchaseDecision`
Expected: PASS (6 tests)

- [ ] **Step 9: Commit**

```bash
git add src/lib/impact/monthKey.ts src/lib/impact/monthKey.test.ts src/lib/impact/purchaseDecision.ts src/lib/impact/purchaseDecision.test.ts
git commit -m "Add monthKey and purchaseDecision pure functions"
```

---

### Task 3: `counterApi` client

**Files:**
- Create: `src/lib/impact/counterApi.ts`
- Create: `src/lib/impact/counterApi.test.ts`

**Interfaces:**
- Consumes: `COUNTERAPI_BASE` from `src/lib/impact/config.ts` (Task 1)
- Produces: `getCounterCount(counterName: string): Promise<number>`, `incrementCounter(counterName: string): Promise<number>` — consumed by Task 7 (visitTracking), Task 8 (impact page), Task 10 (Netlify function)

- [ ] **Step 1: Write the failing tests**

Create `src/lib/impact/counterApi.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- counterApi`
Expected: FAIL — `Cannot find module './counterApi'`

- [ ] **Step 3: Implement `counterApi`**

Create `src/lib/impact/counterApi.ts`:

```ts
import { COUNTERAPI_BASE } from './config';

async function readCount(url: string): Promise<number> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`counterapi request failed: ${response.status}`);
	}
	const data = await response.json();
	return data.count;
}

export function getCounterCount(counterName: string): Promise<number> {
	return readCount(`${COUNTERAPI_BASE}/${counterName}/`);
}

export function incrementCounter(counterName: string): Promise<number> {
	return readCount(`${COUNTERAPI_BASE}/${counterName}/up`);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- counterApi`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/impact/counterApi.ts src/lib/impact/counterApi.test.ts
git commit -m "Add counterapi.dev client"
```

---

### Task 4: `websiteCarbon` shared module

**Files:**
- Create: `src/lib/impact/websiteCarbon.ts`
- Create: `src/lib/impact/websiteCarbon.test.ts`

**Interfaces:**
- Consumes: `MEASURED_URL` from `src/lib/impact/config.ts` (Task 1)
- Produces: `type CarbonStats = { c: number; p: number }`, `fetchCarbonStats(signal?: AbortSignal): Promise<CarbonStats>` — consumed by Task 6 (CarbonBadge refactor) and Task 8 (impact page)

This extracts the fetch+localStorage-cache logic currently inline in `CarbonBadge.svelte` so the new `/impact` page can reuse the exact same cached value instead of duplicating the API call and cache key.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/impact/websiteCarbon.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchCarbonStats } from './websiteCarbon';

describe('fetchCarbonStats', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('fetches and caches the result on a cold cache', async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ c: 1.39, p: 17 }), { status: 200 })
		);

		const result = await fetchCarbonStats();

		expect(result).toEqual({ c: 1.39, p: 17 });
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(JSON.parse(localStorage.getItem('carbon-badge')!).v).toEqual({ c: 1.39, p: 17 });
	});

	it('returns the cached value without fetching when the cache is warm', async () => {
		localStorage.setItem(
			'carbon-badge',
			JSON.stringify({ t: Date.now(), v: { c: 2.5, p: 30 } })
		);

		const result = await fetchCarbonStats();

		expect(result).toEqual({ c: 2.5, p: 30 });
		expect(fetch).not.toHaveBeenCalled();
	});

	it('throws when the response shape is unexpected', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

		await expect(fetchCarbonStats()).rejects.toThrow('unexpected websitecarbon response');
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- websiteCarbon`
Expected: FAIL — `Cannot find module './websiteCarbon'`

- [ ] **Step 3: Implement `websiteCarbon`**

Create `src/lib/impact/websiteCarbon.ts`:

```ts
import { MEASURED_URL } from './config';

const CACHE_KEY = 'carbon-badge';
const CACHE_TTL_MS = 60 * 60 * 1000;

export type CarbonStats = { c: number; p: number };

function readCache(): CarbonStats | null {
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const cached = JSON.parse(raw);
		if (Date.now() - cached.t > CACHE_TTL_MS) return null;
		return cached.v;
	} catch {
		return null;
	}
}

function writeCache(value: CarbonStats): void {
	localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), v: value }));
}

export async function fetchCarbonStats(signal?: AbortSignal): Promise<CarbonStats> {
	const cached = readCache();
	if (cached) return cached;

	const response = await fetch(`https://api.websitecarbon.com/b?url=${encodeURIComponent(MEASURED_URL)}`, {
		signal
	});
	if (!response.ok) {
		throw new Error(`websitecarbon request failed: ${response.status}`);
	}
	const data = await response.json();
	if (typeof data.c !== 'number' || typeof data.p !== 'number') {
		throw new Error('unexpected websitecarbon response shape');
	}
	writeCache(data);
	return data;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- websiteCarbon`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/impact/websiteCarbon.ts src/lib/impact/websiteCarbon.test.ts
git commit -m "Add shared websiteCarbon fetch+cache module"
```

---

### Task 5: `ecologiReporting` client (ground-truth trees count)

**Files:**
- Create: `src/lib/impact/ecologiReporting.ts`
- Create: `src/lib/impact/ecologiReporting.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: `fetchTreesPlanted(username: string, signal?: AbortSignal): Promise<number>` — consumed by Task 8 (impact page) and Task 10 (Netlify function)

Reads Ecologi's own public Reporting API instead of a self-maintained counter, so the displayed trees-planted number can never drift from what Ecologi actually shows on the user's public profile.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/impact/ecologiReporting.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchTreesPlanted } from './ecologiReporting';

describe('fetchTreesPlanted', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns the total from the reporting API', async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ total: 173104, pending: 0 }), { status: 200 })
		);

		const total = await fetchTreesPlanted('liammelkersson');

		expect(total).toBe(173104);
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- ecologiReporting`
Expected: FAIL — `Cannot find module './ecologiReporting'`

- [ ] **Step 3: Implement `ecologiReporting`**

Create `src/lib/impact/ecologiReporting.ts`:

```ts
export async function fetchTreesPlanted(username: string, signal?: AbortSignal): Promise<number> {
	const response = await fetch(`https://public.ecologi.com/users/${encodeURIComponent(username)}/trees`, {
		signal
	});
	if (!response.ok) {
		throw new Error(`ecologi reporting request failed: ${response.status}`);
	}
	const data = await response.json();
	if (typeof data.total !== 'number') {
		throw new Error('unexpected ecologi reporting response shape');
	}
	return data.total;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- ecologiReporting`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/impact/ecologiReporting.ts src/lib/impact/ecologiReporting.test.ts
git commit -m "Add Ecologi Reporting API client for ground-truth trees count"
```

---

### Task 6: Refactor `CarbonBadge.svelte` to use the shared module (no behavior change)

**Files:**
- Modify: `src/lib/components/CarbonBadge.svelte`

**Interfaces:**
- Consumes: `fetchCarbonStats` from `src/lib/impact/websiteCarbon.ts` (Task 4)

This is a pure refactor — the rendered output and displayed text must be identical before and after. Verify manually in-browser per your usual workflow after this commit.

- [ ] **Step 1: Replace the inline fetch+cache logic with the shared module**

Modify `src/lib/components/CarbonBadge.svelte` — replace the entire `<script>` block:

```svelte
<script lang="ts">
	import { fetchCarbonStats, type CarbonStats } from '$lib/impact/websiteCarbon';

	let result = $state<CarbonStats | null>(null);
	let failed = $state(false);

	$effect(() => {
		const controller = new AbortController();
		fetchCarbonStats(controller.signal)
			.then((data) => {
				result = data;
			})
			.catch(() => {
				failed = true;
			});
		return () => controller.abort();
	});
</script>
```

Leave the `<a href="https://www.websitecarbon.com/website/liammelkersson-xyz/" ...>` markup below it unchanged — that link changes in Task 9, not here.

- [ ] **Step 2: Run the full test suite**

Run: `npm run test`
Expected: PASS (all existing tests still pass — this component has no automated tests, so this only confirms nothing else broke)

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/CarbonBadge.svelte
git commit -m "Refactor CarbonBadge to use shared websiteCarbon module"
```

---

### Task 7: Visit tracking wired into the root layout

**Files:**
- Create: `src/lib/impact/visitTracking.ts`
- Modify: `src/routes/+layout.svelte`

**Interfaces:**
- Consumes: `incrementCounter` from `src/lib/impact/counterApi.ts` (Task 3), `VISITS_COUNTER` from `src/lib/impact/config.ts` (Task 1)
- Produces: `trackVisit(): void` — consumed by `+layout.svelte`

- [ ] **Step 1: Implement `trackVisit`**

Create `src/lib/impact/visitTracking.ts`:

```ts
import { incrementCounter } from './counterApi';
import { VISITS_COUNTER } from './config';

const SESSION_KEY = 'visit-tracked';

export function trackVisit(): void {
	if (sessionStorage.getItem(SESSION_KEY)) return;
	sessionStorage.setItem(SESSION_KEY, '1');
	// Best-effort ping: a dropped visit count never affects the visitor,
	// so a failed request is discarded rather than surfaced anywhere.
	incrementCounter(VISITS_COUNTER).catch(() => {});
}
```

- [ ] **Step 2: Wire it into the root layout**

Modify `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import AsciiBackground from '$lib/components/AsciiBackground.svelte';
	import { trackVisit } from '$lib/impact/visitTracking';

	let { children } = $props();

	$effect(() => {
		if (browser) trackVisit();
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" type="image/png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<div class="min-h-screen font-sans text-black antialiased dark:text-white">
	<AsciiBackground />
	{@render children()}
</div>
```

- [ ] **Step 3: Verify manually**

Run: `npm run dev`, open the site, open devtools console, run:
`sessionStorage.getItem('visit-tracked')`
Expected: `"1"` after the page has loaded

- [ ] **Step 4: Commit**

```bash
git add src/lib/impact/visitTracking.ts src/routes/+layout.svelte
git commit -m "Track site visits via counterapi.dev"
```

---

### Task 8: `/impact` page

**Files:**
- Create: `src/routes/impact/+page.svelte`
- Create: `.env.example`

**Interfaces:**
- Consumes: `fetchCarbonStats` (Task 4), `getCounterCount` (Task 3), `fetchTreesPlanted` (Task 5), `VISITS_COUNTER`, `GRAMS_PER_TREE` (Task 1), `treesOwed` (Task 1)

- [ ] **Step 1: Document the public env var**

Create `.env.example`:

```
# Public Ecologi username — not secret, safe to expose client-side.
# Leave blank until the Ecologi account exists; the /impact page degrades gracefully.
PUBLIC_ECOLOGI_USERNAME=
```

- [ ] **Step 2: Build the page**

Create `src/routes/impact/+page.svelte`:

```svelte
<script lang="ts">
	import { PUBLIC_ECOLOGI_USERNAME } from '$env/static/public';
	import { fetchCarbonStats } from '$lib/impact/websiteCarbon';
	import { getCounterCount } from '$lib/impact/counterApi';
	import { fetchTreesPlanted } from '$lib/impact/ecologiReporting';
	import { VISITS_COUNTER, GRAMS_PER_TREE } from '$lib/impact/config';
	import { treesOwed } from '$lib/impact/treesOwed';

	let gramsPerView = $state<number | null>(null);
	let visits = $state<number | null>(null);
	let treesPurchased = $state<number | null>(null);
	let failed = $state(false);

	const totalGrams = $derived(
		gramsPerView !== null && visits !== null ? gramsPerView * visits : null
	);
	const totalKg = $derived(totalGrams !== null ? totalGrams / 1000 : null);
	const treesStillOwed = $derived(
		totalGrams !== null && treesPurchased !== null
			? treesOwed(totalGrams, treesPurchased, GRAMS_PER_TREE)
			: null
	);
	const progressToNextTree = $derived(
		totalGrams !== null ? (totalGrams % GRAMS_PER_TREE) / GRAMS_PER_TREE : null
	);

	$effect(() => {
		const controller = new AbortController();
		Promise.all([
			fetchCarbonStats(controller.signal),
			getCounterCount(VISITS_COUNTER),
			PUBLIC_ECOLOGI_USERNAME
				? fetchTreesPlanted(PUBLIC_ECOLOGI_USERNAME, controller.signal)
				: Promise.resolve(0)
		])
			.then(([carbon, visitCount, treeCount]) => {
				gramsPerView = carbon.c;
				visits = visitCount;
				treesPurchased = treeCount;
			})
			.catch(() => {
				failed = true;
			});
		return () => controller.abort();
	});
</script>

<svelte:head>
	<title>Carbon impact — Liam Melkersson</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-24">
	<h1 class="text-3xl font-semibold">Carbon impact</h1>

	{#if failed}
		<p class="mt-6 text-sm opacity-60">Couldn't load impact data right now.</p>
	{:else if gramsPerView === null}
		<p class="mt-6 text-sm opacity-60">Measuring…</p>
	{:else}
		<div class="mt-12 grid gap-12 sm:grid-cols-2">
			<div>
				<p class="text-sm opacity-60">This website consumes</p>
				<p class="mt-2 text-6xl font-semibold">{gramsPerView}</p>
				<p class="mt-2 text-sm opacity-60">grams of CO2 per view</p>
			</div>
			<div>
				<p class="text-sm opacity-60">Since this website's first publish</p>
				<p class="mt-2 text-6xl font-semibold">{treesPurchased}</p>
				<p class="mt-2 text-sm opacity-60">trees have been planted to offset CO2 use</p>
			</div>
		</div>

		<div class="mt-12">
			<p class="text-sm opacity-60">Total CO2 emitted across {visits} visits</p>
			<p class="mt-2 text-4xl font-semibold">{totalKg?.toFixed(2)}kg</p>
			{#if treesStillOwed !== null && treesStillOwed > 0}
				<p class="mt-1 text-sm opacity-60">{treesStillOwed} tree(s) owed, queued for the next offset run</p>
			{/if}
		</div>

		<div class="mt-8">
			<p class="text-sm opacity-60">Progress to next tree</p>
			<div class="mt-2 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800">
				<div
					class="h-2 rounded-full bg-current"
					style="width: {(progressToNextTree ?? 0) * 100}%"
				></div>
			</div>
		</div>

		<p class="mt-12 text-xs opacity-50">
			Estimated from live per-view carbon data and total visits since launch. Offsets purchased
			automatically through
			<a
				href="https://ecologi.com"
				target="_blank"
				rel="noopener noreferrer"
				class="underline underline-offset-2"
			>
				Ecologi
			</a>.
		</p>
	{/if}
</div>
```

- [ ] **Step 3: Verify manually**

Run: `npm run dev`, open `/impact` in a browser
Expected: page renders "Measuring…" briefly, then shows grams/view, trees planted (`0` until `PUBLIC_ECOLOGI_USERNAME` is set and the offset function has run), total kg, and a progress bar

- [ ] **Step 4: Commit**

```bash
git add src/routes/impact/+page.svelte .env.example
git commit -m "Add /impact carbon offset page"
```

---

### Task 9: Link the footer badge to `/impact`

**Files:**
- Modify: `src/lib/components/CarbonBadge.svelte`

- [ ] **Step 1: Change the link target**

Modify `src/lib/components/CarbonBadge.svelte` — replace the closing `<a>` tag's attributes:

```svelte
<a href="/impact" class="text-xs opacity-60 transition-opacity hover:opacity-100">
```

(This replaces the previous `href="https://www.websitecarbon.com/website/liammelkersson-xyz/" target="_blank" rel="noopener noreferrer"` external link — now an internal SvelteKit link, so `target`/`rel` are dropped.)

- [ ] **Step 2: Verify manually**

Run: `npm run dev`, click the carbon text in the footer
Expected: navigates to `/impact` within the site (no new tab)

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/CarbonBadge.svelte
git commit -m "Link footer carbon badge to /impact page"
```

---

### Task 10: Netlify Scheduled Function for auto-purchasing trees

**Files:**
- Create: `netlify/functions/check-tree-offset.mts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `getCounterCount` (Task 3); `fetchTreesPlanted` (Task 5); `treesOwed` (Task 1); `monthKey` (Task 2); `purchasesThisMonthCount`, `shouldPurchaseTree`, `type PurchaseState` (Task 2); `VISITS_COUNTER`, `GRAMS_PER_TREE`, `MEASURED_URL` (Task 1)

No automated test for this file — per the spec, the real test is running it with `DRY_RUN=true` against live data after deploy and confirming the logged output.

- [ ] **Step 1: Add Netlify packages**

Modify `package.json` — add to `"devDependencies"` (alphabetical):

```json
		"@netlify/blobs": "^10.7.9",
		"@netlify/functions": "^5.3.0",
```

Run: `npm install`
Expected: both packages appear in `node_modules`, `package-lock.json` updated

- [ ] **Step 2: Write the scheduled function**

Create `netlify/functions/check-tree-offset.mts`:

```ts
import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { getCounterCount } from '../../src/lib/impact/counterApi';
import { fetchTreesPlanted } from '../../src/lib/impact/ecologiReporting';
import { treesOwed } from '../../src/lib/impact/treesOwed';
import { monthKey } from '../../src/lib/impact/monthKey';
import {
	purchasesThisMonthCount,
	shouldPurchaseTree,
	type PurchaseState
} from '../../src/lib/impact/purchaseDecision';
import { VISITS_COUNTER, GRAMS_PER_TREE, MEASURED_URL } from '../../src/lib/impact/config';

const ECOLOGI_PURCHASE_ENDPOINT = 'https://public.ecologi.com/impact/trees';
const PURCHASE_STATE_STORE = 'impact';
const PURCHASE_STATE_KEY = 'purchase-state';

async function fetchGramsPerView(): Promise<number> {
	const response = await fetch(`https://api.websitecarbon.com/b?url=${encodeURIComponent(MEASURED_URL)}`);
	if (!response.ok) {
		throw new Error(`websitecarbon request failed: ${response.status}`);
	}
	const data = await response.json();
	if (typeof data.c !== 'number') {
		throw new Error('unexpected websitecarbon response shape');
	}
	return data.c;
}

async function purchaseTree(apiKey: string, idempotencyKey: string): Promise<void> {
	const response = await fetch(ECOLOGI_PURCHASE_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			'Idempotency-Key': idempotencyKey
		},
		body: JSON.stringify({
			number: 1,
			name: 'liammelkersson.xyz carbon offset'
		})
	});
	if (!response.ok) {
		throw new Error(`Ecologi purchase failed: ${response.status} ${await response.text()}`);
	}
}

export default async () => {
	try {
		const apiKey = process.env.ECOLOGI_API_KEY;
		const username = process.env.PUBLIC_ECOLOGI_USERNAME;
		if (!apiKey || !username) {
			console.log('check-tree-offset: ECOLOGI_API_KEY or PUBLIC_ECOLOGI_USERNAME not configured, skipping run');
			return new Response('not configured', { status: 200 });
		}

		const [visits, treesPurchased, gramsPerView] = await Promise.all([
			getCounterCount(VISITS_COUNTER),
			fetchTreesPlanted(username),
			fetchGramsPerView()
		]);

		const owed = treesOwed(visits * gramsPerView, treesPurchased, GRAMS_PER_TREE);
		if (owed < 1) {
			console.log(`check-tree-offset: no trees owed yet (${visits} visits, ${treesPurchased} already planted)`);
			return new Response('no trees owed', { status: 200 });
		}

		const store = getStore(PURCHASE_STATE_STORE);
		const state = (await store.get(PURCHASE_STATE_KEY, { type: 'json' })) as PurchaseState | null;
		const currentMonth = monthKey(new Date());
		const purchasesThisMonth = purchasesThisMonthCount(state, currentMonth);

		if (!shouldPurchaseTree(owed, purchasesThisMonth)) {
			console.log(`check-tree-offset: monthly cap reached for ${currentMonth}`);
			return new Response('monthly cap reached', { status: 200 });
		}

		if (process.env.DRY_RUN !== 'false') {
			console.log(`check-tree-offset: DRY_RUN, would purchase 1 tree (${owed} owed, month ${currentMonth})`);
			return new Response('dry run', { status: 200 });
		}

		await purchaseTree(apiKey, `tree-offset-${currentMonth}`);
		await store.setJSON(PURCHASE_STATE_KEY, {
			lastPurchaseMonth: currentMonth,
			purchasesThisMonth: purchasesThisMonth + 1
		});

		console.log(`check-tree-offset: purchased 1 tree for ${currentMonth}`);
		return new Response('purchased', { status: 200 });
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`check-tree-offset: run failed - ${message}`);
		return new Response(message, { status: 500 });
	}
};

export const config: Config = {
	schedule: '0 */6 * * *'
};
```

Note: no counter to increment after a successful purchase — Ecologi's own Reporting API (`fetchTreesPlanted`) reflects the new purchase on its own, which is the entire point of using it as ground truth instead of a self-maintained counter.

- [ ] **Step 3: Verify the function builds**

Run: `npx tsc --noEmit netlify/functions/check-tree-offset.mts --module esnext --moduleResolution bundler --target es2022 --skipLibCheck`
Expected: no type errors (this checks syntax/types only — the function itself is only truly verified once deployed, since it needs the live Netlify Blobs/env runtime)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json netlify/functions/check-tree-offset.mts
git commit -m "Add scheduled function to auto-purchase offset trees via Ecologi"
```

- [ ] **Step 5: Post-deploy manual steps (not part of this commit)**

After this deploys to Netlify:
1. Create the Ecologi account, get the public username, set `PUBLIC_ECOLOGI_USERNAME` in Netlify's site environment variables (and locally in `.env` for dev) — this alone makes the `/impact` page show real trees-planted numbers
2. Once the Ecologi API key exists, set `ECOLOGI_API_KEY` in Netlify's site environment variables
3. Leave `DRY_RUN` unset (defaults to dry-run) and check the function's logs in the Netlify dashboard after a few scheduled runs to confirm the math looks right
4. Only then set `DRY_RUN=false` to let it actually purchase

---

## Post-plan spec coverage check

- Per-view grams display → Task 8 ✓
- Total visits counter → Task 7, 8 ✓
- Cumulative CO2 → Task 8 (`totalGrams`/`totalKg`) ✓
- Trees planted display → Task 8, sourced from Ecologi's own Reporting API (Task 5) rather than a self-maintained counter — a deliberate deviation from the original spec's `trees-purchased` counterapi.dev counter, made after discovering Ecologi's public Reporting API during implementation planning; removes a drift-risk class the spec's design didn't need to accept ✓
- Progress bar → Task 8 ✓
- Footer link → Task 9 ✓
- Scheduled auto-purchase, monthly cap, DRY_RUN, idempotency key (as an HTTP header, corrected from the spec's initial body-field assumption) → Task 10 ✓
- Error handling table from spec → try/catch in Task 10, `.catch` fallbacks in Task 7/8 ✓
- Pure-function unit tests → Tasks 1, 2, 3, 4, 5 ✓
