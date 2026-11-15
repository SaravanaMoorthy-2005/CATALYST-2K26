---
trigger: model_decision
description: "Apply when implementing Firebase Auth, Firestore, Cloud Functions, invitations, shared care permissions, privacy, logging or encryption."
---
# Backend Security Rule

Read `docs/SECURITY_AND_PRIVACY.md` and `docs/ARCHITECTURE_AND_DATA.md`. Authenticate and authorize each sensitive request with active membership, action permission and scoped resource ownership. Server validates input using shared Zod; Firestore Rules default deny and protect list queries as well as reads. Admin SDK bypasses Rules. Protect passcodes with server HMAC-SHA-256, cryptographic randomness, email binding, 10-minute expiration, attempt/rate limits and atomic consume. No tokens, codes, PHI or Admin secrets in client, logs or VITE_* vars. If AES-256-GCM + KMS is added, document key/nonce/rotation/associated-data and never claim E2EE. Test cross-care-circle and revoked-user negatives.