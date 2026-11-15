import { NotificationJob, MailMessage, DoseStatus } from '@carecircle/shared'

/**
 * Checks if a scheduled notification job is still relevant immediately prior to delivery.
 * Avoids phantom reminder spam for already taken doses or cancelled appointments.
 */
export function isNotificationStillRelevant(
  job: NotificationJob,
  currentStatus: DoseStatus | string | null,
  isRecipientActiveMember: boolean,
  recipientConsent: boolean
): boolean {
  if (!isRecipientActiveMember || !recipientConsent) {
    return false
  }

  // Dose reminders
  if (
    job.type === 'dose_upcoming' ||
    job.type === 'dose_due' ||
    job.type === 'dose_unconfirmed' ||
    job.type === 'dose_escalation'
  ) {
    // If dose is already taken, skipped, or cancelled, reminder is stale
    if (
      currentStatus === 'taken' ||
      currentStatus === 'skipped' ||
      currentStatus === 'cancelled'
    ) {
      return false
    }
  }

  // Appointment reminders
  if (job.type === 'appointment_reminder') {
    if (currentStatus === 'cancelled' || currentStatus === 'completed') {
      return false
    }
  }

  return true
}

/**
 * Calculates exponential retry backoff with jitter.
 * Formula: min(300, 15 * 2^attempt) seconds + jitter
 */
export function calculateRetryBackoff(attempt: number, mockJitter?: number): number {
  const baseSeconds = Math.min(300, 15 * Math.pow(2, Math.max(0, attempt)))
  const jitter = mockJitter !== undefined ? mockJitter : Math.floor(Math.random() * 5)
  return baseSeconds + jitter
}

/**
 * Renders lock-screen safe, privacy-conscious email templates.
 * Never leaks sensitive drug names or diagnoses into subject lines.
 */
