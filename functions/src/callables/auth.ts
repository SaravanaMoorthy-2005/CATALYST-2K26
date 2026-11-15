import { defineCallable, HttpsError } from '../utils/callable'
import * as admin from 'firebase-admin'
import {
  CreateCareCircleInputSchema,
  UpdateCareProfileInputSchema,
  CreateInvitationInputSchema,
  RedeemInvitationInputSchema,
  SetMemberPermissionsInputSchema,
  RevokeMemberInputSchema,
  Invitation,
} from '@carecircle/shared'
import {
  generateSecureNumericCode,
  createInvitationVerifier,
  verifyInvitationVerifier,
  normalizeInviteeEmail,
} from '../domain/invitation'
import { assertOwnership } from '../security/permissions'
import { getMailTransport } from '../mail/transport'
import { renderEmailTemplate } from '../domain/notifications'

const db = admin.firestore()

export const createCareCircle = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CreateCareCircleInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { displayName, elderProfile, timezone } = parsed.data
  const circleRef = db.collection('careCircles').doc()
  const circleId = circleRef.id
  const now = new Date().toISOString()

  await db.runTransaction(async (t) => {
    // 1. Create care circle
    t.set(circleRef, {
      id: circleId,
      ownerUid: context.auth!.uid,
      displayName,
      elderProfile,
      timezone,
      settings: {
        allowFamilyInvite: false,
        enableQuietHours: true,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
      },
      createdAt: now,
      updatedAt: now,
    })

    // 2. Add creator as owner member
    const memberRef = circleRef.collection('members').doc(context.auth!.uid)
    t.set(memberRef, {
      uid: context.auth!.uid,
      circleId,
      displayName: elderProfile.name,
      email: context.auth!.token.email || '',
      role: 'owner',
      status: 'active',
      permissions: {
        medication_read: true,
        medication_write: true,
        medication_confirm: true,
        appointments_read: true,
        appointments_write: true,
        adherence_read: true,
        alerts_read: true,
        alerts_ack: true,
        tasks_read: true,
        tasks_assign: true,
        tasks_complete: true,
        members_manage: true,
        audit_read: true,
        privacy_export: true,
        careNotes_read: true,
      },
      grantedBy: context.auth!.uid,
      grantedAt: now,
    })

    // 3. Audit log
    const auditRef = circleRef.collection('auditLogs').doc()
    t.set(auditRef, {
      action: 'CARE_CIRCLE_CREATED',
      actorUid: context.auth!.uid,
      timestamp: now,
      metadata: { displayName, elderName: elderProfile.name },
    })
  })

  return { circleId }
})

export const updateCareProfile = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = UpdateCareProfileInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, elderProfile } = parsed.data
  await assertOwnership(db, circleId, context.auth.uid)

  const circleRef = db.collection('careCircles').doc(circleId)
  await circleRef.update({
    elderProfile,
    updatedAt: new Date().toISOString(),
  })

  return { success: true }
})

export const createInvitation = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = CreateInvitationInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, intendedEmail, role, permissions } = parsed.data
  await assertOwnership(db, circleId, context.auth.uid)

  const normalizedEmail = normalizeInviteeEmail(intendedEmail)
  const inviteRef = db.collection('invitations').doc()
  const inviteId = inviteRef.id

  // Cryptographically random 8-digit numeric code
  const rawCode = generateSecureNumericCode()
  const secret = process.env.INVITATION_HMAC_SECRET || 'carecircle-dev-secret-key-32bytes!'
  const verifier = createInvitationVerifier(secret, inviteId, rawCode)

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString() // 10 minutes

  // Default permission template by role
  const defaultPermissions = {
    medication_read: true,
    medication_write: role === 'caregiver',
    medication_confirm: true,
    appointments_read: true,
    appointments_write: role === 'caregiver',
    adherence_read: true,
    alerts_read: true,
    alerts_ack: role === 'caregiver',
    tasks_read: true,
    tasks_assign: role === 'caregiver',
    tasks_complete: true,
    members_manage: false,
    audit_read: false,
    privacy_export: false,
    careNotes_read: true,
    ...permissions,
  }

  const inviteDocData: Invitation = {
    id: inviteId,
    circleId,
    intendedEmail: normalizedEmail,
    role,
    permissions: defaultPermissions,
    verifier, // NEVER store rawCode
    status: 'pending',
    attempts: 0,
    maxAttempts: 5,
    expiresAt,
    createdAt: now.toISOString(),
    invitedBy: context.auth.uid,
  }

  await inviteRef.set(inviteDocData)

  // Send invitation email with raw code directly to the invitee
  const circleSnap = await db.collection('careCircles').doc(circleId).get()
  const elderName = circleSnap.data()?.elderProfile?.name || 'Care Circle'

  const mailTransport = getMailTransport()
  await mailTransport.send(
    renderEmailTemplate('invitation_code', {
      recipientEmail: normalizedEmail,
      elderName,
      role,
      code: rawCode,
    })
  )

  // Audit log (never log rawCode)
  await db
    .collection('careCircles')
    .doc(circleId)
    .collection('auditLogs')
    .add({
      action: 'INVITATION_ISSUED',
      actorUid: context.auth.uid,
      timestamp: now.toISOString(),
      metadata: { inviteId, intendedEmail: normalizedEmail, role },
    })

  // Return invitationId, expiresAt, and deliveryStatus. NEVER RETURN rawCode!
  return {
    invitationId: inviteId,
    expiresAt,
    deliveryStatus: 'queued',
  }
})

