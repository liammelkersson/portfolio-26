# Personal desk page — design

Date: 2026-09-23
Status: awaiting review

## Goal

A new `/personal` page that shows Liam's personal side as a desk seen from above. Visitors click objects on the desk to open richer content: a reading list, selected albums, playlists and the record collection, the travel passport, ticket stubs, fun facts and photos. The page should feel playful and tactile while staying light (512KB Club goal), accessible and usable on phones.

## Decisions already made

- The homepage Personal section stays exactly as it is. The desk page is an additional, richer page reached by links.
- Launch objects: book, vinyls, passport, ticket stubs, dice + notebook, polaroids, plus non-interactive decor.
- Missing content ships as clearly marked placeholder entries in data files, replaced by Liam later.
- Rendering approach: flat top-down desk built with HTML/CSS, objects with light 3D (CSS transforms). No WebGL / Three.js.

## Page structure

- Route: `src/routes/personal/+page.svelte`, prerendered like the other pages.
- Header: the existing sticky header (`tone="page"`). A "Personal" link is added to the header nav after "Impact".
- Homepage: a small "See my desk →" link is added at the end of the Personal section. Nothing else on the homepage changes.
- The `h1` ("Personal — Liam Melkersson") is visually hidden. `<svelte:head>` gets title, description, canonical and OG tags following the pattern in `src/routes/impact/+page.svelte`.

## Desk scene

- A full-width desk surface below the header. On desktop the stage keeps a 16:10 ratio, capped so it fits the viewport height. On phones it switches to a 3:4 stage and the page scrolls.
- Surface: warm oak from layered CSS gradients plus a small tiling grain texture (WebP, under 20 KB), with an edge vignette. Dark mode shows darker walnut with a warm lamp glow in one corner.
- Lighting: every object uses a shared soft shadow token as if lit from the top left.
- Layout: each object is positioned by percentages (`x`, `y`, `width`, `rotationDeg`), read from `src/lib/desk/deskLayout.ts`. The file holds one full layout for desktop and one for mobile. A single `DESK_LAYOUT_BREAKPOINT` decides which applies.
- A handwritten-style note on the desk reads "click anything".

## Interaction model

- Each interactive object is a `<button>` with an explicit `aria-label` (e.g. "Open reading list").
- Clicking opens `DeskPanel`: a native `<dialog>` shown with `showModal()`. It is centred on desktop and slides up from the bottom on screens narrower than the breakpoint.
- Esc, the close button or a click on the backdrop closes the panel. Focus returns to the object that opened it. Only one panel is open at a time.
- The page keeps a single piece of state: which panel is open (`OpenPanel` discriminated union, or `null`). One exhaustive `{#if}` chain renders the matching panel component.
- Hover and focus-visible lift an object slightly (translate + shadow growth). `prefers-reduced-motion` disables the lifts, spins and rolls. State changes then apply instantly.

## Objects

### Book
- Desk: The Count of Monte Cristo as a CSS 3D box. Cover on top, page edges and spine visible through a slight rotation. It lifts and turns a little on hover.
- Panel (`ReadingListPanel`): the current book first ("reading since …"), then finished books. Each entry has a cover, title, author and an optional note.
- Placeholder data: The Count of Monte Cristo (current), The Stranger (finished, note: favourite book).

### Vinyls
- Desk: the albums flagged `onDesk` in `vinyls.ts` (3–4), each a sleeve with a black record peeking out. On hover the record slides further out and spins.
- Panel (`AlbumPanel`): large cover, title, artist, optional note, a Spotify link and, if `discogsUrl` is set, a Discogs link.
- An extra "Collection" sleeve opens `CollectionPanel`, which links to the Discogs collection and lists the playlists from `playlists.ts`.

### Passport
- Desk: the passport cover, closed.
- Panel (`PassportPanel`): the existing `Passport.svelte`, opened on spread 1 on mount. For that, `Passport` gains an optional `initialSpread` prop (default: closed). Page turning is unchanged.

