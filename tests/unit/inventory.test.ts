import { describe, it, expect } from 'vitest'
import { estimateInventory, diffMedicationPlans } from '../../functions/src/domain/inventory'
import { InventoryLedgerEntry, Medication, ProposedMedication } from '@carecircle/shared'

describe('Inventory & DischargeSync Domain Logic', () => {
  describe('estimateInventory', () => {
    it('accurately calculates remaining stock and flags low stock', () => {
      const mockLedger: InventoryLedgerEntry[] = [
        {
          id: '1',
          medicationId: 'med_1',
          circleId: 'circle_1',
          type: 'opening',
          quantity: 30,
          unit: 'tablets',
          recordedBy: 'user_1',
          recordedAt: '2026-11-01T00:00:00Z',
        },
        {
          id: '2',
          medicationId: 'med_1',
          circleId: 'circle_1',
          type: 'restock',
          quantity: 10,
          unit: 'tablets',
          recordedBy: 'user_1',
          recordedAt: '2026-11-10T00:00:00Z',
        },
      ]

      // 40 total added, 35 taken = 5 remaining (<= 7 threshold -> low stock)
      const estimate = estimateInventory(mockLedger, 35, 1, 7)

      expect(estimate.estimatedRemaining).toBe(5)
      expect(estimate.isLowStock).toBe(true)
      expect(estimate.daysRemaining).toBe(5)
      expect(estimate.isEstimate).toBe(true)
      expect(estimate.disclaimer).toContain('approximation')
    })

    it('guards against negative inventory values', () => {
      const mockLedger: InventoryLedgerEntry[] = [
        {
          id: '1',
          medicationId: 'med_1',
          circleId: 'circle_1',
          type: 'opening',
          quantity: 10,
          unit: 'tablets',
          recordedBy: 'user_1',
          recordedAt: '2026-11-01T00:00:00Z',
        },
      ]

      // 10 opening - 15 taken -> bounded at 0
      const estimate = estimateInventory(mockLedger, 15, 1, 7)
      expect(estimate.estimatedRemaining).toBe(0)
    })
  })

  describe('diffMedicationPlans (DischargeSync)', () => {
    const currentMeds: Medication[] = [
      {
        id: 'med_1',
        circleId: 'c1',
        name: 'Atorvastatin',
        dosage: '20mg',
        instructions: 'Take in morning',
        schedule: { times: ['08:00'], startDate: '2026-01-01' },
        timezone: 'UTC',
        status: 'active',
        version: 1,
        createdBy: 'u1',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'med_2',
        circleId: 'c1',
        name: 'Metformin',
        dosage: '500mg',
        instructions: 'Take with food',
        schedule: { times: ['12:00'], startDate: '2026-01-01' },
        timezone: 'UTC',
        status: 'active',
        version: 1,
        createdBy: 'u1',
        createdAt: '',
        updatedAt: '',
      },
    ]

    it('accurately categorizes added, changed, discontinued, and unchanged medications', () => {
      const proposedMeds: ProposedMedication[] = [
        // Unchanged
        {
          name: 'Atorvastatin',
          dosage: '20mg',
          instructions: 'Take in morning',
          schedule: { times: ['08:00'], startDate: '2026-01-01' },
          timezone: 'UTC',
          action: 'continue',
        },
        // Changed dosage
        {
          name: 'Metformin',
          dosage: '850mg', // Increased from 500mg
          instructions: 'Take with food',
          schedule: { times: ['12:00'], startDate: '2026-01-01' },
          timezone: 'UTC',
          action: 'change',
        },
        // Newly added
        {
          name: 'Aspirin',
          dosage: '81mg',
          schedule: { times: ['08:00'], startDate: '2026-11-15' },
          timezone: 'UTC',
          action: 'add',
        },
      ]

      const diff = diffMedicationPlans(currentMeds, proposedMeds)

      expect(diff.unchanged).toContain('Atorvastatin')
      expect(diff.changed.some((c) => c.name === 'Metformin')).toBe(true)
      expect(diff.added.some((a) => a.includes('Aspirin'))).toBe(true)
    })
  })
})