export const redeemInvitation = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const callerEmail = context.auth.token.email
  if (!callerEmail) {
    throw new HttpsError(
      'failed-precondition',
      'User must have a verified email on their account to redeem an invitation.'
    )
  }

  const parsed = RedeemInvitationInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { invitationId, code } = parsed.data
  const inviteRef = db.collection('invitations').doc(invitationId)
  const secret = process.env.INVITATION_HMAC_SECRET || 'carecircle-dev-secret-key-32bytes!'

  return await db.runTransaction(async (t) => {
    const inviteSnap = await t.get(inviteRef)
    if (!inviteSnap.exists) {
      throw new HttpsError('not-found', 'Invitation not found.')
    }

    const invite = inviteSnap.data() as Invitation

    // Check status
    if (invite.status !== 'pending') {
      throw new HttpsError(
        'failed-precondition',
        `Invitation is already ${invite.status}.`
      )
    }

    // Check expiration
    if (new Date(invite.expiresAt).getTime() <= Date.now()) {
      t.update(inviteRef, { status: 'expired' })
      throw new HttpsError('deadline-exceeded', 'Invitation code has expired.')
    }

    // Check rate-limit / attempts budget
    if (invite.attempts >= invite.maxAttempts) {
      t.update(inviteRef, { status: 'locked' })
      throw new HttpsError(
        'resource-exhausted',
        'Maximum verification attempts exceeded. Invitation is locked.'
      )
    }

    // Check email binding
    if (normalizeInviteeEmail(callerEmail) !== normalizeInviteeEmail(invite.intendedEmail)) {
      throw new HttpsError(
        'permission-denied',
        'Signed-in email does not match the invitation email.'
      )
    }

    // Constant-time HMAC comparison
    const isValid = verifyInvitationVerifier(secret, invitationId, code, invite.verifier)

    if (!isValid) {
      const nextAttempts = invite.attempts + 1
      t.update(inviteRef, {
        attempts: nextAttempts,
        status: nextAttempts >= invite.maxAttempts ? 'locked' : 'pending',
      })
      throw new HttpsError(
        'invalid-argument',
        `Incorrect verification code. ${invite.maxAttempts - nextAttempts} attempts remaining.`
      )
    }

    // Atomic redemption: grant membership & mark invitation redeemed
    const memberRef = db
      .collection('careCircles')
      .doc(invite.circleId)
      .collection('members')
      .doc(context.auth!.uid)

    const now = new Date().toISOString()

    t.set(memberRef, {
      uid: context.auth!.uid,
      circleId: invite.circleId,
      displayName: context.auth!.token.name || callerEmail.split('@')[0],
      email: callerEmail,
      role: invite.role,
      status: 'active',
      permissions: invite.permissions,
      grantedBy: invite.invitedBy,
      grantedAt: now,
    })

    t.update(inviteRef, {
      status: 'redeemed',
      redeemedBy: context.auth!.uid,
      redeemedAt: now,
    })

    // Audit log
    const auditRef = db
      .collection('careCircles')
      .doc(invite.circleId)
      .collection('auditLogs')
      .doc()

    t.set(auditRef, {
      action: 'INVITATION_REDEEMED',
      actorUid: context.auth!.uid,
      timestamp: now,
      metadata: { invitationId, role: invite.role },
    })

    return {
      circleId: invite.circleId,
      membershipStatus: 'active',
      role: invite.role,
    }
  })
})

export const revokeInvitation = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const { invitationId } = data
  if (!invitationId) {
    throw new HttpsError('invalid-argument', 'invitationId is required.')
  }

  const inviteRef = db.collection('invitations').doc(invitationId)
  const inviteSnap = await inviteRef.get()
  if (!inviteSnap.exists) {
    throw new HttpsError('not-found', 'Invitation not found.')
  }

  const invite = inviteSnap.data() as Invitation
  await assertOwnership(db, invite.circleId, context.auth.uid)

  await inviteRef.update({
    status: 'revoked',
    revokedAt: new Date().toISOString(),
  })

  return { success: true }
})

export const setMemberPermissions = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = SetMemberPermissionsInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, targetUid, permissions } = parsed.data
  await assertOwnership(db, circleId, context.auth.uid)

  const memberRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('members')
    .doc(targetUid)

  await memberRef.update({
    permissions,
    updatedAt: new Date().toISOString(),
  })

  return { success: true }
})

export const revokeMember = defineCallable(async (data, context) => {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.')
  }

  const parsed = RevokeMemberInputSchema.safeParse(data)
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.message)
  }

  const { circleId, targetUid, reason } = parsed.data
  await assertOwnership(db, circleId, context.auth.uid)

  const memberRef = db
    .collection('careCircles')
    .doc(circleId)
    .collection('members')
    .doc(targetUid)

  const now = new Date().toISOString()
  await memberRef.update({
    status: 'revoked',
    revokedAt: now,
    revocationReason: reason || 'Revoked by owner',
  })

  // Cancel any pending notification jobs destined for this user
  const jobsSnap = await db
    .collection('notificationJobs')
    .where('circleId', '==', circleId)
    .where('recipientUid', '==', targetUid)
    .where('status', '==', 'pending')
    .get()

  const batch = db.batch()
  jobsSnap.docs.forEach((doc) => {
    batch.update(doc.ref, { status: 'cancelled', cancelledReason: 'Member revoked' })
  })
  await batch.commit()

  // Audit log
  await db
    .collection('careCircles')
    .doc(circleId)
    .collection('auditLogs')
    .add({
      action: 'MEMBER_REVOKED',
      actorUid: context.auth.uid,
      timestamp: now,
      metadata: { targetUid, reason },
    })

  return { success: true }
})
