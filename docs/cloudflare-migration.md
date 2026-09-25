# Migrating liammelkersson.xyz from Netlify to Cloudflare

**Status (2026-09-25): live on Cloudflare.** DNS cut over, site and `/api/*` routes verified against production, D1 seeded from the old Blobs data. `DRY_RUN` stays `true` until a cron run's been checked in the logs. Netlify kept as rollback for now — not yet deleted.

Goal: host the site on a Green Web Foundation–verified provider for free, keeping every feature of the `/impact` page.

## Current state (checked 2026-09-24)

| Thing | Where it is now |
|---|---|
| Domain registrar | Name.com, bought through Netlify. Expires **2027-01-04** |
| DNS | Netlify DNS (`dns1–4.p04.nsone.net`) |
| Site | Netlify, built with `adapter-static` into `build/` |
| Backend | 3 Netlify Functions and Netlify Blobs (store `impact`) |
| Email | iCloud custom domain: MX, SPF, DKIM and `apple-domain` records |
| Green check | `green: false` |

## Target state

| Thing | Where it goes |
|---|---|
| Site | Cloudflare Workers static assets (`build/`), free and unlimited |
| API | The same Worker handles `/api/visit-counter` and `/api/report-carbon-stats` |
| Storage | Cloudflare D1 (SQLite), replacing Netlify Blobs |
| Tree job | Worker cron trigger, `0 */6 * * *` |
| DNS | Cloudflare |
| Registrar | Cloudflare Registrar, at cost (optional, last step) |

Free plan limits: 100,000 Worker requests/day, 10 ms CPU per request, 100,000 D1 rows written/day, 5 GB D1 storage. Static asset requests are free and don't count toward the limit. The API paths stay the same, so the frontend doesn't change.

---

## Phase 0: Back up everything

Do this first, while Netlify still works.

### 0.1 Export the DNS records

Netlify → **Domains** → `liammelkersson.xyz` → **DNS records**. Screenshot or copy every record. These are the ones currently visible from outside:

| Name | Type | Value |
|---|---|---|
| `@` | MX | `10 mx01.mail.icloud.com.` |
| `@` | MX | `10 mx02.mail.icloud.com.` |
| `@` | TXT | `v=spf1 include:icloud.com ~all` |
| `@` | TXT | `apple-domain=q6wlfheq9ytbtglw` |
| `sig1._domainkey` | CNAME | `sig1.dkim.liammelkersson.xyz.at.icloudmailadmin.com.` |

If you lose any of these, your email stops working. Also check the Netlify list for records you can't see from outside, such as a `_dmarc` record or other subdomains.

### 0.2 Export the Netlify Blobs data

```sh
npm i -g netlify-cli
netlify login
netlify link            # pick the portfolio site
netlify blobs:get impact visits
netlify blobs:get impact carbon-stats
netlify blobs:get impact purchase-state
```

Save the three outputs. You'll seed them into D1 in Phase 1.4.

### 0.3 Note the environment variables

Netlify → **Site configuration** → **Environment variables**. Note `ECOLOGI_API_KEY`, `PUBLIC_ECOLOGI_USERNAME` and `DRY_RUN`.

### 0.4 Check the domain transfer rules

Netlify → **Domains** → `liammelkersson.xyz`. See whether Netlify lets you **change the nameservers** or only offers **transfer out** (an auth/EPP code). This decides which path you take in Phase 3. If neither option is in the UI, ask Netlify support for the transfer auth code.

---

## Phase 1: Port the code (local)

### 1.1 Install Wrangler

```sh
npm i -D wrangler
npx wrangler login
```

### 1.2 Create the D1 database

```sh
npx wrangler d1 create impact
```

Copy the printed `database_id`.

Create `migrations/0001_impact_state.sql`:

```sql
CREATE TABLE impact_state (
	key TEXT PRIMARY KEY,
	value TEXT NOT NULL
);
```

This is one key/value table, the same shape as the Blobs store. The existing keys (`visits`, `carbon-stats`, `purchase-state`) carry over unchanged.

### 1.3 Add `wrangler.jsonc` at the project root

