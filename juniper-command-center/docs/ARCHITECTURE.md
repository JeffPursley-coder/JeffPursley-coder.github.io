# Architecture and validation boundaries

**Synthetic source → Scenario engine → Calculated operations / schedule / rules → Human review → Synthetic audit.**

The fixed seed produces primary keys for eight branches, 60 technicians, 1,200 customers, 15 weekdays, several thousand work orders and corresponding completed-job invoices. References are validated before analytics are produced. Operating computations share one `Assumptions` instance for all three views in `integrated()`; each event has `scenario_id`, `data_version` and its own parameters.

Operations P&L is branched first and added to a company statement, which prevents company-versus-branch rounding mismatches. Scenario volumes, prices, margins and technician availability are explicit transformations of one immutable baseline. The scheduler uses qualified staff and window checks but does not model continuous travel arcs; it is not a production routing solver.

Program planning uses project dependencies and technical-resource slots. CRM → Dispatch, CRM → AI, and all three → Adoption. Two unavailable technical contributors reduce baseline resource capacity from four to two. Critical CRM quality below 95% blocks release regardless of schedule. Risk simulations do not include correlations or actual implementation measurements.

AI workflow is currently **deterministic classification**, not an LLM. Structured output carries the incident ID, owner, category, requested outcome, constraints, missing data, next owner, review requirement, and a replay version. Text from incident notes has no authority to approve an action. State machine: Pending Review → Approved/Rejected → Executed → Resolved. Version checks prevent stale writes. Audit records capture role, timestamp, state transition and synthetic-only marker. The current `X-Role` header is a demo shortcut and cannot authenticate anyone.

## Gaps to a production product

The application still needs a complete time-dependent OR-Tools route solver, authenticated users, fine-grained RBAC, real secured API gateway, durable managed database, migration tooling, monitoring, secure server-side LLM integration, independent AI benchmark, distributed job scheduling, visual browser regression tests, rate limits and service-level agreements. None is claimed completed in this release.
