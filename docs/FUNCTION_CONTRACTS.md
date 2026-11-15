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