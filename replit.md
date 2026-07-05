# ExamManagerOS

A polished, frontend-only React + Vite prototype for Contractor Compliance Authority's internal exam-scheduling platform. Tagline: "Manage. Prepare. Succeed."

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/exammanageros/src/domain/` — source of truth for the app model:
  - `types.ts` — all entity + status-union types
  - `status.ts` — status tone/color helpers + `EXAM_STATUSES`
  - `seed.ts` — `buildSeed()` with the 10 required scenarios
  - `derive.ts` — queue filters (`matchesFilter`), `lookup` helpers, `isOverdue`, KPI derivations
- `artifacts/exammanageros/src/store/useStore.ts` — zustand + persist store (key `examsmanageros-v2`); all mutating actions log audit events and run lifecycle automations. Exports `type Store`.
- `artifacts/exammanageros/src/pages/` — one file per screen; `exam-detail.tsx` (9 tabs) is the most complex.
- `artifacts/exammanageros/src/components/{shared.tsx,layout.tsx}` — shared UI primitives + app shell.
- `artifacts/exammanageros/src/App.tsx` — wouter routes wrapped in Layout; base = `import.meta.env.BASE_URL`.

## Architecture decisions

- Frontend-only prototype: no backend, no real integrations. All state persists to localStorage via zustand `persist`.
- Lifecycle automations live in the store, not the components: e.g. `markPassed` auto-creates a transcript task (or unblocks applications when no transcript is required), `setExamStatus` gates "Ready to schedule" behind eligibility, `markFailed` creates a retake task.
- Every mutating store action appends an audit event, so the audit trail is complete without per-component wiring.
- Queue filter is URL-driven (`?filter=`) and synced via effect, so Command Desk KPI drilldowns always update the visible filter.
- Honesty labels are intentional: "Protected Preview" / "RoseOS Ecosystem App" chrome and "Sync-ready preview" integration labels; no dead buttons.

## Product

ExamsManagerOS is an internal exam-lifecycle operating app for Contractor Compliance Authority (RoseOS ecosystem). It tracks each contractor exam from eligibility → study/prep → scheduling → results → transcripts → unblocking dependent license applications. Operators work a unified Exam Queue (16 filters) and per-exam workspace (9 tabs), manage tasks and escalations, review client-facing updates through an approval workflow, collect documents, and view analytics — all against representative seed data.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
