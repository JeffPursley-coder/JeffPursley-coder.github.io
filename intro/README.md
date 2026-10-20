# Many Workspaces — Homepage Intro

This intro runs on the homepage of Jeff Pursley's GitHub Pages portfolio. It shows **12 software-inspired demo screenshots** in three alternating horizontal rows. Images are local assets under `assets/workspaces/` and never request external software accounts.

Sequence: **MANY WORKSPACES** (4.55 s) → **ONE MANAGER** (1.2 s) → **JEFF PURSLEY** (1.65 s) → fade to the unchanged portfolio (0.65 s). The twelve screenshots are displayed before the final name reveal. Three are normally visible per row, with the fourth moving into view; smaller screens show two cards per row and traverse two card widths.

- Implementation: `intro/intro.js` + `intro/intro.css`
- Full-screen Skip / Escape, homepage Replay, keyboard handling, and reduced-motion support
- First direct homepage visit or reload autoplays; internal navigation and hash links bypass
- Forced preview: `https://jeffpursley-coder.github.io/?intro=1`
- Automated check: `node --check intro/intro.js && node scripts/check-intro.mjs`

Screenshots are **fictional demonstration data in software-inspired interfaces**, not evidence of personal experience with every named product.

The homepage hero, navigation, case studies and remaining content were not changed; only the stylesheet/script version tokens in `index.html` were bumped for cache refresh.
