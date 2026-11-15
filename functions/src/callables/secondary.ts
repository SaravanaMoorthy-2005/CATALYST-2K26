import { defineCallable, HttpsError } from '../utils/callable'
import * as admin from 'firebase-admin'
import {
  RecordWellbeingCheckInInputSchema,
  SaveAppointmentCompanionInputSchema,
  CarePassport,
  Medication,
  Appointment,
} from '@carecircle/shared'
import { assertCarePermission } from '../security/permissions'

const db = admin.firestore()

export const recordWellbeingCheckIn = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = RecordWellbeingCheckInInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, status, notes } = parsed.data
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10)

  const checkInRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('wellbeingCheckIns')
    .doc(dateStr)

  await checkInRef.set({
    id: dateStr,
    circleId,
    elderUid: context.auth.uid,
    status,
    notes: notes || '',
    date: dateStr,
    recordedAt: now.toISOString(),
  })

  // If status is needs_attention or unwell, generate an alert for caregivers
  if (status !== 'good') {
    await db
      .collection('careCircles')
      .doc(circleId)
      .collection('alerts')
      .add({
        circleId,
        type: 'assistance_request',
        status: 'created',
        title: 'Elder Wellbeing Check-In Alert',
        message: `Elder checked in today with status: "${status}". Notes: ${notes || 'None'}.`,
        referenceId: dateStr,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      })
  }

  return {
    success: true,
    disclaimer:
      'Daily Wellbeing Check-In is self-reported. Non-submission or lack of report does not infer physical safety or emergency dispatch.',
  }
})

export const exportCarePassport = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const { circleId } = (data as any) || {}
  if (!circleId) {
    throw new HttpsError('invalid-argument', 'circleId is required.')
  }

  await assertCarePermission(db, circleId, context.auth.uid, 'privacy_export')

  // Load CareCircle & Elder Profile
  const circleSnap = await db.collection('careCircles').doc(circleId).get()
  if (!circleSnap.exists) {
    throw new HttpsError('not-found', 'Care circle not found.')
  }
  const circleData = circleSnap.data()!
  const elder = circleData.elderProfile || {}

  // Load Active Medications
  const medsSnap = await db
    .collection('careCircles')
    .doc(circleId)
    .collection('medications')
    .where('status', '==', 'active')
    .get()

  const activeMedications = medsSnap.docs.map((d) => {
    const m = d.data() as Medication
    return {
      name: m.name,
      dosage: m.dosage,
      scheduleSummary: `Daily at ${m.schedule.times.join(', ')}`,
      instructions: m.instructions,
    }
  })

  // Load Upcoming Appointments
  const nowIso = new Date().toISOString()
  const apptsSnap = await db
    .collection('careCircles')
    .doc(circleId)
    .collection('appointments')
    .where('status', '==', 'scheduled')
    .where('appointmentAt', '>=', nowIso)
    .orderBy('appointmentAt', 'asc')
    .limit(5)
    .get()

  const upcomingAppointments = apptsSnap.docs.map((d) => {
    const a = d.data() as Appointment
    return {
      title: a.title,
      doctorName: a.doctorName,
      appointmentAt: a.appointmentAt,
      location: a.location,
    }
  })

  const now = new Date().toISOString()
  const callerName = context.auth.token.name || context.auth.token.email || 'Authorized Member'

  const passport: CarePassport = {
    elderName: elder.name || 'Elder Profile',
    dateOfBirth: elder.dateOfBirth || 'Not provided',
    primaryLanguage: elder.primaryLanguage || 'en',
    emergencyContacts: elder.emergencyContacts || [],
    allergies: elder.allergies || [],
    activeMedications,
    upcomingAppointments,
    generatedAt: now,
    generatedBy: callerName,
    disclaimer:
      'CarePassport is an administrative snapshot of active records in CareCircle as of the generation timestamp. For official clinician records, consult healthcare providers directly.',
  }

  // Audit log export
  await db
    .collection('careCircles')
    .doc(circleId)
    .collection('auditLogs')
    .add({
      action: 'CARE_PASSPORT_EXPORTED',
      actorUid: context.auth.uid,
      timestamp: now,
      metadata: { elderName: elder.name },
    })

  return { passport }
})

export const saveAppointmentCompanion = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = SaveAppointmentCompanionInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, appointmentId, companionQuestions, notes } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'appointments_write')

  const apptRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('appointments')
    .doc(appointmentId)

  await apptRef.update({
    companionQuestions,
    ...(notes !== undefined && { notes }),
    updatedAt: new Date().toISOString(),
  })

  return { success: true }
})
