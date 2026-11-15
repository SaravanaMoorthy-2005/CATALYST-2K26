import { defineCallable, HttpsError } from '../utils/callable'
import * as admin from 'firebase-admin'
import {
  RecordOpeningInventoryInputSchema,
  RecordRestockInputSchema,
  AdjustInventoryInputSchema,
  CreateRefillTaskInputSchema,
  AssignRefillTaskInputSchema,
  CompleteRefillTaskInputSchema,
  RefillTask,
  Medication,
} from '@carecircle/shared'
import { assertCarePermission } from '../security/permissions'

const db = admin.firestore()

export const recordOpeningInventory = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = RecordOpeningInventoryInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, medicationId, quantity, unit, idempotencyKey } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'medication_write')

  const ledgerRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('inventoryLedger')
    .doc(idempotencyKey)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const existing = await t.get(ledgerRef)
    if (existing.exists) {
      return { success: true, isDuplicate: true }
    }

    t.set(ledgerRef, {
      id: idempotencyKey,
      medicationId,
      circleId,
      type: 'opening',
      quantity,
      unit,
      reason: 'Opening stock count',
      recordedBy: context.auth!.uid,
      recordedAt: now,
    })

    return { success: true, quantity, unit }
  })
})

export const recordRestock = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = RecordRestockInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, medicationId, quantity, unit, notes, idempotencyKey } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'medication_write')

  const ledgerRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('inventoryLedger')
    .doc(idempotencyKey)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const existing = await t.get(ledgerRef)
    if (existing.exists) {
      return { success: true, isDuplicate: true }
    }

    t.set(ledgerRef, {
      id: idempotencyKey,
      medicationId,
      circleId,
      type: 'restock',
      quantity,
      unit,
      reason: notes || 'Prescription refill replenishment',
      recordedBy: context.auth!.uid,
      recordedAt: now,
    })

    return { success: true, restockedQuantity: quantity }
  })
})

export const adjustInventory = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = AdjustInventoryInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, medicationId, adjustment, reason, idempotencyKey } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'medication_write')

  const ledgerRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('inventoryLedger')
    .doc(idempotencyKey)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const existing = await t.get(ledgerRef)
    if (existing.exists) {
      return { success: true, isDuplicate: true }
    }

    t.set(ledgerRef, {
      id: idempotencyKey,
      medicationId,
      circleId,
      type: 'adjustment',
      quantity: adjustment,
      unit: 'dose',
      reason,
      recordedBy: context.auth!.uid,
      recordedAt: now,
    })

    return { success: true, adjustment }
  })
})

export const createRefillTask = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CreateRefillTaskInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, medicationId, assignedTo, dueDate, notes } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'tasks_assign')

  // Load medication name
  const medSnap = await db
    .collection('careCircles')
    .doc(circleId)
    .collection('medications')
    .doc(medicationId)
    .get()

  const medName = medSnap.exists ? (medSnap.data() as Medication).name : 'Medication'

  const taskRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('refillTasks')
    .doc()

  const now = new Date().toISOString()

  await taskRef.set({
    id: taskRef.id,
    medicationId,
    medicationName: medName,
    circleId,
    status: 'open',
    assignedTo: assignedTo || null,
    dueDate: dueDate || null,
    notes: notes || '',
    estimatedRemaining: 0,
    version: 1,
    createdAt: now,
    updatedAt: now,
  })

  return { taskId: taskRef.id }
})

export const assignRefillTask = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = AssignRefillTaskInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, taskId, expectedVersion, assignedTo } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'tasks_assign')

  const taskRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('refillTasks')
    .doc(taskId)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const snap = await t.get(taskRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Refill task not found.')
    }

    const current = snap.data() as RefillTask
    if (current.version !== expectedVersion) {
      throw new HttpsError('aborted', 'Task was modified concurrently.')
    }

    const newVersion = current.version + 1
    t.update(taskRef, {
      assignedTo,
      status: 'claimed',
      version: newVersion,
      updatedAt: now,
    })

    return { success: true, newVersion }
  })
})

export const completeRefillTask = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CompleteRefillTaskInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, taskId, expectedVersion, restockQuantity, notes, idempotencyKey } = parsed.data
  await assertCarePermission(db, circleId, context.auth.uid, 'tasks_complete')

  const taskRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('refillTasks')
    .doc(taskId)

  const now = new Date().toISOString()

  return await db.runTransaction(async (t) => {
    const snap = await t.get(taskRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Refill task not found.')
    }

    const current = snap.data() as RefillTask
    if (current.version !== expectedVersion) {
      throw new HttpsError('aborted', 'Task was modified concurrently.')
    }

    t.update(taskRef, {
      status: 'completed',
      completedAt: now,
      version: current.version + 1,
      updatedAt: now,
    })

    // If restocking quantity was included, add restock ledger entry
    if (restockQuantity && restockQuantity > 0) {
      const ledgerRef = db
        .collection('careCircles')
        .doc(circleId)
        .collection('inventoryLedger')
        .doc(idempotencyKey)

      t.set(ledgerRef, {
        id: idempotencyKey,
        medicationId: current.medicationId,
        circleId,
        type: 'restock',
        quantity: restockQuantity,
        unit: 'dose',
        reason: notes || `Restocked via refill task ${taskId}`,
        recordedBy: context.auth!.uid,
        recordedAt: now,
      })
    }

    return { success: true }
  })
})
