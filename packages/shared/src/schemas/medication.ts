import { z } from 'zod'

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const DoseStatusSchema = z.enum([
  'scheduled',
  'due',
  'unconfirmed',
  'taken',
  'skipped',
  'cancelled',
])
export const DoseStatus = DoseStatusSchema.enum
export type DoseStatus = z.infer<typeof DoseStatusSchema>

export const WhyMissedReasonSchema = z.enum([
  'forgot',
  'medicine_unavailable',
  'need_assistance',
  'feeling_unwell',
  'already_taken_not_recorded',
])
export type WhyMissedReason = z.infer<typeof WhyMissedReasonSchema>

// ---------------------------------------------------------------------------
// Medication schedule
// ---------------------------------------------------------------------------

export const MedicationScheduleSchema = z.object({
  /** e.g. ['08:00', '20:00'] */
  times: z.array(z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM')).min(1),
  /** 0 = Sunday … 6 = Saturday; undefined = every day */
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  /** YYYY-MM-DD in the medication's local timezone */
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
    .optional(),
})
export type MedicationSchedule = z.infer<typeof MedicationScheduleSchema>

// ---------------------------------------------------------------------------
// Medication
// ---------------------------------------------------------------------------

export const MedicationSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  name: z.string().min(1).max(200),
  dosage: z.string().max(100),
  /** Clinician-provided instructions only — never editable by caregiver */
  instructions: z.string().max(1000).optional(),
  schedule: MedicationScheduleSchema,
  /** IANA timezone identifier, e.g. 'America/Chicago' */
  timezone: z.string(),
  status: z.enum(['active', 'paused', 'archived']),
  /** Optimistic-lock version; incremented on every edit */
  version: z.number().int().min(1),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Medication = z.infer<typeof MedicationSchema>

// ---------------------------------------------------------------------------
// Dose occurrence
// ---------------------------------------------------------------------------

export const DoseOccurrenceSchema = z.object({
  /** Deterministic: `${medId}_v${version}_${localDate}_${localTime.replace(':', '')}` */
  id: z.string(),
  circleId: z.string(),
  medicationId: z.string(),
  medicationVersion: z.number(),
  /** UTC ISO-8601 string */
  dueAt: z.string(),
  /** YYYY-MM-DD in the medication's timezone */
  localDate: z.string(),
  /** HH:MM in the medication's timezone */
  localTime: z.string(),
  /** IANA timezone identifier */
  timezone: z.string(),
  status: DoseStatusSchema,
  confirmedAt: z.string().optional(),
  /** Firebase uid of the person who confirmed */
  confirmedBy: z.string().optional(),
  skippedAt: z.string().optional(),
  skippedBy: z.string().optional(),
  /** UUID for idempotent confirmations */
  idempotencyKey: z.string().optional(),
})
export type DoseOccurrence = z.infer<typeof DoseOccurrenceSchema>

// ---------------------------------------------------------------------------
// Input schemas for Cloud Functions
// ---------------------------------------------------------------------------

export const CreateMedicationInputSchema = z.object({
  circleId: z.string(),
  name: z.string().min(1).max(200),
  dosage: z.string().max(100),
  instructions: z.string().max(1000).optional(),
  schedule: MedicationScheduleSchema,
  timezone: z.string(),
})
export type CreateMedicationInput = z.infer<typeof CreateMedicationInputSchema>

export const UpdateMedicationInputSchema = z.object({
  circleId: z.string(),
  medicationId: z.string(),
  /** Must match current version for optimistic-lock */
  expectedVersion: z.number().int().min(1),
  name: z.string().min(1).max(200).optional(),
  dosage: z.string().max(100).optional(),
  instructions: z.string().max(1000).optional(),
  schedule: MedicationScheduleSchema.optional(),
})
export type UpdateMedicationInput = z.infer<typeof UpdateMedicationInputSchema>

export const ConfirmDoseInputSchema = z.object({
  circleId: z.string(),
  occurrenceId: z.string(),
  action: z.enum(['taken', 'skipped']),
  /** UUID — required for SafeDose Shield idempotency */
  idempotencyKey: z.string().uuid(),
})
export type ConfirmDoseInput = z.infer<typeof ConfirmDoseInputSchema>

export const CorrectDoseInputSchema = z.object({
  circleId: z.string(),
  occurrenceId: z.string(),
  correctedAction: z.enum(['taken', 'skipped']),
  reason: z.string().min(1).max(500),
  idempotencyKey: z.string().uuid(),
})
export type CorrectDoseInput = z.infer<typeof CorrectDoseInputSchema>

export const ReportUnconfirmedReasonInputSchema = z.object({
  circleId: z.string(),
  occurrenceId: z.string(),
  reason: WhyMissedReasonSchema,
  /** Required only for 'already_taken_not_recorded' */
  retrospectiveConfirmation: z
    .object({
      takenAt: z.string(),
      notes: z.string().max(500).optional(),
    })
    .optional(),
})
export type ReportUnconfirmedReasonInput = z.infer<typeof ReportUnconfirmedReasonInputSchema>
