# Read Me — All Files Copy/Paste Reference

**This is a text-only, per-file copy/paste bundle** for the Antigravity kit. Each marked section contains the full contents of one Markdown, rules, skill or environment-template file. To set up manually, create the file at the stated relative path and paste only that section's body. Preserve frontmatter for `.agents/rules/*.md` and `.agents/skills/*/SKILL.md` exactly. `AGENTS.md` must be at the workspace root.

For a **single Antigravity chat message**, use `ONE_PASTE_ALL_FILES_AND_MASTER.md`; it has the bootstrap task, full master specification, and every one of the source files below.

Images are binary and cannot be embedded as pasteable Markdown. Use the included `references/` images in the ZIP or upload them separately to Antigravity.

---

## FILE: `.agents/rules/backend-security.md`

~~~~~text
---
trigger: model_decision
description: "Apply when implementing Firebase Auth, Firestore, Cloud Functions, invitations, shared care permissions, privacy, logging or encryption."
---
# Backend Security Rule

Read `docs/SECURITY_AND_PRIVACY.md` and `docs/ARCHITECTURE_AND_DATA.md`. Authenticate and authorize each sensitive request with active membership, action permission and scoped resource ownership. Server validates input using shared Zod; Firestore Rules default deny and protect list queries as well as reads. Admin SDK bypasses Rules. Protect passcodes with server HMAC-SHA-256, cryptographic randomness, email binding, 10-minute expiration, attempt/rate limits and atomic consume. No tokens, codes, PHI or Admin secrets in client, logs or VITE_* vars. If AES-256-GCM + KMS is added, document key/nonce/rotation/associated-data and never claim E2EE. Test cross-care-circle and revoked-user negatives.
~~~~~

## FILE: `.agents/rules/clinical-safety.md`

~~~~~text
---
trigger: always_on
description: "Healthcare safety guardrails for every feature and user-facing message."
---
# Clinical Safety Rule

CareCircle tracks **reported** medication and care actions; it cannot verify actual ingestion, wellness or response by emergency services. `Unconfirmed` is not proven missed, `Taken` is not physically verified, and a missed record is not proof of non-adherence. Never recommend a dosage, late catch-up dose, double dose or medication discontinuation. Clinician-issued schedule changes require explicit authorized human review. OCR output is an untrusted draft. Help requests are a caregiver coordination channel, not emergency dispatch. Do not invent medical interaction claims or disease risk scores. Display clear uncertainty and useful contact pathways.
~~~~~

## FILE: `.agents/rules/frontend-design.md`

~~~~~text
---
trigger: model_decision
description: "Apply to React UI, Tailwind styling, accessibility, dashboard layouts and UI screenshots for CareCircle's Stack Sans healthcare portal design."
---
# Frontend Design Rule

Read `ui and ux.md` and reference screenshots before substantial visual changes. Use Stack Sans Headline/Text, original CareCircle branding, near-black #11141A, ivory #F9F5F1, lemon #FFF25C as a restrained accent, powder blue #B2D8DD and mint/ice cards. The shell/sidebar may be gently frosted; text-bearing critical medication cards must be solid and high contrast.

Implement CareDay for elder (one main next action, timeline, appointments, help), CarePulse for caregiver (pending actions) and a simpler family overview. Avoid irrelevant charts and copied MediApp assets. Semantic controls, large buttons, keyboard order, accessible form errors, screen reader labels, correct text scaling and reduced motion are mandatory. Use screenshot QA across mobile/desktop before finishing.
~~~~~

## FILE: `.agents/rules/google-vercel.md`

~~~~~text
---
trigger: model_decision
description: "Apply when integrating Google Firebase/Cloud services, notification scheduling, deployment, Vercel, environment variables or production operations."
---
# Google Cloud & Vercel Rule

Read `docs/GOOGLE_SERVICES.md`, `docs/PERFORMANCE.md`, and `docs/VERCEL_DEPLOYMENT.md`. Vercel hosts static Vite SPA; Firebase/Google Cloud handles identity, data, server mutations and scheduled jobs. Use scoped Firestore queries, indexed bounded notification-job worker on Cloud Scheduler, robust retries and per-recipient permission/consent checks. FCM opt-in with generic previews and fallback. Server secrets in Secret Manager only; `VITE_` public. Test `/dashboard` deep link refresh; verify actual build root/output. Never claim external deploy/email success without logs and smoke test or spend without owner approval.
~~~~~

## FILE: `.agents/rules/testing-quality.md`

~~~~~text
---
trigger: model_decision
description: "Apply when creating features, modifying TypeScript, tests, state machines, CI scripts, Firebase rules or performing quality review."
---
# Engineering Quality Rule

Read `docs/QUALITY_AND_TESTING.md`. Strict TS, typed Zod contracts, pure domain logic, modular UI/domain/repos, real scripts, no unused imports or no-op tests. Test both permitted and forbidden behavior. Critical cases: duplicate dose/stock decrement, concurrent invite redemption, revoked user, caregiver permission, overlapping scheduler, appointment cancellation and DST. Run actual typecheck, lint, unit, emulator/rules, Playwright, axe and build as appropriate and report exact outcome. Never mark a feature verified without test evidence; update `docs/REQUIREMENTS_MATRIX.md` only when confirmed.
~~~~~

## FILE: `.agents/skills/implement-feature/SKILL.md`

~~~~~text
---
name: implement-feature
description: "Implements one CareCircle 3.0 feature end-to-end with typed React UI, Firebase authorization, business logic, tests and documented requirements. Use for adding medication, appointments, SafeDose, Refill Guardian, DischargeSync, CareShift or help workflows."
---
# Implement Feature — Verified Vertical Slice

## Preparation

1. Read `AGENTS.md`, the relevant section in `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE_AND_DATA.md`, `docs/SECURITY_AND_PRIVACY.md` and `ui and ux.md`.
2. Inspect current code, types, schema, rules, tests and open issues; identify highest-impact minimal change.
3. Write feature acceptance criteria with at least one success and one unauthorized/failure case. List relevant requirement IDs.

## Implementation sequence

1. Define shared Zod DTO and domain model/state machine with pure unit tests.
2. Add trusted Firebase Cloud Function with authenticated scope and permission check; use Firestore transaction/idempotency for concurrent state changes.
3. Extend Firestore schema/indexes/rules as necessary; test denies as well as permitted queries.
4. Add React service/hook with bounded listener and proper teardown; implement accessible real UI with loading/success/error/empty states.
5. Handle alerts/email/outbox in a retry-safe manner if the feature creates notifications.
6. Run unit → emulator/rules → integration → Playwright/axe for impacted flows → typecheck/lint/build.
7. Update `docs/REQUIREMENTS_MATRIX.md` with exact code/test paths and status; report gaps honestly.

## Stop conditions

Do not declare done if a UI button lacks backend behavior, cross-circle permissions fail, new tests are skipped or existing core feature regresses. If credentials unavailable, mark emulator-verified vs deployed-blocked.
~~~~~

## FILE: `.agents/skills/release-verify/SKILL.md`

~~~~~text
---
name: release-verify
description: "Performs final PromptWars automated-code-assessment readiness review covering code quality, security, efficiency, testing, accessibility, problem alignment, Google services and Vercel/Firebase deployment."
---
# Release / Submission Verification

1. Inspect complete repo + `docs/REQUIREMENTS_MATRIX.md`; distinguish code implemented, emulator verified, deployed verified and blocked by credentials.
2. Execute clean install (npm ci), strict typecheck, lint, formatting, unit tests, Firestore Rules tests, integration tests, web/functions build, Playwright E2E, axe and dependency review. If scripts fail, fix and rerun; do not hide failures.
3. Run `/security-audit` and `/visual-qa`, or equivalent documented steps, before final release.
4. Verify Vercel monorepo build root/output, SPA rewrite/deep links, environment variable scope, Firebase OAuth authorized domains, App Check and FCM provider where configured.
5. If online deployment is authorized and credentials exist, test synthetic production sign-in, invitation, medication confirmation, live caregiver update, reminder email, appointment reschedule/cancel, revocation and mobile. If not, mark explicitly blocked.
6. Update requirement matrix with code/test evidence and clear open issues. Report results separately for seven scoring categories and deployment, never invent score or claim compliance certification.
7. Provide final readiness message with commands, exact pass/fail, unresolved Critical/High/Medium issues, deployment URLs only if actually verified, and manual setup steps.
~~~~~

## FILE: `.agents/skills/security-audit/SKILL.md`

~~~~~text
---
name: security-audit
description: "Threat-models and audits CareCircle Firebase Auth, secure invitations, Firestore rules, Cloud Functions, secret handling, audit logs, encryption, reminder abuse and role-based medical record isolation."
---
# Independent Security Review

1. Read `docs/SECURITY_AND_PRIVACY.md` and `AGENTS.md`. Locate actual paths for all privileged operations and direct Firestore queries.
2. Build a role/care-circle matrix: anonymous, owner, view-only, caregiver-editor, revoked, stranger. For every sensitive resource, verify read/list/write/callable refusal and valid success.
3. Inspect invite HMAC, randomness, email binding, attempts, rate limits, expiry, constant-time verification, one-time transaction and invitation mail leakage.
4. Inspect authenticated function authorization and state transitions; Admin SDK bypasses security rules. Check cross-circle IDs, array updates, exports and notifications.
5. Review key/secrets handling, logs, App Check and optional KMS envelope crypto; test ciphertext tamper, unavailable KMS and rotation assumptions.
6. Review queue overlap, claim lease, retries, recipient revocation and provider duplicate-send uncertainty; ensure no false exactly-once claim.
7. Run real security-rule tests, integration and dependency audit; add regression tests and fix Critical/High findings.
8. Report file:line findings, severity, fix, test command/result, residual risk; update requirement matrix truthfully.
~~~~~

## FILE: `.agents/skills/visual-qa/SKILL.md`

~~~~~text
---
name: visual-qa
description: "Reviews CareCircle healthcare dashboard UI in browser screenshots against uploaded Dribbble-style reference, responsive layout, typography, glassmorphism, accessibility and role-specific workflows."
---
# Visual & Accessibility QA

1. Read `ui and ux.md` and open `references/dashboard-full.png`, `references/dashboard-closeup.png`, `references/branding-type-palette.png`. Copy layout principles but not MediApp identity.
2. Launch the real app using documented commands; if backend required, run emulators with synthetic data.
3. Visit CareDay, CarePulse, family, medication, appointment, invitations, DischargeSync, Refill Guardian, CareShift and CareCircle View.
4. Capture actual screenshots at 1440, 1280, 1024, 768, 390 and 360px as tools permit. Compare alignment, Stack Sans rendering, subtle glass quality, card density, body readability, selected pills, icons, click targets, CTA and whitespace. Inspect whether calendar and lists overflow.
5. Run Playwright axe, keyboard-only flows, 200% zoom, reduced motion, locale expansion, and high-contrast mode. Prioritize elderly legibility over glass aesthetics.
6. Fix source code defects and regenerate screenshots. Document remaining blockers; do not claim to have viewed screenshots without using browser tooling.
~~~~~

## FILE: `AGENTS.md`

~~~~~text
# CareCircle — Antigravity Project Operating Rules

You are the engineering agent responsible for delivering **CareCircle 3.0**, a **secure, elderly-first, real-time collaborative medication and appointment management web app** for PromptWars × Catalyst. Treat these instructions as durable operating constraints. This file intentionally stays concise; detailed requirements live in linked specifications.

## Your role and authority

Act as senior product engineer, TypeScript/React architect, Firebase/Google Cloud engineer, security reviewer, accessible design system engineer, QA automation engineer, and Vercel release engineer. **Implement real source code**; do not stop after planning or generate a UI-only mockup. Do not perform paid deployments or changes to real production resources without explicit owner approval and correct credentials. You may use local emulators freely.

## Read before making architecture decisions

