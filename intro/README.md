# Jeff's Garage monitor introduction

The homepage has a **standalone rugged retro monitor** as the entire cinematic stage: no laptop, keyboard or stand. The actual frame is based on Jeff's uploaded powered-off monitor image (`assets/img/garage-monitor-off.webp`). The desktop powers on inside the frame with an editable Windows-inspired wallpaper, icons and taskbar.

The site reuses all 12 locally hosted software-inspired portfolio screens in `assets/workspaces/`. Their actual software names are in the window title bars: Jira, Microsoft Planner, Planview, Power BI, Dynamics 365, SAP IBP, Excel, ServiceNow, Power Automate, Microsoft Copilot Studio, and Teams. **Role labels are external to the windows**, left-aligned alongside the currently active window and connected by a small bright cyan line. Each workspace now occupies most of the desktop. Instead of a traveling cursor, the minimize control glows and clicks itself before each window rapidly contracts to the taskbar. Two short, large, full-viewport cinematic overlays with a dark translucent scrim read **MANY WORKSPACES** during the first group and **ONE LEADER** midway. The titles clear for an unobscured look at the remaining software windows. When all twelve are minimized, the desktop flickers off and **JEFF PURSLEY** appears on the dark monitor for approximately one second, then the monitor fades into the existing portfolio.

The screenshots are illustrative interface recreations, not live sessions or verified employer records.

## Play, skip, replay

The intro plays on first direct visits and reloads; `?intro=1` forces it. It does not intercept anchor/deep links, internal navigation, or people with reduced-motion preferences. Skip intro and Escape end the animation; a `Watch the intro` button appears in the homepage hero. The portfolio and its existing portrait and case studies are not modified.

## Customize

- `intro/intro.js`: `WORKSPACES` lists each role, actual software window title, and image; `placements` controls the 12 window positions; `TIMING` controls speed.
- `intro/intro.css`: monitor, desktop, callout, pointer, three title beats and power-off animation.
- `assets/img/garage-monitor-off.webp`: optimized local monitor frame artwork.

## Verify

Run `node --check intro/intro.js` and `node scripts/check-intro.mjs`. GitHub Actions runs both when the intro changes. After deployment, verify desktop and mobile Safari and use `https://jeffpursley-coder.github.io/?intro=1` to replay.
