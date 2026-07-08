# Rose Final Review and Go-Live Sign-Off Form

**DRAFT** — prepared July 7, 2026 (Rev. 2, access status updated). This form is **NOT approved** and carries no approvals until Rose completes and signs it.

---

## Project & Version

| Field | Value |
|-------|-------|
| Project/app name | ExamManagerOS |
| GitHub repo | https://github.com/contractorcomplianceco-cmyk/exammanageros (public) |
| Review branch / staging repo | None used for initial push; required for all future changes |
| Main branch status | Clean newest version; single plain push; no force push |
| Commit hash | `d65dfa5d8055578982fa0c708bfea04b93686869` |
| Version ID | `2026-07-07-exammanageros-clean-main-v1` |

## Links & Endpoint

| Field | Value |
|-------|-------|
| Temporarily published latest-version link | https://exam-manager-os.replit.app (public, verified July 7, 2026) |
| Endpoint domain / final app domain | **exams.cagteam.net** (updated July 8, 2026) |
| Endpoint domain type | Public — by link only (per Rose) |
| Endpoint DNS status | Configured — A record → server |
| Endpoint SSL status | Issued — Let's Encrypt |
| Endpoint hosting status | Attached — nginx + static SPA |
| Endpoint redirect/auth requirements | None stated |

## Review Details

| Field | Value |
|-------|-------|
| Review date | ____________________________ |
| Reviewed by | ____________________________ |
| Prepared by Carmen | ____________________________ |
| Current status | Ready for Rose review |
| Launch target | ____________________________ |

## Verification (circle/mark yes or no)

| Item | Response |
|------|----------|
| Code inspected before main | yes (read-only inspection completed July 7, 2026) |
| Safe to push/merge to main | already pushed; future merges require review branch + code word |
| Design changes made | no |
| Function changes made | no |
| Data migrated or connected | no |
| Live services connected | no |
| Old data excluded | yes |
| Screenshots reviewed | ____________________________ |
| Carmen technical review complete | **yes** (July 8, 2026 — see deploy/CARMEN-TECHNICAL-REVIEW.md) |
| Private code word confirmed | **no** |

## Risks, Questions, Decisions

**Known risks or open questions:** Code word method pending; DNS pending; preview and repo publicly viewable (per Rose intent); localStorage-only data; no automated tests

**Items requiring Rose decision:** Code word method; integration wiring order; DNS timing for investor.ccacontact.com

## Rose Approval Decision (select one)

- ☐ Approved to update main
- ☐ Approved to proceed to staging
- ☐ Approved to proceed live
- ☐ Approved with conditions: ______________________________
- ☐ Not approved
- ☐ Needs changes first: ______________________________

**Rose notes:** ____________________________

**Rose approval date:** ____________________________

## Required Confirmation Statements (initial each)

- ____ I confirm I reviewed the latest visual version using the temporary published link.
- ____ I confirm I reviewed the endpoint domain/final app domain separately from the temporary preview link.
- ____ I confirm the code was inspected before main was updated.
- ____ I confirm no design changes were made unless I approved them.
- ____ I confirm no function changes were made unless I approved them.
- ____ I confirm no old data should be carried into the clean newest version.
- ____ I understand this sign-off controls whether Carmen may proceed to the next approved step.

> **Security note:** This form must never include Rose's private code word. It may only record: Private code word confirmed: yes/no.

---

## Carmen Server Status Addendum (July 8, 2026)

*This section is Carmen's factual server record only. It does not modify Rose's form above or constitute Rose approval.*

| Field | Carmen server record |
|-------|---------------------|
| Server project path | `/home/ubuntu/projects/exammanageros` |
| Handoff commit deployed | `d65dfa5d8055578982fa0c708bfea04b93686869` (matches) |
| Static build | `/var/www/exammanageros` |
| Local preview | `http://127.0.0.1:5030/` (PM2: `exammanageros-preview`) |
| Uptime monitoring | Active (15-min cron → Carmen) |
| Public URL | https://exams.cagteam.net |
| investor.ccacontact.com | Separate Investor Boardroom surface (not ExamManagerOS) |
| ExamManagerOS on endpoint domain | **Attached** at exams.cagteam.net (July 8, 2026) |
| Carmen technical review | Server provisioning complete; awaiting Rose visual review + sign-off |

**Carmen may not proceed past this point without Rose completing this form and confirming the private code word method.**