```jsonc
{
	"$schema": "node_modules/wrangler/config-schema.json",
	"name": "liammelkersson-xyz",
	"main": "worker/index.ts",
	"compatibility_date": "2026-09-01",
	"assets": {
		"directory": "./build",
		"binding": "ASSETS",
		"run_worker_first": ["/api/*"],
		"not_found_handling": "404-page"
	},
	"d1_databases": [
		{
			"binding": "DB",
			"database_name": "impact",
			"database_id": "PASTE_ID_FROM_1.2",
			"migrations_dir": "migrations"
		}
	],
	"triggers": { "crons": ["0 */6 * * *"] },
	"vars": {
		"PUBLIC_ECOLOGI_USERNAME": "liammelkersson",
		"DRY_RUN": "true"
	},
	"observability": { "enabled": true }
}
```

`run_worker_first: ["/api/*"]` sends only API calls to Worker code. Every other request is served straight from `build/` and costs nothing.

Then generate the binding types:

```sh
npx wrangler types
```

This writes `worker-configuration.d.ts`, which declares the global `Env` type (`DB`, `ASSETS`, and the vars). Secrets such as `ECOLOGI_API_KEY` aren't in the config, so the `Env` type needs extending by hand. `worker/index.ts` below does that.

### 1.4 Run the migration and seed your data

```sh
npx wrangler d1 migrations apply impact --remote
```

Seed the data with the values you exported in Phase 0.2. Replace the example values below:

```sh
npx wrangler d1 execute impact --remote --command \
  "INSERT INTO impact_state (key, value) VALUES
   ('visits', '1234'),
   ('carbon-stats', '{\"c\":0.12,\"p\":0.85}'),
   ('purchase-state', '{\"lastPurchaseMonth\":\"2026-09\",\"purchasesThisMonth\":1}');"
```

Skip any key that `blobs:get` returned empty.

### 1.5 Write the Worker

The files go in `worker/`. They reuse the existing pure logic in `src/lib/impact/`, which Wrangler bundles automatically.

`worker/impactStateStore.ts`:

```ts
import { CARBON_STATS_KEY, VISITS_KEY } from '../src/lib/impact/config';
import type { PurchaseState } from '../src/lib/impact/purchaseDecision';

export type CarbonStats = { c: number; p: number };

const PURCHASE_STATE_KEY = 'purchase-state';

async function readJson<T>(db: D1Database, key: string): Promise<T | null> {
	const row = await db
		.prepare('SELECT value FROM impact_state WHERE key = ?')
		.bind(key)
		.first<{ value: string }>();
	return row ? (JSON.parse(row.value) as T) : null;
}

async function writeJson(db: D1Database, key: string, state: unknown): Promise<void> {
	await db
		.prepare(
			'INSERT INTO impact_state (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
		)
		.bind(key, JSON.stringify(state))
		.run();
}

export async function readVisitCount(db: D1Database): Promise<number> {
	return (await readJson<number>(db, VISITS_KEY)) ?? 0;
}

export async function incrementVisitCount(db: D1Database): Promise<number> {
	const row = await db
		.prepare(
			"INSERT INTO impact_state (key, value) VALUES (?, '1') ON CONFLICT(key) DO UPDATE SET value = CAST(value AS INTEGER) + 1 RETURNING value"
		)
		.bind(VISITS_KEY)
		.first<{ value: string }>();
	return Number(row?.value ?? 1);
}

export function readCarbonStats(db: D1Database): Promise<CarbonStats | null> {
	return readJson<CarbonStats>(db, CARBON_STATS_KEY);
}

export function writeCarbonStats(db: D1Database, stats: CarbonStats): Promise<void> {
	return writeJson(db, CARBON_STATS_KEY, stats);
}

export function readPurchaseState(db: D1Database): Promise<PurchaseState | null> {
	return readJson<PurchaseState>(db, PURCHASE_STATE_KEY);
}

export function writePurchaseState(db: D1Database, state: PurchaseState): Promise<void> {
	return writeJson(db, PURCHASE_STATE_KEY, state);
}
```

The visit increment is a single atomic SQL statement, so two visitors at once can't overwrite each other's count. The old Blobs read-then-write could.

`worker/jsonResponse.ts`:

```ts
export function jsonResponse(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' }
	});
}
```

`worker/visitCounterRoute.ts`:

```ts
import { incrementVisitCount, readVisitCount } from './impactStateStore';
import { jsonResponse } from './jsonResponse';

export async function respondToVisitCounter(request: Request, db: D1Database): Promise<Response> {
	if (request.method === 'GET') return jsonResponse({ count: await readVisitCount(db) });
	if (request.method === 'POST') return jsonResponse({ count: await incrementVisitCount(db) });
	return new Response('method not allowed', { status: 405 });
}
```

`worker/carbonStatsRoute.ts`:

```ts
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
```

