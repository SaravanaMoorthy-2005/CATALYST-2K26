# Vercel Frontend + Firebase Backend — Deployment Runbook

**Deployment model:** Vercel CDN for React/Vite static SPA; Firebase Auth/Firestore/Functions v2/Scheduler/FCM and Google Cloud Secret Manager for secure backend. Do not run scheduled clinical reminders in Vercel or put Admin SDK credentials in the web bundle.

## 1. Recommended monorepo setup

At project root use `package.json` npm workspaces:

```json
{
  "private": true,
  "workspaces": ["apps/*", "functions", "packages/*"],
  "scripts": {
    "build:web": "npm run build --workspace @carecircle/web"
  }
}
```

**This is a template excerpt, not an installable project.** Antigravity must generate actual package scripts and lockfile, align workspace package names, and verify `npm ci` + `npm run build:web` in a clean environment. The Vercel project root should be chosen consistently with its actual build/output paths.

Recommended Vercel setting: link the repository, set Root Directory to the **repository root** for this layout, override build command `npm run build:web`, output directory `apps/web/dist` relative to that root (verify exact Vercel UI), package manager npm with root lockfile. If Vercel auto-detection chooses a different root, adapt config and test rather than letting paths conflict.

### SPA routing (official Vercel pattern)

At the Vercel **project root**, use a validated `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Antigravity should generate it at the correct root and verify static asset loading and direct refresh on `/login`, `/dashboard`, `/medications`, `/appointments`, `/care-circle`, `/settings`, and permitted deep links. Do not copy a second conflicting config under `apps/web` and root.

## 2. Browser environment variables (PUBLIC)

Add to Vercel Production and scoped Preview environments as appropriate:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_STORAGE_BUCKET      # only if used
VITE_FIREBASE_FUNCTIONS_REGION
VITE_FIREBASE_VAPID_KEY          # only if FCM enabled
VITE_FIREBASE_APPCHECK_SITE_KEY  # if App Check enabled
```

These are public client configuration values; they must not contain service-account JSON, SMTP password, secret signing keys, Cloud KMS credentials or privileged API keys.

## 3. Backend secrets — GOOGLE, NOT VERCEL CLIENT

Set `INVITATION_HMAC_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_ADDRESS`, optional `KMS_KEY_RESOURCE` and provider tokens through Firebase Functions secret integration or Google Cloud Secret Manager. Limit IAM access; never put secrets in a `VITE_` variable or committed `.env`.

## 4. Recommended deployment order

1. Firebase project + Auth providers + stable authorized Vercel domain planned.
2. Firestore schema/indexes/security rules generated, tested and deployed.
3. Server secrets + mail verified sender configured.
4. Cloud Functions v2 callables and `onSchedule` backend deployed; verify API/regions and scheduler job.
5. App Check + FCM production setup; only enable App Check enforcement after tested domain setup.
6. Push the reviewed repo to GitHub; CI green.
7. Vercel import repository; select correct root/build/output and public env vars; deploy.
8. Register Vercel production/custom domain in Firebase Auth domains and relevant App Check allowlist.
9. Smoke test with **synthetic profiles**: sign-in, invite redeem, medication add, confirm dose, live caregiver view, reminder email, appointment edit, caregiver revocation, accessibility and SPA deep-link refresh.
10. Document production URL and backend project/region only after successfully verified.

## 5. Local development

- `npm ci`, start Firebase emulators, run `npm run dev` from the repo root; use fake project ID and emulator ports.
- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:rules`, `npm run test:integration`, `npm run test:e2e`, `npm run test:a11y`, `npm run build`, `npm run verify`; scripts must be created by implementation.
- Do not seed real user data or enable production database in local tests.

## 6. Production blockers and cost

- Cloud Functions/Scheduler require appropriate Firebase billing configuration (Blaze); Cloud Scheduler has separate billing considerations. Vercel frontend can be hosted independently, but notifications won't function without the Google backend.
- Set billing alerts and monitor function invocation, reads, emails, FCM and KMS costs; alerts do not hard-stop bills.
- Stable OAuth domains and SMTP verified sender may require manual admin steps. Keep environment-specific projects and allowlists separate. Random Vercel previews may not be allowed for Google OAuth/App Check.
- Some service APIs/regions may change; verify against official SDK/CLI at implementation time.

## 7. Failure checks

- 404 on refresh → Vite SPA rewrite/root mismatch.
- OAuth works on localhost but not prod → Firebase Auth authorized domains, popup-block or third-party storage issue.
- Firestore permission denied → recheck actual membership + rules/query shape, do not loosen globally.
- Function CORS/App Check failures → validate region, SDK/config, App Check and caller authentication.
- Push missing → HTTPS, VAPID, notification permission, service worker scope/token and browser support.
- Reminders missing → Scheduler deployed job, indexed due queue, timezone conversion, job lease, transport credentials, permission recheck and service logs.
- Email not received → verified sender, provider acceptance vs delivery, retries, spam and configured recipients.

## 8. Release evidence

Record a timestamped production smoke-test report and distinguish `implemented`, `emulator tested`, `deployment configured`, `deployed`, `end-to-end verified`. Do not mark production live if credentials or billing are unavailable.

References: https://vercel.com/docs/frameworks/frontend/vite , https://vercel.com/docs/monorepos , https://firebase.google.com/docs/functions/schedule-functions , https://firebase.google.com/docs/auth/web/google-signin .