# Engineering Quality, Testing & CI Specification

## Code quality architecture

- React/Vite + strict TypeScript with no unbounded `any`, no enormous components, no UI-to-admin-SDK import. Domain types and Zod schemas in `packages/shared` reused by web/functions. Prefer pure recurrence, state machine, authorization policy, refill-forecast helpers.
- Dependency rule: UI → typed client services; callable handlers → validation/auth → domain → repositories; repositories contain Firebase Admin usage; email and scheduler are adapters. No circular imports or secrets in client bundle.
- Choose currently supported stable libraries; commit lockfile, pin Node LTS via engines; lint unused imports/hook dependencies; Prettier and clear naming. Avoid giant abstractions and dependency bloat.
- Every feature needs loading/empty/error/success state, optimistic rollback where applicable, typed backend errors, audit record and negative test. Tests should assert behavior, not snapshots only.

## Automated quality gates

| Gate | Minimum evidence |
|---|---|
| Build | `npm ci` clean, web + functions production build; no type errors |
| Static analysis | TS strict typecheck, ESLint, formatting; no secret files committed |
| Unit | Recurrence/DST, validation, dose states, role permissions, inventory math, reconciliation, task states, job backoff |
| Rules | Firebase Emulator rule tests for all persona/role permutations incl. list/queries |
| Integration | Emulator-backed endpoint + Firestore transaction flows, email capture, queue, invites, revocation |
| E2E | Playwright core user flows from signup to reminders, alerts, refills, approvals and revocation |
| Accessibility | axe-core on critical screens; keyboard/manual screen-reader checks |
| Performance | size regressions, query bounds/indexes, listener cleanup, job batch caps |
| Supply-chain | dependency audit with reviewed severity, lockfile, no unsafe secrets |
| CI | GitHub Actions runs all practical gates with emulator, Node LTS and Java if needed |

Suggested domain coverage ≥80% where feasible, but high-risk **security and state-transition branch coverage** matters more than inflated global percentages. Do not weaken tests to meet target. Track untested branches as release risks.

## Test inventory and case examples

### Unit — deterministic, injected clock

- Recurrences: multiple daily schedules, weekly days, start/end dates, leap years, spring DST skip, autumn repeated local time, timezone relocation, edition preserves past.
- Dose status: `unconfirmed→taken`, `unconfirmed→skipped`, duplicate idempotent, conflict, correction event provenance, backdating metadata.
- WhyMissed?: all five reasons map to proper help/refill/care response; no clinical instruction generation.
- Refill: open stock+restocks-confirmed usage+manual correction; no double decrement; uncertainty exposed, negative stock guard.
- DischargeSync: Added/Changed/Stopped/Unchanged, audit, reviewer approval, old future jobs invalidated.
- CareShift: assign/accept/reassign/complete, revoked assignee, concurrent state version conflict.
- Invitation HMAC: constant time verified where supported, expiry, replay, attempt limits, intendedEmail normalization.
- Notification: due-job filters, recipient permission recheck, retries and cancellation, dedupe and lease expiry.

### Security Rules

Run `@firebase/rules-unit-testing`; test anonymous / unrelated circle / elder / caregiver reader / caregiver editor / family view-only / revoked member for all sensitive collections; must include list queries (rules not filters), direct client writes and internal queue read attempts.

### Integration — Emulator

- Registration/profile bootstrap and separate circles.
- Invite code issued → captured email → verified account redeem → membership active; mismatch/racing denied.
- CRUD medications + generate occurrences + confirm → caregiver snapshot updated; audit event.
- Job queue due → one email captured → overlapping run and retry does not create unlimited duplicates.
- Appointment cancel/reminder invalidation, revoked recipient, caregiver permission changes.
- Help request ack and resolution; inventory task assigned, completed, handoff.
- Encryption local test uses injected mock KMS or test-only key adapter, never a production secret.

### E2E — Playwright

1. Elder register/login; create profile/circle; responsive CareDay and accessibility settings.
2. Owner invite family/caregiver; verified invited account redeems code; unauthorized foreign account denied.
3. Add morning + evening medication; today's timeline; confirm dose → other authorized session updates without refresh.
4. Duplicate tap SafeDose Shield; no duplicate persisted event or stock decrement.
5. Unconfirmed → reason "Medicine unavailable" → refill task → CareShift assign → caregiver acknowledges.
6. Appointment create/reschedule/cancel; caregiver sees update; cancelled reminders suppressed.
7. DischargeSync review/approve → future schedule changed; previous adherence remains.
8. Help action, acknowledgement, resolve, with explicit emergency limitation.
9. Revoke member and attempt direct read/function call; must fail; member UI clears.
10. Keyboard-only and screen-reader semantics for medication form and calendar; mobile 390 and 360px no overflow.

### Accessibility automated + manual

Run axe on auth, CareDay, CarePulse, medication, appointment, invitations, CareShift, DischargeSync, alerts, CareCircle View, settings. Manually verify tab/shift-tab, modal focus return, live announcements, 200% zoom/reflow, contrast, high contrast, languages, voice-off path, reduced motion.

## CI strategy

- GitHub Actions PR/push: checkout → Node LTS + Java where emulator needs it → `npm ci` → `format:check` → `lint` → `typecheck` → `test` → emulator `test:rules` + `test:integration` → web/functions builds → Playwright `test:e2e` + `test:a11y` → upload test artifacts. Run `npm audit` and classify findings; do not silently ignore critical findings.
- Use local `.env.test` for emulators only; CI uses fake Firebase project and no production credential. Secret scans should exclude sample placeholder values.
- Record actual scripts and exit code. `npm run verify` should wrap meaningful gates and fail if any required gate fails; tests must not be dummy green commands.

## Release acceptance and evidence

For each implemented requirement fill `docs/REQUIREMENTS_MATRIX.md` with current file path, test path, status `not started / implemented / verified locally / verified deployed` and issue link or note. Only say deployed if a real Vercel + Firebase deployment and smoke test succeeded. Current kit is **specification**, not evidence of completed code.

## Antigravity task technique

Prefer short reviewable diffs. Agent should create targeted tests before/with modifications, report exact command outputs, and compare before/after. Use `/implement-feature` and `/release-verify` skills for consistency. If browsers/secrets are unavailable, document limitation and still run local checks.