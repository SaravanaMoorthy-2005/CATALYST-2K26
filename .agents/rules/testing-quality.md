---
trigger: model_decision
description: "Apply when creating features, modifying TypeScript, tests, state machines, CI scripts, Firebase rules or performing quality review."
---
# Engineering Quality Rule

Read `docs/QUALITY_AND_TESTING.md`. Strict TS, typed Zod contracts, pure domain logic, modular UI/domain/repos, real scripts, no unused imports or no-op tests. Test both permitted and forbidden behavior. Critical cases: duplicate dose/stock decrement, concurrent invite redemption, revoked user, caregiver permission, overlapping scheduler, appointment cancellation and DST. Run actual typecheck, lint, unit, emulator/rules, Playwright, axe and build as appropriate and report exact outcome. Never mark a feature verified without test evidence; update `docs/REQUIREMENTS_MATRIX.md` only when confirmed.