import { z } from 'zod'

export const CareTaskTypeSchema = z.enum([
  'medication_assistance',
  'appointment_transport',
  'refill_collection',
  'general_care',
  'wellbeing_check',
])
export type CareTaskType = z.infer<typeof CareTaskTypeSchema>

export const CareTaskStatusSchema = z.enum([
  'pending',
  'accepted',
  'declined',
  'in_progress',
  'completed',
  'cancelled',
])
export type CareTaskStatus = z.infer<typeof CareTaskStatusSchema>

export const CareTaskSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  type: CareTaskTypeSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  assignedTo: z.string().optional(),
  assignedToName: z.string().optional(),
  status: CareTaskStatusSchema,
  dueAt: z.string().optional(),
  completedAt: z.string().optional(),
  completedBy: z.string().optional(),
  declineReason: z.string().max(500).optional(),
  version: z.number().int().min(1),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type CareTask = z.infer<typeof CareTaskSchema>

export const CreateCareTaskInputSchema = z.object({
  circleId: z.string(),
  type: CareTaskTypeSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  assignedTo: z.string().optional(),
  dueAt: z.string().optional(),
})
export type CreateCareTaskInput = z.infer<typeof CreateCareTaskInputSchema>

export const AssignCareTaskInputSchema = z.object({
  circleId: z.string(),
  taskId: z.string(),
  expectedVersion: z.number().int().min(1),
  assignedTo: z.string(),
})
export type AssignCareTaskInput = z.infer<typeof AssignCareTaskInputSchema>

export const AcceptCareTaskInputSchema = z.object({
  circleId: z.string(),
  taskId: z.string(),
  expectedVersion: z.number().int().min(1),
})
export type AcceptCareTaskInput = z.infer<typeof AcceptCareTaskInputSchema>

export const DeclineCareTaskInputSchema = z.object({
  circleId: z.string(),
  taskId: z.string(),
  expectedVersion: z.number().int().min(1),
  reason: z.string().min(1).max(500),
})
export type DeclineCareTaskInput = z.infer<typeof DeclineCareTaskInputSchema>

export const CompleteCareTaskInputSchema = z.object({
  circleId: z.string(),
  taskId: z.string(),
  expectedVersion: z.number().int().min(1),
  notes: z.string().max(500).optional(),
})
export type CompleteCareTaskInput = z.infer<typeof CompleteCareTaskInputSchema>

export const GenerateCareHandoffInputSchema = z.object({
  circleId: z.string(),
  fromTime: z.string(),
  toTime: z.string(),
})
export type GenerateCareHandoffInput = z.infer<typeof GenerateCareHandoffInputSchema>

export const CareHandoffReportSchema = z.object({
  circleId: z.string(),
  generatedAt: z.string(),
  windowFrom: z.string(),
  windowTo: z.string(),
  elderName: z.string(),
  dosesTaken: z.number(),
  dosesUnconfirmed: z.number(),
  completedTasks: z.array(z.string()),
  pendingTasks: z.array(z.string()),
  activeAlerts: z.array(z.string()),
  upcomingAppointments: z.array(z.string()),
  disclaimer: z.string(),
})
export type CareHandoffReport = z.infer<typeof CareHandoffReportSchema>
