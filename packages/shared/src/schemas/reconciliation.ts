import { z } from 'zod'
import { MedicationScheduleSchema } from './medication'

export const ProposedMedicationSchema = z.object({
  name: z.string().min(1).max(200),
  dosage: z.string().max(100),
  instructions: z.string().max(1000).optional(),
  schedule: MedicationScheduleSchema,
  timezone: z.string(),
  action: z.enum(['add', 'change', 'discontinue', 'continue']),
})
export type ProposedMedication = z.infer<typeof ProposedMedicationSchema>

export const ReconciliationProposalStatusSchema = z.enum([
  'draft',
  'pending_review',
  'approved',
  'rejected',
])
export type ReconciliationProposalStatus = z.infer<typeof ReconciliationProposalStatusSchema>

export const ReconciliationProposalSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  status: ReconciliationProposalStatusSchema,
  hospitalOrClinician: z.string().max(200).optional(),
  visitDate: z.string().optional(),
  proposedMedications: z.array(ProposedMedicationSchema),
  diffSummary: z.object({
    added: z.array(z.string()),
    changed: z.array(z.object({ name: z.string(), changes: z.string() })),
    discontinued: z.array(z.string()),
    unchanged: z.array(z.string()),
  }),
  sourceNote: z.string().max(1000).optional(),
  reviewedBy: z.string().optional(),
  reviewedByName: z.string().optional(),
  reviewedAt: z.string().optional(),
  rejectionReason: z.string().optional(),
  version: z.number().int().min(1),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type ReconciliationProposal = z.infer<typeof ReconciliationProposalSchema>

export const CreateReconciliationProposalInputSchema = z.object({
  circleId: z.string(),
  hospitalOrClinician: z.string().max(200).optional(),
  visitDate: z.string().optional(),
  proposedMedications: z.array(ProposedMedicationSchema),
  sourceNote: z.string().max(1000).optional(),
})
export type CreateReconciliationProposalInput = z.infer<typeof CreateReconciliationProposalInputSchema>

export const ApproveReconciliationInputSchema = z.object({
  circleId: z.string(),
  proposalId: z.string(),
  expectedVersion: z.number().int().min(1),
  confirmationNote: z.string().max(500).optional(),
})
export type ApproveReconciliationInput = z.infer<typeof ApproveReconciliationInputSchema>

export const RejectReconciliationInputSchema = z.object({
  circleId: z.string(),
  proposalId: z.string(),
  expectedVersion: z.number().int().min(1),
  reason: z.string().min(1).max(500),
})
export type RejectReconciliationInput = z.infer<typeof RejectReconciliationInputSchema>
