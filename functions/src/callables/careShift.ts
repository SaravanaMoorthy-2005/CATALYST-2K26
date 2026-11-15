import { defineCallable, HttpsError } from '../utils/callable'
import * as admin from 'firebase-admin'
import {
  CreateCareTaskInputSchema,
  AssignCareTaskInputSchema,
  AcceptCareTaskInputSchema,
  DeclineCareTaskInputSchema,
  CompleteCareTaskInputSchema,
  GenerateCareHandoffInputSchema,
  CareTask,
  DoseOccurrence,
} from '@carecircle/shared'
import { canTransitionCareTask, buildCareHandoff } from '../domain/careShift'
import { assertCarePermission } from '../security/permissions'

const db = admin.firestore()

export const createCareTask = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CreateCareTaskInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, type, title, description, assignedTo, dueAt } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'tasks_assign')

  const taskRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('careTasks')
    .doc()

  const now = new Date().toISOString()
  const taskId = taskRef.id

  const taskData: CareTask = {
    id: taskId,
    circleId,
    type,
    title,
    description,
    assignedTo: assignedTo || undefined,
    status: 'pending',
    dueAt: dueAt || undefined,
    version: 1,
    createdBy: context.auth.uid,
    createdAt: now,
    updatedAt: now,
  }

  await taskRef.set(taskData)

  return { taskId }
})

export const assignCareTask = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = AssignCareTaskInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, taskId, expectedVersion, assignedTo } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'tasks_assign')

  const taskRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('careTasks')
    .doc(taskId)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const snap = await t.get(taskRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Care task not found.')
    }

    const current = snap.data() as CareTask
    if (current.version !== expectedVersion) {
      throw new HttpsError('aborted', 'Task modified concurrently.')
    }

    const newVersion = current.version + 1
    t.update(taskRef, {
      assignedTo,
      status: 'pending',
      version: newVersion,
      updatedAt: now,
    })

    return { success: true, newVersion }
  })
})

export const acceptCareTask = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = AcceptCareTaskInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, taskId, expectedVersion } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'tasks_complete')

  const taskRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('careTasks')
    .doc(taskId)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const snap = await t.get(taskRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Care task not found.')
    }

    const current = snap.data() as CareTask
    if (current.version !== expectedVersion) {
      throw new HttpsError('aborted', 'Task modified concurrently.')
    }

    if (!canTransitionCareTask(current.status, 'accepted')) {
      throw new HttpsError(
        'failed-precondition',
        `Cannot transition task from ${current.status} to accepted.`
      )
    }

    t.update(taskRef, {
      status: 'accepted',
      assignedTo: context.auth!.uid,
      version: current.version + 1,
      updatedAt: now,
    })

    return { success: true }
  })
})

export const declineCareTask = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = DeclineCareTaskInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, taskId, expectedVersion, reason } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'tasks_complete')

  const taskRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('careTasks')
    .doc(taskId)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const snap = await t.get(taskRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Care task not found.')
    }

    const current = snap.data() as CareTask
    if (current.version !== expectedVersion) {
      throw new HttpsError('aborted', 'Task modified concurrently.')
    }

    t.update(taskRef, {
      status: 'declined',
      declineReason: reason,
      version: current.version + 1,
      updatedAt: now,
    })

    return { success: true }
  })
})

export const completeCareTask = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CompleteCareTaskInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, taskId, expectedVersion, notes } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'tasks_complete')

  const taskRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('careTasks')
    .doc(taskId)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const snap = await t.get(taskRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Care task not found.')
    }

    const current = snap.data() as CareTask
    if (current.version !== expectedVersion) {
      throw new HttpsError('aborted', 'Task modified concurrently.')
    }

    t.update(taskRef, {
      status: 'completed',
      completedAt: now,
      completedBy: context.auth!.uid,
      completionNotes: notes || '',
      version: current.version + 1,
      updatedAt: now,
    })

    return { success: true }
  })
})

export const generateCareHandoff = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = GenerateCareHandoffInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, fromTime, toTime } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'careNotes_read')

  // Load elder profile name
  const circleSnap = await db.collection('careCircles').doc(circleId).get()
  const elderName = circleSnap.data()?.elderProfile?.name || 'Elder'

  // Bounded occurrences within time window
  const occurrencesSnap = await db
    .collection('careCircles')
    .doc(circleId)
    .collection('doseOccurrences')
    .where('dueAt', '>=', fromTime)
    .where('dueAt', '<=', toTime)
    .get()

  const occurrences = occurrencesSnap.docs.map((d) => d.data() as DoseOccurrence)
  const dosesTaken = occurrences.filter((o) => o.status === 'taken').length
  const dosesUnconfirmed = occurrences.filter((o) => o.status === 'unconfirmed').length

  // Bounded tasks
  const tasksSnap = await db
    .collection('careCircles')
    .doc(circleId)
    .collection('careTasks')
    .where('createdAt', '>=', fromTime)
    .get()

  const tasks = tasksSnap.docs.map((d) => d.data() as CareTask)
  const completedTasks = tasks.filter((t) => t.status === 'completed').map((t) => t.title)
  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').map((t) => t.title)

  // Active alerts
  const alertsSnap = await db
    .collection('careCircles')
    .doc(circleId)
    .collection('alerts')
    .where('status', '!=', 'resolved')
    .get()

  const activeAlerts = alertsSnap.docs.map((d) => d.data().title as string)

  // Upcoming appointments
  const apptsSnap = await db
    .collection('careCircles')
    .doc(circleId)
    .collection('appointments')
    .where('status', '==', 'scheduled')
    .limit(5)
    .get()

  const upcomingAppointments = apptsSnap.docs.map(
    (d) => `${d.data().title} on ${d.data().localDate} at ${d.data().localTime}`
  )

  const report = buildCareHandoff({
    circleId,
    elderName,
    fromTime,
    toTime,
    dosesTaken,
    dosesUnconfirmed,
    completedTasks,
    pendingTasks,
    activeAlerts,
    upcomingAppointments,
  })

  return { report }
})