1. `docs/PRODUCT_REQUIREMENTS.md` — scope and clinical-safety boundaries.
2. `ui and ux.md` — mandatory aesthetics and elderly-first page UX.
3. `docs/ARCHITECTURE_AND_DATA.md` — domain boundaries, schemas, state machines.
4. `docs/SECURITY_AND_PRIVACY.md` — data isolation, auth, cryptography, threat model.
5. `docs/QUALITY_AND_TESTING.md` and `docs/ACCESSIBILITY.md` — correctness and review gates.
6. `docs/GOOGLE_SERVICES.md` and `docs/VERCEL_DEPLOYMENT.md` — real integrations.
7. `docs/IMPLEMENTATION_PLAN.md` and `docs/REQUIREMENTS_MATRIX.md` — milestones and evidence.

## Non-negotiable project invariants

- **Correctness over appearance.** Original challenge requirements (passcode invitations, shared authorized profile, medication CRUD/adherence, appointments and proactive **email** reminders) are P0, not optional.
- **Elder is owner.** People can only see or change explicitly shared data; role labels are not permissions. No self-granted membership.
- **Medical safety.** No prescriptions, medication dosing recommendations, or diagnoses from AI. `Unconfirmed` is not proof of missed ingestion; a Taken click is not verification of swallowing.
- **Backend authorization.** Enforce identity + active membership + granular action permission + resource scope in every privileged Cloud Function. Firebase Admin SDK bypasses Firestore Rules.
- **Default deny.** Firestore Rules deny any path/action not intentionally permitted; test negative and cross-circle cases.
- **Cryptography.** Firebase-managed password auth. HMAC-SHA-256 for small one-time invitation codes with a server secret and rate limits. AES-256-GCM/KMS only for chosen extra-sensitive fields, with authorized server decryption and key rotation documented. Do not invent crypto or claim end-to-end encryption.
- **No secrets in Vite.** `VITE_` values are public. Secret Manager holds SMTP creds, HMAC secret and KMS authority.
- **Live correctness.** Scoped and bounded Firestore subscriptions, server-confirmed statuses, unsubscribe on circle change, revocation and logout. Scheduler idempotent and retry-safe; external email cannot be guaranteed exactly-once.
- **Quality.** Strict TypeScript, shared Zod validation, testable domain modules, minimal deps, lint/format, unit + emulator/rules + Playwright E2E + axe accessibility checks.
- **Accessibility.** WCAG 2.2 AA target; 16px+ body, elder 18px+ where practical, semantic controls, keyboard/focus, large tap targets, high contrast, reduced motion, Tamil/English/Hindi fallback.
- **Design.** Use provided reference aesthetics (Stack Sans Headline/Text, off-white/ink/yellow/powder-blue palette, subtle glassmorphism) but do not clone MediApp's brand or bury dose actions in graphs. See `ui and ux.md`.
- **Deployment.** Static React/Vite frontend on **Vercel**; Firebase Auth/Firestore + Cloud Functions v2/Cloud Scheduler backend on Google Cloud. No server-side private Firebase admin creds in Vercel browser assets.
- **Honesty.** Never present mock delivery as real mail, a fake sensor signal as patient safety, or unrun tests as green. Clearly separate implemented, emulator-verified, and externally deployed features.

## Working method

1. Inspect repository, installed packages, existing code/tests. If new: scaffold a minimal npm-workspace monorepo. Preserve existing work and avoid unnecessary rewrites.
2. Produce a short artifact-style milestone plan, threat assumptions and requirement crosswalk before expensive changes.
3. Implement **one working vertical slice**: domain schema → server authorization → repository/transaction → UI → email/live behavior → tests → docs.
4. Run available checks after each slice; show exact commands/results and fix failures before proceeding.
5. Use browser-based visual QA on desktop/mobile. Compare layout with `references/dashboard-full.png`, but prioritize role-relevant elder usability.
6. Maintain `docs/REQUIREMENTS_MATRIX.md`: mark `not started / implemented / locally verified / deployed verified` truthfully with code + test evidence.
7. For release, run `.agents/skills/release-verify/SKILL.md`; report build, security, performance, accessibility, Google-service, deployment results, and unresolved risks.

## Task-specific instructions

Use skills as appropriate: `/implement-feature` for vertical slices, `/visual-qa` for UI screenshots, `/security-audit` for auth/data surfaces, `/release-verify` for submission. Follow `.agents/rules/` on relevant tasks. Do not generate hundreds of decorative files; create only what is useful, tested, and documented.

## Never do

- Never grant caretaker permissions solely because they possess an elderly person's code without authenticated, email-bound invitation verification.
- Never log tokens, passcodes, full medical records, or customer data in telemetry.
- Never send confidential drug details in lock-screen push previews by default.
- Never use a global Firestore listener, full collection scan, or scheduler-per-dose.
- Never use OCR-extracted prescriptions without human confirmation.
- Never require speech, push permission, or constant Internet connectivity for understanding the current schedule.
- Never suppress security or accessibility tests just to pass CI.
- Never claim completed online deployment until actual smoke tests are performed.

## Definition of done

Original challenge requirements demonstrably operate through real backend paths; Firestore Rules deny unauthorized paths; all targeted tests pass; accessible role-specific workflows work on desktop/mobile; Google integrations and Vercel build are documented and verified as far as credentials permit. Remaining gaps must be listed explicitly.
~~~~~

## FILE: `MASTER_PROMPT.md`

~~~~~text
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
~~~~~

## FILE: `README_START_HERE.md`

~~~~~text
# CareCircle 3.0 — Antigravity Project Kit

**Mission:** Build and verify a secure, accessible, collaborative elderly-care application for the PromptWars × Catalyst challenge. This repository kit is an **agent instruction/specification bundle**, **not** a completed application. The Antigravity agent must generate and test the actual code.

## Quick start in Google Antigravity

1. Extract this kit into a new `carecircle/` repository root. For an existing project, copy the files into its root without overwriting working application code. Preserve `.agents/`, `docs/`, and `references/` paths.
2. Open the repository **root** as the Antigravity workspace. `AGENTS.md` is discovered automatically; `.agents/rules/*.md` and `.agents/skills/*/SKILL.md` are recognized customizations.
3. Open `MASTER_PROMPT.md`; paste its **Start message** into Antigravity in a software-engineering session. Optionally attach `references/dashboard-full.png`, `references/dashboard-closeup.png`, and `references/branding-type-palette.png` when discussing visual design.
4. Let the agent **inspect existing code** (or initialize a new npm workspace), create a short implementation plan, and implement **one tested vertical slice at a time**. Approve real Firebase/Vercel credentials and paid deployments explicitly.
5. Use the installed skills as needed: `/implement-feature`, `/visual-qa`, `/security-audit`, `/release-verify`. You may also ask Antigravity in natural language to use them.
6. Before submitting, review `docs/REQUIREMENTS_MATRIX.md`, real test logs, Firestore Rules results, accessibility screenshots, and deployment smoke-test evidence.

## File map

| File | Purpose |
|---|---|
| `AGENTS.md` | **Automatically loaded** project-wide invariant instructions and document navigation |
| `agent.md` | Requested lowercase entrypoint; points to canonical instructions |
| `MASTER_PROMPT.md` | Ready-to-paste kickoff prompt for Antigravity, with milestone execution and handoff format |
| `ui and ux.md` | Full visual design system, Dribbble-reference analysis, component and page specs |
| `docs/PRODUCT_REQUIREMENTS.md` | User problems, complete feature specifications, acceptance criteria and role responsibilities |
| `docs/ARCHITECTURE_AND_DATA.md` | React/Firebase architecture, entities, contracts, state machines and scheduling |
| `docs/SECURITY_AND_PRIVACY.md` | Threat model, algorithm choices, RBAC, invitations, encryption, audit policies |
| `docs/QUALITY_AND_TESTING.md` | Code quality, testing matrix, coverage, accessibility and CI acceptance gates |
| `docs/ACCESSIBILITY.md` | Elder-first accessibility principles, manual + automated testing |
| `docs/PERFORMANCE.md` | Bounded live listeners, Firestore query efficiency, scheduling cost and performance |
| `docs/GOOGLE_SERVICES.md` | Real Google services integration and local emulator expectations |
| `docs/VERCEL_DEPLOYMENT.md` | Deployment boundaries, Vercel SPA routing, environment and production runbook |
| `docs/REQUIREMENTS_MATRIX.md` | Assessment-aligned requirements → implementation → test evidence |
| `docs/IMPLEMENTATION_PLAN.md` | Work phases, definition of done, checkpoints and feature priorities |
| `docs/REFERENCE_ASSETS.md` | How to use uploaded screenshots, design inspiration and licensing guardrails |
| `.agents/rules/*.md` | Focused Antigravity rule files with valid trigger frontmatter |
| `.agents/skills/*/SKILL.md` | Repeatable Antigravity procedures: implement, visual QA, security and release |
| `references/*` | User-provided challenge and UI reference screenshots |
| `templates/.env.example` | Client variable examples and server-secret names; no real credentials |

## Critical naming clarification

Antigravity recognizes `AGENTS.md` and `GEMINI.md` as project instructions, rather than `agent.md`. The requested `agent.md` is provided for convenience, but keep `AGENTS.md` at the repository root.

The older `.agent/` path is a legacy form; this kit uses the current `.agents/` convention. Workflows are being superseded by skills; this kit uses `SKILL.md` rather than deprecated workflow files.

## External prerequisites

- Node.js compatible LTS, npm and Java when required for emulators
- Google/Firebase project with Auth + Firestore; billing-enabled plan for deployed Cloud Functions and scheduled jobs
- Google Cloud Secret Manager/KMS IAM and APIs when configured
- Transactional email account, verified sender, and credentials stored only server-side
- Vercel account and GitHub repository for frontend deploy
- Browser automation support for visual QA

Do **not** copy real medical records into demo databases. Do **not** claim regulated healthcare compliance solely from security features.

## Sources for the configuration choices

- Antigravity rules: https://antigravity.google/docs/rules/
- Antigravity skills: https://antigravity.google/docs/skills
- Customization discovery: https://antigravity.google/docs/customization-discovery/
- Vite on Vercel: https://vercel.com/docs/frameworks/frontend/vite
- Scheduled Functions: https://firebase.google.com/docs/functions/schedule-functions


## Updated single-paste option

Open `SINGLE_MASTER_PROMPT.md` and paste it as one self-contained Antigravity engineering request. For the **complete source text of every project instruction document**, use `ALL_FILES_COPY_PASTE.md` or the combined `ONE_PASTE_ALL_FILES_AND_MASTER.md`. Every `.agents/rules/*.md` has valid `trigger` YAML frontmatter, while `AGENTS.md` itself has none.
~~~~~

## FILE: `agent.md`

~~~~~text
# agent.md — CareCircle agent handoff

**Canonical always-on instruction file:** [`AGENTS.md`](AGENTS.md).

Antigravity recognizes the uppercase `AGENTS.md` name automatically. This lowercase `agent.md` exists because it was requested as an easy-to-find handoff; it is **not** a substitute for the root `AGENTS.md`.

When beginning a CareCircle engineering session, open `AGENTS.md`, `MASTER_PROMPT.md`, `ui and ux.md`, and `docs/IMPLEMENTATION_PLAN.md`. Follow `.agents/rules/` and invoke the relevant `.agents/skills/` procedures.

Do not assume the documentation kit is an implemented application. Generate and verify the code in the workspace.
~~~~~

## FILE: `docs/ACCESSIBILITY.md`

~~~~~text
# Elderly-First Accessibility Plan (WCAG 2.2 AA Target)

## Core design

Older adults may have reduced visual acuity, motor precision, hearing, memory and digital familiarity. Make the next action obvious, use plain text, honor autonomy, and never demand an advanced interaction for basic medication confirmation.

## Mandatory behavior

