# One-page site (`/v2`) — design

Lightweight single-page version of the portfolio, styled after jaspr.lol: narrow text column, collapsible `+` sections, no hero image, no ASCII background.

## Sections (in order)

1. Name + short about.
2. Recent books — current + finished from `readingList.ts`; link to Margins profile.
3. Recently rated movies — 10 most recent from hand-written `movies.ts`, IMDb rating out of 10; link to IMDb ratings.
4. Albums of the year — Spotify playlists 2024 / 2025 / 2026, cover + year.
5. Timeline — projects from `projects.ts`, `year · title — description`. Projects carry `startYear` and optional `endYear`; missing `endYear` with `ongoing: true` renders "2024–now".
6. Links — existing `Links` component.
7. Footer — existing `Footer` (badges, `111 ♡ 222`); carbon badge opens impact dialog.

## Decisions

- Collapsible sections use native `<details>` — no JS.
- Impact stats extracted from `/impact` into `ImpactStats.svelte`, shared by the `/impact` page and a native `<dialog>` on `/v2`. The dialog mounts the stats only on first open, so the fetches never run for visitors who don't open it.
- Posters and playlist covers are self-hosted (CSP `img-src 'self'`). `scripts/fetch-media.js` downloads them once: TMDB `/find` by IMDb id (needs `TMDB_API_KEY` in `.env`) and Spotify oEmbed (no key). Output is committed webp in `static/movies/` and `static/playlists/`.
- IMDb blocks scraping, so movie entries are typed by hand.
- Root layout skips `AsciiBackground` on `/v2`.

## Testing

Unit tests pin: recent movies sorted newest-rated first and capped at 10; timeline order (ongoing first, then newest year); year-span label.
