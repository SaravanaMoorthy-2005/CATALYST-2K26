# MASTER PROMPT — Build CareCircle 3.0 in Google Antigravity

## Start message — paste this into a new Antigravity engineering session

You are my **principal full-stack engineer, product designer, security architect, QA engineer and Google Cloud/Vercel deployment lead**. Build **CareCircle 3.0 — Connected Care. Confident Living.** for PromptWars × Catalyst's **Elderly Care & Medication Management Platform** challenge. I care especially about automated source-code assessment for **Code Quality, Security, Efficiency, Testing, Accessibility, Problem Statement Alignment, and Google Services Usage**, plus a beautiful original UI inspired by the reference files in `references/`.

**This workspace contains the specification kit, not necessarily application code.** First inspect the workspace. Follow `AGENTS.md` and the `.agents/rules/` customizations. Read these files thoroughly before writing code:

- `docs/PRODUCT_REQUIREMENTS.md` for all features and role workflows;
- `ui and ux.md` and `references/*` for premium Stack Sans typography, glassmorphism, pastels, dashboard composition and elder-first information architecture;
- `docs/ARCHITECTURE_AND_DATA.md` and `docs/GOOGLE_SERVICES.md` for the actual React/Firebase system and the reminder engine;
- `docs/SECURITY_AND_PRIVACY.md`, `docs/ACCESSIBILITY.md`, `docs/PERFORMANCE.md` and `docs/QUALITY_AND_TESTING.md` for engineering constraints;
- `docs/VERCEL_DEPLOYMENT.md` for frontend deployment and secret boundaries;
- `docs/IMPLEMENTATION_PLAN.md` and `docs/REQUIREMENTS_MATRIX.md` for phases, evidence, and acceptance.

### Required complete feature set

**Original challenge P0**: elderly account/profile and owner control; Firebase login + secure one-time passcode invitations for caregivers/family; granular permissions; persistent medication schedules with multiple daily doses, lifecycle edits and adherence tracking; appointment management; proactive real email for upcoming doses, unconfirmed reminders, caregiver escalations and appointments; shared real-time dashboards; privacy-aware activity/audit trail.

**CareCircle live safety/core P0–P1**: time-aware reminder job queue; due/unconfirmed/taken/skipped state machine; realtime Firebase update; caregiver acknowledgement and alert resolution; elderly one-tap assistance; SafeDose duplicate-confirmation guard; WhyMissed? contextual follow-up; Refill Guardian projected stock and tasks; DischargeSync human-verified prescription reconciliation; CareShift task and responsibility coordination.

**Elderly-first P1**: CareDay simplified home, CarePulse caregiver overview, CareCircle View permissions, CareVoice English/Tamil/Hindi text + opt-in speech, CarePassport permission-controlled health summary, Appointment Companion, Wellbeing Check-In and Care Handoff Report.

**P2, only after all mandatory gates pass**: prescription OCR with review, side-effect journal, offline read-only schedule, clinician-review duplicate medication flag, clinician-recommended care routines, optional Google Calendar. Never allow advanced features to break P0 requirements.

### Approved architecture

- npm-workspaces monorepo: `apps/web` Vite + React + strict TypeScript + React Router + Tailwind + shadcn/ui + React Hook Form/Zod; `functions/` Cloud Functions v2 TypeScript; `packages/shared/` typed domain/Zod schemas; `tests/` emulator/e2e/a11y.
- Firebase Authentication, Cloud Firestore scoped live listeners, Firestore security rules, Firebase Admin SDK in functions only, Firebase App Check, Cloud Scheduler `onSchedule`, FCM with permission, Google Cloud Secret Manager, selective Cloud KMS if justified.
- Server-side mail adapter with real transactional provider, captured-mail emulator transport, retry/deduplication and privacy-safe content.
- **Vercel** static hosting only for the React SPA; never move private functions or scheduling logic to the browser. Configure SPA deep-link rewrite and correct monorepo root/output; verify with Vercel docs.
- GitHub Actions CI, Vitest + Testing Library, Firebase Emulator Suite + security-rule tests, Playwright E2E, axe-core, strict typing/lint/format/dependency audit.

### Non-negotiable design

