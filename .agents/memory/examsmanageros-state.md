---
name: ExamsManagerOS persisted state
description: zustand persist gotcha for the frontend-only exam-lifecycle prototype
---

# ExamsManagerOS persisted state

The app (`artifacts/exammanageros`) is frontend-only and persists all state to
localStorage via zustand `persist` under the key `examsmanageros-v2`.

**Gotcha:** if you change the shape of the seed data (`src/domain/seed.ts`) or the
store state, an existing user's persisted localStorage will override the new seed
and can produce missing/undefined fields at runtime.

**How to apply:** when changing seed/state shape, bump the persist key (e.g.
`-v3`) or use Settings → "Reset Demo Data" (calls `resetDemoData()`) to reseed.
Otherwise stale persisted state silently wins over the new defaults.