The `.catch(() => null)` turns malformed JSON into a 400, like the old `try/catch` did. It recovers with a response, so the error isn't swallowed.

`worker/treeOffsetJob.ts`, ported from `netlify/functions/check-tree-offset.mts`:

```ts
import { fetchTreesPlanted } from '../src/lib/impact/ecologiReporting';
import { treesOwed } from '../src/lib/impact/treesOwed';
import { monthKey } from '../src/lib/impact/monthKey';
import { purchasesThisMonthCount, shouldPurchaseTree } from '../src/lib/impact/purchaseDecision';
import { GRAMS_PER_TREE } from '../src/lib/impact/config';
import { readCarbonStats, readPurchaseState, readVisitCount, writePurchaseState } from './impactStateStore';

const ECOLOGI_PURCHASE_ENDPOINT = 'https://public.ecologi.com/impact/trees';

export type TreeOffsetEnv = {
	DB: D1Database;
	ECOLOGI_API_KEY?: string;
	PUBLIC_ECOLOGI_USERNAME?: string;
	DRY_RUN?: string;
};

async function purchaseTree(apiKey: string, idempotencyKey: string): Promise<void> {
	const response = await fetch(ECOLOGI_PURCHASE_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			'Idempotency-Key': idempotencyKey
		},
		body: JSON.stringify({ number: 1, name: 'liammelkersson.xyz carbon offset' })
	});
	if (!response.ok) {
		throw new Error(`Ecologi purchase failed: ${response.status} ${await response.text()}`);
	}
}

export async function runTreeOffsetCheck(env: TreeOffsetEnv): Promise<void> {
	const { DB: db, ECOLOGI_API_KEY: apiKey, PUBLIC_ECOLOGI_USERNAME: username } = env;
	if (!apiKey || !username) {
		console.log('check-tree-offset: ECOLOGI_API_KEY or PUBLIC_ECOLOGI_USERNAME not configured, skipping run');
		return;
	}

	const [visits, treesStatus, carbonStats] = await Promise.all([
		readVisitCount(db),
		fetchTreesPlanted(username),
		readCarbonStats(db)
	]);
	if (!carbonStats) {
		console.log('check-tree-offset: no carbon stats reported yet, skipping run');
		return;
	}

	const treesPurchased = treesStatus.total + treesStatus.pending;
	const owed = treesOwed(visits * carbonStats.c, treesPurchased, GRAMS_PER_TREE);
	const currentMonth = monthKey(new Date());
	const purchasesThisMonth = purchasesThisMonthCount(await readPurchaseState(db), currentMonth);

	if (!shouldPurchaseTree(owed, purchasesThisMonth)) {
		console.log(`check-tree-offset: nothing to buy (${owed} owed, ${purchasesThisMonth} bought in ${currentMonth})`);
		return;
	}
	if (env.DRY_RUN !== 'false') {
		console.log(`check-tree-offset: DRY_RUN, would purchase 1 tree (${owed} owed, month ${currentMonth})`);
		return;
	}

	await purchaseTree(apiKey, `tree-offset-${currentMonth}`);
	await writePurchaseState(db, { lastPurchaseMonth: currentMonth, purchasesThisMonth: purchasesThisMonth + 1 });
	console.log(`check-tree-offset: purchased 1 tree for ${currentMonth}`);
}
```

Failures in this job throw, and Cloudflare records the cron run as failed in its logs. That replaces the old `try/catch` and 500 response.

`worker/index.ts`:

```ts
import { REPORT_CARBON_STATS_PATH, VISIT_COUNTER_PATH } from '../src/lib/impact/config';
import { respondToVisitCounter } from './visitCounterRoute';
import { respondToCarbonStatsReport } from './carbonStatsRoute';
import { runTreeOffsetCheck } from './treeOffsetJob';

type WorkerEnv = Env & { ECOLOGI_API_KEY?: string };
type ApiRoute = (request: Request, env: WorkerEnv) => Promise<Response>;

const API_ROUTES = new Map<string, ApiRoute>([
	[VISIT_COUNTER_PATH, (request, env) => respondToVisitCounter(request, env.DB)],
	[REPORT_CARBON_STATS_PATH, (request, env) => respondToCarbonStatsReport(request, env.DB)]
]);

export default {
	fetch(request, env) {
		const route = API_ROUTES.get(new URL(request.url).pathname);
		return route ? route(request, env) : env.ASSETS.fetch(request);
	},
	async scheduled(_controller, env, ctx) {
		ctx.waitUntil(runTreeOffsetCheck(env));
	}
} satisfies ExportedHandler<WorkerEnv>;
```