The visual identity is not a generic medical dashboard. Adapt the reference **layout system** without copying branding: Stack Sans Headline + Stack Sans Text, #11141A near-black, #F9F5F1 ivory, #FFF25C lemon accent, #B2D8DD powder blue, mint/ice/pastel card surfaces, gently frosted shell/sidebar, solid white critical cards, minimal thin icons, black active controls, 20–24px rounded cards, generous whitespace. Elder CareDay has **one dominant next-action card, today's timeline, appointments, medicines and Need Help**; caregiver CarePulse has actionable work queues; family has care updates. Avoid unnecessary charts, fake AI avatars, subscription ad panels, loud gradients or heavy frosted text backgrounds. WCAG AA supersedes visual mimicry.

### Required way of working in Antigravity

1. **Inspect first.** Detect whether source code already exists; preserve valid work. Read the files and assets above. Check current dependency/docs compatibility; don't guess unsupported APIs.
2. **Plan minimally.** Provide scope and security boundaries, missing external credentials, current tests and a milestone-by-milestone plan matching `docs/IMPLEMENTATION_PLAN.md`.
3. **Build runnable slices, not empty screens.** Implement identity/care circles/invitations first, then medications/dose occurrences, appointments/notifications, live care/safety features, design system, secondary features, testing/hardening, deployment.
4. **Verify each slice.** Run actual npm scripts and emulator/rule tests. Fix high-risk failures before continuing. Preserve working code. Commit coherent changes if repository and permissions permit.
5. **Use browser screenshots** after web UI changes: desktop 1440/1280, tablet 768 and mobile 390/360; confirm visual hierarchy, no overflow, text scaling, keyboard focus, contrasts and reduced motion. Use available Antigravity browser tools if supported, otherwise state the limitation.
6. **Build genuine integrations.** Use Google services in real code and document any billing/secrets needed. No fake email delivery, token, appointment or deployment successes.
7. **Independent final audit.** Check source, security rules, idempotency, crypto, concurrency, rate limits, data leaks, responsive design, live listeners, performance, all tests and Vercel config. Update the traceability matrix with exact file/test references and status.

### Safety and security rules

An `unconfirmed` dose is not a known missed dose and confirming a dose is not physical ingestion verification. Do not make medical dosage recommendations or automated prescription changes. Firebase password management rather than homegrown auth. Authenticated + email-bound invitation with 8-digit crypto-random code, HMAC-SHA-256 server verifier, 10-minute expiry, ≤5 attempts, transactionally single-use and rate-limited. Server-side per-resource authorization and deny-by-default Firestore Rules are essential. Sensitive fields may use AES-256-GCM + KMS envelope encryption if implemented with key management and searchable metadata separated; do not falsely claim E2EE. Do not expose secrets in `VITE_` variables. Revocation must take effect on backend immediately; client cached content must be cleared.

### Expected deliverables

Produce actual working application code and docs. Required scripts: `dev`, `build`, `typecheck`, `lint`, `format:check`, `test`, `test:rules`, `test:integration`, `test:e2e`, `test:a11y`, `verify` (must perform real checks). Create real tests for each high-risk state machine and cross-circle access, and GitHub Actions running them. Supply Firebase and Vercel setup instructions, `.env.example` with no credentials, a safe synthetic local demo, requirement evidence matrix and an honest completion report.

**Start now:** inspect project, report detected state and first execution milestone, and begin implementing the minimal production-quality vertical slice. Do not stop after planning. Do not ask repetitive routine questions; request explicit approval only when a paid external operation, irreversible action or genuinely missing credential blocks it.

---

## Follow-up message after a milestone

Continue with the next unfinished milestone from `docs/IMPLEMENTATION_PLAN.md`. Inspect actual git diff and test results first; preserve working architecture. Implement end-to-end with negative-path tests, run relevant checks, update `docs/REQUIREMENTS_MATRIX.md`, and report actual evidence, not assumed completion. Follow `AGENTS.md` and the relevant skill.

## Follow-up message for UI fidelity

Use `/visual-qa` and `ui and ux.md`. Open the actual application in the available browser, inspect screenshots at desktop/mobile, compare *layout principles* with `references/dashboard-full.png` and `references/dashboard-closeup.png`, then fix visual differences while preserving accessible contrast, semantic UI and all real interactions. No pixel cloning of MediApp branding.

## Follow-up message for final release

Use `/security-audit` then `/release-verify`. Run the real repository checks, check Firebase Auth/Rules and privilege boundaries, review notification queue and encryption, validate Vercel build and SPA routing, and document what is emulator-tested versus truly deployed. Fix all Critical and High defects before release. Update the evidence matrix and produce a concise readiness report.