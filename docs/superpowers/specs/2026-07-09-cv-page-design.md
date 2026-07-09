# CV page

## Purpose

Add a `/cv` page presenting a curated work history, sourced from Liam's LinkedIn profile, in the site's existing visual language. Gives visitors (recruiters/clients) a quick professional summary without leaving the portfolio.

## Data source

LinkedIn profile (pasted text + exported PDF), 2026-07-09. Curated down from the full 10-entry history to the professionally relevant subset — pre-2022 school-era entries (Lapid UF, Tranemo TG Gymnasieskola TA, Liberalerna political campaign) are dropped.

## Content

**Intro**
- Name: Liam Melkersson
- Title: Design & Web @ Awaio
- Location: Jönköping, Sweden
- Summary: "I design and develop intuitive digital experiences. By integrating aesthetics with front-end solutions, I create interactions that solve user needs."

**Experience** (newest first)

| Company | Role | Dates | Description |
|---|---|---|---|
| Awaio | Design & Web | Jun 2024 – Present | Marketing, design, web, growth |
| JonWest Consulting AB | Web Designer | Jun 2025 – Oct 2025 | Short web project redesigning JonWest Consulting's website. |
| Papaja | Designer + Developer | Mar 2024 – May 2024 | Worked on projects for Awaio, Mitigater and Stammy. |
| OneOneOne. | Designer + Developer | Jun 2018 – Mar 2024 | Freelance design work for different companies and people, including the largest West Ham fan account on Instagram (@Westhamlatest) — matchday designs for football matches. |
| Tekniska Högskolan i Jönköping (JTH) | Teaching Assistant | Sep 2023 – Dec 2023 | Teaching assistant for the course Web & User Interface Design. |

**Education**
- Jönköping University — Bachelor's degree, Grafisk Design & Webbutveckling (New Media Design), Aug 2022 – May 2025

No skills section, no PDF download/print view — on-site page only.

## Architecture

- New route: `src/routes/cv/+page.svelte`, following the shape of `src/routes/impact/+page.svelte` (own `<svelte:head>` with title/meta/canonical, wraps `<Header />` … `<Footer />`).
- Content is static markup in the page (no new component needed — the list is short and won't be reused elsewhere), styled per existing conventions: section label in `text-xs uppercase tracking-[0.2em] text-neutral-500` (see `Personal.svelte`), entries using `{@attach reveal(delay)}` for the scroll-in effect already used across the site.
- `Header.svelte`: add a `CV` nav link between `Impact` and `ThemeToggle` (`src/lib/components/Header.svelte:8`).

## SEO

- `<title>`: "Liam Melkersson — CV"
- Meta description summarizing the page
- `<link rel="canonical" href="https://liammelkersson.xyz/cv" />`
- Reuse the `Person` schema pattern from the homepage if it fits naturally; not required.

## Out of scope

- PDF export / print stylesheet
- Skills/tools list (LinkedIn's "Top Skills" field is not a usable source — contains non-skills)
- Full 10-entry history