### 1.5b `west-ham-result` doesn't go in the Worker

This function is missing above because it can't work the same way: `site.api.espn.com` returns `403 Access Denied` to Cloudflare Workers' egress IPs (verified with `wrangler dev`, which proxies outbound `fetch` like production — same class of block as the existing Website Carbon/Netlify workaround). Routing it through the Worker would just 502 in production.

Fix: ESPN's API sends `access-control-allow-origin: *`, so the fetch moved to the browser instead, in `src/lib/football/latestResultClient.ts`. It now calls ESPN directly rather than a `/api/west-ham-result` endpoint. Two knock-on changes:

- `static/_headers`: CSP `connect-src` gained `https://site.api.espn.com`, and `img-src` gained `https://a.espncdn.com` (the crest images are now referenced directly instead of inlined as base64 — the server-side `Buffer`-based inlining in `westHamResultSource.ts` was only there to satisfy the old `img-src 'self' data:'` policy).
- `LATEST_RESULT_PATH`, the `vite dev` middleware in `vite.config.ts`, and `worker/westHamResultRoute.ts` are gone — nothing serves that path anymore, on any host.
- `src/lib/football/westHamResultSource.ts` and `netlify/functions/west-ham-result.mts` are kept for now (same rollback-safety reason as the rest of `netlify/`), but nothing calls them post-migration.

### 1.6 Clean up the Netlify-specific files

- `static/_redirects`: delete the three `/.netlify/functions/...` lines (visit-counter, report-carbon-stats, west-ham-result). Keep the `301` redirects. Cloudflare supports the same syntax.
- `static/_headers`: no change needed. Cloudflare static assets read it. The longest line after the CSP hashing step is about 720 characters, well under Cloudflare's 2,000-character limit, and the file has 10 rules (limit 100).
- Delete `netlify/functions/` and remove `@netlify/blobs` and `@netlify/functions` from `package.json`. Do this **after** the cutover in Phase 4 works, so you can roll back.
- Add `.wrangler` to `.gitignore`. It's already there.

Note: `_headers` rules don't apply to responses generated by the Worker. That's why `jsonResponse` sets its own `nosniff` header.

### 1.7 Test locally

```sh
npm run build
npx wrangler d1 migrations apply impact --local
npx wrangler dev --test-scheduled
```

- Open `http://localhost:8787` and click through every page. Check that `/impact` loads its count.
- `curl -X POST http://localhost:8787/api/visit-counter` should return an increasing count.
- `curl "http://localhost:8787/__scheduled?cron=0+*/6+*+*+*"` triggers the tree job. It should log `DRY_RUN` or a skip reason.
- Run `npm test`. It should still be green.

---

## Phase 2: Deploy to workers.dev (the live site is untouched)

### 2.1 Add the secret

```sh
npx wrangler secret put ECOLOGI_API_KEY
```

### 2.2 Connect Git for automatic deploys (like Netlify)

Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository** → `liammelkersson/portfolio-26`.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Build variable: `PUBLIC_ECOLOGI_USERNAME=liammelkersson`

The prerendered pages bake `$env/dynamic/public` in at build time, so the build variable is required. The `vars` entry in `wrangler.jsonc` only covers the Worker at runtime.

To deploy by hand instead, with `.env` present locally:

```sh
npm run build && npx wrangler deploy
```

### 2.3 Test on `liammelkersson-xyz.<your-subdomain>.workers.dev`

- All pages load, and there are no CSP errors in the DevTools console.
- `/impact` shows the count you seeded in Phase 1.4.
- Response headers on an image under `/vinyls/` include `Cache-Control: public, max-age=31536000, immutable`.
- Under Worker → **Settings** → **Trigger events**, the cron `0 */6 * * *` is listed.

---

## Phase 3: Move DNS to Cloudflare

Take **Path A** if Netlify lets you change the nameservers. Take **Path B** if it only offers transfer out.

### Path A: change the nameservers (fast, reversible)

1. Cloudflare dashboard → **Add a domain** → `liammelkersson.xyz` → **Free plan**.
2. Cloudflare scans the existing records. Compare them against your Phase 0.1 list. **Make sure all 5 iCloud records are there**, and add any that are missing by hand.
3. Delete the imported A/AAAA/CNAME records for `@` and `www` that point at Netlify. The Worker takes those over in Phase 4.
4. Set `sig1._domainkey` (CNAME) to **DNS only** (grey cloud). Leave the MX and TXT records as they are, since those can't be proxied.
5. Cloudflare shows you 2 nameservers, such as `xxx.ns.cloudflare.com`. Enter them in Netlify in place of the `nsone.net` ones.
6. Wait for Cloudflare to email you "domain active". This usually takes under an hour and can take up to 24h.

