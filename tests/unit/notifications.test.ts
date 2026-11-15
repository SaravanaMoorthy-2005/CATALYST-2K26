import { describe, it, expect } from 'vitest'
import {
  calculateRetryBackoff,
  isNotificationStillRelevant,
  renderEmailTemplate,
  sanitizeAuditMetadata,
} from '../../functions/src/domain/notifications'
import { NotificationJob } from '@carecircle/shared'

describe('Notification Domain Engine', () => {
  describe('calculateRetryBackoff', () => {
    it('applies exponential backoff with deterministic jitter', () => {
      // 15 * 2^0 + 2 = 17s
      expect(calculateRetryBackoff(0, 2)).toBe(17)
      // 15 * 2^1 + 2 = 32s
      expect(calculateRetryBackoff(1, 2)).toBe(32)
      // 15 * 2^2 + 2 = 62s
      expect(calculateRetryBackoff(2, 2)).toBe(62)
      // Capped at 300 + 0 = 300s
      expect(calculateRetryBackoff(10, 0)).toBe(300)
    })
  })

  describe('isNotificationStillRelevant', () => {
    const baseJob: NotificationJob = {
      id: 'job_1',
      circleId: 'c1',
      type: 'dose_upcoming',
      status: 'pending',
      dueAt: '2026-11-15T08:00:00Z',
      recipientUid: 'u1',
      recipientEmail: 'caregiver@example.com',
      referenceId: 'occ_1',
      referenceVersion: 1,
      channel: 'email',
      attempts: 0,
      maxAttempts: 3,
      createdAt: '',
    }

    it('returns false if recipient membership has been revoked or inactive', () => {
      expect(isNotificationStillRelevant(baseJob, 'due', false, true)).toBe(false)
    })

    it('returns false if recipient has withdrawn notification consent', () => {
      expect(isNotificationStillRelevant(baseJob, 'due', true, false)).toBe(false)
    })

    it('returns false if the dose is already taken, skipped, or cancelled (stale job)', () => {
      expect(isNotificationStillRelevant(baseJob, 'taken', true, true)).toBe(false)
      expect(isNotificationStillRelevant(baseJob, 'skipped', true, true)).toBe(false)
      expect(isNotificationStillRelevant(baseJob, 'cancelled', true, true)).toBe(false)
    })

    it('returns true if the dose is still pending/due and recipient is active', () => {
      expect(isNotificationStillRelevant(baseJob, 'due', true, true)).toBe(true)
      expect(isNotificationStillRelevant(baseJob, 'scheduled', true, true)).toBe(true)
    })
  })

  describe('renderEmailTemplate', () => {
    it('never leaks confidential medication names in subject line', () => {
      const email = renderEmailTemplate('dose_upcoming', {
        recipientEmail: 'user@example.com',
        elderName: 'Eleanor',
        medicationName: 'SecretDrug',
      })

      expect(email.subject).not.toContain('SecretDrug')
      expect(email.subject).toContain('Medication Reminder')
      expect(email.text).toBeDefined()
      expect(email.html).toBeDefined()
    })
  })

  describe('sanitizeAuditMetadata', () => {
    it('redacts tokens, passcodes, and cryptographic verifiers from logs', () => {
      const dirty = {
        elderName: 'Eleanor',
        code: '12345678',
        verifier: 'deadbeef1234',
        secretToken: 'supersecret',
        action: 'CONFIRM',
      }

      const clean = sanitizeAuditMetadata(dirty)

      expect(clean.elderName).toBe('Eleanor')
      expect(clean.action).toBe('CONFIRM')
      expect(clean.code).toBe('[REDACTED]')
      expect(clean.verifier).toBe('[REDACTED]')
      expect(clean.secretToken).toBe('[REDACTED]')
    })
  })
})
