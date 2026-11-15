# Genuine Google Services Integration Plan

The project is judged partly on **Google Services Usage**. Integrate useful services in real workflows; never add unused SDK imports merely for evaluator optics.

| Service | Actual purpose | Local/production evidence |
|---|---|---|
| Firebase Authentication | Email/password, Google sign-in, verified identity, Firebase sessions | Auth emulator tests + login flow, real app config |
| Cloud Firestore | Care circles, schedules, dose state, roles, appointments, tasks, alerts and live subscriptions | Firestore emulator integration + Rules tests + scoped onSnapshot demo |
| Cloud Functions v2 | Trusted callables for membership, invite, medication and business mutations, audit | Local Functions emulator + request validation/authorization tests |
| Cloud Scheduler | Trigger bounded reminder/appointment jobs via `onSchedule` | Scheduler handler unit/integration tests; deployed job only after billing/configuration |
| Firebase Cloud Messaging | Optional web push with consent, service worker, token handling | Permission-denied fallback + supported browser test; not substitute for email |
| Firebase App Check | App attestation complementary to Firebase Auth | Production provider and domain config, emulator/debug isolation |
| Secret Manager | HMAC, SMTP and optional encryption credentials; Functions secrets | deployment config/CI no leaked secrets; only verified when provisioned |
| Google Cloud KMS | Optional per-record encryption key wrapping for sensitive fields | integration tests, IAM, key rotation evidence only if actually configured |
| Firebase Emulator Suite | Local repeatable auth, Firestore, Functions and rules development | test scripts/CI with fake project ID and fixture cleanup |
| Optional Google Calendar API | Explicit user-authorized appointment export | separate OAuth consent & token security; not required for P0 |

## Implementation notes

- Register a Firebase Web app and use the **public** Firebase client config in Vite. Public client config does not secure Firestore; Auth, App Check, Security Rules and server checks do.
- Use Firebase Auth verified email for passcode redemption; Google popup sign-in is a practical default on a separate Vercel domain. Configure authorized domains. If redirect is desired, follow Firebase redirect storage best practices rather than assuming it works cross-site.
- For Firestore, design permission-aware list queries and indexes up front. Client SDK reads must pass security rules; Admin SDK functions explicitly verify authorization.
- Cloud Functions v2 `onCall` for authenticated browser-to-server operations; validate input; Secret Manager access server-side; App Check where available/configured.
- Cloud Scheduler via `firebase-functions/v2/scheduler` and `onSchedule`; one recurring worker with robust job queue, transaction claims, retries and recipient rechecks. Scheduler functions may overlap and retry; design accordingly.
- FCM browser push requires service worker, VAPID, permission and HTTPS; fall back gracefully. Use generic lock-screen text.
- Don't suggest Gemini for medical triage, drug interactions, automated prescriptions or unreviewed clinical recommendations. Optional generative text summaries require privacy/consent and manual review.
- Google services may require billing-enabled project, API permissions, domain ownership and SMTP account; document actual prerequisites rather than promise everything is cost-free.

## Production setup checklist

- [ ] Firebase project created; correct region selected; separate staging/prod projects when feasible.
- [ ] Auth email/password + Google provider enabled; authorized stable Vercel/custom domains.
- [ ] Firestore in production mode with generated restricted rules and composite indexes; no broad `allow read, write: if true`.
- [ ] Cloud Functions v2 deployed after real secrets configured; least-privilege service accounts/IAM.
- [ ] Scheduler API/job deployed and backend logs verified against a synthetic near-due test event.
- [ ] Email transport configured with verified sender; delivery success differentiated from provider acceptance.
- [ ] App Check production keys and debug bypass restricted to development.
- [ ] FCM web permission opt-in and service worker tested; fallback works without permission.
- [ ] Cloud KMS only if configured; encryption data/key schema and tamper tests present.
- [ ] All source code imports used for real functions, not just symbolic Google usage.

## Source references

- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/firestore/security/get-started
- https://firebase.google.com/docs/firestore/security/test-rules-emulator
- https://firebase.google.com/docs/functions/schedule-functions
- https://firebase.google.com/docs/app-check
- https://firebase.google.com/docs/cloud-messaging/js/client