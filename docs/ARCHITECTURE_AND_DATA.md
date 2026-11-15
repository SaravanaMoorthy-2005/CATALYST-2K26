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