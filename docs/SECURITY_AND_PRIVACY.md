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