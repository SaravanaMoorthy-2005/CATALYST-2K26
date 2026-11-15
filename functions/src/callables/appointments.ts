import { defineCallable, HttpsError } from '../utils/callable'
import * as admin from 'firebase-admin'
import {
  CreateAppointmentInputSchema,
  UpdateAppointmentInputSchema,
  RescheduleAppointmentInputSchema,
  CancelAppointmentInputSchema,
  Appointment,
} from '@carecircle/shared'
import { assertCarePermission } from '../security/permissions'

const db = admin.firestore()

export const createAppointment = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CreateAppointmentInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const {
    circleId,
    title,
    doctorName,
    specialty,
    location,
    appointmentAt,
    localDate,
    localTime,
    timezone,
    notes,
    companionQuestions,
  } = parsed.data

  await assertCarePermission(db, circleId, context.auth.uid, 'appointments_write')

  const apptRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('appointments')
    .doc()

  const apptId = apptRef.id
  const now = new Date().toISOString()

  const apptData: Appointment = {
    id: apptId,
    circleId,
    title,
    doctorName,
    specialty,
    location,
    appointmentAt,
    localDate,
    localTime,
    timezone,
    status: 'scheduled',
    notes,
    companionQuestions: companionQuestions || [],
    version: 1,
    createdBy: context.auth.uid,
    createdAt: now,
    updatedAt: now,
  }

  await db.runTransaction(async (t) => {
    t.set(apptRef, apptData)

    // Schedule 24h and 2h email notification jobs
    const apptTime = new Date(appointmentAt).getTime()
    const tMinus24h = new Date(apptTime - 24 * 60 * 60 * 1000).toISOString()
    const tMinus2h = new Date(apptTime - 2 * 60 * 60 * 1000).toISOString()

    // 24h reminder
    const job24Ref = db.collection('notificationJobs').doc(`appt_${apptId}_24h_v1`)
    t.set(job24Ref, {
      id: `appt_${apptId}_24h_v1`,
      circleId,
      type: 'appointment_reminder',
      status: 'pending',
      dueAt: tMinus24h,
      recipientUid: context.auth!.uid,
      recipientEmail: context.auth!.token.email || '',
      referenceId: apptId,
      referenceVersion: 1,
      channel: 'email',
      attempts: 0,
      createdAt: now,
    })

    // 2h reminder
    const job2Ref = db.collection('notificationJobs').doc(`appt_${apptId}_2h_v1`)
    t.set(job2Ref, {
      id: `appt_${apptId}_2h_v1`,
      circleId,
      type: 'appointment_reminder',
      status: 'pending',
      dueAt: tMinus2h,
      recipientUid: context.auth!.uid,
      recipientEmail: context.auth!.token.email || '',
      referenceId: apptId,
      referenceVersion: 1,
      channel: 'email',
      attempts: 0,
      createdAt: now,
    })

    // Audit log
    const auditRef = db
      .collection('careCircles')
      .doc(circleId)
      .collection('auditLogs')
      .doc()

    t.set(auditRef, {
      action: 'APPOINTMENT_CREATED',
      actorUid: context.auth!.uid,
      timestamp: now,
      metadata: { apptId, title, doctorName, appointmentAt },
    })
  })

  return { appointmentId: apptId }
})

export const updateAppointment = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = UpdateAppointmentInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const {
    circleId,
    appointmentId,
    expectedVersion,
    title,
    doctorName,
    specialty,
    location,
    appointmentAt,
    localDate,
    localTime,
    notes,
    companionQuestions,
  } = parsed.data

  await assertCarePermission(db, circleId, context.auth.uid, 'appointments_write')

  const apptRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('appointments')
    .doc(appointmentId)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const snap = await t.get(apptRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Appointment not found.')
    }

    const current = snap.data() as Appointment
    if (current.version !== expectedVersion) {
      throw new HttpsError(
        'aborted',
        'Appointment was modified concurrently. Please refresh.'
      )
    }

    const newVersion = current.version + 1
    t.update(apptRef, {
      ...(title !== undefined && { title }),
      ...(doctorName !== undefined && { doctorName }),
      ...(specialty !== undefined && { specialty }),
      ...(location !== undefined && { location }),
      ...(appointmentAt !== undefined && { appointmentAt }),
      ...(localDate !== undefined && { localDate }),
      ...(localTime !== undefined && { localTime }),
      ...(notes !== undefined && { notes }),
      ...(companionQuestions !== undefined && { companionQuestions }),
      version: newVersion,
      updatedAt: now,
    })

    return { success: true, newVersion }
  })
})

