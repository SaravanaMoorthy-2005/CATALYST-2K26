import { z } from 'zod'

export const InventoryEntryTypeSchema = z.enum([
  'opening',
  'restock',
  'adjustment',
  'administration',
])
export type InventoryEntryType = z.infer<typeof InventoryEntryTypeSchema>

export const InventoryLedgerEntrySchema = z.object({
  id: z.string(), // Idempotency key
  medicationId: z.string(),
  circleId: z.string(),
  type: InventoryEntryTypeSchema,
  quantity: z.number(), // positive for credits, negative for debits
  unit: z.string().default('doses'),
  reason: z.string().max(500).optional(),
  recordedBy: z.string(),
  recordedAt: z.string(),
})
export type InventoryLedgerEntry = z.infer<typeof InventoryLedgerEntrySchema>

export const RefillTaskStatusSchema = z.enum([
  'open',
  'claimed',
  'in_progress',
  'completed',
  'cancelled',
])
export type RefillTaskStatus = z.infer<typeof RefillTaskStatusSchema>

export const RefillTaskSchema = z.object({
  id: z.string(),
  medicationId: z.string(),
  medicationName: z.string(),
  circleId: z.string(),
  status: RefillTaskStatusSchema,
  assignedTo: z.string().optional(),
  assignedToName: z.string().optional(),
  estimatedRemaining: z.number(),
  dueDate: z.string().optional(),
  completedAt: z.string().optional(),
  notes: z.string().max(500).optional(),
  version: z.number().int().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type RefillTask = z.infer<typeof RefillTaskSchema>

export const RecordOpeningInventoryInputSchema = z.object({
  circleId: z.string(),
  medicationId: z.string(),
  quantity: z.number().positive(),
  unit: z.string().default('doses'),
  idempotencyKey: z.string().uuid(),
})
export type RecordOpeningInventoryInput = z.infer<typeof RecordOpeningInventoryInputSchema>

export const RecordRestockInputSchema = z.object({
  circleId: z.string(),
  medicationId: z.string(),
  quantity: z.number().positive(),
  unit: z.string().default('doses'),
  notes: z.string().max(500).optional(),
  idempotencyKey: z.string().uuid(),
})
export type RecordRestockInput = z.infer<typeof RecordRestockInputSchema>

export const AdjustInventoryInputSchema = z.object({
  circleId: z.string(),
  medicationId: z.string(),
  adjustment: z.number(), // signed quantity
  reason: z.string().min(1).max(500),
  idempotencyKey: z.string().uuid(),
})
export type AdjustInventoryInput = z.infer<typeof AdjustInventoryInputSchema>

export const CreateRefillTaskInputSchema = z.object({
  circleId: z.string(),
  medicationId: z.string(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().max(500).optional(),
})
export type CreateRefillTaskInput = z.infer<typeof CreateRefillTaskInputSchema>

export const AssignRefillTaskInputSchema = z.object({
  circleId: z.string(),
  taskId: z.string(),
  expectedVersion: z.number().int().min(1),
  assignedTo: z.string(),
})
export type AssignRefillTaskInput = z.infer<typeof AssignRefillTaskInputSchema>

export const CompleteRefillTaskInputSchema = z.object({
  circleId: z.string(),
  taskId: z.string(),
  expectedVersion: z.number().int().min(1),
  restockQuantity: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
  idempotencyKey: z.string().uuid(),
})
export type CompleteRefillTaskInput = z.infer<typeof CompleteRefillTaskInputSchema>