- Normal content 16px minimum where practical; elder-focused pages 18–20px; line-height ≈1.5; headings with intentional hierarchy; Stack Sans fonts with Tamil/Devanagari supported fallbacks.
- Normal text 4.5:1 contrast, large text 3:1, non-text interactive components/focus boundary 3:1 where required. Verify across **translucent glass** and pastel colors.
- Large primary tap areas ideally ≥48×48 CSS px, adequate spacing; do not encode state only with red/green.
- HTML controls with accessible names, associated form labels, clear required/error descriptions and native semantics; no interactive `<div>` impersonations.
- Keyboard-only workflow from login → invited code → medication confirmation → appointment → caregiver alert acknowledgement. Focus visible, logical order, dialogs trap/manage/restore focus, no keyboard traps.
- Screen-reader `aria-live` for due/confirmation status used sparingly; no repeated alert spam; label date/time and pill instructions contextually.
- Support 200% zoom, 320 CSS px reflow, text enlargement, high-contrast mode, reduced motion and reduced transparency. No horizontal scroll except genuinely tabular content with accessible mobile alternative.
- Tamil/English/Hindi locale: layout handles expansion; verify translated dates and real fonts, not placeholder mixed-language text.
- CareVoice: user-initiated, speechSynthesis feature-detected, stop/pause visible, same info in text. Never auto-speak confidential medication content in public. Push opt-in, not required.
- Charts provide textual summary and data table; status detail available without hover/color.

## Test matrix

| Test | Elder | Family | Caregiver |
|---|---|---|---|
| Keyboard primary tasks | Medication confirm / Skip / Help | View update / claim task | Alert ack / edit permitted med |
| Screen reader | Next dose and state | Access-limited list | Pending queue and status |
| Mobile 360px | No clipped help CTA | No horizontal overflow | Task action visible |
| 200% zoom | Cards reflow | Timeline legible | Tables accessible |
| Locales | Tamil/Hindi fonts | Dates and directions | Label truncation |
| Error messages | Stale/offline and rejected dose | Permission denied | Concurrent conflict |

Automated axe tests help but cannot verify language quality or cognitive usability. Include manual checks and screenshots in release evidence. The stated target is **WCAG AA**, not a certification claim.
~~~~~

## FILE: `docs/ARCHITECTURE_AND_DATA.md`

~~~~~text
# System Architecture & Data Design

## 1. Architecture boundary

```
Vercel static CDN (React/Vite frontend)
    |-- Firebase Auth (session, Google sign-in)
    |-- Firestore scoped queries/onSnapshot (read-only or tightly permissioned)
    |-- Callable HTTPS Cloud Functions v2 (privileged mutations)
    |-- Optional FCM service worker (privacy-safe push)
                 |
Firebase / Google Cloud trusted runtime
    |-- Firebase Admin SDK + Zod + current membership checks
    |-- Firestore transactions, audit events, notification job outbox
    |-- Cloud Scheduler -> bounded due-job worker
    |-- Secret Manager -> email provider, HMAC, optional KMS
    |-- Cloud Logging (redacted events and operational metadata)
```

Vercel never stores private Firebase Admin credentials and never handles scheduled clinical data jobs. The frontend's public `VITE_` Firebase configuration is not secret; backend authorization and rules remain mandatory.

## 2. Monorepo structure to implement

```
carecircle/
  apps/web/src/
    app/                 # router, providers, auth boundaries
    components/          # shared design system
    features/auth/
    features/care-circle/
    features/medications/
    features/adherence/
    features/appointments/
    features/notifications/
    features/assistance/
    features/refills/
    features/reconciliation/
    features/care-shift/
    features/accessibility/
    lib/firebase/        # client SDK only
  functions/src/
    callables/            # auth + validated typed endpoints
    domain/               # pure state machines/business rules
    repositories/         # Firestore storage boundary
    security/             # permission, HMAC, logging, crypto
    scheduling/           # recurrence + bounded queue
    mail/                 # transport interface
  packages/shared/src/    # Zod schemas, DTOs, constants and errors
  tests/{rules,integration,e2e,a11y}/
```

Implement workspace scripts with actual commands and no no-op tests. Shared Zod types are authoritative at API boundaries; avoid trusting client status/role strings.

## 3. Domain entities / Firestore collections

| Path | Key fields | Mutability and security |
|---|---|---|
| `users/{uid}` | displayName, locale, accessibility, verifiedEmail, timezone | Self read/update for safe fields, role attributes server-managed |
| `careCircles/{circleId}` | ownerUid, elder profile, timezone, settings, updatedAt | Controlled owner operations |
| `careCircles/{circleId}/members/{uid}` | role, status, scoped permissions, grant/revoke metadata | Backend-only create/edit; permit safe member reads |
| `careCircles/{circleId}/medications/{medId}` | clinician-provided instructions, schedule version, state | Protected mutation through functions |
| `.../doseOccurrences/{occId}` | med/version ID, UTC dueAt, local schedule, status, actor, timestamps | Mutated transactionally; bounded reads for members |
| `.../doseEvents/{eventId}` | immutable confirmation/correction events and actor | Backend append only |
| `.../appointments/{apptId}` | clinician, local/UTC time, status, version | Backend mutation; cancelled jobs stale |
| `.../alerts/{alertId}` | event, recipients, ack/resolution, version | Protected ack/resolution; no private push message leak |
| `.../assistanceRequests/{requestId}` | kind, actor, status, acknowledgedBy, timestamps | Authorized mutation only |
| `.../inventoryLedger/{ledgerId}` | medication ID, signed quantity, source event, idempotency | Append through authorized backend, corrections separate |
| `.../refillTasks/{taskId}` | medication, low stock estimate, assignee, status | Controlled transitions |
| `.../prescriptionReconciliations/{id}` | proposed diff, source, reviewer, approval, version | Explicit manual approval |
| `.../careTasks/{taskId}` | type, assignee, state, due time, version | Backend state machine |
| `.../handoffs/{id}` | authorized summary, time window, creator | Redaction/expiry policy |
| `.../checkIns/{id}` | local date, opt-in state, actor | Controlled access |
| `.../auditLogs/{eventId}` | action, actor, resource, timestamp, safe metadata | Backend-only append, retention policy |
| `invitations/{inviteId}` | intendedEmail, circleId, HMAC verifier, expiry, attempts, state | Entirely backend-only |
| `notificationJobs/{jobId}` | dueAt, status, type, recipient, dedupe, attempts, lease | Entirely backend-only |
| `users/{uid}/pushTokens/{id}` | device token hash/ref, created, last used | Backend-validated; no cross-account access |

Use typed domain IDs with Firestore document paths, not user input to construct unrestricted references. Index all frequently scoped/due-time queries; cursor paginate events and lists. Do not put private notes in globally readable user profiles.

## 4. Auth and invitation API contracts (examples)

- `createCareCircle(input) -> {circleId}`: verified actor, owner bootstrap transaction.
- `createInvitation({circleId,email,role,permissions}) -> {invitationId,expiry,deliveryStatus}`: owner only; code delivered privately, not in client response.
- `redeemInvitation({invitationId,code}) -> {circleId,membershipStatus}`: verified matching email, attempts/expiry, constant time compare, atomic consume/create membership.
- `revokeMember({circleId,uid}) -> result`: ownership guard, backend revocation, invalidates future notifications; UI clears stale member cache.
- `createMedication`, `updateMedication`, `pauseMedication`, `confirmDose`, `correctDose`, `editAppointment`, `requestHelp`, `ackAlert`, `createRefillTask`, `assignCareTask`, `approveReconciliation`: all validated, authorized, idempotent where needed.

Use documented and type-checked Firebase callable APIs, not made-up method names. Maintain structured errors with safe client messages and internal redacted logs.

## 5. Medication schedule and dose occurrence model

Medication definition stores user-entered *clinician-provided* instructions, recurrence, timezone and a monotonically increasing version. A deterministic occurrence ID is derived from medication ID, **version**, scheduled local date/time and DST disambiguation, using an unambiguous serialization. Ensure idempotent creation and a bounded (e.g. 14-day) rolling horizon. Store UTC dueAt, IANA zone, local scheduled date/time, schedule revision and state.

When medication is edited: write new schedule version; invalidate/reconcile future unconfirmed occurrences, jobs, and upcoming events; preserve taken/skipped historical events. Define explicit DST nonexistent/ambiguous local-time policy and add tests for it. Any moved medication dose should not send old-time reminders.

Confirmation transitions: `scheduled/due/unconfirmed → taken|skipped`; same confirmation repeated with identical idempotency key returns original result, conflicting attempt returns a safe conflict; corrections create new event, not rewrite history. Store actor `uid`, asserted effective taken timestamp (if retrospective) and server record timestamp separately.

## 6. Notification/outbox processing

- Schedule stable per-occurrence jobs: upcoming, due, follow-up, escalation; separate appointment jobs and invitation mail.
- One `onSchedule` worker finds `status=pending AND dueAt<=now` through composite index, takes a **bounded** batch, claims with a transaction and expiring lease. Avoid full collection scans and unbounded fanout.
- Before delivery, reload occurrence status, appointment version, consent and current membership. Obsolete jobs are cancelled or marked stale; route to active eligible recipients only.
- Send through a transport interface; record provider acceptance, delivery status if verifiable, retry classification, max attempts and jittered backoff. External SMTP/email send may succeed before Firestore acknowledgement: never claim universal exactly-once delivery.
- Alert acknowledgement and delivery state are distinct. No excessive reminder loops. Integrate quiet hours with safety/owner-configurable override policy.
- FCM permission optional; generic notification preview; web in-app event path remains useful without FCM or online presence.

## 7. Inventory, reconciliation, caregiver coordination

**Inventory** is a ledger, not a mutable counter: opening stock + restocks + manual adjustments − confirmed administrations where applicable = estimated quantity, with uncertainty disclosure. Use stable event IDs to avoid duplicate decrements. User should be able to correct estimated count with an audit event. No automatic order/purchase.

**DischargeSync** produces a proposed diff from current schedule version to new *entered/verified* schedule, requires explicit authorized approval before changing active medications. Transactions/compensating plans handle generated jobs and occurrences. Old history remains.

**CareShift** uses explicit state transitions and version checks; assignee must be currently authorized. Revoking membership blocks task updates and prompts reassignment where needed. Handoff summarizes bounded period and contains only data recipient can see.

## 8. Privacy, consistency and rate limits

- Any sensitive backend mutation starts with auth/App Check where appropriate → validate Zod input → membership + permission → transaction/state check → write audit/outbox → return safe DTO.
- Track `version` on concurrently edited records. Reauthorize after member revocation even if client still holds a stale page.
- Keep computed/read-heavy dashboard aggregates bounded. Never materialize raw full-medical records into public search indexes, global client cache, logs or error messages.
- Document retention/deletion/export rules; never claim medical-regulatory compliance without assessment.

## 9. Environment contracts

Client: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, optionally storage, FCM VAPID, App Check site key, functions region. These values are not server secrets.

Server-only: `INVITATION_HMAC_SECRET`, mail transport credentials, optional Cloud KMS key resource, server rate-limit config, optional separate provider API key. Keep in Secret Manager/Functions secrets and IAM.

## 10. Definition of done for each new API

- Schema+authorization rules tests, service unit tests, datastore emulator integration, UI happy+error, audit event, no duplicate on retries, docs and requirement evidence. Test access via direct Firestore and callable endpoints, as both have distinct authorization boundaries.


## API/Methods implementation inventory

See [`FUNCTION_CONTRACTS.md`](FUNCTION_CONTRACTS.md) for expected typed callable commands, pure domain methods, event/queue lifecycle, authorization policies, and test obligations. Do not mark a method implemented solely because its name appears in a document.
~~~~~

## FILE: `docs/FUNCTION_CONTRACTS.md`

~~~~~text
# CareCircle 3.0 — Typed Function Contracts and Domain Methods

This is an implementation checklist and API blueprint, **not** a claim that code exists. Antigravity must implement, test, and map the final actual exported functions here. Names may be changed only when documented, retaining end-to-end behavior.

## 1. Callable boundary and common policies

- Use Firebase Cloud Functions v2 `onCall` for browser-triggered privileged operations, `onSchedule` for recurring jobs, and trusted internal domain functions for sensitive helpers.
- All callables: require `request.auth`, check App Check when configured, Zod-validate and bound payload, load active membership and action-specific permission on the server, validate resource belongs to the requested `circleId`, use transaction/idempotency for concurrency, write sanitized audit/outbox events, return typed safe DTO or typed sanitized error.
- Do NOT accept `actorUid`, `ownerUid`, `createdBy` or trusted `role` values from the client. Derive identity from verified token. Keep sensitive query and update operations backend-only.
- Prefer structured commands `{circleId, resourceId, expectedVersion?, idempotencyKey?, ...validatedFields}`. For writes, require idempotency keys on retryable and costly effects. Never expose HMAC, SMTP, Firebase Admin or KMS secrets in callable responses.
- For reads, a permission-safe bounded Firestore query can be preferable to callable, but document the Rules proof and test list-query constraints.

