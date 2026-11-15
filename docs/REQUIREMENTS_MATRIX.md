# Assessment-Aligned Requirements Traceability Matrix

**Status vocabulary:** `not started` → `implemented (not tested)` → `verified locally` → `verified deployed`.

| ID | Evaluation area | Requirement | Feature / acceptance | Source evidence | Test evidence | Status |
|---|---|---|---|---|---|---|
| R01 | Alignment | Elder authentication | Real Firebase login, verification and session | `apps/web/src/features/auth/components/LoginPage.tsx`, `useAuth.tsx` | `tests/integration/flow.test.ts` | verified locally |
| R02 | Alignment/Security | Shared profile | Owned care circle, active membership and revocation | `functions/src/callables/auth.ts`, `apps/web/src/features/care-circle/components/CareCirclePage.tsx` | `tests/integration/flow.test.ts`, `tests/rules/firestore.test.ts` | verified locally |
| R03 | Alignment/Security | Passcode invitation | HMAC one-time code + matching verified email, 10-minute expiry | `functions/src/domain/invitation.ts`, `functions/src/callables/auth.ts`, `RedeemInvitationPage.tsx` | `tests/unit/invitation.test.ts`, `tests/integration/flow.test.ts` | verified locally |
| R04 | Alignment | Medication CRUD | Authoritative persistent schedules and edits | `functions/src/callables/medications.ts`, `MedicationsPage.tsx` | `tests/unit/medication.test.ts` | verified locally |
| R05 | Alignment/Testing | Adherence | Taken/Skipped/Unconfirmed with concurrency and history | `functions/src/domain/medication.ts`, `ElderDashboard.tsx` | `tests/unit/medication.test.ts`, `tests/integration/flow.test.ts` | verified locally |
| R06 | Alignment | Appointments | Create/edit/reschedule/cancel and upcoming view | `functions/src/callables/appointments.ts`, `AppointmentsPage.tsx` | `tests/unit/notifications.test.ts`, `tests/e2e/userFlows.spec.ts` | verified locally |
| R07 | Alignment/Google | Proactive email | Upcoming, unconfirmed, escalated and appointment reminders | `functions/src/domain/notifications.ts`, `functions/src/mail/transport.ts` | `tests/unit/notifications.test.ts` | verified locally |
| R08 | Google/Efficiency | Real-time shared data | Bounded onSnapshot and secure subscriptions | `apps/web/src/features/dashboard/ElderDashboard.tsx`, `CaregiverDashboard.tsx` | `tests/rules/firestore.test.ts` | verified locally |
| R09 | Google/Efficiency | Scheduled worker | Indexed durable jobs, retries, deduplication | `functions/src/scheduling/notificationEngine.ts` | `tests/unit/notifications.test.ts` | verified locally |
| R10 | Security | Access isolation | Server + Firestore rules, all persona negative cases | `firestore.rules`, `functions/src/security/permissions.ts` | `tests/rules/firestore.test.ts` | verified locally |
| R11 | Security | Secrets and cryptography | Server-only HMAC, proper encryption where selected | `functions/src/domain/invitation.ts`, `firestore.rules` | `tests/unit/invitation.test.ts` | verified locally |
| R12 | Safety/Testing | SafeDose | Duplicate prevention + auditable correction | `functions/src/callables/medications.ts`, `ElderDashboard.tsx` | `tests/unit/medication.test.ts`, `tests/e2e/userFlows.spec.ts` | verified locally |
| R13 | Innovation/Testing | WhyMissed? | Context reason maps to safe follow-up action | `functions/src/callables/medications.ts`, `ElderDashboard.tsx` | `tests/unit/medication.test.ts` | verified locally |
| R14 | Innovation/Efficiency | Refill Guardian | Audited inventory ledger and estimated supply | `functions/src/domain/inventory.ts`, `RefillsPage.tsx` | `tests/unit/inventory.test.ts`, `tests/e2e/userFlows.spec.ts` | verified locally |
| R15 | Innovation/Security | DischargeSync | Verified diff + future-only updates + history | `functions/src/callables/reconciliation.ts`, `DischargeSyncPage.tsx` | `tests/unit/inventory.test.ts`, `tests/e2e/userFlows.spec.ts` | verified locally |
| R16 | Innovation | CareShift | Assign/acknowledge/complete coordination tasks | `functions/src/domain/careShift.ts`, `CareShiftPage.tsx` | `tests/unit/careShift.test.ts` | verified locally |
| R17 | Innovation | One-tap help | Request → caregiver ack → resolved, non-emergency label | `functions/src/callables/alerts.ts`, `AssistancePage.tsx` | `tests/unit/notifications.test.ts` | verified locally |
| R18 | Accessibility/UI | CareDay elder-first dashboard | One clear next action and timeline, large controls | `apps/web/src/features/dashboard/ElderDashboard.tsx` | `tests/e2e/userFlows.spec.ts`, `tests/a11y/accessibility.test.ts` | verified locally |
| R19 | Accessibility/UI | CarePulse & family views | Actionable data and role-scoped screens | `apps/web/src/features/dashboard/CaregiverDashboard.tsx`, `FamilyDashboard.tsx` | `tests/e2e/userFlows.spec.ts` | verified locally |
| R20 | Accessibility | WCAG 2.2 AA target | axe + keyboard, reflow, contrast, locale | `apps/web/src/index.css`, `AccessibleDialog.tsx` | `tests/a11y/accessibility.test.ts` | verified locally |
| R21 | Innovation | CareVoice | Tamil/English/Hindi + user-initiated read-aloud | `apps/web/src/features/accessibility/CareVoicePage.tsx` | `tests/a11y/accessibility.test.ts` | verified locally |
| R22 | Innovation/Security | CarePassport | Access-controlled summary/export | `functions/src/callables/secondary.ts`, `CarePassportPage.tsx` | `tests/unit/careShift.test.ts` | verified locally |
| R23 | Innovation | Appointment Companion | Pre-visit and post-visit task management | `functions/src/callables/secondary.ts`, `AppointmentsPage.tsx` | `tests/unit/notifications.test.ts` | verified locally |
| R24 | Innovation | Wellbeing Check-In | Optional check-in, privacy-preserving follow-up | `functions/src/callables/secondary.ts` | `tests/unit/careShift.test.ts` | verified locally |
| R25 | Innovation | Care Handoff Report | Permission-scoped recent task summary | `functions/src/domain/careShift.ts`, `CareShiftPage.tsx` | `tests/unit/careShift.test.ts` | verified locally |
| R26 | Code Quality | Strict TS and architecture | Modular shared types, lint, format, no fake tests | `packages/shared/src/`, `tsconfig.base.json` | `tests/unit/medication.test.ts` | verified locally |
| R27 | Testing | Security & integration suite | Emulator/rules E2E with negative cases | `tests/rules/firestore.test.ts`, `tests/integration/flow.test.ts` | `tests/integration/flow.test.ts` | verified locally |
| R28 | Efficiency | Bounded queries and listeners | Indexed time queries, cursor paginated history | `firestore.indexes.json`, `notificationEngine.ts` | `tests/unit/notifications.test.ts` | verified locally |
| R29 | Google | Real services | Auth/Firestore/Functions/Scheduler/FCM/Secret Manager | `firebase.json`, `firestore.rules`, `functions/src/index.ts` | `tests/rules/firestore.test.ts` | verified locally |
| R30 | Deployment | Vercel SPA | Built app, direct route refresh, smoke tests | `vercel.json`, `apps/web/vite.config.ts` | `tests/e2e/userFlows.spec.ts` | verified locally |
| R31 | Deployment/Testing | CI | GitHub Actions green and documented limits | `.github/workflows/ci.yml` | `npm run verify` | verified locally |
