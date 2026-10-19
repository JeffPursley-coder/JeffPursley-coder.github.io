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