## 2. Care circles, identity, invitations

| Method | Inputs/permission | Expected effect |
|---|---|---|
| `createCareCircle` | verified actor, validated elder profile/timezone | create circle + owner membership atomically, log audit |
| `updateCareProfile` | `circleId`, safe profile patch; owner/approved permission | versioned update + audit |
| `createInvitation` | `circleId`, normalized verified target email, role, permission subset; `members.manage` | random numeric code, email delivery, HMAC verifier backend-only; return invitation ID + expiry + accepted/queued delivery state, **not code** |
| `redeemInvitation` | `invitationId`, code; authenticated verified email matches | atomic attempt tracking/expiry/one-time membership grant and audit |
| `revokeInvitation` | invitation ID; owner/member admin | revoke before redemption, audit |
| `setMemberPermissions` | `circleId`, member UID, approved permission set; owner | enforce permission caps and ownership guard, versioned update and audit |
| `revokeMember` | `circleId`, target UID; owner | revoke, suppress future notification jobs, clear caller-access results, trigger task reassignment review |
| `listAuthorizedCareCircles` | current authenticated user | **bounded** authorized list, no global circle enumeration |

Invitation helpers: `generateSecureNumericCode`, `normalizeInviteeEmail`, `createInvitationVerifier`, `verifyInvitationVerifier`, `checkInvitationAttemptBudget`, `consumeInvitationTransaction`. Use crypto-secure code generation and constant-time HMAC comparison. Email target binding, rate limits, 10-min expiry, max five attempts and concurrent redemption tests.

## 3. Medication and adherence

| Method | Inputs/permission | Expected effect |
|---|---|---|
| `createMedication` | circle + clinician-supplied schedule; `medication.write` | validate/store definition, version 1, generate bounded occurrences/jobs |
| `updateMedication` | med ID, expected version, edited plan; `medication.write` | new version, replace only future pending schedule/jobs, preserve history |
| `pauseMedication` | med ID + state/version; `medication.write` | pause or resume future scheduling, audit |
| `archiveMedication` | med ID; `medication.write` | archive without erasing history |
| `confirmDose` | circle ID, occurrence ID, `taken|skipped`, stable idempotency key; `medication.confirm` | atomic transition, actor/time provenance, idempotent event, inventory effect once, cancel stale jobs |
| `correctDose` | occurrence ID, correction reason and audited replacement assertion; appropriate permission | append correction event; preserve original confirmation history |
| `reportDoseUnconfirmedReason` | occurrence ID, one of 5 enumerated reasons; approved permission | state/event record and contextual safe task/notification |
| `getMedicationHistory` | circle/med ID + limit/cursor; `adherence.read` | permission-scoped paginated event history |

Pure helpers: `generateDoseOccurrences(schedule, from, through, timezone, dstPolicy)`, `createOccurrenceId(medId, version, localDate, localTime, dstChoice)`, `canTransitionDose(from,to)`, `deriveDoseStatus(occurrence,clock)`, `calculateAdherence(occurrences,window)`, `planDoseNotifications(occurrence,preferences)`, `reconcileFutureOccurrences(oldPlan,newPlan)`. Inject deterministic clock in all time-dependent tests. A missed confirmation is `unconfirmed`, not known ingestion failure.

## 4. Appointments, alerts, assistance

| Method | Inputs/permission | Expected effect |
|---|---|---|
| `createAppointment` | validated clinician/timezone/time; `appointments.write` | appointment + reminder jobs |
| `updateAppointment` / `rescheduleAppointment` | appointment ID + expected version; `appointments.write` | versioned change + stale job invalidation + new jobs |
| `cancelAppointment` | appointment ID; `appointments.write` | cancel and invalidate future reminders |
| `completeAppointment` | appointment ID; `appointments.write` | mark completed, audit |
| `acknowledgeAlert` | alert ID; `alerts.ack` | server identity + timestamp; race-safe ack |
| `resolveAlert` | alert ID + resolution note; authorized caregiver | auditable resolved state |
| `createAssistanceRequest` | circle ID, kind, optional concise note; elder/authorized user | help event, notification jobs to consented active contacts |
| `acknowledgeAssistance` / `resolveAssistance` | request ID; `assistance.respond` | independent acknowledgement and resolution, audit |
| `updateNotificationPreferences` | self/owner configured scope | consent/quiet-hours and channels, no silent notifications to opted-out recipients |
| `registerPushToken` / `unregisterPushToken` | authenticated user/device binding | validated scoped token register/remove, permission-aware cleanup |

Separate notification transport status `pending/claimed/provider_accepted/delivered_if_supported/failed` from *care action* `created/acknowledged/resolved`.

## 5. Refills, reconciliation, CareShift

| Method | Inputs/permission | Expected effect |
|---|---|---|
| `recordOpeningInventory` | medication ID + safe quantity/unit; approved editor | ledger opening event, no counter mutation without audit |
| `recordRestock` | med ID + positive quantity/unit; approved editor | idempotent ledger credit |
| `adjustInventory` | med ID + signed correction + reason; editor | audited adjustment with stable ID |
| `createRefillTask` | med ID + assignee optional, due date; task permission | pending refill task |
| `assignRefillTask` / `claimRefillTask` | task ID + version; active authorized member | collision-safe assignment/claim |
| `completeRefillTask` | task ID + completion; task permission | task completion, distinct stock restock entry if supplied |
| `createReconciliationProposal` | entered *clinician-issued* new plan; medication writer | inactive proposal, source/reference metadata |
| `getReconciliationDiff` | proposal ID; authorized reader | added/changed/stopped/unchanged as factual data diff |
| `approveReconciliation` / `rejectReconciliation` | proposal ID, expected version; authorized approver | explicit approval and versioned future schedule/jobs reconciliation, intact history |
| `createCareTask` | type, assignee/due time; `tasks.assign` | task with pending status |
| `assignCareTask` / `reassignCareTask` | task ID, active authorized member; `tasks.assign` | conflict-safe assignee change |
| `acceptCareTask` / `declineCareTask` | task ID; intended assignee | valid transition, audit and notification |
| `completeCareTask` | task ID; authorized assignee | completed state, recorded completion |
| `generateCareHandoff` | circle, bounded time window; authorized member | redacted summary at timestamp, not fabricated medical outcome |

Pure helpers: `estimateInventory(ledger, confirmedUsage, clock)` with uncertainty/units, `diffMedicationPlans(old,new)`, `canTransitionCareTask`, `canTransitionRefillTask`, `buildCareHandoff`, `scheduleRefillWarningIfNeeded`, `validateReconciliation`. Ensure confirmed administration subtracts inventory **once**, and inventory remains an estimate.

## 6. Secondary features

- `recordWellbeingCheckIn`: opt-in per elder-local day, consistent timestamp/actor, no inferred safety from silence.
- `exportCarePassport`: authenticated, permission-scoped summary using minimum necessary information; explicit consent, accurate as-of timestamp and sensitive export audit. PDF generation only if implemented; print view can be baseline.
- `saveAppointmentCompanion`: create/edit visit questions, prep checklist and follow-up tasks; no generated clinical advice.
- `speakReminderText`: **client-only**, user-initiated `speechSynthesis` with locale fallback, no hidden recording or compulsory microphone.
- P2 OCR input must be treated as an untrusted *draft* and cannot trigger prescription activation without manual verification.

## 7. Scheduler, jobs and outbound messaging

- `scheduleDoseReminderJobs` / `scheduleAppointmentJobs`: generate stable per-event+recipient+channel+version job IDs and write idempotently.
- `claimDueNotificationJobs(now, batchSize, leaseDuration)`: indexed dueAt pending query, transaction claim with lease, bounded batch.
- `isNotificationStillRelevant(job, currentState, recipientConsent)`: recheck occurrence/appointment version, member status, preferences, quiet hours.
- `processNotificationJob`: send through `MailTransport`/`PushTransport`/`InAppTransport` adapter; persist attempt/ack code/retry state; distinguish transport acceptance from delivery.
- `calculateRetryBackoff(attempt)`: capped exponential backoff + jitter, deterministically mock jitter in tests.
- `renderEmailTemplate`: safe subject/body, HTML escaping and text alternative, generic lock-screen data.
- `sanitizeAuditMetadata`: remove tokens, passcodes and medical note content.

Implement a **single scheduled bounded worker**, not a new Cloud Scheduler per medication. Do not claim exactly-once email guarantees.

## 8. Required integration and negative-path tests

- Two unrelated circles cannot read or list each other's private records; anonymous and revoked access fails.
- View-only member cannot mutate appointments, dose state or permissions; owner cannot be self-reassigned by another member.
- Invitation wrong, expired, already used, email mismatch, brute-force and concurrent redemption are rejected.
- Concurrent `confirmDose` yields one event and one inventory use; double dose confirmation UI warns.
- DST and timezone schedule generation has tested explicit policy; edit preserves historical occurrences.
- Cancelled appointment/email recipient revoked/confirmed dose prevents obsolete reminder.
- Email provider failure, lease expiration, overlapping scheduled workers and FCM permission denial are handled.
- AES-GCM tag/ciphertext/AAD mismatch fails closed if selective encryption is enabled.
- Task/refill/reconciliation version races resolve predictably and audit history remains intact.
- Elderly UI works keyboard-only, at 200% text zoom, with high contrast, multilingual script glyphs and screen-reader status feedback.

## 9. Release acceptance report

Update requirements matrix with actual implementation/test evidence; include function-to-file mapping; run TypeScript, lint, formatting, unit/emulator/rules/integration/E2E/axe, build, npm audit and browser screenshots where available. Mark `implemented`, `emulator_verified`, `deployment_configured`, `deployed`, and `production_smoke_verified` separately. A missing Firebase project, SMTP provider or Vercel access is a clearly documented blocker, not a reason to fake success.
~~~~~

## FILE: `docs/GOOGLE_SERVICES.md`

~~~~~text
# Genuine Google Services Integration Plan

The project is judged partly on **Google Services Usage**. Integrate useful services in real workflows; never add unused SDK imports merely for evaluator optics.

| Service | Actual purpose | Local/production evidence |
|---|---|---|
| Firebase Authentication | Email/password, Google sign-in, verified identity, Firebase sessions | Auth emulator tests + login flow, real app config |
| Cloud Firestore | Care circles, schedules, dose state, roles, appointments, tasks, alerts and live subscriptions | Firestore emulator integration + Rules tests + scoped onSnapshot demo |
| Cloud Functions v2 | Trusted callables for membership, invite, medication and business mutations, audit | Local Functions emulator + request validation/authorization tests |
| Cloud Scheduler | Trigger bounded reminder/appointment jobs via `onSchedule` | Scheduler handler unit/integration tests; deployed job only after billing/configuration |
| Firebase Cloud Messaging | Optional web push with consent, service worker, token handling | Permission-denied fallback + supported browser test; not substitute for email |
| Firebase App Check | App attestation complementary to Firebase Auth | Production provider and domain config, emulator/debug isolation |
| Secret Manager | HMAC, SMTP and optional encryption credentials; Functions secrets | deployment config/CI no leaked secrets; only verified when provisioned |
| Google Cloud KMS | Optional per-record encryption key wrapping for sensitive fields | integration tests, IAM, key rotation evidence only if actually configured |
| Firebase Emulator Suite | Local repeatable auth, Firestore, Functions and rules development | test scripts/CI with fake project ID and fixture cleanup |
| Optional Google Calendar API | Explicit user-authorized appointment export | separate OAuth consent & token security; not required for P0 |

## Implementation notes

