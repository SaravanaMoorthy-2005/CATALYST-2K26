import { z } from 'zod'

export const AppointmentStatusSchema = z.enum([
  'scheduled',
  'completed',
  'cancelled',
  'rescheduled',
])
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>

export const AppointmentSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  title: z.string().min(1).max(200),
  doctorName: z.string().max(200).optional(),
  specialty: z.string().max(100).optional(),
  location: z.string().max(300).optional(),
  appointmentAt: z.string(), // UTC ISO
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  localTime: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string(),
  status: AppointmentStatusSchema,
  notes: z.string().max(1000).optional(),
  companionQuestions: z.array(z.string()).default([]),
  version: z.number().int().min(1),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Appointment = z.infer<typeof AppointmentSchema>

export const CreateAppointmentInputSchema = z.object({
  circleId: z.string(),
  title: z.string().min(1).max(200),
  doctorName: z.string().max(200).optional(),
  specialty: z.string().max(100).optional(),
  location: z.string().max(300).optional(),
  appointmentAt: z.string(),
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  localTime: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string(),
  notes: z.string().max(1000).optional(),
  companionQuestions: z.array(z.string()).optional(),
})
export type CreateAppointmentInput = z.infer<typeof CreateAppointmentInputSchema>

export const UpdateAppointmentInputSchema = z.object({
  circleId: z.string(),
  appointmentId: z.string(),
  expectedVersion: z.number().int().min(1),
  title: z.string().min(1).max(200).optional(),
  doctorName: z.string().max(200).optional(),
  specialty: z.string().max(100).optional(),
  location: z.string().max(300).optional(),
  appointmentAt: z.string().optional(),
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  localTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  notes: z.string().max(1000).optional(),
  companionQuestions: z.array(z.string()).optional(),
})
export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentInputSchema>

export const RescheduleAppointmentInputSchema = z.object({
  circleId: z.string(),
  appointmentId: z.string(),
  expectedVersion: z.number().int().min(1),
  appointmentAt: z.string(),
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  localTime: z.string().regex(/^\d{2}:\d{2}$/),
  reason: z.string().max(500).optional(),
})
export type RescheduleAppointmentInput = z.infer<typeof RescheduleAppointmentInputSchema>

export const CancelAppointmentInputSchema = z.object({
  circleId: z.string(),
  appointmentId: z.string(),
  expectedVersion: z.number().int().min(1),
  reason: z.string().max(500).optional(),
})
export type CancelAppointmentInput = z.infer<typeof CancelAppointmentInputSchema>
