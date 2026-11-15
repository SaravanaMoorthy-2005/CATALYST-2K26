import { z } from 'zod'

export const WellbeingStatusSchema = z.enum(['good', 'needs_attention', 'unwell'])
export type WellbeingStatus = z.infer<typeof WellbeingStatusSchema>

export const WellbeingCheckInSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  elderUid: z.string(),
  status: WellbeingStatusSchema,
  notes: z.string().max(500).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  recordedAt: z.string(),
})
export type WellbeingCheckIn = z.infer<typeof WellbeingCheckInSchema>

export const RecordWellbeingCheckInInputSchema = z.object({
  circleId: z.string(),
  status: WellbeingStatusSchema,
  notes: z.string().max(500).optional(),
})
export type RecordWellbeingCheckInInput = z.infer<typeof RecordWellbeingCheckInInputSchema>

export const CarePassportSchema = z.object({
  elderName: z.string(),
  dateOfBirth: z.string(),
  primaryLanguage: z.string(),
  emergencyContacts: z.array(z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string(),
  })),
  allergies: z.array(z.string()),
  activeMedications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    scheduleSummary: z.string(),
    instructions: z.string().optional(),
  })),
  upcomingAppointments: z.array(z.object({
    title: z.string(),
    doctorName: z.string().optional(),
    appointmentAt: z.string(),
    location: z.string().optional(),
  })),
  generatedAt: z.string(),
  generatedBy: z.string(),
  disclaimer: z.string(),
})
export type CarePassport = z.infer<typeof CarePassportSchema>

export const SaveAppointmentCompanionInputSchema = z.object({
  circleId: z.string(),
  appointmentId: z.string(),
  companionQuestions: z.array(z.string().min(1).max(200)),
  notes: z.string().max(1000).optional(),
})
export type SaveAppointmentCompanionInput = z.infer<typeof SaveAppointmentCompanionInputSchema>
