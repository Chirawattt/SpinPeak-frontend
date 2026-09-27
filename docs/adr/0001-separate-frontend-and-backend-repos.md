# Separate frontend and backend repos

Requirement v3 proposed a monorepo, arguing that one person changing an API contract should open one PR, not two. The owner chose two repos anyway: `SpinPeak-frontend` (Next.js on Vercel) and a Go + Postgres backend on a VPS. The two already deploy separately, and the Phase 1 API is only `/go/contact` and `/healthz`, so contract churn is small.

## Consequences

- `content/` (the course and set data built from the Google Sheet) and `tools/sheet-sync/` live in the frontend repo. The backend does not read `content/` in Phase 1.
- Phase 2 enrollment needs to know which courses each set contains. How the backend gets that data is still open.
- The API contract is written down in the backend repo (`docs/api.md`). The frontend follows that document, not shared code.
