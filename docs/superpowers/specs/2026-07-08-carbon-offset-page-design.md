# Carbon offset impact page

## Purpose

A dedicated page showing the site's cumulative carbon footprint since launch, and
automatically buying trees via Ecologi to offset it — inspired by sites like
Ilja van Eck's portfolio, which show a live CO2 counter and trees-planted stat.

## Scope

- New route: `src/routes/impact/+page.svelte`
- Two public counters on `counterapi.dev` (no auth): `carbon-visits`, `trees-purchased`
- One Netlify Scheduled Function that auto-purchases trees via Ecologi's API
- One Netlify Blobs record for monthly-spend bookkeeping

Out of scope: unique-visitor dedup (session-level dedup only), historical
CO2 charting, any UI beyond the single stats page.

## Page content (`/impact`)

- **This site consumes**: grams CO2/view, live from `api.websitecarbon.com/b`
  (same source already used in `CarbonBadge.svelte`)
- **Total visits since launch**: read from `carbon-visits` counter (counterapi.dev)
- **Total CO2 emitted**: visits × grams/view
- **Trees planted to offset**: read from `trees-purchased` counter (counterapi.dev)
- **Progress to next tree**: `(cumulative grams mod 22000) / 22000` as a bar
- Attribution line noting the number is an estimate and offsets run through Ecologi

Footer's existing `CarbonBadge.svelte` per-view text becomes a link to `/impact`
instead of (or alongside) the current link to the websitecarbon.com report page.

## Visit counting (client-side)

In the root layout (`src/routes/+layout.svelte`), so the counter reflects
total site traffic, not just `/impact` visits — the whole point is measuring
the site's actual footprint:

- Guard with `sessionStorage` so a single browser session increments once
- `POST https://api.counterapi.dev/v1/liammelkersson-xyz/carbon-visits/up`
- Display reads the same counter with a plain `GET` (no `/up` — doesn't increment)

No secrets involved; this stays entirely client-side, same trust level as the
existing `CarbonBadge.svelte` fetch.

## Auto-purchase (server-side only)

**Netlify Scheduled Function**, cron every 6 hours. Chosen over an
on-page-load-triggered function so concurrent visitors can never race to
trigger simultaneous purchases — the cron is a single writer.

Each run:

1. Read `carbon-visits` and `trees-purchased` counters (public GET, no auth)
2. Fetch current grams/view from `api.websitecarbon.com/b`
3. Compute `treesOwed = floor((visits × gramsPerView) / 22000) - treesPurchased`
   (22kg CO2/tree/year — generic estimate, swappable if Ecologi gives a specific figure)
4. If `treesOwed < 1`, stop — nothing to do
5. Read monthly-cap state from Netlify Blobs: `{ lastPurchaseMonth, purchasesThisMonth }`
   - If `lastPurchaseMonth` isn't the current month, reset `purchasesThisMonth` to 0
   - If `purchasesThisMonth >= 1`, stop — monthly cap hit, wait for next month
6. If `DRY_RUN` env var is `true` (default): log what would be purchased, stop
   without calling Ecologi or writing any counters/state
7. Otherwise: call Ecologi's tree-purchase endpoint with the API key from a
   Netlify env var (server-side only, never bundled into client code)
8. On success: increment `trees-purchased` counter via its `/up` endpoint,
   write updated Blobs state (`purchasesThisMonth += 1`, `lastPurchaseMonth = current month`)
9. On failure (network/auth error from Ecologi): log and stop — no counters or
   state are touched, so the next cron run retries cleanly

### Guardrails

- Hard cap: **1 purchase per calendar month**, regardless of how far behind
  the CO2 tally gets — bounds worst-case spend even if the math or counters misbehave
- `DRY_RUN=true` by default — flips to `false` only once the user has created
  and funded their Ecologi account and confirmed the dry-run log output looks correct
- Ecologi API key lives only in Netlify's environment variable store, read by
  the function at runtime — never in the repo, never sent to the browser
- If the Ecologi key env var is unset, the function logs "not configured" and
  returns early — safe to deploy before the account exists

### Known residual risk

No distributed lock across cron invocations — if Netlify ever double-fires a
scheduled run, both could pass the cap check before either writes state,
causing 2 purchases in one month instead of 1. Accepted given low site traffic
and personal-project stakes; not worth the complexity of a real lock.

## Data flow summary

Two independent paths, no coupling:

1. **Page view** (client) → increments/reads `carbon-visits`, reads
   `trees-purchased`, reads live grams/view → renders stats. Never touches
   Ecologi or Blobs.
2. **Cron** (server) → reads the same two counters + grams/view → checks
   Blobs cap → purchases via Ecologi + increments `trees-purchased` if warranted.

## Error handling

| Failure | Behavior |
|---|---|
| Ecologi call fails | Log, no state change, retry next cron run |
| Ecologi key missing | Log "not configured", return early |
| counterapi.dev unreachable (page) | Show last-known cached value or "—" |
| counterapi.dev unreachable (cron) | Log, skip this run, retry next run |
| Missing/first-run Blobs state | Treated as `{ purchasesThisMonth: 0, lastPurchaseMonth: null }` |
| Month rollover | Cap counter resets to 0 before the threshold check |

## Testing

- `treesOwed(cumulativeGrams, treesPurchased)` is a pure function — unit-testable
  with no network calls
- Real integration test is running the cron with `DRY_RUN=true` against live
  counters and confirming the logged math is correct, before ever setting
  `DRY_RUN=false`
- Page rendering verified manually in-browser by the user (per their standard workflow)