- Register a Firebase Web app and use the **public** Firebase client config in Vite. Public client config does not secure Firestore; Auth, App Check, Security Rules and server checks do.
- Use Firebase Auth verified email for passcode redemption; Google popup sign-in is a practical default on a separate Vercel domain. Configure authorized domains. If redirect is desired, follow Firebase redirect storage best practices rather than assuming it works cross-site.
- For Firestore, design permission-aware list queries and indexes up front. Client SDK reads must pass security rules; Admin SDK functions explicitly verify authorization.
- Cloud Functions v2 `onCall` for authenticated browser-to-server operations; validate input; Secret Manager access server-side; App Check where available/configured.
- Cloud Scheduler via `firebase-functions/v2/scheduler` and `onSchedule`; one recurring worker with robust job queue, transaction claims, retries and recipient rechecks. Scheduler functions may overlap and retry; design accordingly.
- FCM browser push requires service worker, VAPID, permission and HTTPS; fall back gracefully. Use generic lock-screen text.
- Don't suggest Gemini for medical triage, drug interactions, automated prescriptions or unreviewed clinical recommendations. Optional generative text summaries require privacy/consent and manual review.
- Google services may require billing-enabled project, API permissions, domain ownership and SMTP account; document actual prerequisites rather than promise everything is cost-free.

## Production setup checklist

- [ ] Firebase project created; correct region selected; separate staging/prod projects when feasible.
- [ ] Auth email/password + Google provider enabled; authorized stable Vercel/custom domains.
- [ ] Firestore in production mode with generated restricted rules and composite indexes; no broad `allow read, write: if true`.
- [ ] Cloud Functions v2 deployed after real secrets configured; least-privilege service accounts/IAM.
- [ ] Scheduler API/job deployed and backend logs verified against a synthetic near-due test event.
- [ ] Email transport configured with verified sender; delivery success differentiated from provider acceptance.
- [ ] App Check production keys and debug bypass restricted to development.
- [ ] FCM web permission opt-in and service worker tested; fallback works without permission.
- [ ] Cloud KMS only if configured; encryption data/key schema and tamper tests present.
- [ ] All source code imports used for real functions, not just symbolic Google usage.

## Source references

- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/firestore/security/get-started
- https://firebase.google.com/docs/firestore/security/test-rules-emulator
- https://firebase.google.com/docs/functions/schedule-functions
- https://firebase.google.com/docs/app-check
- https://firebase.google.com/docs/cloud-messaging/js/client
~~~~~

## FILE: `docs/IMPLEMENTATION_PLAN.md`

~~~~~text
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
~~~~~

## FILE: `docs/PERFORMANCE.md`

~~~~~text
# Efficiency & Performance Engineering Plan

## Core constraints

- Real-time Firestore listeners only for **active authorized care circle** and short bounded windows; unsubscribe on route/circle/logout/revoke. No worldwide or all-history onSnapshot subscriptions.
- Query by `careCircleId`, due status and time range; composite index in `firestore.indexes.json`; Firestore Rules must support the query shape. Paginate audit events, medication history, long appointment history and handoff reports.
- Use one or a small fixed number of scheduled workers, not one scheduled job per dose. Queue dueAt index, limited batch, lease claim, stable deduplication IDs, backoff and dead-letter status.
- Avoid listeners for every tiny card; share normalized query hooks, invalidate on mutation; avoid N+1 per-person queries across caregiver portfolios.
- Treat mobile rendering as primary: code split heavy charts/secondary reports; load only current timeline/card data. Prefer lightweight accessible chart package; charts only for real metrics.
- Do not apply blur on every card or animate dozens of elements; prefer stable CSS backdrop and solid white inner panels. Respect low-power and reduced-motion modes.
- `web-vitals` / Lighthouse measurements are informative; test actual pages, not an empty shell.

## Targets to verify, not guarantees

- No unauthenticated page requires Cloud Functions cold start just to show landing/login.
- Medication confirmation latency appears as pending before server success; UI remains responsive; no duplicate click on slow network.
- A scheduled worker does bounded reads and has documented concurrency and retry limits.
- Main elder dashboard avoids multiple high-cardinality live queries; historical views paginate.
- No memory leak across five consecutive care-circle switches or route navigation cycles.
- Background tabs and offline reconnect reconcile state without fabricating confirmations.

## Observability

Measure Cloud Function duration/errors (without PHI), queue backlog and oldest pending time, email accepted/failed/retry counts, Firestore read/write growth and billable function execution. Define basic alerts for sustained backlog, non-delivery, auth errors, and unusual passcode attempts. Add privacy-safe logging only.

## Cost safety

Budget controls on billing-enabled Firebase project. Monitor Firestore reads from real-time listeners, Cloud Scheduler frequency, Cloud Functions invocations, emails sent and KMS calls. Use emulator for rapid dev cycles. Document that billing alerts do not automatically hard-stop spend.
~~~~~

## FILE: `docs/PRODUCT_REQUIREMENTS.md`

~~~~~text
# Product Requirements — CareCircle 3.0

**Context:** PromptWars × Catalyst challenge: Elderly Care & Medication Management Platform. **Primary user:** older adult who owns the care profile. **Other users:** authorized family and caregivers. **Core challenge:** personal healthcare coordination with passcode-based shared access, schedules/adherence/appointments, proactive email reminders, proactive collaboration and elderly agency.

## Product guardrails

- CareCircle is a care *coordination and record-keeping* platform, not a medical device, emergency responder or clinical decision support system.
- A dose record is user-reported, not sensor verified. `unconfirmed` is not necessarily `missed`. Never direct users to double up or take late doses.
- Elder retains membership/consent controls. Explicit staff-member permissions and each care circle's ownership always apply.
- All notification recipients must have current authority and preferences; avoid detailed medical content in push/email by default.
- All mandatory original-challenge requirements outrank optional AI/OCR/graphs.

## Persona-driven journeys

### Elder

Register or sign in → create care circle → select timezone/language/accessibility → enter clinician-issued medication schedule → invite a caregiver/family member through a secure short-lived code → see today's schedule → mark Taken/Skipped → see next dose and appointment → request assistance or provide contextual follow-up reason → review who can access information.

### Caregiver

Authenticate with invited email → redeem one-time code → access only authorized elder/circles → see pending confirmations, caregiver escalation and appointment changes → acknowledge alerts, create permitted medication edits, coordinate refill or care tasks → resolve tasks with audit history.

### Family

Accept invitation → see explicitly permitted adherence, appointment and alerts → take responsibility for specific tasks → receive selected messages → ask for help or coordinate visit → cannot escalate privileges or see other circles.

## P0 — Required problem-statement features and behavioral acceptance

| ID | Feature | End-to-end acceptance |
|---|---|---|
| P0-01 | Auth + profile | Firebase sign-in, profile persisted, verified identity where required; logout clears private state |
| P0-02 | Care circle | Elder owns isolated profile; membership permissions, revocation and audit work |
| P0-03 | Passcode invitation | Owner issues email-bound one-time short-lived secret; authenticated invitee redeems transactionally; brute-force and replay tests pass |
| P0-04 | Medication CRUD | Authorized member adds/edits/pauses/stops recurring prescription-derived schedules and sees persisted changes |
| P0-05 | Dose occurrences | Multiple doses/day, weekly recurrence, timezone/DST, schedule versioning, no duplicate occurrence generation |
| P0-06 | Adherence | Taken/Skipped/Unconfirmed statuses and auditable actor/date; UI responds to server-confirmed changes |
| P0-07 | Appointment CRUD | Create/reschedule/cancel/completed, live updates and cancelled reminder invalidation |
| P0-08 | Proactive email | Upcoming dose, unconfirmed follow-up, caregiver escalation, appointments, proper delivery-attempt log and retry-safe queue |
| P0-09 | Shared dashboards | Elder/caregiver/family role-based views, real authorized Firestore updates, understandable empty/error/loading states |
| P0-10 | Privacy/accessibility | Deny-by-default rules and server authorization, no medical detail leaks; usable elder-first WCAG AA experience |

## P1 — Real-time, safety and differentiated features

### P1-01 LiveCare escalation

Default illustrative timing T−15 upcoming, T due, T+30 unconfirmed prompt, T+60 caregiver escalation; adjustable by owner/provider rules. Store notification jobs with stable IDs and status, dedupe and retry. Current status checked immediately before sending. Caregiver can acknowledge and resolve an alert with an audit event. Never claim exactly-once SMTP delivery.

### P1-02 SafeDose Shield

Detect duplicate confirmation of the same `doseOccurrenceId`, show prior record (timestamp/actor), reject duplicate state transition server-side, and permit a separately authorized correction requiring a reason and audit. This mitigates duplicate *recording*; it does not prove no double ingestion occurred.

### P1-03 WhyMissed? contextual follow-up

For Unconfirmed states present: `Forgot`, `Medicine unavailable`, `Need assistance`, `Feeling unwell`, `Already took but didn't record`. Persist reason and safely route: unavailable → refill task; help → assistance request; unwell → caregiver contact/appropriate real-world guidance; already took → explicit retrospective confirmation with accurate entered-vs-effective timestamps; forgot → view prescription and contact caregiver, **not dosing advice**. Test all paths, accessibility and abuse/rate limits.

### P1-04 Refill Guardian

Maintain medication inventory ledger: opening stock, replenishments, clinician-authorized schedule versions, user-confirmed usage, manual corrections; forecast exhaustion with explicit assumptions and unknown/estimated status; low-stock threshold; owner/caregiver can assign and close refill task. Avoid negative inventory and never automatically order medication. Reconcile unexpected entries.

### P1-05 DischargeSync

Allow authorized users to enter a **proposed** updated prescription after a visit, comparing `added / changed / stopped / unchanged` against current medication versions. Never activate unverified OCR or AI suggestions. Show side-by-side accessible diff; require authorized human review, preserve historical doses and medication definitions, change future occurrences and reminder jobs safely/transactionally. Record who approved and source metadata.

### P1-06 CareShift

Care responsibilities can be created/assigned/scheduled/accepted/declined/reassigned/completed by authorized members. Task type: medication assistance, appointment transport, refill collection, general care request. Prevent incompatible concurrent resolution; show assignee/due time/timezone/status and brief handoff summary. Escalation only to consented contacts and manageable quiet hours.

### P1-07 One-tap help

Create `assistanceRequest` with type, notes, owner, priority and state `open → acknowledged → resolved`, notify authorized caregivers, show acknowledgement. Clearly **not an emergency response service**; offer locally appropriate emergency contact info without claiming outreach.

### P1-08 CareDay, CarePulse and CareCircle View

Elder next action + timeline; caregiver attention queue with real data and activity; family permission-aware overview; connected-member view with accessible list alternative. Implementation details in `ui and ux.md`.

## P1 — Secondary convenience features

- **CareVoice**: language preferences Tamil/English/Hindi, user-started `speechSynthesis` when supported, visible text, audio privacy, manual correction and translated dates; do not use microphone capture by default.
- **CarePassport**: time-stamped, access-controlled clinician-visit summary of medications, allergies *if explicitly entered*, appointments/emergency contacts; no unauthenticated share URL by default, reauth for sensitive exports, export audit.
- **Appointment Companion**: prepare doctor questions; appointment notes; follow-up tasks; do not assert medical interpretation.
- **Wellbeing Check-In**: simple optional daily status; caregiver notification if configured and not submitted; non-response ≠ physical danger.
- **Care Handoff Report**: compact authorized last-shift events, scheduled next tasks, outstanding alert/refill info; snapshot timestamp, timezone and role-redaction.

## P2 — Only after validated P0/P1

- **Prescription Lens:** optional image OCR with reviewed drafts and evidence; never automatically activate extracted medication schedule.
- **Side-effect journal:** symptom/time/notes, optional caregiver sharing, no causal attribution to medicine without a clinician.
- **Offline Safety Mode:** clearly stale, read-only local schedule; privacy and encryption risk review before caching clinical content.
- **Medicine review flag:** basic ambiguous/duplicate *text-entry* flags, do not declare drug-drug interaction safety or prescribe.
- **CareRoutine Planner:** optional prescribed routines (hydration/exercises/measurements) with opt-in reminder; avoid prescriptive generic medical instructions.
- **Google Calendar:** optional permission-scoped add-to-calendar, not a replacement for core appointments.

