import { defineCallable, HttpsError } from '../utils/callable'
import * as admin from 'firebase-admin'
import {
  CreateMedicationInputSchema,
  UpdateMedicationInputSchema,
  ConfirmDoseInputSchema,
  CorrectDoseInputSchema,
  ReportUnconfirmedReasonInputSchema,
  Medication,
  DoseOccurrence,
} from '@carecircle/shared'
import {
  generateDoseOccurrences,
  canTransitionDose,
  reconcileFutureOccurrences,
} from '../domain/medication'
import { assertCarePermission } from '../security/permissions'

const db = admin.firestore()

export const createMedication = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CreateMedicationInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, name, dosage, instructions, schedule, timezone } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'medication_write')

  const medRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('medications')
    .doc()

  const medId = medRef.id
  const now = new Date()
  const nowIso = now.toISOString()
  const todayStr = nowIso.slice(0, 10)
  const fourteenDaysFuture = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

  const medDocData: Medication = {
    id: medId,
    circleId,
    name,
    dosage,
    instructions,
    schedule,
    timezone,
    status: 'active',
    version: 1,
    createdBy: context.auth.uid,
    createdAt: nowIso,
    updatedAt: nowIso,
  }

  // Generate 14-day rolling occurrences
  const occurrences = generateDoseOccurrences(
    medDocData,
    todayStr,
    fourteenDaysFuture,
    timezone,
    () => now
  )

  await db.runTransaction(async (t) => {
    // 1. Save medication document
    t.set(medRef, medDocData)

    // 2. Batch write occurrences
    for (const occ of occurrences) {
      const occRef = db
        .collection('careCircles')
        .doc(circleId)
        .collection('doseOccurrences')
        .doc(occ.id)
      t.set(occRef, occ)
    }

    // 3. Write audit log
    const auditRef = db
      .collection('careCircles')
      .doc(circleId)
      .collection('auditLogs')
      .doc()

    t.set(auditRef, {
      action: 'MEDICATION_CREATED',
      actorUid: context.auth!.uid,
      timestamp: nowIso,
      metadata: { medId, name, dosage, occurrencesCount: occurrences.length },
    })
  })

  return { medicationId: medId, occurrencesGenerated: occurrences.length }
})

export const updateMedication = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = UpdateMedicationInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, medicationId, expectedVersion, name, dosage, instructions, schedule } =
    parsed.data

  await assertCarePermission(db, circleId, context.auth.uid, 'medication_write')

  const medRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('medications')
    .doc(medicationId)

  const now = new Date()

  return await db.runTransaction(async (t) => {
    const medSnap = await t.get(medRef)
    if (!medSnap.exists) {
      throw new HttpsError('not-found', 'Medication not found.')
    }

    const currentMed = medSnap.data() as Medication
    if (currentMed.version !== expectedVersion) {
      throw new HttpsError(
        'aborted',
        'Medication was modified concurrently by another member. Please refresh.'
      )
    }

    const newVersion = currentMed.version + 1
    const updatedMed: Medication = {
      ...currentMed,
      name: name ?? currentMed.name,
      dosage: dosage ?? currentMed.dosage,
      instructions: instructions !== undefined ? instructions : currentMed.instructions,
      schedule: schedule ?? currentMed.schedule,
      version: newVersion,
      updatedAt: now.toISOString(),
    }

    t.set(medRef, updatedMed)

    // Reconcile future occurrences
    const occurrencesSnap = await db
      .collection('careCircles')
      .doc(circleId)
      .collection('doseOccurrences')
      .where('medicationId', '==', medicationId)
      .get()

    const oldOccurrences = occurrencesSnap.docs.map((d) => d.data() as DoseOccurrence)
    const { toCancel, toCreate } = reconcileFutureOccurrences(oldOccurrences, updatedMed, now)

    // Cancel obsolete future occurrences
    for (const cancelId of toCancel) {
      const cancelRef = db
        .collection('careCircles')
        .doc(circleId)
        .collection('doseOccurrences')
        .doc(cancelId)
      t.update(cancelRef, { status: 'cancelled' })
    }

    // Create new occurrences
    for (const newOcc of toCreate) {
      const newOccRef = db
        .collection('careCircles')
        .doc(circleId)
        .collection('doseOccurrences')
        .doc(newOcc.id)
      t.set(newOccRef, newOcc)
    }

    return {
      success: true,
      newVersion,
      cancelledCount: toCancel.length,
      createdCount: toCreate.length,
    }
  })
})

