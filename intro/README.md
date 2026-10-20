# Jeff's Computer — Desktop Windows Cinematic Intro

The animation shows an unbranded laptop with a full operating-system style desktop: abstract navy wallpaper, menu bar, visible desktop icons and a bottom application taskbar. Five independent illustrative application windows begin already open, overlapping in a staggered stack.

A white pointer travels to the **minimize (−)** control on the frontmost window and clicks it. That window contracts toward the taskbar and uncovers the next window. The sequence is:
**Operations → Projects → Program Office → Implementation → Code**.

The larger laptop screen and slimmer bezel make the dashboard windows easier to see at desktop and phone sizes. **MANY WORKSPACES** stays above the laptop throughout the presentation, including the closing reveal. After all five are minimized, the viewer sees the **clear desktop**, then the laptop lid closes and the title sequence reads exactly **ONE LEADER → JEFF PURSLEY**, fading into the existing portfolio.

Original dashboard/backlog/PMO/deployment/code screens remain unchanged. Financial figures and software screens are **illustrative**, not actual employer records. No branded enterprise UI is copied.

The bar at the bottom measures animation completion, not actual page loading. Skip, Escape, replay from the homepage, refreshing to replay, first-visit persistence, direct-link/anchor bypass, and prefers-reduced-motion behavior remain. The overlay does not remove or modify the homepage content or navigation.

Changes are browser-native CSS and JavaScript with no packages, paid services, video or extra network requests.

Validation: run `node --check intro/intro.js` and `node scripts/check-intro.mjs`. Check mobile and desktop behavior manually, especially the lid-close perspective in native iOS Safari.

## October 19 refinements
- Persistent heading changed to **MANY WORKSPACES**.
- Cursor speed / button delay / workspace hold changed from 485 / 155 / 745 ms to **340 / 120 / 560 ms** respectively. Full sequence ~10.0 seconds versus ~12.2 seconds.
- Desktop laptop max width raised from 1050 px to **1185 px**, with a height-aware cap for shorter screens; slimmer display sides and a larger desktop window region. Mobile screen uses narrower side margins and a slightly larger usable area.
- All five dashboards, illustrative-data notices, skip/replay, reduced-motion behavior and the final title reveal remain unchanged.

## Headline update
**MANY WORKSPACES** is a standalone, very large, bold white, center-aligned heading directly above the laptop. It stays on screen while the five desktop windows are minimized and while the lid closes, then fades away for the clean **ONE LEADER → JEFF PURSLEY** finale. The small corner label has been removed. Responsive typography and height-aware laptop sizing prevent overlap with the headline on smaller screens. No other on-screen copy, case studies, or animation pacing is changed.

## Sequential text-only ending
The heading above the running laptop now reads **I fix the processes**. Once the last application minimizes and the laptop closes, the computer UI and progress graphics clear, leaving three successive bold text-only screens: **MANY WORKSPACES**, then **ONE LEADER**, then **JEFF PURSLEY**. Each phrase takes the center alone rather than remaining visible under the following phrase. The initial laptop title and established window-minimizing pace are unchanged. The three finale holds are 1,130 / 1,150 / 1,650 ms respectively; the progress meter accounts for the additional phrase. The accessible Skip control remains available until the homepage is revealed.

## Final motion polish
The existing three full-screen finale title cards now get a subtle upward reveal, quick text sharpening, understated cyan radial lighting, and a thin light line beneath (not across) the text. The three phrases remain separate and never overlap. The JEFF PURSLEY reveal has slightly stronger letter-spacing and scale settling. Finale holds are 1,280 ms for MANY WORKSPACES, 1,280 ms for ONE LEADER, and 1,850 ms for JEFF PURSLEY. The refinement adds only 0.48 seconds to the introduction. Reduced-motion CSS disables the animation. Laptop, five workspaces, homepage content, controls, and illustrative data remain intact.

## Hiring-manager and usability pass (October 19, 2026)

The current version supersedes the earlier timing and heading notes above:
- Opening statement: **I fix what slows businesses down.** Displayed as two lines to maintain legibility across widescreen and phone sizes.
- Five meaningful *illustrative* interactions now precede the minimize animation: assigning a field-capacity issue, advancing a project story to review, assigning a program risk owner, requesting implementation UAT sign-off, and running workflow checks. Project cards and relevant status text update as the cursor acts, and all changes reset on replay.
- Timing is approximately **8.535 seconds**, down from 11.88 seconds. The entire laptop/minimize/reveal structure remains.
- The concluding title cards are still **MANY WORKSPACES → ONE LEADER → JEFF PURSLEY**. A short descriptor follows beneath the name: **Operations Leadership · Project Delivery · Business Systems**.
- Mobile keeps the laptop, but replaces unreadably tiny dashboard detail with a succinct per-workspace highlight above a compact action prompt. Desktop retains the full financial, backlog, program, implementation and code interfaces.
- Existing illustrative-demo notices and the portfolio's genuine achievement figures are retained; no new data-separation screen was added.
- Skip, Escape, replay, first-visit persistence, direct-link bypass and reduced-motion support are unchanged.

Validation: `node --check intro/intro.js` and `node scripts/check-intro.mjs`. Check actual layout on both desktop and iOS Safari after deployment.
- CI now runs the intro regression checks on updates to `main` as well as the original feature branch.