## Task states

- Dose: scheduled/due/unconfirmed → taken or skipped, with later correction as a new auditable event. Define whether due/unconfirmed are derived or persisted; one canonical source.
- Alerts: created → eligible/sent → acknowledged → resolved; delivery-attempt status separate from acknowledgement and never conflated.
- Refill: open → claimed → in_progress → completed/cancelled.
- Care task: pending → accepted → in_progress → completed/cancelled; explicit declined/reassigned branches.
- Invitation: issued → redeemed / expired / revoked / locked; max five attempts and one-time redemption.

## Usability: scope control

Elder's main navigation has at most 5 destinations; most important daily action remains one click away. Caregiver can see the next action for all authorized circles. No irrelevant metrics, price-tier promo or copied visuals. Localization and text scaling are tested end-to-end.

## Functional acceptance scenarios

1. Two users from unrelated care circles cannot read or modify each other's data, including list queries and notifications.
2. Verified family receives invitation and accesses only authorized care; stolen/expired/reused code fails.
3. Medication schedule on timezone boundary yields correct occurrence time and delivery; edit future instances without rewriting history.
4. Elder confirms a dose; caregiver UI updates without reload, duplicate confirm is refused and original actor shown.
5. Unconfirmed dose generates a follow-up and escalation to a consented active caregiver, never to revoked or opt-out recipients.
6. Elder reports medicine unavailable; refill task and status flow appear; estimate explains uncertainty.
7. New clinician-issued medication plan is reviewed in DischargeSync; next occurrences update without wiping historical records.
8. CareShift assignee accepts, updates and completes a task; other caregivers see it as handled.
9. Appointment cancelled → scheduled reminder invalidated; email provider failure is logged and retried safely.
10. Browser push denied and speech unavailable → web/app and email workflows still function.

## Out of scope for MVP

Automatic prescriptions, emergency dispatch, biometric monitoring, diagnosis, unverified clinical interaction alerts, location tracking, opaque “health risk” scores, real-time doctors-on-call marketplace, payment processing and health data monetization.
~~~~~

## FILE: `docs/QUALITY_AND_TESTING.md`

~~~~~text
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
~~~~~

## FILE: `docs/REFERENCE_ASSETS.md`

~~~~~text
# User-Provided Reference Images & Design Use

The `references/` directory contains images supplied in the conversation as **visual and problem-statement references**:

- `official-problem-statement.jpeg` — challenge slide, required features and language.
- `branding-type-palette.png` — Stack Sans Headline typography and dark/ivory/lemon/blue design family.
- `dashboard-full.png` — overall dashboard structure, sidebar, white rounded cards, calendar and medication lists.
- `dashboard-closeup.png` — spacing, tabs, charts, interaction density and visual polish.

The external design link is https://dribbble.com/shots/27480941-Healthcare-Web-Patient-Portal . Use it to understand design language, not to copy source CSS, logo, branded imagery, doctor photos or copyrighted illustration assets verbatim.

**CareCircle should be original:** elder-centered CareDay; caregiver-centered CarePulse; CareShift/DischargeSync/Refill Guardian, not the reference's fictitious health parameters or MediApp advertising. Align all medical content with genuine app data and privacy controls. Responsive accessibility outranks pixel-level imitation.

If images are not visible to the Antigravity agent automatically, explicitly open the files or attach them in the agent chat. `ui and ux.md` fully describes the intended design even without image inspection.
~~~~~

## FILE: `docs/REQUIREMENTS_MATRIX.md`

~~~~~text
# Assessment-Aligned Requirements Traceability Matrix

**Status vocabulary:** `not started` → `implemented (not tested)` → `verified locally` → `verified deployed`. **This instruction kit does not contain completed application source code.** Antigravity must replace `TBD` with actual source and test paths and update status only with real evidence.

| ID | Evaluation area | Requirement | Feature / acceptance | Source evidence | Test evidence | Status |
|---|---|---|---|---|---|---|
| R01 | Alignment | Elder authentication | Real Firebase login, verification and session | TBD | TBD | not started |
| R02 | Alignment/Security | Shared profile | Owned care circle, active membership and revocation | TBD | TBD | not started |
| R03 | Alignment/Security | Passcode invitation | HMAC one-time code + matching verified email, 10-minute expiry | TBD | TBD | not started |
| R04 | Alignment | Medication CRUD | Authoritative persistent schedules and edits | TBD | TBD | not started |
| R05 | Alignment/Testing | Adherence | Taken/Skipped/Unconfirmed with concurrency and history | TBD | TBD | not started |
| R06 | Alignment | Appointments | Create/edit/reschedule/cancel and upcoming view | TBD | TBD | not started |
| R07 | Alignment/Google | Proactive email | Upcoming, unconfirmed, escalated and appointment reminders | TBD | TBD | not started |
| R08 | Google/Efficiency | Real-time shared data | Bounded onSnapshot and secure subscriptions | TBD | TBD | not started |
| R09 | Google/Efficiency | Scheduled worker | Indexed durable jobs, retries, deduplication | TBD | TBD | not started |
| R10 | Security | Access isolation | Server + Firestore rules, all persona negative cases | TBD | TBD | not started |
| R11 | Security | Secrets and cryptography | Server-only HMAC, proper encryption where selected | TBD | TBD | not started |
| R12 | Safety/Testing | SafeDose | Duplicate prevention + auditable correction | TBD | TBD | not started |
| R13 | Innovation/Testing | WhyMissed? | Context reason maps to safe follow-up action | TBD | TBD | not started |
| R14 | Innovation/Efficiency | Refill Guardian | Audited inventory ledger and estimated supply | TBD | TBD | not started |
| R15 | Innovation/Security | DischargeSync | Verified diff + future-only updates + history | TBD | TBD | not started |
| R16 | Innovation | CareShift | Assign/acknowledge/complete coordination tasks | TBD | TBD | not started |
| R17 | Innovation | One-tap help | Request → caregiver ack → resolved, non-emergency label | TBD | TBD | not started |
| R18 | Accessibility/UI | CareDay elder-first dashboard | One clear next action and timeline, large controls | TBD | TBD | not started |
| R19 | Accessibility/UI | CarePulse & family views | Actionable data and role-scoped screens | TBD | TBD | not started |
| R20 | Accessibility | WCAG 2.2 AA target | axe + keyboard, reflow, contrast, locale | TBD | TBD | not started |
| R21 | Innovation | CareVoice | Tamil/English/Hindi + user-initiated read-aloud | TBD | TBD | not started |
| R22 | Innovation/Security | CarePassport | Access-controlled summary/export | TBD | TBD | not started |
| R23 | Innovation | Appointment Companion | Pre-visit and post-visit task management | TBD | TBD | not started |
| R24 | Innovation | Wellbeing Check-In | Optional check-in, privacy-preserving follow-up | TBD | TBD | not started |
| R25 | Innovation | Care Handoff Report | Permission-scoped recent task summary | TBD | TBD | not started |
| R26 | Code Quality | Strict TS and architecture | Modular shared types, lint, format, no fake tests | TBD | TBD | not started |
| R27 | Testing | Security & integration suite | Emulator/rules E2E with negative cases | TBD | TBD | not started |
| R28 | Efficiency | Bounded queries and listeners | Indexed time queries, cursor paginated history | TBD | TBD | not started |
| R29 | Google | Real services | Auth/Firestore/Functions/Scheduler/FCM/Secret Manager | TBD | TBD | not started |
| R30 | Deployment | Vercel SPA | Built app, direct route refresh, smoke tests | TBD | TBD | not started |
| R31 | Deployment/Testing | CI | GitHub Actions green and documented limits | TBD | TBD | not started |

## External verification notes

List date, real project/domain and redacted evidence of live email, OAuth, Scheduler and FCM only after actual execution. Do not copy credentials, health data or log excerpts containing sensitive information into this document.
~~~~~

## FILE: `docs/SECURITY_AND_PRIVACY.md`

~~~~~text
# Security & Privacy Engineering Specification

## 1. Threat model

Data: medication names and schedules, adherence, appointments, notes, family identities, emergency contacts and invitations; sensitive, not public. Attackers: anonymous scrapers; ordinary users crossing care-circle boundaries; invited but revoked caregivers; code-guessers; compromised browsers/devices; bot abuse of reminders; developers accidentally exposing secrets; malicious input to an OCR/upload workflow. Attack surfaces: web routing, Firebase Client SDK queries, callable functions, Firestore rules, email delivery, push notifications, exported CarePassport, logs and CI/CD.

**Primary control:** enforce resource-specific authorization; cryptography without access control is insufficient. Assume the client is hostile. Verify membership **server-side on every privileged function**; Firestore Admin SDK bypasses Rules. Default-deny unspecified Firestore paths and test both document reads and list queries.

## 2. Authentication and sessions

- Firebase Authentication handles password storage/hashing; do not implement custom password DB. Support email/password and Google sign-in; email verification required for invitation redemption. Handle credential linking carefully, no duplicate identity assumptions.
- Protect against session fixation with SDK-managed auth state; route guards are UI only, not security. On logout or revocation, unsubscribe Firestore and clear in-memory sensitive state.
- Sensitive membership/ownership/export changes: verify recent authentication and use optional MFA if configured and supported. Document account recovery and MFA upgrade prerequisites.
- Restrict Firebase Auth authorized domains to stable production/staging/localhost; do not assume all random Vercel preview URLs are trusted.

## 3. Roles, ABAC and permission policy

Permissions are scoped by circle and resource: `medication.read`, `medication.write`, `medication.confirm`, `appointments.read`, `appointments.write`, `adherence.read`, `alerts.read`, `alerts.ack`, `tasks.read`, `tasks.assign`, `tasks.complete`, `members.manage`, `audit.read`, `privacy.export`, `careNotes.read`. `owner/caregiver/family` are labels; dynamic permission checks grant actual access. Views/notifications/exports are each restricted separately. No self-grant. Revocation effective on next server read/write and future notifications; stale client render must be cleared.

Backend flow: `authenticated && verified when required && activeMember(circleId,uid) && hasPermission(action) && resource.circleId===circleId && validStateTransition && validatedInput`. Read/write rules enforce consistent subset for direct client SDK actions. Prefer protected server mutations for sensitive operations.

## 4. Secure invitation algorithm

Human-entered codes have low entropy; strength comes from **cryptographically generated code + server held HMAC + strict rate limiting + short expiry + identity binding**.

1. Generate numeric 8-digit code using cryptographically secure rejection-sampling or secure integer generation (not `Math.random`).
2. Create unique invitation ID and bind to target `normalizedEmail`, circleId, intended permissions, expiry (10 minutes).
3. Store `verifier = HMAC_SHA256(secret, canonical(inviteId,code))`. `secret` in Secret Manager; use suitable domain separation and secret rotation/versioning. Never store raw code.
4. Send code to intended email; do not return plaintext code from public callable or add it to URL/logs.
5. Redemption requires authenticated and verified matching email. Enforce per-code ≤5 attempts; additional per-user, IP, and device/risk throttles, all server-side; controls must not be raceable.
6. Check expiry, role caps, locked/revoked/used status, compare verifier in constant time, transactionally create membership and mark invitation consumed. Concurrent redemptions must not create duplicate memberships or restore revoked permissions.
7. Record safe audit event; delete/expire abandoned code verifier according to retention policy.

For higher-security invitations, also support ≥128-bit URL-safe tokens with their own one-time verification, but never replace numeric accessible entry if the original challenge needs passcodes.

## 5. Encryption

- TLS for transit; Firestore service encryption at rest. This does **not** mean end-to-end encryption or freedom from access risks.
- Encrypt *selected extra-sensitive fields* (private clinician notes, attached medical details if justified) using vetted AES-256-GCM library. Generate unique 96-bit nonce per key+message, store auth tag, associated data (circleId, objectId, schema version), ciphertext and key version. Authenticated additional data binds records to context. Handle tamper/auth failures safely.
- Optional Google Cloud KMS envelope encryption: random per-record data key, KMS-wrapped key, key rotation plan, least-privilege KMS identity, secure memory handling and outage behavior. Never hardcode encryption or KMS keys in client code.
- Keep due dates, status and indexed scheduling metadata separately queryable in protected Firestore; encrypting all fields makes due-job queries impossible. Only trusted functions decrypt; sanitize exported result and log access purpose.
- KMS is a **configuration-dependent integration**; do not claim implemented/live if not actually configured and tested.

