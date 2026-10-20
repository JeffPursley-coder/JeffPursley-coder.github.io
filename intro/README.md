# Many Workspaces — full-screen GitHub Pages intro

This is the **large-screen, two-row revision** of the homepage animation. All **12** pre-existing software-inspired demo images remain local in `assets/workspaces/`. No fictional NexaPlan or NexaField files are used.

- Top six screens: Operations Manager (Dynamics 365 Field Service), Project Manager (Microsoft Planner), Program Manager (Planview), Implementation Specialist (ServiceNow + Jira), Revenue Management (Power BI), Supply Chain (SAP IBP).
- Bottom six screens: Budgeting (Excel + Power BI), Business Systems (Power Platform), Process Automation (Power Automate), Leadership (Teams + Power BI), AI Implementation (Copilot Studio), Scrum (Jira).

Both strips use **native 16:9 ratios** with large cards. The top moves right and the bottom moves left. At runtime, travel distance is calculated as the **entire six-card strip width minus the viewport**; this ensures all 12 screens pass into view instead of merely showing a fourth card. The center band remains stationary.

Sequence: **MANY WORKSPACES** for 6.2 s → **ONE MANAGER** for 1.15 s → **JEFF PURSLEY** for 1.9 s → fade into the unchanged homepage for 0.65 s (about 9.9 s total). Labels show both the job function and real software name.

Skip/Escape, manual Replay, first-visit autoplay, cache busting and reduced-motion support remain. Forced preview: https://jeffpursley-coder.github.io/?intro=1 .

Automated checks: `node --check intro/intro.js` and `node scripts/check-intro.mjs` plus the site's usual integrity workflow.

**Disclosure:** Workspace image content contains fictional demonstration records. The recreations are not native authenticated sessions, nor evidence of experience with every vendor product.