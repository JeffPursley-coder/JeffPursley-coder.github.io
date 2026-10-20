# Jeff's Brain — portfolio homepage animation

The former five-workspace cinematic intro has been replaced by a new sequence showing Jeff's celebratory black silhouette connected by glowing cables to a terminal monitor.

The silhouette is a compact vector outline traced from the exact uploaded image with both fists raised. As seventeen professional and humorous capabilities process, **each individual bar runs from 0 to 100%**, then flashes its completion status. The silhouette fills from bottom to top after each successful action. Dad Jokes triggers a monitor wobble; 1 Magic Trick triggers a sparkle. A final PMP / PASSED / ABOVE TARGET card interrupts the terminal before a JEFF PURSLEY / Many functions. One manager. / SYSTEM ONLINE reveal. The overlay fades to the existing professional homepage and portrait.

Timing: 700 ms startup + 17 × 635 ms items + 1100 ms PMP + 1450 ms reveal, about 14 seconds. Displaying all 17 requested titles makes a 6–8 second version illegible.

## Edit the animation

Modify the `INSTALLS` array and `TIMING` object near the beginning of `intro/intro.js`. Modify responsive colors and positioning in `intro/intro.css`. No third-party dependencies or additional network assets are required.

First direct homepage visits and reloads play the intro; existing internal navigation, anchors, and reduced-motion preferences bypass it. The homepage provides **Watch the intro**, a full-screen **Skip intro** control, and Escape to close. Direct preview: `https://jeffpursley-coder.github.io/?intro=1`.

## Validate

`node --check intro/intro.js` and `node scripts/check-intro.mjs`. GitHub Actions automatically checks the introduction after pushes to `main`. Review desktop and mobile iOS Safari after deployment.
