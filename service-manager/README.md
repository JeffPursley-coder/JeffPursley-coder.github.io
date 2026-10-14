# Service Manager Operating System | Independent workflow demonstration

[Professional case study](../service-manager.html) · [Interactive demo](../service-manager-demo.html) · [GitHub Actions test results](https://github.com/JeffPursley-coder/JeffPursley-coder.github.io/actions/workflows/service-manager-tests.yml)

## Purpose
Jeff's real-world project involved consulting with a field-service manager, designing an accountable work-state model, and configuring Gmail, Google Workspace Studio and Gemini workflow components. This folder is a separate, **fully synthetic JavaScript demonstration** of the business rules that informed that work.

It is not the corporate Gemini classifier, a proprietary integration, or an operational performance study.

## Source inventory
- `engine.mjs`: deterministic work-state and urgency evaluator; manual-review, duplicate-event and protected-correction safeguards.
- `scenarios.mjs`: 30 fictional acceptance cases, transcribed from the original pilot-readiness test library; 12 selected for the browser demo.
- `demo.mjs`: interactive public selection and result display. Dynamic text is set with `textContent`, without rendering supplied content as HTML.
- `engine.test.mjs`: direct comparisons between predefined expected states / urgency and **actual engine outputs**, plus edge-case checks.
- `demo-ui.test.mjs`: dependency-free UI behavior tests for case selection, urgent WAITING display, injection handling and reset focus.

## Execute locally
From the repository root, with Node.js 22 or later:

```sh
node --test service-manager/*.test.mjs
```

The GitHub Actions workflow runs the same command on relevant commits. Its verified October 14, 2026 run reported **42 passed, 0 failed**, including all 30 synthetic acceptance cases and additional rule / UI tests. Consult CI for the latest result.

## Model boundaries
The rules engine uses transparent pattern matching against short fictional messages. It demonstrates operating decisions, not language-model comprehension across arbitrary corporate correspondence. The input may optionally supply known event IDs, prior work state, and a protected manual override to test retry safeguards. There is no persisted database, login, network request, company data, actual inbox connection or ability to send or modify email.

Decision outputs include category, exclusive current work state, independent urgency, next owner, recommended action, review requirement and rationale.

## Important design choices
1. A reply does not establish completion. Keep active obligations open.
2. Urgency is independent of work state; urgent WAITING items remain visible.
3. Conflicting or insufficient context fails to human review.
4. A protected human correction outranks an automated assessment.
5. Repeated events preserve a supplied prior state instead of generating a spurious transition.
6. Untrusted message instructions do not grant permission to send, disclose or delete.

These checks are reproducible **synthetic test evidence only**. No corporate adoption rate, time saving, Gemini benchmark, revenue increase or real-world improvement percentage is asserted.
