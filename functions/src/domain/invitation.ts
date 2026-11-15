import * as crypto from 'crypto'

/**
 * Normalizes email address for consistent comparison and verification.
 */
export function normalizeInviteeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Generates an 8-digit cryptographically random numeric code.
 * Uses crypto.randomInt for uniform distribution without modulo bias.
 */
export function generateSecureNumericCode(): string {
  const codeInt = crypto.randomInt(10000000, 100000000)
  return codeInt.toString()
}

/**
 * Creates HMAC-SHA-256 verifier for an invitation.
 * Stores verifier server-side; NEVER stores raw plaintext code.
 */
export function createInvitationVerifier(secret: string, inviteId: string, code: string): string {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(`${inviteId}:${code.trim()}`)
  return hmac.digest('hex')
}

/**
 * Verifies code against stored verifier in constant time to prevent timing attacks.
 */
export function verifyInvitationVerifier(
  secret: string,
  inviteId: string,
  code: string,
  storedVerifier: string
): boolean {
  if (!code || !storedVerifier) return false
  const calculated = createInvitationVerifier(secret, inviteId, code)

  const calcBuf = Buffer.from(calculated, 'hex')
  const storedBuf = Buffer.from(storedVerifier, 'hex')

  if (calcBuf.length !== storedBuf.length) {
    return false
  }

  return crypto.timingSafeEqual(calcBuf, storedBuf)
}
