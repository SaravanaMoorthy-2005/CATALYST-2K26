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