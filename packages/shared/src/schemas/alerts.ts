import { z } from 'zod'

export const AlertTypeSchema = z.enum([
  'dose_unconfirmed',
  'dose_escalation',
  'assistance_request',
  'low_stock',
  'care_task_overdue',
])
export type AlertType = z.infer<typeof AlertTypeSchema>

export const AlertStatusSchema = z.enum(['created', 'acknowledged', 'resolved'])
export type AlertStatus = z.infer<typeof AlertStatusSchema>

export const AlertSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  type: AlertTypeSchema,
  status: AlertStatusSchema,
  title: z.string(),
  message: z.string(),
  referenceId: z.string(), // e.g. occurrenceId, taskId
  acknowledgedBy: z.string().optional(),
  acknowledgedAt: z.string().optional(),
  resolvedBy: z.string().optional(),
  resolvedAt: z.string().optional(),
  resolutionNote: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Alert = z.infer<typeof AlertSchema>

export const AssistanceKindSchema = z.enum([
  'medication_assistance',
  'appointment_assistance',
  'contact_caregiver',
  'other',
])
export type AssistanceKind = z.infer<typeof AssistanceKindSchema>

export const AssistanceRequestStatusSchema = z.enum(['open', 'acknowledged', 'resolved'])
export type AssistanceRequestStatus = z.infer<typeof AssistanceRequestStatusSchema>

export const AssistanceRequestSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  requestedBy: z.string(),
  requesterName: z.string(),
  kind: AssistanceKindSchema,
  note: z.string().max(500).optional(),
  status: AssistanceRequestStatusSchema,
  acknowledgedBy: z.string().optional(),
  acknowledgedByName: z.string().optional(),
  acknowledgedAt: z.string().optional(),
  resolvedBy: z.string().optional(),
  resolvedByName: z.string().optional(),
  resolvedAt: z.string().optional(),
  resolutionNote: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type AssistanceRequest = z.infer<typeof AssistanceRequestSchema>

export const CreateAssistanceRequestInputSchema = z.object({
  circleId: z.string(),
  kind: AssistanceKindSchema,
  note: z.string().max(500).optional(),
})
export type CreateAssistanceRequestInput = z.infer<typeof CreateAssistanceRequestInputSchema>

export const AcknowledgeAssistanceInputSchema = z.object({
  circleId: z.string(),
  requestId: z.string(),
})
export type AcknowledgeAssistanceInput = z.infer<typeof AcknowledgeAssistanceInputSchema>

export const ResolveAssistanceInputSchema = z.object({
  circleId: z.string(),
  requestId: z.string(),
  resolutionNote: z.string().max(500).optional(),
})
export type ResolveAssistanceInput = z.infer<typeof ResolveAssistanceInputSchema>

export const AcknowledgeAlertInputSchema = z.object({
  circleId: z.string(),
  alertId: z.string(),
})
export type AcknowledgeAlertInput = z.infer<typeof AcknowledgeAlertInputSchema>

export const ResolveAlertInputSchema = z.object({
  circleId: z.string(),
  alertId: z.string(),
  resolutionNote: z.string().max(500).optional(),
})
export type ResolveAlertInput = z.infer<typeof ResolveAlertInputSchema>