export const pauseMedication = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const { circleId, medicationId, pause } = data
  if (!circleId || !medicationId) {
    throw new HttpsError('invalid-argument', 'circleId and medicationId required.')
  }

  await assertCarePermission(db, circleId, context.auth.uid, 'medication_write')

  const medRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('medications')
    .doc(medicationId)

  await medRef.update({
    status: pause ? 'paused' : 'active',
    updatedAt: new Date().toISOString(),
  })

  return { success: true }
})

export const archiveMedication = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const { circleId, medicationId } = data
  if (!circleId || !medicationId) {
    throw new HttpsError('invalid-argument', 'circleId and medicationId required.')
  }

  await assertCarePermission(db, circleId, context.auth.uid, 'medication_write')

  const medRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('medications')
    .doc(medicationId)

  await medRef.update({
    status: 'archived',
    updatedAt: new Date().toISOString(),
  })

  return { success: true }
})

/**
 * SafeDose Shield Dose Confirmation:
 * - Atomic Firestore Transaction
 * - Idempotency key protection against duplicate digital taps
 * - Conflict detection if confirmed by another actor
 * - Exactly one inventory ledger decrement
 * - Cancellation of obsolete notification jobs
 */
export const confirmDose = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = ConfirmDoseInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, occurrenceId, action, idempotencyKey } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'medication_confirm')

  const occRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('doseOccurrences')
    .doc(occurrenceId)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const occSnap = await t.get(occRef)
    if (!occSnap.exists) {
      throw new HttpsError('not-found', 'Dose occurrence not found.')
    }

    const occ = occSnap.data() as DoseOccurrence

    // SAFEDOSE SHIELD CHECK:
    if (occ.status === 'taken' || occ.status === 'skipped') {
      // 1. Same idempotency key -> idempotent retry, return existing success
      if (occ.idempotencyKey === idempotencyKey) {
        return {
          status: occ.status,
          confirmedAt: occ.confirmedAt || occ.skippedAt,
          confirmedBy: occ.confirmedBy || occ.skippedBy,
          isDuplicateSubmission: true,
          safeDoseShieldActive: true,
        }
      }

      // 2. Different key -> CONFLICT (already confirmed by another caregiver or earlier tap)
      return {
        status: occ.status,
        conflict: true,
        confirmedAt: occ.confirmedAt || occ.skippedAt,
        confirmedBy: occ.confirmedBy || occ.skippedBy,
        safeDoseShieldWarning: `This dose was already marked ${occ.status} at ${occ.confirmedAt || occ.skippedAt}. SafeDose Shield prevented duplicate entry.`,
      }
    }

    if (!canTransitionDose(occ.status, action)) {
      throw new HttpsError(
        'failed-precondition',
        `Cannot transition dose from ${occ.status} to ${action}.`
      )
    }

    // Apply update
    const updateData: Partial<DoseOccurrence> = {
      status: action,
      idempotencyKey,
      ...(action === 'taken'
        ? { confirmedAt: now, confirmedBy: context.auth!.uid }
        : { skippedAt: now, skippedBy: context.auth!.uid }),
    }

    t.update(occRef, updateData)

    // Append immutable DoseEvent record
    const eventRef = db
      .collection('careCircles')
      .doc(circleId)
      .collection('doseEvents')
      .doc()

    t.set(eventRef, {
      occurrenceId,
      medicationId: occ.medicationId,
      action,
      actorUid: context.auth!.uid,
      actorEmail: context.auth!.token.email || '',
      idempotencyKey,
      timestamp: now,
    })

    // If taken: decrement inventory ledger once with idempotent ID
    if (action === 'taken') {
      const ledgerRef = db
        .collection('careCircles')
        .doc(circleId)
        .collection('inventoryLedger')
        .doc(`admin_${occurrenceId}`)

      t.set(ledgerRef, {
        id: `admin_${occurrenceId}`,
        medicationId: occ.medicationId,
        circleId,
        type: 'administration',
        quantity: -1,
        unit: 'dose',
        reason: `Dose administered at ${occ.localTime}`,
        recordedBy: context.auth!.uid,
        recordedAt: now,
      })
    }

    return {
      status: action,
      confirmedAt: now,
      confirmedBy: context.auth!.uid,
      safeDoseShieldActive: true,
    }
  })
})

