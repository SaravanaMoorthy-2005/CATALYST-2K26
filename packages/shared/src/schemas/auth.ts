import { z } from 'zod'

export const RoleSchema = z.enum(['owner', 'caregiver', 'family'])
export type Role = z.infer<typeof RoleSchema>

export const MemberStatusSchema = z.enum(['active', 'revoked', 'pending'])
export type MemberStatus = z.infer<typeof MemberStatusSchema>

export const PermissionSetSchema = z.object({
  medication_read: z.boolean().default(true),
  medication_write: z.boolean().default(false),
  medication_confirm: z.boolean().default(false),
  appointments_read: z.boolean().default(true),
  appointments_write: z.boolean().default(false),
  adherence_read: z.boolean().default(true),
  alerts_read: z.boolean().default(true),
  alerts_ack: z.boolean().default(false),
  tasks_read: z.boolean().default(true),
  tasks_assign: z.boolean().default(false),
  tasks_complete: z.boolean().default(false),
  members_manage: z.boolean().default(false),
  audit_read: z.boolean().default(false),
  privacy_export: z.boolean().default(false),
  careNotes_read: z.boolean().default(true),
})
export type PermissionSet = z.infer<typeof PermissionSetSchema>

export const AccessibilitySettingsSchema = z.object({
  largeText: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  reducedMotion: z.boolean().default(false),
})
export type AccessibilitySettings = z.infer<typeof AccessibilitySettingsSchema>

export const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  photoURL: z.string().url().optional().nullable(),
  role: RoleSchema.default('owner'),
  timezone: z.string().default('America/New_York'),
  locale: z.enum(['en', 'ta', 'hi']).default('en'),
  accessibilitySettings: AccessibilitySettingsSchema.default({}),
  verifiedEmail: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type UserProfile = z.infer<typeof UserProfileSchema>

export const EmergencyContactSchema = z.object({
  name: z.string().min(1),
  relationship: z.string().min(1),
  phone: z.string().min(1),
  isPrimary: z.boolean().default(false),
})
export type EmergencyContact = z.infer<typeof EmergencyContactSchema>

export const ElderProfileSchema = z.object({
  name: z.string().min(1).max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  primaryLanguage: z.enum(['en', 'ta', 'hi']).default('en'),
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  conditions: z.array(z.string()).default([]),
  emergencyContacts: z.array(EmergencyContactSchema).default([]),
})
export type ElderProfile = z.infer<typeof ElderProfileSchema>

export const CareCircleSchema = z.object({
  id: z.string(),
  ownerUid: z.string(),
  displayName: z.string().min(1).max(100),
  elderProfile: ElderProfileSchema,
  timezone: z.string().default('America/New_York'),
  settings: z.object({
    allowFamilyInvite: z.boolean().default(false),
    enableQuietHours: z.boolean().default(true),
    quietHoursStart: z.string().default('22:00'),
    quietHoursEnd: z.string().default('07:00'),
  }).default({}),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type CareCircle = z.infer<typeof CareCircleSchema>

export const MemberSchema = z.object({
  uid: z.string(),
  circleId: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  role: RoleSchema,
  status: MemberStatusSchema,
  permissions: PermissionSetSchema,
  grantedBy: z.string(),
  grantedAt: z.string(),
  revokedAt: z.string().optional(),
})
export type Member = z.infer<typeof MemberSchema>

export const InvitationStatusSchema = z.enum(['pending', 'redeemed', 'expired', 'revoked', 'locked'])
export type InvitationStatus = z.infer<typeof InvitationStatusSchema>

export const InvitationSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  intendedEmail: z.string().email(),
  role: RoleSchema,
  permissions: PermissionSetSchema,
  verifier: z.string(), // HMAC-SHA-256 verifier, never plaintext code
  status: InvitationStatusSchema,
  attempts: z.number().int().nonnegative().default(0),
  maxAttempts: z.number().int().default(5),
  expiresAt: z.string(),
  createdAt: z.string(),
  invitedBy: z.string(),
})
export type Invitation = z.infer<typeof InvitationSchema>

// Cloud function input schemas
export const CreateCareCircleInputSchema = z.object({
  displayName: z.string().min(1).max(100),
  elderProfile: ElderProfileSchema,
  timezone: z.string().default('America/New_York'),
})
export type CreateCareCircleInput = z.infer<typeof CreateCareCircleInputSchema>

export const UpdateCareProfileInputSchema = z.object({
  circleId: z.string(),
  elderProfile: ElderProfileSchema.partial(),
})
export type UpdateCareProfileInput = z.infer<typeof UpdateCareProfileInputSchema>

export const CreateInvitationInputSchema = z.object({
  circleId: z.string(),
  intendedEmail: z.string().email(),
  role: RoleSchema,
  permissions: PermissionSetSchema.partial().optional(),
})
export type CreateInvitationInput = z.infer<typeof CreateInvitationInputSchema>

export const RedeemInvitationInputSchema = z.object({
  invitationId: z.string(),
  code: z.string().regex(/^\d{8}$/, 'Code must be exactly 8 digits'),
})
export type RedeemInvitationInput = z.infer<typeof RedeemInvitationInputSchema>

export const SetMemberPermissionsInputSchema = z.object({
  circleId: z.string(),
  targetUid: z.string(),
  permissions: PermissionSetSchema,
})
export type SetMemberPermissionsInput = z.infer<typeof SetMemberPermissionsInputSchema>

export const RevokeMemberInputSchema = z.object({
  circleId: z.string(),
  targetUid: z.string(),
  reason: z.string().optional(),
})
export type RevokeMemberInput = z.infer<typeof RevokeMemberInputSchema>
