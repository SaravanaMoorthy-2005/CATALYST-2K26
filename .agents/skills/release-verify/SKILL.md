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