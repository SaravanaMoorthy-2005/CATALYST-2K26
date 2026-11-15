---
trigger: model_decision
description: "Apply when integrating Google Firebase/Cloud services, notification scheduling, deployment, Vercel, environment variables or production operations."
---
# Google Cloud & Vercel Rule

Read `docs/GOOGLE_SERVICES.md`, `docs/PERFORMANCE.md`, and `docs/VERCEL_DEPLOYMENT.md`. Vercel hosts static Vite SPA; Firebase/Google Cloud handles identity, data, server mutations and scheduled jobs. Use scoped Firestore queries, indexed bounded notification-job worker on Cloud Scheduler, robust retries and per-recipient permission/consent checks. FCM opt-in with generic previews and fallback. Server secrets in Secret Manager only; `VITE_` public. Test `/dashboard` deep link refresh; verify actual build root/output. Never claim external deploy/email success without logs and smoke test or spend without owner approval.