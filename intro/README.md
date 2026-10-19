# Laptop portfolio intro — Jeff's Computer

The five original illustrative workspace interfaces are preserved. They are now presented as clickable-looking tabs inside a single unbranded laptop on a dark desktop. An animated white pointer travels to each tab and clicks it, advancing Operations → Projects → Program → Implementation → Code. The laptop lid closes before the final ONE LEADER → JEFF PURSLEY reveal, followed by the existing homepage.

The progress bar measures the scripted animation only, not network loading. The whole sequence is roughly 12 seconds with deliberate tab movements and readable holds. Uses native CSS, JavaScript and existing workspace HTML with no new third-party dependencies. All figures are synthetic demonstration data, not screenshots or employer records.

Accessibility and navigation: Skip, Escape, Replay, reduced-motion bypass, keyboard focus containment, first-time browser visitors, refreshing to replay, and automatic bypass on anchors, queries, internal navigation and other pages. The existing homepage HTML, career claims, cases and navigation are unchanged.

Run `node --check intro/intro.js && node scripts/check-intro.mjs` to check the syntax and accounting invariants. QA also requires a real browser check, particularly for CSS 3D laptop closure on iOS Safari.
