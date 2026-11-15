# Antigravity Implementation Plan & Milestone Gates

The project kit is specifications only; the application must be created or upgraded by Antigravity. Use small validated slices and preserve previously working code. Do not implement secondary extras before the original challenge is verifiably complete.

| Phase | Deliverable | Mandatory quality gate |
|---|---|---|
| 0 — Inspect | Repo inventory, verified versions, baseline test/build, plan and risk register | Record what exists; no guessed completions |
| 1 — Foundation | npm monorepo, Vite/React strict TS, design tokens, Firebase emulator config, CI skeleton, typed shared Zod | Clean `npm ci`, typecheck/lint/build |
| 2 — Identity & circles | Firebase auth, elder profile, granular permissions, invite passcode HMAC, Firestore rules and audit | Auth + cross-circle rules + invitation abuse tests |
| 3 — Medications | Medication CRUD, recurrence, dose state, SafeDose, timezones/DST, live sync | Unit state tests, transaction races, E2E confirm |
| 4 — Appointments & email | Appointment lifecycle, Cloud Scheduler bounded queue, email transport, recipient privacy and escalation | Due-job retry/cancel tests, captured email, real provider setup doc |
| 5 — LiveCare & signature features | WhyMissed?, Refill Guardian, CareShift, assistance, acknowledgements, DischargeSync | Inventory/reconciliation/role/retry integration tests |
| 6 — UI/UX | Stack Sans, frosted shell, CareDay/CarePulse, CareCircle View, responsive charts/calendar; no copied brand | Actual Playwright screenshots, axe + manual keyboard checks |
| 7 — Secondary | CareVoice, CarePassport, Appointment Companion, wellbeing checks, handoff | Locale/care permissions/export/status tests |
| 8 — Hardening | App Check, optional KMS, rate limits, audit/retention, query budgets, performance | Security audit + performance evidence |
| 9 — Release | GitHub Actions, Vercel SPA, Firebase deployment, final tests and documentation | `npm run verify`, production smoke report or explicit blockers |

## Gate expectations

- A milestone is done when **real runnable code**, tests (including negative cases), relevant rule/index changes, UI feedback and docs are complete.
- Each phase concludes with actual executed test commands/results; failures must be fixed before marking complete.
- Seed only synthetic test users and medication data in emulators. Production cannot be seeded with fictitious medical history as though real.
- Build and deploy must be separately labeled. A compiled bundle is not proof of working production email or Scheduler.
- If a stage is too large, split into coherent vertical slices; don't leave giant half-implemented PRs.

## Priorities for time-limited hackathon

**P0 before anything else:** authenticated elder owner/circle, caregiver/family secure passcode, role checks, medication CRUD and doses/adherence, appointments, reliable upcoming/unconfirmed/appointment emails, accessible UI, backend and rules tests, Vercel build.

**P1 competitive:** real-time alerts, acknowledgement, SafeDose, WhyMissed?, refill, DischargeSync, CareShift, one-tap help, original design system.

**P1 later:** language/voice, care passport, appointment companion, wellbeing, handoff.

**P2 optional:** OCR, side effects, offline, medicine review and care routines. Never fake AI clinical knowledge.

## Progress report format after each phase

```
Milestone:
What actually works end to end:
Files changed:
Tests executed (command, result):
Security/access-control evidence:
Accessibility/visual QA:
Google services used:
Open risks/blockers:
Next smallest milestone:
```

Use `docs/REQUIREMENTS_MATRIX.md` for durable status; only put exact code paths/tests there after implementation.