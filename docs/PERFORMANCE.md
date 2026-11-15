# Efficiency & Performance Engineering Plan

## Core constraints

- Real-time Firestore listeners only for **active authorized care circle** and short bounded windows; unsubscribe on route/circle/logout/revoke. No worldwide or all-history onSnapshot subscriptions.
- Query by `careCircleId`, due status and time range; composite index in `firestore.indexes.json`; Firestore Rules must support the query shape. Paginate audit events, medication history, long appointment history and handoff reports.
- Use one or a small fixed number of scheduled workers, not one scheduled job per dose. Queue dueAt index, limited batch, lease claim, stable deduplication IDs, backoff and dead-letter status.
- Avoid listeners for every tiny card; share normalized query hooks, invalidate on mutation; avoid N+1 per-person queries across caregiver portfolios.
- Treat mobile rendering as primary: code split heavy charts/secondary reports; load only current timeline/card data. Prefer lightweight accessible chart package; charts only for real metrics.
- Do not apply blur on every card or animate dozens of elements; prefer stable CSS backdrop and solid white inner panels. Respect low-power and reduced-motion modes.
- `web-vitals` / Lighthouse measurements are informative; test actual pages, not an empty shell.

## Targets to verify, not guarantees

- No unauthenticated page requires Cloud Functions cold start just to show landing/login.
- Medication confirmation latency appears as pending before server success; UI remains responsive; no duplicate click on slow network.
- A scheduled worker does bounded reads and has documented concurrency and retry limits.
- Main elder dashboard avoids multiple high-cardinality live queries; historical views paginate.
- No memory leak across five consecutive care-circle switches or route navigation cycles.
- Background tabs and offline reconnect reconcile state without fabricating confirmations.

## Observability

Measure Cloud Function duration/errors (without PHI), queue backlog and oldest pending time, email accepted/failed/retry counts, Firestore read/write growth and billable function execution. Define basic alerts for sustained backlog, non-delivery, auth errors, and unusual passcode attempts. Add privacy-safe logging only.

## Cost safety

Budget controls on billing-enabled Firebase project. Monitor Firestore reads from real-time listeners, Cloud Scheduler frequency, Cloud Functions invocations, emails sent and KMS calls. Use emulator for rapid dev cycles. Document that billing alerts do not automatically hard-stop spend.