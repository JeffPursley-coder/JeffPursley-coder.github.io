# Juniper Vale | Enterprise Transformation Command Center

**Independent fictional operations transformation case study.** This repository archive provides a working, local FastAPI application and a reproducible synthetic scenario engine. No live customer records or actual employer performance outcomes are used.

## Reproduce the work

Requires Python 3.11+.

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
python -m lab.generate --out data/juniper_synthetic_v1.json
python -m lab.evaluate
python -m pytest -q
uvicorn lab.api:app --reload
```

Open `http://127.0.0.1:8000/docs` for the interactive OpenAPI API and `http://127.0.0.1:8000/api/program` for program results. Invoke `/api/scenario` with `{"scenario":"technician-shortage"}`, `{"scenario":"crm-data-failure"}`, or `{"scenario":"demand-surge"}`. Custom assumptions are also accepted.

### Practical local API workflow

```bash
curl -X POST http://127.0.0.1:8000/api/incidents -H 'Content-Type: application/json' -H 'X-Role: dispatcher' -d '{"note":"Appointment #44 needs rescheduling","incident_id":"training-example-1"}'
```

For this local demonstration, supply `X-Role: manager` to approve and execute. This header is **not identity authentication**. The synthetic-only application is not suitable for publicly accessible writable deployment as-is.

## System map

- `lab/engine.py`: fixed-seed, linked synthetic 8-branch/60-technician operating dataset; branch P&L reconciliation; staff, pricing, travel and CRM quality scenarios; constrained exact subset assignment; resource-constrained initiative schedule; Monte Carlo risk and overlap-adjusted investment NPV.
- `lab/workflow.py`: deterministic service-note replay, explicit human-review states, local SQLite audit trail, duplicate key protection, optimistic version checks and release-gate business rules.
- `lab/api.py`: FastAPI scenario, company, branch, program, incident, approval and audit endpoints.
- `lab/generate.py`: writes identical synthetic data on each fixed-seed run.
- `lab/evaluate.py`: executes 20 labeled deterministic cases, retains every output and mismatch.
- `tests/`: completed pytest financial, data, optimization, program, API and approval checks.
- `results/`: generated scenario snapshots, test and replay evidence.
- `docs/`: executive and technical interpretation.

## Accounting and scenario assumptions

Three illustrative recurring service types cost $145/$255/$345 before deterministic synthetic price variation; burdened service labor $27.50/hour; travel $0.26/minute; materials by service type $11/$24/$43; fixed operating expenses $850 per branch per modeled weekday. Revenue is recognized on completed fictional jobs. Contributions = recognized revenue minus direct service labor, materials and travel. Operating profit = contribution minus fixed branch operating expenses. Metrics do not represent cash flow or EBITDA. Company totals are sums of the eight branch statements, not separately rounded forecasts.

15 fictional weekdays are modeled from October 2026, with a 300-job peak day and variable average demand. Baseline synthetic work orders are **not** the historical Juniper Vale 1,800-order or 45,140-order artifacts. This is a new data version (`2026.10.v1`) with its own denominator, assumptions and performance outputs.

Capacity is a transparent planning approximation using qualified effort plus travel, not a time-expanded network model. The independent scheduling solver validates skills, shift limits, time windows, inventory, and overlapping assignments on up to 11 jobs / 10 technicians. It uses bounded enumeration, **not OR-Tools/VRPTW**. The return status distinguishes a cutoff from proven best subset assignment.

Program schedules use finish-start dependencies and one shared technical resource pool, with full-day slots. Monte Carlo samples independent triangular duration distributions; probabilities are conditional on those assumptions and are not evidence of actual delivery performance. NPV assumes 11% discount, three years, 70% benefit adoption and explicitly discounts overlapping benefit estimates.

## AI and approvals

There is **no LLM integration in this release**. Deterministic replay is intentionally labeled to prevent misrepresentation. The classifier never executes a model-suggested action. Service notes are untrusted input. Before a simulated write, the manager role must approve, the incident must have a recognized work-order reference and no missing-information blockers, the CRM data quality gate must pass, and a feasible subset solution must exist. Actions are recorded in SQLite as synthetic state changes. No third-party CRM API is called.

The role header is a **demonstration-only permission switch**. Deploy behind real identity authentication, tenancy boundaries, authorization middleware, audit immutability controls and rate limiting before considering a hosted writable service. Current version is for local study only. Reset the demo by deleting its SQLite file when no process is using it.

## Relationship to the portfolio

The existing Juniper Vale implementation artifacts, SQL analytics, fit-gap, migration, UAT, and AI test plans have not been changed. The Command Center is an **additional versioned scenario**; no historical synthetic outcome is silently overwritten. For the latest public browser replay, see [the transformation case study](https://jeffpursley-coder.github.io/transformation-lab.html).