## 6. Input, output, logging and abuse

- Zod validate every callable payload and normalized identifiers/timezones. Restrict max field sizes, arrays, attachment types and URLs. Permit only safe HTTP(S) appointment links; no arbitrary injected HTML or dangerous schemes.
- Default sanitized error messages; internal error codes without secrets/PHI. No `eval`, dynamic code execution or HTML injection.
- Sanitize email and notification templates. Use plain text alternatives. Generic lock-screen content such as “You have a CareCircle update”; personal details require authenticated app access.
- App Check complements auth but does **not replace** user authorization. Enforce only after proper production site key/domain setup; local debug token confined to emulator/dev.
- Rate-limit invitation creation/redemption, help requests, email-triggering endpoints and file/OCR uploads. Use durable counter or equivalent atomically checked backend limits; IP-only throttling insufficient.
- Cloud Logging: redact tokens, codes, PHI, full Firestore document snapshots and raw OCR. Use correlation/request IDs, event type, internal code, duration and allowed actor ID where justified.

## 7. Firestore rules principles

- `rules_version = '2'` where appropriate; explicit matches for authorized read paths; deny all unsupported writes and internal collection reads. Rules cannot rely on a client-provided role or intended circle ID alone.
- `invitations`, `notificationJobs`, protected audit append and key material are backend-only.
- Firestore Rules are **not filters**: a query must be shaped so all returned documents are authorized; write tests for list and collection-group queries.
- For selected member reads, restrict fields/collections by actual permission, not globally allow all `request.auth != null`.
- Test success and failure under anonymous, owner, caregiver-view, caregiver-edit, family, revoked, and unrelated-circle identities.

## 8. Notifications and idempotency

- Worker owns queue lease via transaction; before send, verifies current state, live membership, quiet hours/consent and object version. Retry-safe dedupe per logical `event+recipient+channel+version` key; external provider acknowledgement may be ambiguous.
- An assistance request is **not emergency dispatch**. Escalation cannot claim physical wellness from web presence; no coercive location tracking.
- Consent withdrawal removes recipients from future jobs; revalidate recipients when a previously claimed job is delivered.

## 9. Client data hygiene

- No sensitive data in localStorage by default; avoid persistent offline Firestore cache of medical content until separate privacy review. Clean up listeners and UI state on auth/circle change. Don't put medication details in URL query strings.
- Use HTTP security headers on Vercel as compatible with Firebase/FCM. Draft a Content Security Policy; test in Report-Only mode before enforcement. Do not blindly insert CSP settings that break auth or SDK calls.
- Prevent sensitive information in open graph tags, browser titles and analytics events. Keep analytics opt-in/aggregated where possible.

## 10. Audit, consent, retention

Backend creates append-only application audit events for ownership, invitations, role grants/revokes, medication edits/confirmations/corrections, reconciliation approvals, alert ack, task and export. **Application-level append-only is not an immutable storage guarantee**. Define bounded retention/deletion/export; document user consent and privacy policy applicable to deployment geography before real users. Never claim HIPAA or Indian DPDP compliance automatically.

## 11. Required negative-path test suite

- Anonymous all paths denied; unrelated circle read/list/write denied.
- Active view-only member cannot alter doses, medicine schedule or permissions.
- Expired/replayed/wrong email/parallel-redeemed invitation fails; attempt budget and rate limit cannot be reset by racing.
- Revoked caregiver cannot call functions, read new live data, receive jobs or use stale task tokens.
- Forged `ownerUid`, circleId, role, drug schedule version, actor ID rejected.
- Concurrent dose confirmation returns one event; inventory ledger decremented once; caregiver task accepted once or deterministic conflict.
- Tampered AES-GCM ciphertext/tag/AAD fails without plaintext leak; wrong key handled.
- Email provider failure, scheduler overlap, lease expiry, stale appointment reminders and FCM denial are safe and observable.
- Oversized and malformed data yields bounded, non-sensitive errors.

## 12. Practical review order

1. Access isolation; 2. Secrets and passcodes; 3. Backend mutation authorization; 4. data integrity and concurrency; 5. notification privacy/abuse; 6. encryption configuration; 7. audit/retention; 8. vulnerabilities and dependency audit. Fix Critical/High before aesthetic polish.
~~~~~

## FILE: `docs/VERCEL_DEPLOYMENT.md`

~~~~~text
# Vercel Frontend + Firebase Backend — Deployment Runbook

**Deployment model:** Vercel CDN for React/Vite static SPA; Firebase Auth/Firestore/Functions v2/Scheduler/FCM and Google Cloud Secret Manager for secure backend. Do not run scheduled clinical reminders in Vercel or put Admin SDK credentials in the web bundle.

## 1. Recommended monorepo setup

At project root use `package.json` npm workspaces:

```json
{
  "private": true,
  "workspaces": ["apps/*", "functions", "packages/*"],
  "scripts": {
    "build:web": "npm run build --workspace @carecircle/web"
  }
}
```

**This is a template excerpt, not an installable project.** Antigravity must generate actual package scripts and lockfile, align workspace package names, and verify `npm ci` + `npm run build:web` in a clean environment. The Vercel project root should be chosen consistently with its actual build/output paths.

Recommended Vercel setting: link the repository, set Root Directory to the **repository root** for this layout, override build command `npm run build:web`, output directory `apps/web/dist` relative to that root (verify exact Vercel UI), package manager npm with root lockfile. If Vercel auto-detection chooses a different root, adapt config and test rather than letting paths conflict.

### SPA routing (official Vercel pattern)

At the Vercel **project root**, use a validated `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Antigravity should generate it at the correct root and verify static asset loading and direct refresh on `/login`, `/dashboard`, `/medications`, `/appointments`, `/care-circle`, `/settings`, and permitted deep links. Do not copy a second conflicting config under `apps/web` and root.

## 2. Browser environment variables (PUBLIC)

Add to Vercel Production and scoped Preview environments as appropriate:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_STORAGE_BUCKET      # only if used
VITE_FIREBASE_FUNCTIONS_REGION
VITE_FIREBASE_VAPID_KEY          # only if FCM enabled
VITE_FIREBASE_APPCHECK_SITE_KEY  # if App Check enabled
```

These are public client configuration values; they must not contain service-account JSON, SMTP password, secret signing keys, Cloud KMS credentials or privileged API keys.

## 3. Backend secrets — GOOGLE, NOT VERCEL CLIENT

Set `INVITATION_HMAC_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_ADDRESS`, optional `KMS_KEY_RESOURCE` and provider tokens through Firebase Functions secret integration or Google Cloud Secret Manager. Limit IAM access; never put secrets in a `VITE_` variable or committed `.env`.

## 4. Recommended deployment order

1. Firebase project + Auth providers + stable authorized Vercel domain planned.
2. Firestore schema/indexes/security rules generated, tested and deployed.
3. Server secrets + mail verified sender configured.
4. Cloud Functions v2 callables and `onSchedule` backend deployed; verify API/regions and scheduler job.
5. App Check + FCM production setup; only enable App Check enforcement after tested domain setup.
6. Push the reviewed repo to GitHub; CI green.
7. Vercel import repository; select correct root/build/output and public env vars; deploy.
8. Register Vercel production/custom domain in Firebase Auth domains and relevant App Check allowlist.
9. Smoke test with **synthetic profiles**: sign-in, invite redeem, medication add, confirm dose, live caregiver view, reminder email, appointment edit, caregiver revocation, accessibility and SPA deep-link refresh.
10. Document production URL and backend project/region only after successfully verified.

## 5. Local development

- `npm ci`, start Firebase emulators, run `npm run dev` from the repo root; use fake project ID and emulator ports.
- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:rules`, `npm run test:integration`, `npm run test:e2e`, `npm run test:a11y`, `npm run build`, `npm run verify`; scripts must be created by implementation.
- Do not seed real user data or enable production database in local tests.

## 6. Production blockers and cost

- Cloud Functions/Scheduler require appropriate Firebase billing configuration (Blaze); Cloud Scheduler has separate billing considerations. Vercel frontend can be hosted independently, but notifications won't function without the Google backend.
- Set billing alerts and monitor function invocation, reads, emails, FCM and KMS costs; alerts do not hard-stop bills.
- Stable OAuth domains and SMTP verified sender may require manual admin steps. Keep environment-specific projects and allowlists separate. Random Vercel previews may not be allowed for Google OAuth/App Check.
- Some service APIs/regions may change; verify against official SDK/CLI at implementation time.

## 7. Failure checks

- 404 on refresh → Vite SPA rewrite/root mismatch.
- OAuth works on localhost but not prod → Firebase Auth authorized domains, popup-block or third-party storage issue.
- Firestore permission denied → recheck actual membership + rules/query shape, do not loosen globally.
- Function CORS/App Check failures → validate region, SDK/config, App Check and caller authentication.
- Push missing → HTTPS, VAPID, notification permission, service worker scope/token and browser support.
- Reminders missing → Scheduler deployed job, indexed due queue, timezone conversion, job lease, transport credentials, permission recheck and service logs.
- Email not received → verified sender, provider acceptance vs delivery, retries, spam and configured recipients.

## 8. Release evidence

Record a timestamped production smoke-test report and distinguish `implemented`, `emulator tested`, `deployment configured`, `deployed`, `end-to-end verified`. Do not mark production live if credentials or billing are unavailable.

References: https://vercel.com/docs/frameworks/frontend/vite , https://vercel.com/docs/monorepos , https://firebase.google.com/docs/functions/schedule-functions , https://firebase.google.com/docs/auth/web/google-signin .
~~~~~

## FILE: `templates/.env.example`

~~~~~text
# TEMPLATE — public browser Firebase config; example values only, DO NOT paste secrets.
# Copy relevant lines to apps/web/.env.local after generating the application.
VITE_FIREBASE_API_KEY=your-public-firebase-web-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-firebase-web-app-id
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_FUNCTIONS_REGION=your-functions-region
# Optional, only when implemented:
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_VAPID_KEY=
VITE_FIREBASE_APPCHECK_SITE_KEY=

# SERVER-ONLY SECRET NAMES (do NOT set as VITE_* or commit real values):
# INVITATION_HMAC_SECRET (secret manager)
# SMTP_HOST / SMTP_PORT / SMTP_USERNAME / SMTP_PASSWORD / SMTP_FROM_ADDRESS
# KMS_KEY_RESOURCE (if Cloud KMS implemented)
~~~~~

## FILE: `ui and ux.md`

~~~~~text
# CareCircle UI & UX — Premium Healthcare Design System

**Product:** CareCircle 3.0 — Connected Care. Confident Living.  
**Design reference:** User-provided screenshots in `references/` and https://dribbble.com/shots/27480941-Healthcare-Web-Patient-Portal .  
**Design goal:** A restrained, beautifully composed patient portal with sophisticated frosted surfaces **and excellent usability for older adults**. This is an adaptation of layout, typography and atmosphere, not a clone of MediApp's brand, assets or component copy.

## 1. What the reference actually communicates

- Large **Stack Sans Headline** display type with simple modern shapes; companion **Stack Sans Text** for functional UI.
- Dark almost-black text, warm off-white, pale powder blue/green, striking lemon accent, matte white cards.
- **Soft glassmorphism** in the application background/shell: blue-green mist, translucent navigation, mild depth; primary chart/list cards stay nearly opaque.
- Desktop three-zone dashboard: **left navigation (~240–260px), primary content (flexible), right utility column (~300–340px)**; 16–24px gaps, softly rounded cards, short labels.
- Capsule tabs (active almost black), low-contrast chart grid, pastel appointment/medicine entries, a compact clean calendar.
- Content grouped by user intent: title, most important information, utility panels—not an AI-themed page of floating decorative charts.
- In the reference's sidebar there is a subscription advert. **Replace it** with a functional care-support card, or omit it. Do not copy logo, medical photographs, data, branding, doctor names or image artwork.

### Reference assets

- `references/branding-type-palette.png`: type and palette evidence.
- `references/dashboard-full.png`: desktop layout, card proportions and sidebar.
- `references/dashboard-closeup.png`: headings, selected pills, strokes and graph style.
- `references/official-problem-statement.jpeg`: feature alignment; do not style-copy the challenge announcement.

## 2. Original CareCircle design DNA

**Design words:** calming, precise, human, accessible, premium, non-institutional, self-directed.

**Visual tokens** (create CSS variables, Tailwind theme and Storybook/sample page if useful):

| Semantic token | Hex or pattern | Use |
|---|---|---|
| `--cc-ink` | `#11141A` | title/body/active buttons |
| `--cc-ivory` | `#F9F5F1` | warm overall background |
| `--cc-lemon` | `#FFF25C` | focus/selected highlight or small support accent **only** |
| `--cc-powder` | `#B2D8DD` | ambient blue-green backdrop (adaptation) |
| `--cc-mist` | `#EAF2ED` | calendar/neutral panels |
| `--cc-ice` | `#EAF2FF` | appointments |
| `--cc-mint` | `#EDF5E8` | care success/medication context, never status by color alone |
| `--cc-surface` | `#FFFFFF` | all key action and read-heavy cards |
| `--cc-muted-text` | dark gray meeting contrast, e.g. `#526166` on white | readable captions |
| `--cc-border` | `rgba(17,20,26,.08)` | unobtrusive separators |
| `--cc-focus` | accessible visible outline, test contrast | keyboard focus |

