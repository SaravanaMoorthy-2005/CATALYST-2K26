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