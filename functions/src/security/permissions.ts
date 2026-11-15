import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { PermissionSet, Member } from '@carecircle/shared'

export async function assertOwnership(
  db: admin.firestore.Firestore,
  circleId: string,
  uid: string
): Promise<void> {
  const circleDoc = await db.collection('careCircles').doc(circleId).get()
  if (!circleDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Care circle not found.')
  }

  if (circleDoc.data()?.ownerUid !== uid) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Action restricted to care circle owner.'
    )
  }
}

export async function assertCarePermission(
  db: admin.firestore.Firestore,
  circleId: string,
  uid: string,
  permission: keyof PermissionSet
): Promise<Member> {
  // First check if user is the care circle owner (owner has all permissions)
  const circleDoc = await db.collection('careCircles').doc(circleId).get()
  if (!circleDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Care circle not found.')
  }

  const circleData = circleDoc.data()!
  if (circleData.ownerUid === uid) {
    return {
      uid,
      circleId,
      displayName: 'Owner',
      email: '',
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
      grantedBy: uid,
      grantedAt: circleData.createdAt,
    }
  }

  // Otherwise check active membership document
  const memberDoc = await db
    .collection('careCircles')
    .doc(circleId)
    .collection('members')
    .doc(uid)
    .get()

  if (!memberDoc.exists) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'User is not an active member of this care circle.'
    )
  }

  const member = memberDoc.data() as Member
  if (member.status !== 'active') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Care circle membership has been revoked or is inactive.'
    )
  }

  if (!member.permissions[permission]) {
    throw new functions.https.HttpsError(
      'permission-denied',
      `Missing required permission: ${permission}`
    )
  }

  return member
}