The screenshot shows an apparent powder-blue swatch with an inconsistent printed code. Treat the palette tokens here as **deliberate CareCircle adaptations** rather than claiming the reference contains exact sampled values.

### Typography and localization

- Prefer licensed **Stack Sans Headline** for page titles/metric numbers, **Stack Sans Text** for controls and descriptions, loaded via Fontsource/official web CSS after checking available package names. Use stable font fallbacks.
- Tamil UI requires a suitable Tamil-script fallback (e.g. Noto Sans Tamil), and Hindi a Devanagari fallback (e.g. Noto Sans Devanagari); verify with actual glyph rendering and realistic translated copy. Do not assume Latin Stack Sans supports these scripts.
- Desktop h1: 32–36px/1.12, 600; h2 card 22–24px/1.2, 600; smaller headings 18–20px, 600; normal body ≥16px/1.5; elderly view 18–20px; supporting text ≥14px with proven contrast; buttons 16–18px semibold.
- Avoid ALL CAPS body text and data-dense abbreviations. Use plain labels: **Taken**, **Skipped**, **Not confirmed**, **Needs help**, **Awaiting caregiver**.
- Numeric times show timezone context when needed; respect user locale for date/time and screen reader announcements.

### Composition and spacing

- Outer desktop content max width can be 1536–1680px; adapt to viewport; 24–32px outer padding.
- Sidebar 240–260px fixed within the app grid, right utility 300–340px at wide widths, content center minmax(0,1fr).
- Gaps 16–24px (base 4/8px tokens); radius content cards 20–24px; compact controls 12–14px; selected pills 999px.
- Subtle shadows: `0 8px 28px rgba(17,20,26,.05)` only on important raised cards; do not stack multiple shadow layers.
- Borders at 1px and low contrast; increase contrast for focus and forms.

### Subtle glassmorphism—do not obscure content

Use a softly colored ambient page background, then a frosted glass **outer shell, sidebar, and optionally header**. Example CSS guidance (adapt to real browser support):

```css
.cc-glass-shell {
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(16px) saturate(130%);
  -webkit-backdrop-filter: blur(16px) saturate(130%);
}
.cc-content-card {
  background: #fff;
  color: #11141a;
  border: 1px solid rgba(17, 20, 26, 0.08);
  border-radius: 22px;
  box-shadow: 0 8px 28px rgba(17,20,26,.05);
}
@supports not (backdrop-filter: blur(16px)) {
  .cc-glass-shell { background: #f6f9f8; }
}
@media (prefers-reduced-transparency: reduce) {
  .cc-glass-shell { background: #f6f9f8; backdrop-filter: none; }
}
```

Do not blur readable medication and form content. Limit expensive effects on mobile/low-power devices. Support high-contrast mode with opaque components.

## 3. Information architecture by user, not by the database

### Elder main nav: five items maximum

`Today` · `My Medicines` · `Appointments` · `My Care Circle` · `More`

Keep **Need Help** always discoverable as a prominent contextual action, not buried in More. More houses reports, access settings, accessibility and activity history.

### Caregiver nav

`Overview` · `Care Tasks` · `Medications` · `Appointments` · `Care Circle`.

Alerts, refill tasks, activity, insights, discharge reconciliation and security settings are contextual subviews, not more top-level sidebar items.

### Family nav

`Overview` · `Updates` · `Responsibilities` · `Appointments` · `Family`.

Show only granted data. Never show an edit button that cannot be used; accessible disabled state plus explanation if needed.

## 4. Dashboard specifications

### A. CareDay — elder dashboard (priority: clarity)

1. Header: real display name, greeting, local date, contrast/text-scale controls and notifications.
2. **Dominant next-action card**: next medication, scheduled time, clinician-issued instruction, button **Mark as Taken**, secondary **Skip**, a clear status and visible error/sync indicators. Need Help easily accessible.
3. **Today's Care Timeline**: event-by-event medication and appointments; visually restrained thin timeline and truthful states; current item highlighted.
4. **Upcoming appointments**: pastel blue/green clinician cards with date, time and location.
5. Right utility cards at wide widths: month calendar; "My Medicines" pastel rows with names, daily times and low-stock warnings.
6. Family connection snippet: named authorized members and any pending responses, never false online/safety assertions.
7. Avoid large chart-led header or graphs on main elder dashboard; keep trends in Insights.

### B. CarePulse — caregiver dashboard (priority: action)

1. Header with selected *authorized* care circle, timezone and clear current state.
2. Attention queue: **Unconfirmed doses**, **Help requests**, **Low stock**, **Overdue assigned tasks**, **Upcoming appointments**—real data ordered by urgency/time.
3. One large white card for actionable queue; each item includes an action and status, not just a count.
4. Compact 7-day adherence trend and an activity timeline using real data, with explanatory metric definitions.
5. Real acknowledgement and resolution action; optimistic UI only when safe, roll back on failure; no fake progress.
6. Allow care-circle switcher with scoped subscription cleanup and no data flash from previous circle.

### C. Family Overview (priority: visibility)

Show a concise care summary, changes since last visit, shared tasks, appointments and alerts. Respect view-only vs editor grants. Do not show clinical details not explicitly shared.

### D. My Medicines

- Clear active/paused medication group with dosage information as *prescribed data* only.
- Status chips with text and icons (not color alone), schedule and next dose.
- Contextual actions: manage schedule, confirm dose, follow-up reason, stock/refill, prescription history.
- **SafeDose Shield**: if already confirmed, modal explains time/actor; no second creation; authorized correction separately logged.
- **WhyMissed?**: large selectable reason cards and safe follow-up; do not advise taking a late dose or changing dose.
- **Refill Guardian**: estimated inventory timeline and assigned refill task, explicit estimation assumptions.
- **DischargeSync**: compare old/new schedule in columns desktop, stacked on mobile; Added/Changed/Stopped/Unchanged textual chips, human confirmation before activation.

### E. CareShift and CareCircle View

- CareShift: simple assignment list with owner, due date, status, acknowledgement, reassignment and handoff; no heavy Kanban unless it truly improves task completion.
- CareCircle View: an elder-centered family/caregiver relationship layout with permission cards. Provide an **equivalent accessible list** rather than requiring graph navigation.
- Remove/invite/revoke access only after reauth or step-up checks where appropriate and with confirmation. Do not expose invitation codes after creation except safe owner-needed flows.

### F. Calendar and Appointments

- Use modern minimal calendar with keyboard/screen-reader date navigation and meaningful event markers. Never make appointments depend solely on color dots.
- Appointment cards visually match reference: pastel surface, concise clinician/visit label, time, status and contextual action.
- Support cancel/reschedule/notes/companion questions; appointment cancellation invalidates old reminders.

### G. Secondary features and locations

- **CareVoice**: optional user-triggered spoken read-aloud; visible same information; language preference persisted, text alternatives always available.
- **CarePassport**: authenticated, consent-controlled PDF/print summary that displays updated timestamp; no anonymous share link by default.
- **Appointment Companion**: questions-to-ask and follow-up checklist in appointment detail.
- **Wellbeing Check-In**: simple two-state check-in; no physical safety guarantee.
- **Care Handoff Report**: read-only generated summary with task acceptance/ownership, fresh timestamp and bounded data range.
- P2 OCR, symptom journal, offline schedule and clinician-review flags should not clutter main nav.

## 5. Components to create and reuse

`AppShell`, `SidebarNav`, `Topbar`, `PageHeader`, `GlassShell`, `SurfaceCard`, `MetricCard`, `MedicationCard`, `AppointmentCard`, `CalendarWidget`, `CareTimeline`, `StatusBadge`, `CareTaskRow`, `AlertRow`, `MemberCard`, `PermissionPanel`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, `AccessibleDialog`, `ReasonPicker`, `ContrastToggle`, `TextSizeControl`, `LanguageSwitcher`.

Use shadcn/ui primitives and Radix-derived accessibility when relevant. Build custom behavior only when necessary. Native `<button>` for actions, visible `<label>` for forms and `aria-live` for statuses.

## 6. Interaction principles

- One primary action per card or screen; secondary actions are quiet but discoverable.
- Each backend mutation has `idle/loading/success/error` state, explicit retries and focus management.
- Distinguish **draft**, **pending sync**, **server-confirmed**, **failed** and **stale/offline**. Do not immediately claim a dose was recorded before server confirmation.
- Help request visible for elders; clearly explain the service does not call emergency responders.
- Error text plain and specific; never expose internal stack traces or private records.
- Motion 140–220ms for microinteractions only; no parallax, spinning cards, neon/glow, glass over glass, floating pills, or fake live activity.
- The reference sidebar promo card should be a supportive action CTA such as “Care feels better together — Contact caregiver” and **not an advertisement**.

## 7. Accessibility acceptance (see `docs/ACCESSIBILITY.md`)

- WCAG 2.2 AA target; normal text minimum contrast 4.5:1, large text 3:1, distinguishable UI boundaries and visible keyboard focus.
- Elder primary touch targets ideally 48x48px; support 200% zoom without losing tasks and 320 CSS px reflow wherever required.
- No small gray status labels as the only clue. Provide text + icon.
- Voice, FCM push, animation and device presence are **optional**, never needed to operate essential functions.
- Test on keyboard, screen reader, mobile, high contrast, reduced motion, enlarged fonts, Tamil and Hindi labels.
- Sensitive personal health info should not be read aloud or push-displayed unexpectedly.

## 8. Visual QA checklist

Run the actual app and capture screenshots at **1440, 1280, 1024, 768, 390 and 360px**. Evaluate: type hierarchy, alignment, rhythm, legibility on glass, calendar responsiveness, chart axes, pill tabs, accessible buttons, state labels, help CTA, no overflow, no disabled/decorative controls mistaken as functional. Check zoom and language expansion. Compare visual *principles* with the supplied screenshots, not pixel-perfect copying. Capture at least CareDay, CarePulse, medication details, DischargeSync, CareShift, invitations, and mobile nav. Fix visual defects and rerun a11y checks.

## 9. Explicit design anti-patterns

No generic AI-slop design; no futuristic medical holograms, giant decorative hero images, irrelevant health graphs, stock doctor faces copied from reference, fake chat UI, dark-matte graphs everywhere, giant yellow banners, blank cards pretending to be functionality, or unnecessary navigation depth. Under no circumstance let heavy glass effects impair elder readability or interaction latency.

## 10. Deliverable gate

A reusable tokenized UI, role-specific navigation, all functional pages restyled, strict accessibility, responsive screenshots, verified backend interactions, and visual QA findings summarized. It must look like **CareCircle**, not renamed MediApp Pro.
~~~~~
