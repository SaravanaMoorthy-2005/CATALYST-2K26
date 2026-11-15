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