export const rescheduleAppointment = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = RescheduleAppointmentInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, appointmentId, expectedVersion, appointmentAt, localDate, localTime, reason } =
    parsed.data

  await assertCarePermission(db, circleId, context.auth.uid, 'appointments_write')

  const apptRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('appointments')
    .doc(appointmentId)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const snap = await t.get(apptRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Appointment not found.')
    }

    const current = snap.data() as Appointment
    if (current.version !== expectedVersion) {
      throw new HttpsError(
        'aborted',
        'Appointment was modified concurrently. Please refresh.'
      )
    }

    const newVersion = current.version + 1
    t.update(apptRef, {
      appointmentAt,
      localDate,
      localTime,
      status: 'rescheduled',
      rescheduleReason: reason || '',
      version: newVersion,
      updatedAt: now,
    })

    // Invalidate old reminder jobs
    const oldJob24Ref = db.collection('notificationJobs').doc(`appt_${appointmentId}_24h_v${current.version}`)
    const oldJob2Ref = db.collection('notificationJobs').doc(`appt_${appointmentId}_2h_v${current.version}`)
    t.update(oldJob24Ref, { status: 'cancelled', cancelledReason: 'Appointment rescheduled' })
    t.update(oldJob2Ref, { status: 'cancelled', cancelledReason: 'Appointment rescheduled' })

    // Create new reminder jobs
    const newApptTime = new Date(appointmentAt).getTime()
    const tMinus24h = new Date(newApptTime - 24 * 60 * 60 * 1000).toISOString()
    const tMinus2h = new Date(newApptTime - 2 * 60 * 60 * 1000).toISOString()

    const newJob24Ref = db.collection('notificationJobs').doc(`appt_${appointmentId}_24h_v${newVersion}`)
    t.set(newJob24Ref, {
      id: `appt_${appointmentId}_24h_v${newVersion}`,
      circleId,
      type: 'appointment_reminder',
      status: 'pending',
      dueAt: tMinus24h,
      recipientUid: context.auth!.uid,
      recipientEmail: context.auth!.token.email || '',
      referenceId: appointmentId,
      referenceVersion: newVersion,
      channel: 'email',
      attempts: 0,
      createdAt: now,
    })

    const newJob2Ref = db.collection('notificationJobs').doc(`appt_${appointmentId}_2h_v${newVersion}`)
    t.set(newJob2Ref, {
      id: `appt_${appointmentId}_2h_v${newVersion}`,
      circleId,
      type: 'appointment_reminder',
      status: 'pending',
      dueAt: tMinus2h,
      recipientUid: context.auth!.uid,
      recipientEmail: context.auth!.token.email || '',
      referenceId: appointmentId,
      referenceVersion: newVersion,
      channel: 'email',
      attempts: 0,
      createdAt: now,
    })

    return { success: true, newVersion }
  })
})

export const cancelAppointment = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CancelAppointmentInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, appointmentId, expectedVersion, reason } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'appointments_write')

  const apptRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('appointments')
    .doc(appointmentId)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const snap = await t.get(apptRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Appointment not found.')
    }

    const current = snap.data() as Appointment
    if (current.version !== expectedVersion) {
      throw new HttpsError(
        'aborted',
        'Appointment was modified concurrently. Please refresh.'
      )
    }

    t.update(apptRef, {
      status: 'cancelled',
      cancelReason: reason || '',
      version: current.version + 1,
      updatedAt: now,
    })

    // Invalidate existing notification jobs
    const oldJob24Ref = db.collection('notificationJobs').doc(`appt_${appointmentId}_24h_v${current.version}`)
    const oldJob2Ref = db.collection('notificationJobs').doc(`appt_${appointmentId}_2h_v${current.version}`)
    t.update(oldJob24Ref, { status: 'cancelled', cancelledReason: 'Appointment cancelled' })
    t.update(oldJob2Ref, { status: 'cancelled', cancelledReason: 'Appointment cancelled' })

    return { success: true }
  })
})

export const completeAppointment = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const { circleId, appointmentId } = data
  if (!circleId || !appointmentId) {
    throw new HttpsError('invalid-argument', 'circleId and appointmentId required.')
  }

  await assertCarePermission(db, circleId, context.auth.uid, 'appointments_write')

  const apptRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('appointments')
    .doc(appointmentId)

  await apptRef.update({
    status: 'completed',
    completedAt: new Date().toISOString(),
    completedBy: context.auth.uid,
  })

  return { success: true }
})