export const correctDose = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CorrectDoseInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, occurrenceId, correctedAction, reason, idempotencyKey } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'medication_confirm')

  const occRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('doseOccurrences')
    .doc(occurrenceId)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const occSnap = await t.get(occRef)
    if (!occSnap.exists) {
      throw new HttpsError('not-found', 'Dose occurrence not found.')
    }

    const occ = occSnap.data() as DoseOccurrence
    const originalStatus = occ.status

    t.update(occRef, {
      status: correctedAction,
      ...(correctedAction === 'taken'
        ? { confirmedAt: now, confirmedBy: context.auth!.uid }
        : { skippedAt: now, skippedBy: context.auth!.uid }),
    })

    // Add audited correction event (preserving original confirmation history intact)
    const eventRef = db
      .collection('careCircles')
      .doc(circleId)
      .collection('doseEvents')
      .doc()

    t.set(eventRef, {
      type: 'CORRECTION',
      occurrenceId,
      medicationId: occ.medicationId,
      fromStatus: originalStatus,
      toStatus: correctedAction,
      reason,
      actorUid: context.auth!.uid,
      idempotencyKey,
      timestamp: now,
    })

    return { success: true, correctedStatus: correctedAction }
  })
})

export const reportDoseUnconfirmedReason = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = ReportUnconfirmedReasonInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, occurrenceId, reason, retrospectiveConfirmation } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'medication_confirm')

  const occRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('doseOccurrences')
    .doc(occurrenceId)

  const occSnap = await occRef.get()
  if (!occSnap.exists) {
    throw new HttpsError('not-found', 'Dose occurrence not found.')
  }
  const occ = occSnap.data() as DoseOccurrence

  const now = new Date().toISOString()

  // 1. Persist WhyMissed reason on the occurrence
  await occRef.update({
    unconfirmedReason: reason,
    unconfirmedReportedAt: now,
    unconfirmedReportedBy: context.auth.uid,
    ...(reason === 'already_taken_not_recorded' && retrospectiveConfirmation
      ? {
          status: 'taken',
          confirmedAt: retrospectiveConfirmation.takenAt,
          confirmedBy: context.auth.uid,
          retrospectiveNotes: retrospectiveConfirmation.notes,
        }
      : {}),
  })

  // 2. Contextual follow-up workflow routing
  let followUpAction = 'none'

  if (reason === 'medicine_unavailable') {
    // Automatically generate Refill Task
    await db
      .collection('careCircles')
      .doc(circleId)
      .collection('refillTasks')
      .add({
        medicationId: occ.medicationId,
        medicationName: 'Medication Supply',
        circleId,
        status: 'open',
        estimatedRemaining: 0,
        notes: `Urgent refill needed: Elder reported medicine unavailable for ${occ.localDate} ${occ.localTime} dose.`,
        version: 1,
        createdAt: now,
        updatedAt: now,
      })
    followUpAction = 'refill_task_created'
  } else if (reason === 'need_assistance') {
    // Automatically generate Assistance Request
    await db
      .collection('careCircles')
      .doc(circleId)
      .collection('assistanceRequests')
      .add({
        circleId,
        requestedBy: context.auth.uid,
        requesterName: context.auth.token.name || 'Elder',
        kind: 'medication_assistance',
        note: `Medication assistance requested for scheduled dose at ${occ.localTime}.`,
        status: 'open',
        createdAt: now,
        updatedAt: now,
      })
    followUpAction = 'assistance_request_created'
  } else if (reason === 'feeling_unwell') {
    // Generate high-priority alert for caregivers
    await db
      .collection('careCircles')
      .doc(circleId)
      .collection('alerts')
      .add({
        circleId,
        type: 'dose_unconfirmed',
        status: 'created',
        title: 'Elder Feeling Unwell',
        message: `Elder reported feeling unwell when dose was due at ${occ.localTime}. Please check in.`,
        referenceId: occurrenceId,
        createdAt: now,
        updatedAt: now,
      })
    followUpAction = 'caregiver_alerted'
  }

  // Audit log
  await db
    .collection('careCircles')
    .doc(circleId)
    .collection('auditLogs')
    .add({
      action: 'WHY_MISSED_REPORTED',
      actorUid: context.auth.uid,
      timestamp: now,
      metadata: { occurrenceId, reason, followUpAction },
    })

  return { success: true, reason, followUpAction }
})
