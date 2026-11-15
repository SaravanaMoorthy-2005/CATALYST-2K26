import { defineCallable, HttpsError } from '../utils/callable'
import * as admin from 'firebase-admin'
import {
  CreateAssistanceRequestInputSchema,
  AcknowledgeAssistanceInputSchema,
  ResolveAssistanceInputSchema,
  AcknowledgeAlertInputSchema,
  ResolveAlertInputSchema,
} from '@carecircle/shared'
import { assertCarePermission } from '../security/permissions'

const db = admin.firestore()

export const createAssistanceRequest = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CreateAssistanceRequestInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, kind, note } = parsed.data
  const now = new Date().toISOString()
  const callerName = context.auth.token.name || context.auth.token.email?.split('@')[0] || 'Elder'

  const requestRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('assistanceRequests')
    .doc()

  const requestId = requestRef.id

  await db.runTransaction(async (t) => {
    t.set(requestRef, {
      id: requestId,
      circleId,
      requestedBy: context.auth!.uid,
      requesterName: callerName,
      kind,
      note: note || '',
      status: 'open',
      createdAt: now,
      updatedAt: now,
    })

    // Create high-priority alert for caregivers
    const alertRef = db
      .collection('careCircles')
      .doc(circleId)
      .collection('alerts')
      .doc()

    t.set(alertRef, {
      id: alertRef.id,
      circleId,
      type: 'assistance_request',
      status: 'created',
      title: `Assistance Requested: ${kind.replace(/_/g, ' ')}`,
      message: `${callerName} requested assistance: ${note || kind.replace(/_/g, ' ')}.`,
      referenceId: requestId,
      createdAt: now,
      updatedAt: now,
    })

    // Queue notification job to active circle caregivers
    const membersSnap = await db
      .collection('careCircles')
      .doc(circleId)
      .collection('members')
      .where('status', '==', 'active')
      .where('role', 'in', ['owner', 'caregiver'])
      .get()

    for (const memberDoc of membersSnap.docs) {
      const member = memberDoc.data()
      if (member.uid !== context.auth!.uid && member.email) {
        const jobRef = db.collection('notificationJobs').doc(`assist_${requestId}_${member.uid}`)
        t.set(jobRef, {
          id: `assist_${requestId}_${member.uid}`,
          circleId,
          type: 'assistance_request',
          status: 'pending',
          dueAt: now,
          recipientUid: member.uid,
          recipientEmail: member.email,
          referenceId: requestId,
          referenceVersion: 1,
          channel: 'email',
          attempts: 0,
          createdAt: now,
        })
      }
    }
  })

  return {
    requestId,
    disclaimer:
      'This contacts your authorized care circle members. CareCircle is not an emergency response service. In case of immediate medical emergency, please dial 911 or your local emergency number directly.',
  }
})

export const acknowledgeAssistance = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = AcknowledgeAssistanceInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, requestId } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'alerts_ack')

  const reqRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('assistanceRequests')
    .doc(requestId)

  const now = new Date().toISOString()
  const responderName = context.auth.token.name || context.auth.token.email?.split('@')[0] || 'Caregiver'

  await reqRef.update({
    status: 'acknowledged',
    acknowledgedBy: context.auth.uid,
    acknowledgedByName: responderName,
    acknowledgedAt: now,
    updatedAt: now,
  })

  return { success: true }
})

export const resolveAssistance = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = ResolveAssistanceInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, requestId, resolutionNote } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'alerts_ack')

  const reqRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('assistanceRequests')
    .doc(requestId)

  const now = new Date().toISOString()
  const responderName = context.auth.token.name || context.auth.token.email?.split('@')[0] || 'Caregiver'

  await reqRef.update({
    status: 'resolved',
    resolvedBy: context.auth.uid,
    resolvedByName: responderName,
    resolvedAt: now,
    resolutionNote: resolutionNote || 'Resolved',
    updatedAt: now,
  })

  return { success: true }
})

export const acknowledgeAlert = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = AcknowledgeAlertInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, alertId } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'alerts_ack')

  const alertRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('alerts')
    .doc(alertId)

  const now = new Date().toISOString()
  await alertRef.update({
    status: 'acknowledged',
    acknowledgedBy: context.auth.uid,
    acknowledgedAt: now,
    updatedAt: now,
  })

  return { success: true }
})

export const resolveAlert = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = ResolveAlertInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, alertId, resolutionNote } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'alerts_ack')

  const alertRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('alerts')
    .doc(alertId)

  const now = new Date().toISOString()
  await alertRef.update({
    status: 'resolved',
    resolvedBy: context.auth.uid,
    resolvedAt: now,
    resolutionNote: resolutionNote || '',
    updatedAt: now,
  })

  return { success: true }
})
