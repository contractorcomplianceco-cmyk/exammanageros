---
name: ExamManagerOS conventions
description: Non-obvious operational conventions for the exammanageros artifact
---

# ExamManagerOS

## Workflow name
- The workflow to restart is EXACTLY `artifacts/exammanageros: web` — the plain slug `exammanageros` FAILS. Confirm via listWorkflows() if unsure.
**Why:** artifact-generated workflows use the `artifacts/<slug>: <kind>` naming convention, not the bare slug.
**How to apply:** use the full `artifacts/<slug>: <kind>` string for any restart_workflow / listWorkflows call on artifact services.
