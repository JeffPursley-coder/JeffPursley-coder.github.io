# Cinematic multi-workspace introduction

A dependency-free overlay that enhances the existing GitHub Pages homepage without replacing the portrait, navigation, cases, copy, SEO, or downloads.

## Sequence
- Exact opener: **MULTIPLE WORKSPACES**.
- Five original, expressly **illustrative** interfaces: Operations, Project Management, Program Office, Implementation, Code & Automation.
- 780 ms opener; each interface is presented for 1,180 ms; windows converge; exact ending **ONE LEADER** → **JEFF PURSLEY**.
- Overlay fades to the existing homepage. **MULTIPLE WORKSPACES** stays visible in the header throughout (including closing). A slim bottom progress meter tracks the animation, not network loading. A visible Skip intro control, keyboard Escape, and a small Replay introduction control are included.

## Data integrity
No illustrated KPI is presented as a verified historical business result. These are simulations, **not screenshots** from proprietary software or representations of employer production systems.

Operations / September: revenue $126,400; labor $51,250; materials $14,900; gross profit $60,250 (47.7% margin); overhead $24,100; operating profit $36,150. Q3: July $127,000 + August $119,400 + September $126,400 = $372,800. September vs August +5.9%. Capacity 18/22 = 81.8%, displayed as 82%.
Program: four hypothetical workstreams; authorized $1,240,000, actual $910,000, available $330,000. Budget utilization 73.4%. Implementation UAT: 112/120 = 93.3%.

## Loading and accessibility
The intro runs on the homepage on the first external visit, and also on an explicit browser refresh (including for repeat visitors). Normal return visits use localStorage to bypass the sequence. Query strings, fragments, internal navigation, and reduced-motion settings still bypass it. Direct case-study links and internal navigation bypass it. The site remains available if scripts fail. Underlying content is inert while the dialog is active; keyboard focus is held on Skip; Skip and Escape restore focus. Reduced-motion users skip the experience and the unavailable Replay action is hidden. No CDN, video, analytics, font downloads, paid service, or framework.

## Sources of UI conventions
Patterns were studied and independently reinterpreted, not copied:
- [Microsoft: Power BI dashboard tiles and layout](https://learn.microsoft.com/en-us/power-bi/consumer/end-user-dashboard-open)
- [Microsoft: Azure Boards Kanban and backlog](https://learn.microsoft.com/en-us/azure/devops/boards/boards/kanban-overview?view=azure-devops)
- [Microsoft: portfolio project dependencies](https://learn.microsoft.com/en-us/projectonline/define-project-dependencies)
- [Microsoft: deployment and go-live readiness](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/prepare-to-go-live)
- [VS Code: editor interface](https://code.visualstudio.com/docs/getstarted/userinterface)

## QA
Run `node --check intro/intro.js` and `node scripts/check-intro.mjs`.
Browser observations were made in local headless Chromium at 320, 390 and 1366 px with responsive/mobile and desktop workspaces, including all five stages, end transition, Skip, Replay and zero horizontal overflow. Safari, Firefox and Edge still require hands-on review in their native engines; do not represent Chromium verification as cross-browser certification.

**Publication**: proposed for review only on the feature branch. GitHub Pages main stays unchanged until the PR is approved and merged.
