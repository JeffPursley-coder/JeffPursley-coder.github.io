# Juniper Vale controlled release request

**Release:** 2026.10.v2  
**Purpose:** Final portfolio engineering closeout, generated from the authoritative browsable source.

This explicit release request invokes `.github/workflows/juniper-release.yml`. The job must run the complete tests, browser smoke checks and internal-link validation; regenerate synthetic browser inputs, current report PDFs, replay evidence and the sanitized source ZIP; confirm model reconciliation and PDF/ZIP signatures; then publish **one** synchronized release commit. It must never publish if a validation fails or if `main` changes during the run.

The normal read-only CI workflow does not commit files. No paid hosting, production data or model API calls are authorized.
