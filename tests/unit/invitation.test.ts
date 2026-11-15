import { describe, it, expect } from 'vitest'
import {
  generateSecureNumericCode,
  createInvitationVerifier,
  verifyInvitationVerifier,
  normalizeInviteeEmail,
} from '../../functions/src/domain/invitation'

describe('Invitation Cryptography & Security', () => {
  const secret = 'test-secret-hmac-32bytes-for-unit-testing!'
  const inviteId = 'invitation_test_123'

  describe('generateSecureNumericCode', () => {
    it('generates an 8-digit numeric string', () => {
      const code = generateSecureNumericCode()
      expect(code).toMatch(/^\d{8}$/)
      expect(parseInt(code, 10)).toBeGreaterThanOrEqual(10000000)
      expect(parseInt(code, 10)).toBeLessThan(100000000)
    })
  })

  describe('normalizeInviteeEmail', () => {
    it('trims whitespace and converts to lowercase', () => {
      expect(normalizeInviteeEmail('  CareGiver@Example.COM ')).toBe('caregiver@example.com')
    })
  })

  describe('createInvitationVerifier & verifyInvitationVerifier', () => {
    it('verifies valid code in constant-time and rejects invalid codes', () => {
      const code = '12345678'
      const verifier = createInvitationVerifier(secret, inviteId, code)

      // Valid match
      expect(verifyInvitationVerifier(secret, inviteId, code, verifier)).toBe(true)

      // Incorrect code
      expect(verifyInvitationVerifier(secret, inviteId, '87654321', verifier)).toBe(false)

      // Different inviteId
      expect(verifyInvitationVerifier(secret, 'other_invite', code, verifier)).toBe(false)

      // Wrong secret
      expect(verifyInvitationVerifier('wrong-secret', inviteId, code, verifier)).toBe(false)
    })
  })
})