### Ticket stubs
- Desk: 2–3 overlapping tickets with perforated edges.
- Panel (`TicketsPanel`): each ticket can be flipped with a button, and the back shows the date, venue, a note and an optional link.
- Placeholder data: West Ham vs Luton, London Stadium, May 2025, plus one concert placeholder.

### Dice + notebook
- Desk: a CSS 3D die beside a spiral notebook.
- Clicking the die rolls it (tumble animation) and the notebook shows a random fun fact in the handwritten font. The dice open no panel.
- Fun facts move from `Personal.svelte` into `src/lib/data/funFacts.ts`. The homepage and the desk share one `pickNextFunFact(previousIndex)` rule that never repeats the fact just shown. The homepage behaviour stays the same.

### Polaroids
- Desk: 3 white-framed photos, overlapping and tilted, each with a handwritten caption.
- Panel (`PolaroidsPanel`): the clicked photo enlarged, with previous/next buttons.
- Placeholder data: empty grey frames with captions.

### Decor (non-interactive, `aria-hidden`)
- A coffee mug with a ring stain, a pen and a small plant, drawn in CSS/SVG only.

## Files

- `src/routes/personal/+page.svelte`: page, desk stage, open-panel state.
- `src/lib/components/desk/`: `DeskBook`, `DeskVinyl`, `DeskPassport`, `DeskTickets`, `DeskDice`, `DeskPolaroids`, `DeskDecor`, `DeskPanel`.
- `src/lib/components/desk/panels/`: `ReadingListPanel`, `AlbumPanel`, `CollectionPanel`, `PassportPanel`, `TicketsPanel`, `PolaroidsPanel`.
- `src/lib/desk/deskLayout.ts`: desktop and mobile layout tables keyed by object id.
- `src/lib/desk/openPanel.ts`: the `OpenPanel` union type.
- One component or module per file, following the project's coding principles.

## Data

- `src/lib/data/readingList.ts` replaces `currentBook.ts`: `{ current: Book; finished: Book[] }`, where `Book` gains optional `note` and `startedOn`. The homepage `CurrentlyReading` reads `readingList.current`.
- `src/lib/data/vinyls.ts`: `Vinyl` gains optional `onDesk`, `note`, `discogsUrl`.
- `src/lib/data/playlists.ts`: `{ collectionUrl: string; playlists: { title: string; url: string }[] }`. The collection URL is the existing Discogs link; playlist URLs are placeholders.
- `src/lib/data/tickets.ts`, `src/lib/data/polaroids.ts`: new lists with placeholder entries.
- `src/lib/data/funFacts.ts`: moved from `Personal.svelte`.
- Placeholder entries carry a `placeholder: true` flag, so they are easy to find and so the UI can show a subtle "coming soon" treatment.

## Assets and fonts

- Desk grain texture: `static/desk/oak-grain.webp`, under 20 KB, cached a year via `_headers`.
- Handwritten font: Caveat, self-hosted as a Latin-subset WOFF2 (about 25–35 KB) in `static/fonts/`, loaded only on `/personal`. The CSP stays unchanged (`font-src 'self'`).
- Book covers on the desk use the existing small WebP. Panel images (album covers, stamps, photos) load only when their panel opens.
- Weight target: first load of `/personal` under 250 KB, excluding content panels load on open.

## Testing

Unit tests (Vitest):
- The reading list puts the current book first and keeps the finished books in their data order.
- Only albums flagged `onDesk` appear on the desk.
- `pickNextFunFact` never returns the previous index when more than one fact exists.
- Both desk layouts define a placement for every desk object id.

Route render test (following `src/routes/turbo.test.ts`):
- `/personal` renders the hidden `h1` and one labelled button per interactive object.

Manual checks by Liam: look and feel in light and dark mode, animations, phone layout, and 3D rendering in Safari and Chrome.

## Out of scope

- WebGL / Three.js, drag-to-rearrange objects, and fetching live data (Spotify, Goodreads, Discogs APIs).
- Changes to the homepage Personal section beyond the added link.
