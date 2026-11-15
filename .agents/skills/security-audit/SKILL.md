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