export function renderEmailTemplate(
  type: NotificationJob['type'],
  data: Record<string, string>
): MailMessage {
  const recipientEmail = data.recipientEmail || ''
  const elderName = data.elderName || 'Care Circle Member'

  switch (type) {
    case 'dose_upcoming':
      return {
        to: recipientEmail,
        subject: `CareCircle: Medication Reminder for ${elderName}`,
        text: `Hello,\n\nThis is a reminder that scheduled medication is due soon for ${elderName}.\n\nPlease open your CareCircle app to review details and confirm: https://carecircle.health\n\n— CareCircle Team`,
        html: `<div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
          <h2>CareCircle Medication Reminder</h2>
          <p>This is a reminder that scheduled medication is due soon for <strong>${elderName}</strong>.</p>
          <p>Please open CareCircle to review the schedule and log your confirmation.</p>
          <a href="https://carecircle.health" style="display: inline-block; background: #11141A; color: #FFF; padding: 12px 24px; border-radius: 999px; text-decoration: none;">Open CareCircle</a>
        </div>`,
      }

    case 'dose_unconfirmed':
      return {
        to: recipientEmail,
        subject: `CareCircle Notice: Dose Confirmation Pending for ${elderName}`,
        text: `Hello,\n\nA scheduled dose for ${elderName} is currently unconfirmed.\n\nPlease check in with ${elderName} and confirm in CareCircle: https://carecircle.health\n\n— CareCircle Team`,
        html: `<div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
          <h2>Dose Confirmation Pending</h2>
          <p>A scheduled dose for <strong>${elderName}</strong> has not yet been confirmed.</p>
          <p>Please check in and record the update in the CareCircle portal.</p>
          <a href="https://carecircle.health" style="display: inline-block; background: #11141A; color: #FFF; padding: 12px 24px; border-radius: 999px; text-decoration: none;">View CareDay</a>
        </div>`,
      }

    case 'dose_escalation':
      return {
        to: recipientEmail,
        subject: `CareCircle Escalation: Unconfirmed Care for ${elderName}`,
        text: `Important Care Update:\n\nA dose for ${elderName} remains unconfirmed after follow-up. As a designated caregiver, please review: https://carecircle.health\n\n— CareCircle Team`,
        html: `<div style="font-family: sans-serif; max-width: 600px; padding: 20px; border-left: 4px solid #FFF25C;">
          <h2>Caregiver Attention Required</h2>
          <p>A scheduled dose for <strong>${elderName}</strong> remains unconfirmed. Please coordinate with the care circle.</p>
          <a href="https://carecircle.health" style="display: inline-block; background: #11141A; color: #FFF; padding: 12px 24px; border-radius: 999px; text-decoration: none;">Open CarePulse</a>
        </div>`,
      }

    case 'appointment_reminder':
      return {
        to: recipientEmail,
        subject: `CareCircle: Upcoming Appointment for ${elderName}`,
        text: `Reminder: ${elderName} has an upcoming medical appointment on ${data.appointmentDate || 'the scheduled date'}.\n\nDetails: ${data.appointmentTitle || 'Medical Appointment'}\nLocation: ${data.location || 'See portal'}\n\nReview preparation questions in CareCircle: https://carecircle.health`,
        html: `<div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
          <h2>Upcoming Medical Appointment</h2>
          <p><strong>${elderName}</strong> has an appointment scheduled.</p>
          <p><strong>Visit:</strong> ${data.appointmentTitle || 'Medical Visit'}</p>
          <p><strong>When:</strong> ${data.appointmentDate || 'Upcoming'}</p>
          <p><strong>Location:</strong> ${data.location || 'See appointment companion'}</p>
          <a href="https://carecircle.health" style="display: inline-block; background: #11141A; color: #FFF; padding: 12px 24px; border-radius: 999px; text-decoration: none;">View Companion Checklist</a>
        </div>`,
      }

    case 'assistance_request':
      return {
        to: recipientEmail,
        subject: `CareCircle: Help Requested by ${elderName}`,
        text: `Assistance Request:\n\n${elderName} tapped "Need Help" in CareCircle.\nReason: ${data.kind || 'Assistance requested'}\nNote: ${data.note || 'None'}\n\nPlease check in: https://carecircle.health`,
        html: `<div style="font-family: sans-serif; max-width: 600px; padding: 20px; background: #F9F5F1; border-radius: 16px;">
          <h2>Assistance Requested</h2>
          <p><strong>${elderName}</strong> tapped "Need Help".</p>
          <p><strong>Kind:</strong> ${data.kind || 'Care assistance'}</p>
          ${data.note ? `<p><strong>Note:</strong> ${data.note}</p>` : ''}
          <a href="https://carecircle.health" style="display: inline-block; background: #11141A; color: #FFF; padding: 12px 24px; border-radius: 999px; text-decoration: none;">Respond Now</a>
        </div>`,
      }

    case 'low_stock':
      return {
        to: recipientEmail,
        subject: `CareCircle: Medication Low Stock Warning for ${elderName}`,
        text: `Refill Guardian Notice:\n\nSupply is running low for ${data.medicationName || 'a medication'} for ${elderName}.\nEstimated remaining: ${data.estimatedRemaining || 'low'} doses.\n\nPlease assign or complete the refill task: https://carecircle.health`,
        html: `<div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
          <h2>Refill Guardian Low Stock Notice</h2>
          <p>Supply is running low for <strong>${data.medicationName || 'medication'}</strong> for ${elderName}.</p>
          <p><strong>Estimated remaining:</strong> ${data.estimatedRemaining || 'Low'}</p>
          <a href="https://carecircle.health" style="display: inline-block; background: #11141A; color: #FFF; padding: 12px 24px; border-radius: 999px; text-decoration: none;">Open Refill Guardian</a>
        </div>`,
      }

    case 'invitation_code':
      return {
        to: recipientEmail,
        subject: `CareCircle: You are invited to join ${elderName}'s Care Circle`,
        text: `Hello,\n\nYou have been invited to join ${elderName}'s Care Circle as a ${data.role || 'caregiver'}.\n\nYour 8-digit verification code is: ${data.code || 'See invite'}\n\nThis code expires in 10 minutes.\n\nRedeem your invite here: https://carecircle.health/redeem-invite\n\n— CareCircle Team`,
        html: `<div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
          <h2>You've Been Invited to CareCircle</h2>
          <p>You have been invited to join <strong>${elderName}'s</strong> Care Circle as a <strong>${data.role || 'caregiver'}</strong>.</p>
          <p>Your one-time 8-digit access code is:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 16px; background: #EAF2FF; text-align: center; border-radius: 12px;">
            ${data.code}
          </div>
          <p style="color: #666; font-size: 13px;">This code is valid for 10 minutes. Do not share this code with anyone else.</p>
          <a href="https://carecircle.health/redeem-invite" style="display: inline-block; background: #11141A; color: #FFF; padding: 12px 24px; border-radius: 999px; text-decoration: none; margin-top: 12px;">Redeem Invitation</a>
        </div>`,
      }

    default:
      return {
        to: recipientEmail,
        subject: 'CareCircle Update',
        text: `You have an update in CareCircle: https://carecircle.health`,
        html: `<p>You have an update in CareCircle. <a href="https://carecircle.health">View Details</a></p>`,
      }
  }
}

/**
 * Strips tokens, passcodes, and direct PHI from audit logs.
 */
export function sanitizeAuditMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...metadata }
  const sensitiveKeys = ['code', 'password', 'token', 'verifier', 'secret', 'key']

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]'
    }
  }

  return sanitized
}
