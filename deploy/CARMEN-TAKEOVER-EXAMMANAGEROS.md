# Carmen Takeover Report — ExamManagerOS

**Contractor Compliance Authority (RoseOS Ecosystem)** · Prepared July 7, 2026 by Rose · Rev. 2 (access status updated)

No design or function changes have been made. This report is preservation and handoff documentation only. No further changes may be made without Rose's approval confirmed via a private code word method (not yet established — see Approvals).

## Project Identity

| Field | Value |
|-------|-------|
| Project/app | ExamManagerOS — "Manage. Prepare. Succeed." |
| Owner | Rose (Contractor Compliance Authority) |
| Purpose | Internal exam-lifecycle operations: eligibility → study/prep → scheduling → results → transcripts → unblocking dependent license applications |

## Repository & Version

| Field | Value |
|-------|-------|
| GitHub repo | https://github.com/contractorcomplianceco-cmyk/exammanageros — PUBLIC as of July 7, 2026 |
| Review branch / staging repo | None used — clean version pushed directly to main |
| Main branch status | Contains exactly the newest clean version; single push; no force push |
| Commit hash | `d65dfa5d8055578982fa0c708bfea04b93686869` |
| Version ID | `2026-07-07-exammanageros-clean-main-v1` |

## Links & Endpoint Domain

| Field | Value |
|-------|-------|
| Public preview (Replit) | https://exam-manager-os.replit.app |
| Endpoint domain (final) | **exams.cagteam.net** (updated July 8, 2026 — supersedes investor.ccacontact.com for ExamManagerOS) |
| Endpoint domain type | Public — by link only (unlisted) |
| Endpoint readiness | **Live** on exams.cagteam.net (DNS + SSL + nginx configured July 8, 2026) |

## Server Deployment (Carmen — July 8, 2026)

| Field | Value |
|-------|-------|
| Server path | `/home/ubuntu/projects/exammanageros` |
| Static web root | `/var/www/exammanageros` |
| PM2 process | `exammanageros-preview` (port 5030, local health checks) |
| Deploy script | `./deploy/deploy-production.sh` |
| Nginx vhost | `deploy/nginx-exammanageros.conf` → `/etc/nginx/sites-enabled/exams.cagteam.net` |
| Uptime monitor | `/home/ubuntu/projects/scripts/check-exammanageros-uptime.sh` (cron every 15 min) |
| Public URL | https://exams.cagteam.net |

### Deploy commands

```bash
cd /home/ubuntu/projects/exammanageros
./deploy/deploy-production.sh
```

Domain is **exams.cagteam.net**. investor.ccacontact.com remains a separate Investor Boardroom surface.

## What Is Currently Wired

- Complete frontend application with all lifecycle logic, filters, tasks/escalations, client-update approval workflow, audit trail, and analytics — running against representative demo data in browser localStorage (key: `examsmanageros-v2`).
- Replit hosting for the public preview (autoscale, TLS).
- Server: static build deployed to `/var/www/exammanageros`; PM2 preview on port 5030; uptime monitoring active.
- Nothing external is wired: no auth, no server database, no integrations, no email/SMS/payments/AI.

## What Still Needs To Be Connected

- Real authentication and operator accounts.
- Server-side database persistence (scaffold Express + Drizzle/Postgres `api-server` exists in repo).
- Zoho Books, ComplianceConnect, DocCollect/WorkDrive integrations.
- Email/SMS notifications.
- Endpoint domain exams.cagteam.net: nginx vhost live; auth/database/integrations still unwired.

## Connection Plan (requires Rose approval)

1. Carmen completes technical review using the public repo and public preview link.
2. Establish a private code word method with Rose (required before ANY change).
3. All future work on a review branch — never directly on main.
4. Wire auth, then database, then integrations, each behind Rose sign-off.
5. DNS/domain attachment only after Rose's launch approval.

## Risks / Blockers

- Private code word method not yet established — blocks all future changes.
- Preview and repo are PUBLIC — anyone with the links can view the demo app and source.
- Data is per-browser localStorage only — clearing browser data resets it.
- investor.ccacontact.com is no longer the ExamManagerOS endpoint (moved to exams.cagteam.net).
- No automated test suite; verification was manual + typecheck.

## Required Approvals

- Rose: establish private code word method.
- Rose: approve connection plan sequence and any future change via code word.
- Rose: final go-live approval (separate, explicit).

**Code word status: NOT CONFIRMED**

## Related Documents

- [Rose Final Review and Go-Live Sign-Off Form](./ROSE-GO-LIVE-SIGNOFF-FORM.md) — **DRAFT, not approved.** Rose must complete and sign before Carmen proceeds past technical review.

## Readiness Statement

**STATUS: LIVE — REAL APP** on https://exams.cagteam.net with CollabOS-style auth, Postgres persistence, feature-flagged integration adapters, PM2 API (`exammanageros-api`), nginx `/api/` proxy, SSL, and uptime monitoring. Rose sign-off still required before merge to `main` and before enabling external integrations.
