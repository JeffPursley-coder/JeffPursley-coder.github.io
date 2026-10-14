# Executive scenario decisions | Computed synthetic results

Derived from `results/scenarios.json` with seed 20261014. Monetary amounts cover the 15 modeled weekdays, not annual projections.

1. **Baseline:** Dispatch scheduling should focus on exceptions and eligibility before adding fixed technician cost. The modeled operation has capacity headroom and some unfulfilled work driven by qualification, data readiness and historical completion patterns. This is not a realized client result.
2. **Technician shortage:** Loss of 15 modeled technicians reduces feasible service throughput and increases projected service risk. The program also loses two technical contributors, extending the resource-constrained transformation schedule. **Recommendation:** fund targeted temporary coverage and re-sequence critical work rather than overriding skill requirements.
3. **CRM data failure:** Migration quality of 88% falls below the 95% release threshold. Program release is blocked, and attempted downstream scheduling writes must remain on hold. **Recommendation:** remediate identifiers, rerun integrity tests and seek explicit gate approval. Do not ship to preserve a deadline.
4. **Demand surge:** Demand rises 32%; contribution can rise despite weaker service attainment, an important distinction between short-term earnings and acceptable customer service. **Recommendation:** protect time windows and review qualification-limited capacity before promoting a growth scenario as an unequivocal success.

Investment assumptions: four interdependent initiatives ($202,000 total), 11% discount rate, three years, 70% benefit adoption, shared-benefit reductions for AI and adoption. These are management decision assumptions, not booked benefits.
