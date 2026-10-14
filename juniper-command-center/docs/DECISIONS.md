# Juniper Vale management decisions | 2026.10.v2

Financial and program decisions below use illustrative 15-workday synthetic operations, not historical client performance.

## Baseline vs operating disruptions
- **Baseline:** Focus on eligibility, customer commitments and avoidable service exceptions before paying for permanent excess staffing. The aggregate capacity model can show unfulfilled demand even where total available staff minutes exceed average workload; job-level feasibility is separately checked with CP-SAT.
- **Technician shortage:** A modeled loss of 15 field technicians lowers aggregate capacity, changes projected contribution and increases service exposure. The integrated illustration also reduces available transformation technical contributors from four to two. Compare temporary cover, overtime and rescheduling without overriding qualifications.
- **Critical CRM data failure:** Data quality of 88% is below the 95% release gate. Block cutover and any synthetic execution that depends on unverified records; remediate IDs and repeat integrity tests. A modeled completion date is not an authorization to release.
- **Demand surge:** A 32% modeled demand increase can improve contribution while raising unfulfilled demand and service risk. Protect appointment windows and compare qualified capacity. Do not equate higher short-term modeled contribution with improved customer outcomes.

## Investment trade-off
Four initiatives: CRM $52,000, Dispatch $75,000, AI $46,000, Workforce Adoption $29,000. Total modeled full-program investment $202,000. CRM and Adoption are mandatory; Dispatch and AI are discretionary. Dependencies and shared technical staffing constrain feasibility. The allocation engine evaluates budget-limited combinations using 11% discount, three years, 70% assumed benefit adoption and a half-year first-year ramp, adjusting overlaps to avoid double counting. The selected combination is the highest modeled feasible NPV, not a claimed realized return.

**Executive action:** Preserve mandatory data controls and adoption readiness when a funding cut prevents financing every initiative. Show the next-best feasible portfolio and what capability is deferred. If mandatory work itself cannot be funded, declare infeasibility rather than fabricating a valid selection.

## Workflow execution decision
AI interpretation is advisory. Deterministic policy and bounded optimization check feasibility; a bearer-authenticated manager approves significant synthetic changes. SQLite execution changes the modeled appointment and logs the transaction, rejecting duplicates, stale source records and below-threshold CRM quality.

## Evidence boundaries
The static browser permits modeled financial/investment input changes. OR-Tools CP-SAT, Monte Carlo, optional LLM, and persistent transactions run in locally reproducible Python. No external customer data, live CRM, GPS mapping service, production AI benchmark, or measured employer savings is asserted. Current technical test evidence lives in `docs/current-tests.txt` and CI workflow artifacts; do not cite older source ZIP metrics as the latest version.