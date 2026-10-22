# Jeff's Garage monitor introduction

The homepage has a **standalone rugged retro monitor** as the entire cinematic stage: no laptop, keyboard or stand. The actual frame is based on Jeff's uploaded powered-off monitor image (`assets/img/garage-monitor-off.webp`). The desktop powers on inside the frame with an editable Windows-inspired wallpaper, icons and taskbar.

The site reuses the 9 selected locally hosted software-inspired portfolio screens in `assets/workspaces/`. Their actual software names are in the window title bars: Microsoft Planner, Planview, Power BI, Dynamics 365 Field Service, SAP IBP, Excel, ServiceNow, Power Automate, and Microsoft Copilot Studio. **Role labels are external to the software title bars**, right-aligned in the empty strip above each active window and connected to its upper-right edge by a short cyan SVG leader line. Each title is shown in full without word breaks, keeping the software name at the upper left unobstructed. The Leadership, Scrum and Business Systems workspaces are excluded from this intro; their original image files remain in the repository. Each workspace now occupies most of the desktop. Instead of a traveling cursor, the minimize control glows and clicks itself before each window contracts to the taskbar at a deliberately readable pace. A compact, terminal-style status panel at the bottom of the monitor reads `Running: JeffPursley.exe` and displays a thin progress bar synchronized to the nine workspace minimize events, from 0% to 100%. Underneath, it rotates verified qualifications (Certified Scrum Product Owner: CERTIFIED; Certified ScrumMaster: CERTIFIED; Google Project Management: COMPLETED; PMP (Project Management Professional): PASSED; BSBA Operations Management: COMPLETED; B.S. Computer Information Systems: COMPLETED). All six credential/status lines rotate during the nine-window minimize sequence at 0.75-second intervals. The final qualification is displayed before the last workspace closes, and on the ninth minimize the loading bar reaches 100% and shows `Release Status: READY`, before the monitor flashes off. The monitor starts black with a yellow power lamp, flickers to life and displays green while running, then changes red on shutdown. The actual uploaded monitor photograph overlays the former vector border; only the black screen interior is made transparent to display the animated desktop. At 100%, it shows `Release Status: READY` before the monitor and loader flick away together, leaving only **JEFF PURSLEY** in white outlined professional type. This is an illustrative career introduction, not a live executable, audit or certification verification.

The screenshots are illustrative interface recreations, not live sessions or verified employer records.

## Play, skip, replay

The intro plays on first direct visits and reloads; `?intro=1` forces it. It does not intercept anchor/deep links, internal navigation, or people with reduced-motion preferences. Skip intro and Escape end the animation; a `Watch the intro` button appears in the homepage hero. The portfolio and its existing portrait and case studies are not modified.

## Customize

- `intro/intro.js`: `WORKSPACES` lists each role, actual software window title, and image; `placements` controls the 9 window positions; `TIMING` controls speed.
- `intro/intro.css`: monitor, desktop, upper-right callouts, progressive credential loader, frame flicker-out, and large standalone white name title.
- `assets/img/garage-monitor-off.webp`: legacy fallback. `assets/img/garage-monitor-frame-photo-v10.webp`: the actual uploaded photographic monitor frame with transparent display glass.

## Verify

Run `node --check intro/intro.js` and `node scripts/check-intro.mjs`. GitHub Actions runs both when the intro changes. After deployment, verify desktop and mobile Safari and use `https://jeffpursley-coder.github.io/?intro=1` to replay.
