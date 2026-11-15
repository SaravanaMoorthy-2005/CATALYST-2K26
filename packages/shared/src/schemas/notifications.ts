import { z } from 'zod'

export const NotificationJobTypeSchema = z.enum([
  'dose_upcoming',
  'dose_due',
  'dose_unconfirmed',
  'dose_escalation',
  'appointment_reminder',
  'invitation_code',
  'assistance_request',
  'low_stock',
])
export type NotificationJobType = z.infer<typeof NotificationJobTypeSchema>

export const NotificationJobStatusSchema = z.enum([
  'pending',
  'claimed',
  'provider_accepted',
  'failed',
  'cancelled',
  'stale',
])
export type NotificationJobStatus = z.infer<typeof NotificationJobStatusSchema>

export const NotificationJobSchema = z.object({
  id: z.string(), // stable deduplication key
  circleId: z.string(),
  type: NotificationJobTypeSchema,
  status: NotificationJobStatusSchema,
  dueAt: z.string(), // UTC ISO
  recipientUid: z.string(),
  recipientEmail: z.string(),
  recipientName: z.string().optional(),
  referenceId: z.string(),
  referenceVersion: z.number().int().default(1),
  channel: z.enum(['email', 'in_app', 'push']).default('email'),
  attempts: z.number().int().default(0),
  maxAttempts: z.number().int().default(3),
  leaseExpiresAt: z.string().optional(),
  lastError: z.string().optional(),
  createdAt: z.string(),
  sentAt: z.string().optional(),
})
export type NotificationJob = z.infer<typeof NotificationJobSchema>

export const MailMessageSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  text: z.string().min(1),
  html: z.string().min(1),
})
export type MailMessage = z.infer<typeof MailMessageSchema>
