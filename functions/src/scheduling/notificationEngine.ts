import * as admin from 'firebase-admin'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { NotificationJob } from '@carecircle/shared'
import {
  isNotificationStillRelevant,
  calculateRetryBackoff,
  renderEmailTemplate,
} from '../domain/notifications'
import { getMailTransport } from '../mail/transport'

export async function claimDueNotificationJobs(
  db: admin.firestore.Firestore,
  now: Date,
  batchSize: number = 50,
  leaseDurationMs: number = 2 * 60 * 1000 // 2 minutes
): Promise<NotificationJob[]> {
  const nowIso = now.toISOString()
  const leaseExpiryIso = new Date(now.getTime() + leaseDurationMs).toISOString()

  // Query pending jobs whose dueAt is in the past
  const querySnap = await db
    .collection('notificationJobs')
    .where('status', '==', 'pending')
    .where('dueAt', '<=', nowIso)
    .orderBy('dueAt', 'asc')
    .limit(batchSize)
    .get()

  if (querySnap.empty) {
    return []
  }

  const claimedJobs: NotificationJob[] = []

  // Transactionally claim each job
  for (const doc of querySnap.docs) {
    await db.runTransaction(async (t) => {
      const freshDoc = await t.get(doc.ref)
      if (!freshDoc.exists) return

      const data = freshDoc.data() as NotificationJob
      if (data.status === 'pending') {
        t.update(doc.ref, {
          status: 'claimed',
          leaseExpiresAt: leaseExpiryIso,
        })
        claimedJobs.push({
          ...data,
          id: doc.id,
          status: 'claimed',
          leaseExpiresAt: leaseExpiryIso,
        })
      }
    })
  }

  return claimedJobs
}

export async function processNotificationJob(
  db: admin.firestore.Firestore,
  job: NotificationJob
): Promise<void> {
  const jobRef = db.collection('notificationJobs').doc(job.id)

  try {
    // 1. Re-check occurrence or appointment status for staleness
    let currentStatus: string | null = null

    if (job.type.startsWith('dose_')) {
      const occDoc = await db
        .collection('careCircles')
        .doc(job.circleId)
        .collection('doseOccurrences')
        .doc(job.referenceId)
        .get()

      if (occDoc.exists) {
        currentStatus = occDoc.data()?.status ?? null
      }
    } else if (job.type === 'appointment_reminder') {
      const apptDoc = await db
        .collection('careCircles')
        .doc(job.circleId)
        .collection('appointments')
        .doc(job.referenceId)
        .get()

      if (apptDoc.exists) {
        currentStatus = apptDoc.data()?.status ?? null
      }
    }

    // 2. Re-check recipient membership status
    let isActiveMember = true
    if (job.recipientUid) {
      const memberDoc = await db
        .collection('careCircles')
        .doc(job.circleId)
        .collection('members')
        .doc(job.recipientUid)
        .get()

      if (memberDoc.exists) {
        isActiveMember = memberDoc.data()?.status === 'active'
      }
    }

    // 3. Check relevance
    const isRelevant = isNotificationStillRelevant(job, currentStatus, isActiveMember, true)

    if (!isRelevant) {
      await jobRef.update({
        status: 'stale',
        sentAt: new Date().toISOString(),
      })
      return
    }

    // 4. Send via transport
    const transport = getMailTransport()
    const emailMsg = renderEmailTemplate(job.type, {
      recipientEmail: job.recipientEmail,
      elderName: 'Care Circle',
    })

    const sendResult = await transport.send(emailMsg)

    if (sendResult.accepted) {
      await jobRef.update({
        status: 'provider_accepted',
        sentAt: new Date().toISOString(),
      })
    } else {
      throw new Error('Transport rejected message.')
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    const newAttempts = (job.attempts || 0) + 1
    const maxAttempts = job.maxAttempts || 3

    if (newAttempts >= maxAttempts) {
      await jobRef.update({
        status: 'failed',
        attempts: newAttempts,
        lastError: errorMsg,
      })
    } else {
      const backoffSec = calculateRetryBackoff(newAttempts)
      const nextDueAt = new Date(Date.now() + backoffSec * 1000).toISOString()

      await jobRef.update({
        status: 'pending',
        attempts: newAttempts,
        dueAt: nextDueAt,
        lastError: errorMsg,
      })
    }
  }
}

// Scheduled Cloud Function running every minute
export const processNotificationQueue = onSchedule('every 1 minutes', async (_event) => {
  const db = admin.firestore()
  const now = new Date()
  const claimed = await claimDueNotificationJobs(db, now, 50)

  for (const job of claimed) {
    await processNotificationJob(db, job)
  }
})