### Path B: Netlify won't release the nameservers

Cloudflare Registrar only accepts transfers for domains that already use Cloudflare nameservers, so you can't transfer straight there. Do it in two hops:

1. Get the auth/EPP code from Netlify, or from Netlify support.
2. Transfer the domain to any registrar that lets you set custom nameservers, such as Porkbun or a Swedish registrar like Loopia. The transfer adds 1 year to the expiry.
3. Once the transfer completes, follow Path A from step 1, setting the nameservers at the new registrar.
4. Optionally, do Phase 6 later to move the domain to Cloudflare Registrar.

Downtime risk: while a transfer is in progress, the nameservers stay as they are (Netlify DNS). The site and email keep working until you change the nameservers.

---

## Phase 4: Point the domain at the Worker

1. Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain** → `liammelkersson.xyz`.
2. Add another custom domain: `www.liammelkersson.xyz`.
3. Cloudflare creates the DNS records and the TLS certificate automatically, usually within a few minutes.
4. Redirect `www` to the apex: **Rules** → **Redirect Rules** → template "Redirect from WWW to root", status 301.

Check it:

```sh
curl -sI https://liammelkersson.xyz | grep -iE "server|content-security|strict-transport"
curl -s https://liammelkersson.xyz/api/visit-counter
```

You should see `server: cloudflare`, your CSP and HSTS headers, and your visit count.

**Last count sync:** visits recorded on Netlify between Phase 0.2 and now are missing from D1. Run `netlify blobs:get impact visits` again and `UPDATE` D1 if the gap matters to you.

---

## Phase 5: Verify

1. **Green check:**
   ```sh
   curl -s https://api.thegreenwebfoundation.org/api/v3/greencheck/liammelkersson.xyz
   ```
   It should say `"green": true, "hosted_by": "Cloudflare"`. Results are cached, so if it still shows the old result, recheck after a few hours or use the form at https://www.thegreenwebfoundation.org/green-web-check/.
2. **Email:** send a mail to your `@liammelkersson.xyz` address from another account, and send one back. iCloud Settings → **Custom Email Domain** should show the domain as working.
3. **Tree job:** after the next 6-hour mark, open Worker → **Logs** and look for a `check-tree-offset:` line. When you're happy with it, set `"DRY_RUN": "false"` in `wrangler.jsonc` and redeploy.
4. **Website Carbon:** `/impact` should still show the carbon figure, since the browser fetches it, not the server.

When all four pass, clean up Netlify:

- Remove the Netlify packages and `netlify/`, as described in 1.6.
- Netlify → **Site configuration** → **Delete site**. Do this only after the domain has been fully off Netlify DNS for a few days.

---

## Phase 6 (optional): Transfer the domain to Cloudflare Registrar

Cloudflare sells domains at cost, with no markup. That's likely cheaper than the 192 kr/yr Netlify renewal. Compare against the current `.xyz` price on Cloudflare's registrar page before you move.

1. Requirements: the domain is older than 60 days (it was registered 2024-01-04, so that's fine), it's on Cloudflare nameservers (Phase 3), and it's unlocked, with the auth code from its current registrar.
2. Cloudflare dashboard → **Domain Registration** → **Transfer Domains** → select `liammelkersson.xyz` → enter the auth code → pay for 1 year, which extends the expiry.
3. Approve the transfer email. It usually completes within 1–5 days.
4. **Do this before about 2026-12-01.** That leaves plenty of margin before the 2027-01-04 expiry, and you avoid being charged Netlify's renewal.
5. Turn off auto-renew at the old registrar once the transfer shows as complete.

---

## Rollback

- **Before Phase 3:** nothing live has changed. Delete the Worker if you want.
- **After Phase 3 (Path A):** put the `nsone.net` nameservers back in Netlify. The Netlify site and functions are still deployed until you delete them.
- Keep `netlify/functions/` in Git history. If you need it again, `git revert` the cleanup commit.

## Cost summary

| Item | Cost |
|---|---|
| Workers, static assets, D1, cron | 0 kr (free plan) |
| DNS | 0 kr |
| Domain | Cloudflare's at-cost `.xyz` price per year (check it) |
