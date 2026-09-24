# Design QA — `/turbo`

- Source visual truth:
  - Page structure: `/Users/liammelkersson/.t3/userdata/attachments/75887aa3-9a55-412f-9d7e-79e572d7ad96-d4d3919f-040d-43e9-9c2e-3505ae3818a9.png`
  - Scroll narrative: `/Users/liammelkersson/.t3/userdata/attachments/75887aa3-9a55-412f-9d7e-79e572d7ad96-6a09429e-981a-44ab-b6ca-02c31c1cdd6a.png`
  - Footer: `/Users/liammelkersson/.t3/userdata/attachments/75887aa3-9a55-412f-9d7e-79e572d7ad96-d29ddffc-34b8-413f-9170-a48c96f6df0d.png`
  - About modal: `/Users/liammelkersson/.t3/userdata/attachments/75887aa3-9a55-412f-9d7e-79e572d7ad96-1fac9b91-d47b-41be-9386-b0c715966860.png`
  - Carbon modal: `/Users/liammelkersson/.t3/userdata/attachments/75887aa3-9a55-412f-9d7e-79e572d7ad96-e697f1ac-3d32-4f31-9680-775b90422fdf.png`
- Implementation: `/turbo`
- Implementation screenshot: not captured
- Implementation viewport/pixels/density: not available

## Full-view comparison evidence

Blocked. The user’s workflow explicitly leaves browser verification to the user and disallows automated screenshot or preview tools. All supplied references were inspected, but no browser-rendered implementation capture was produced.

## Focused-region comparison evidence

Blocked for the same reason. Scroll states and open dialog states cannot be compared without implementation captures.

## Implemented target measurements

- Scroll narrative: `360svh` section with a sticky `100svh` viewport and six sequential opacity states.
- Footer: restrained three-column layout collapsing to two columns on narrow screens.
- About dialog: `42rem` maximum width with an 18%-opaque surface and 52px backdrop blur.
- Carbon dialog: reduced from `74rem` to `40rem`, with smaller metrics and the same liquid-glass treatment.

## Required fidelity surfaces

- Typography uses the project’s Neue Haas Display family.
- Light and dark themes remain supported.
- Reduced-motion mode removes the sticky scroll sequence and presents all statements together.

## Findings

- [P1] Browser-rendered fidelity remains unverified.
  - Evidence: no implementation screenshot was captured.
  - Impact: exact wrapping, spacing, sticky timing, translucency, and responsive behavior cannot be compared to the references.
  - Fix: inspect `/turbo` in the browser and report any visible differences for another iteration.

## Final result

final result: blocked
