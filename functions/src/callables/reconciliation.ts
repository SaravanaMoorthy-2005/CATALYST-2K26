import { defineCallable, HttpsError } from '../utils/callable'
import * as admin from 'firebase-admin'
import {
  CreateReconciliationProposalInputSchema,
  ApproveReconciliationInputSchema,
  RejectReconciliationInputSchema,
  ReconciliationProposal,
  Medication,
} from '@carecircle/shared'
import { diffMedicationPlans } from '../domain/inventory'
import { generateDoseOccurrences } from '../domain/medication'
import { assertCarePermission } from '../security/permissions'

const db = admin.firestore()

export const createReconciliationProposal = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CreateReconciliationProposalInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, hospitalOrClinician, visitDate, proposedMedications, sourceNote } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'medication_write')

  // Load current active medications
  const medsSnap = await db
    .collection('careCircles')
    .doc(circleId)
    .collection('medications')
    .where('status', '==', 'active')
    .get()

  const currentMeds = medsSnap.docs.map((d) => d.data() as Medication)
  const diffSummary = diffMedicationPlans(currentMeds, proposedMedications)

  const proposalRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('prescriptionReconciliations')
    .doc()

  const now = new Date().toISOString()
  const proposalId = proposalRef.id

  const proposalData: ReconciliationProposal = {
    id: proposalId,
    circleId,
    status: 'pending_review', // ALWAYS requires explicit human approval
    hospitalOrClinician,
    visitDate,
    proposedMedications,
    diffSummary,
    sourceNote,
    version: 1,
    createdBy: context.auth.uid,
    createdAt: now,
    updatedAt: now,
  }

  await proposalRef.set(proposalData)

  return { proposalId, diffSummary }
})

export const getReconciliationDiff = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const { circleId, proposalId } = data
  if (!circleId || !proposalId) {
    throw new HttpsError('invalid-argument', 'circleId and proposalId required.')
  }

  await assertCarePermission(db, circleId, context.auth.uid, 'medication_read')

  const propSnap = await db
    .collection('careCircles')
    .doc(circleId)
    .collection('prescriptionReconciliations')
    .doc(proposalId)
    .get()

  if (!propSnap.exists) {
    throw new HttpsError('not-found', 'Proposal not found.')
  }

  const proposal = propSnap.data() as ReconciliationProposal
  return { diffSummary: proposal.diffSummary, status: proposal.status }
})

export const approveReconciliation = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = ApproveReconciliationInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, proposalId, expectedVersion, confirmationNote } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'medication_write')

  const proposalRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('prescriptionReconciliations')
    .doc(proposalId)

  const now = new Date()
  const nowIso = now.toISOString()
  const reviewerName = context.auth.token.name || context.auth.token.email || 'Caregiver'

  return await db.runTransaction(async (t) => {
    const snap = await t.get(proposalRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Proposal not found.')
    }

    const proposal = snap.data() as ReconciliationProposal
    if (proposal.version !== expectedVersion) {
      throw new HttpsError('aborted', 'Proposal modified concurrently.')
    }

    if (proposal.status !== 'pending_review' && proposal.status !== 'draft') {
      throw new HttpsError('failed-precondition', `Proposal is already ${proposal.status}.`)
    }

    // Mark proposal approved with human reviewer provenance
    t.update(proposalRef, {
      status: 'approved',
      reviewedBy: context.auth!.uid,
      reviewedByName: reviewerName,
      reviewedAt: nowIso,
      confirmationNote: confirmationNote || '',
      version: proposal.version + 1,
      updatedAt: nowIso,
    })

    // Apply the proposed medications
    for (const prop of proposal.proposedMedications) {
      if (prop.action === 'add') {
        const newMedRef = db
          .collection('careCircles')
          .doc(circleId)
          .collection('medications')
          .doc()

        const newMedId = newMedRef.id
        const newMedData: Medication = {
          id: newMedId,
          circleId,
          name: prop.name,
          dosage: prop.dosage,
          instructions: prop.instructions,
          schedule: prop.schedule,
          timezone: prop.timezone,
          status: 'active',
          version: 1,
          createdBy: context.auth!.uid,
          createdAt: nowIso,
          updatedAt: nowIso,
        }

        t.set(newMedRef, newMedData)

        // Generate occurrences
        const future14 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
        const occurrences = generateDoseOccurrences(
          newMedData,
          nowIso.slice(0, 10),
          future14,
          prop.timezone,
          () => now
        )

        for (const occ of occurrences) {
          const occRef = db
            .collection('careCircles')
            .doc(circleId)
            .collection('doseOccurrences')
            .doc(occ.id)
          t.set(occRef, occ)
        }
      }
    }

    // Audit log
    const auditRef = db
      .collection('careCircles')
      .doc(circleId)
      .collection('auditLogs')
      .doc()

    t.set(auditRef, {
      action: 'RECONCILIATION_APPROVED',
      actorUid: context.auth!.uid,
      timestamp: nowIso,
      metadata: { proposalId, reviewerName },
    })

    return { success: true }
  })
})

export const rejectReconciliation = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = RejectReconciliationInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, proposalId, expectedVersion, reason } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'medication_write')

  const proposalRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('prescriptionReconciliations')
    .doc(proposalId)

  const now = new Date().toISOString()
  const reviewerName = context.auth.token.name || context.auth.token.email || 'Caregiver'

  return await db.runTransaction(async (t) => {
    const snap = await t.get(proposalRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Proposal not found.')
    }
    const current = snap.data()
    if (expectedVersion && current?.version !== expectedVersion) {
      throw new HttpsError('aborted', 'Proposal modified concurrently.')
    }

    t.update(proposalRef, {
      status: 'rejected',
      reviewedBy: context.auth!.uid,
      reviewedByName: reviewerName,
      reviewedAt: now,
      rejectionReason: reason,
      updatedAt: now,
    })

    return { success: true }
  })
})
