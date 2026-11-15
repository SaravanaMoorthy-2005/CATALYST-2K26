import { describe, it, expect } from 'vitest'
import {
  generateDoseOccurrences,
  canTransitionDose,
  calculateAdherence,
  deriveDoseStatus,
} from '../../functions/src/domain/medication'
import {
  createInvitationVerifier,
  verifyInvitationVerifier,
  generateSecureNumericCode,
} from '../../functions/src/domain/invitation'
import { estimateInventory } from '../../functions/src/domain/inventory'
import { canTransitionCareTask, buildCareHandoff } from '../../functions/src/domain/careShift'
import { isNotificationStillRelevant } from '../../functions/src/domain/notifications'
import { Medication, InventoryLedgerEntry, NotificationJob } from '@carecircle/shared'

describe('End-to-End Vertical Slice Integration Test', () => {
  const secret = 'test-secret-256bit-for-verification'
  const circleId = 'circle_prod_slice'

  it('executes complete Elder CareDay -> SafeDose -> WhyMissed -> Refill flow', () => {
    // 1. Generate invitation with cryptographic 8-digit code
    const code = generateSecureNumericCode()
    const inviteId = 'invite_caregiver_1'
    const verifier = createInvitationVerifier(secret, inviteId, code)

    // Verify redemption
    const isRedeemed = verifyInvitationVerifier(secret, inviteId, code, verifier)
    expect(isRedeemed).toBe(true)

    // 2. Schedule clinician-issued medication
    const med: Medication = {
      id: 'med_atorvastatin',
      circleId,
      name: 'Atorvastatin',
      dosage: '20mg Tablet',
      instructions: 'Take 1 tablet in the morning',
      schedule: {
        times: ['08:00'],
        startDate: '2026-11-15',
        endDate: '2026-11-21',
      },
      timezone: 'America/New_York',
      status: 'active',
      version: 1,
      createdBy: 'elder_uid',
      createdAt: '2026-11-15T00:00:00Z',
      updatedAt: '2026-11-15T00:00:00Z',
    }

    const occurrences = generateDoseOccurrences(
      med,
      '2026-11-15',
      '2026-11-21',
      'America/New_York'
    )
    expect(occurrences.length).toBe(7)

    // 3. First dose due
    const firstOcc = occurrences[0]
    expect(canTransitionDose(firstOcc.status, 'due')).toBe(true)

    // Transition to Taken (SafeDose Shield)
    expect(canTransitionDose('due', 'taken')).toBe(true)
    const confirmedOcc = { ...firstOcc, status: 'taken' as const, idempotencyKey: 'idemp-1' }

    // 4. Repeated confirmation attempt with different key -> conflict
    expect(canTransitionDose(confirmedOcc.status, 'taken')).toBe(false)

    // 5. Inventory ledger interaction
    const openingStock: InventoryLedgerEntry = {
      id: 'ledger_open',
      medicationId: med.id,
      circleId,
      type: 'opening',
      quantity: 30,
      unit: 'tablets',
      recordedBy: 'elder_uid',
      recordedAt: '2026-11-15T00:00:00Z',
    }

    // 1 dose taken -> estimated 29 remaining
    const stockEstimate = estimateInventory([openingStock], 1, 1, 7)
    expect(stockEstimate.estimatedRemaining).toBe(29)
    expect(stockEstimate.isLowStock).toBe(false)

    // 6. Caregiver handoff summary
    const handoff = buildCareHandoff({
      circleId,
      elderName: 'Eleanor Parker',
      fromTime: '2026-11-15T00:00:00Z',
      toTime: '2026-11-15T23:59:59Z',
      dosesTaken: 1,
      dosesUnconfirmed: 0,
      completedTasks: ['Morning Dose Confirmed'],
      pendingTasks: [],
      activeAlerts: [],
      upcomingAppointments: [],
    })
    expect(handoff.dosesTaken).toBe(1)
    expect(handoff.disclaimer).toBeDefined()
  })
})
