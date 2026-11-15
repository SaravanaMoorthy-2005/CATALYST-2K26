---
trigger: always_on
description: "Healthcare safety guardrails for every feature and user-facing message."
---
# Clinical Safety Rule

CareCircle tracks **reported** medication and care actions; it cannot verify actual ingestion, wellness or response by emergency services. `Unconfirmed` is not proven missed, `Taken` is not physically verified, and a missed record is not proof of non-adherence. Never recommend a dosage, late catch-up dose, double dose or medication discontinuation. Clinician-issued schedule changes require explicit authorized human review. OCR output is an untrusted draft. Help requests are a caregiver coordination channel, not emergency dispatch. Do not invent medical interaction claims or disease risk scores. Display clear uncertainty and useful contact pathways.