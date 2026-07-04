# Portfolio Site — Design Spec

**Date:** 2026-07-03
**Domain:** liammelkersson.xyz
**Reference:** https://alexpate.com/ (layout/vibe reference — minimal, black-on-white, content-first)

## Goal

Personal portfolio site focused on showcasing interfaces of websites Liam has built. Simple, high-contrast, typography-led.

## Stack

- SvelteKit (Svelte 5) + TypeScript
- Tailwind CSS v4
- `@sveltejs/adapter-static` — full static export, no server
- Deploy: Netlify (handled later, out of scope)

## Typography

- Neue Haas Display, self-hosted from `static/fonts/`
- Source files: `/Users/liammelkersson/Library/Fonts/NeueHaasDisplay*.ttf`
- Weights used: Roman (400), Medium (500), Bold (700). Others not shipped — keep payload small.
- Fallback stack: `'Neue Haas Display', 'Helvetica Neue', Helvetica, Arial, sans-serif`

## Layout — single page

1. **Header** — "LM" mark left, nav right: Work, Contact (anchor links)
2. **Hero** — name, one-line role, short bio blurb (placeholder text, user edits later)
3. **Projects** (`#work`) — responsive grid of 4 placeholder cards: image slot, title, one-line tagline, external link. Data-driven.
4. **Contact** (`#contact`) — Email, LinkedIn, Dribbble links with arrow indicators

## Color

Black text on white background. No accent colors. Hover states via opacity/underline.

## Structure

```
src/lib/components/Header.svelte
src/lib/components/Hero.svelte
src/lib/components/ProjectGrid.svelte
src/lib/components/ProjectCard.svelte
src/lib/components/Contact.svelte
src/lib/data/projects.ts        # Project type + placeholder entries
src/routes/+layout.svelte       # global css import, page shell
src/routes/+page.svelte         # composes sections
src/app.css                     # @font-face, tailwind, tokens
static/fonts/*.ttf
```

## Data model

```ts
type Project = {
  title: string;
  tagline: string;   // max ~8 words
  url: string;       // external link
  image: string;     // path under /static or placeholder
};
```

## Error handling / edge cases

- Static site, no runtime errors to handle. Missing project image → neutral placeholder background block.
- Prerender all routes (`prerender = true`).

## Testing / verification

- `npm run build` succeeds, static output in `build/`
- `npm run check` (svelte-check) passes
- Manual browser verification by user (per user's workflow rules — no preview tooling)

## Out of scope

- Netlify deploy config / domain setup
- Real project content (placeholders now)
- Writing/blog section
- CMS, analytics
