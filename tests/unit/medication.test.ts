import { describe, it, expect } from 'vitest'
import {
  generateDoseOccurrences,
  createOccurrenceId,
  canTransitionDose,
  deriveDoseStatus,
  calculateAdherence,
  reconcileFutureOccurrences,
} from '../../functions/src/domain/medication'
import { Medication, DoseOccurrence } from '@carecircle/shared'

describe('Medication Domain Logic', () => {
  const sampleMed: Medication = {
    id: 'med_test_1',
    circleId: 'circle_1',
    name: 'Atorvastatin',
    dosage: '20mg Tablet',
    instructions: 'Take 1 tablet in morning with water',
    schedule: {
      times: ['08:00', '20:00'],
      startDate: '2026-11-15',
      endDate: '2026-11-17',
    },
    timezone: 'America/New_York',
    status: 'active',
    version: 1,
    createdBy: 'user_1',
    createdAt: '2026-11-15T00:00:00Z',
    updatedAt: '2026-11-15T00:00:00Z',
  }

  describe('createOccurrenceId', () => {
    it('creates deterministic, unambiguous occurrence IDs', () => {
      const id1 = createOccurrenceId('med_1', 1, '2026-11-15', '08:00')
      const id2 = createOccurrenceId('med_1', 1, '2026-11-15', '08:00')
      const id3 = createOccurrenceId('med_1', 2, '2026-11-15', '08:00')

      expect(id1).toBe('med_1_v1_2026-11-15_0800')
      expect(id1).toBe(id2)
      expect(id1).not.toBe(id3)
    })
  })

  describe('generateDoseOccurrences', () => {
    it('generates twice daily occurrences across active date range', () => {
      const occs = generateDoseOccurrences(
        sampleMed,
        '2026-11-15',
        '2026-11-17',
        'America/New_York'
      )

      // 3 days * 2 times per day = 6 occurrences
      expect(occs.length).toBe(6)
      expect(occs[0].localDate).toBe('2026-11-15')
      expect(occs[0].localTime).toBe('08:00')
      expect(occs[1].localTime).toBe('20:00')
      expect(occs[5].localDate).toBe('2026-11-17')
      expect(occs[5].localTime).toBe('20:00')
    })

    it('filters by specific days of week when configured', () => {
      const weekdayMed: Medication = {
        ...sampleMed,
        schedule: {
          times: ['09:00'],
          daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
          startDate: '2026-11-15', // Sunday (0)
          endDate: '2026-11-21',
        },
      }

      const occs = generateDoseOccurrences(
        weekdayMed,
        '2026-11-15',
        '2026-11-21',
        'America/New_York'
      )

      // Mon (16), Wed (18), Fri (20) = 3 doses
      expect(occs.length).toBe(3)
      expect(occs.map((o) => o.localDate)).toEqual([
        '2026-11-16',
        '2026-11-18',
        '2026-11-20',
      ])
    })
  })

  describe('canTransitionDose', () => {
    it('permits valid transitions from due to taken or skipped', () => {
      expect(canTransitionDose('due', 'taken')).toBe(true)
      expect(canTransitionDose('due', 'skipped')).toBe(true)
      expect(canTransitionDose('due', 'unconfirmed')).toBe(true)
      expect(canTransitionDose('unconfirmed', 'taken')).toBe(true)
      expect(canTransitionDose('scheduled', 'due')).toBe(true)
    })

    it('rejects illegal transitions from terminal states', () => {
      // Once taken, cannot be flipped directly to skipped (requires audited correction)
      expect(canTransitionDose('taken', 'skipped')).toBe(false)
      expect(canTransitionDose('taken', 'due')).toBe(false)
      expect(canTransitionDose('skipped', 'taken')).toBe(false)
      expect(canTransitionDose('cancelled', 'taken')).toBe(false)
    })
  })

  describe('deriveDoseStatus', () => {
    const baseOcc: DoseOccurrence = {
      id: 'occ_1',
      circleId: 'circle_1',
      medicationId: 'med_1',
      medicationVersion: 1,
      dueAt: '2026-11-15T08:00:00.000Z',
      localDate: '2026-11-15',
      localTime: '08:00',
      timezone: 'UTC',
      status: 'scheduled',
    }

    it('returns scheduled if more than 15 minutes before due time', () => {
      const now = new Date('2026-11-15T07:30:00.000Z')
      expect(deriveDoseStatus(baseOcc, now)).toBe('scheduled')
    })

    it('returns due within the 15-minute leading window and 30-minute grace period', () => {
      const leading = new Date('2026-11-15T07:50:00.000Z')
      const exact = new Date('2026-11-15T08:00:00.000Z')
      const trailing = new Date('2026-11-15T08:25:00.000Z')

      expect(deriveDoseStatus(baseOcc, leading)).toBe('due')
      expect(deriveDoseStatus(baseOcc, exact)).toBe('due')
      expect(deriveDoseStatus(baseOcc, trailing)).toBe('due')
    })

    it('returns unconfirmed when more than 30 minutes past due', () => {
      const late = new Date('2026-11-15T08:45:00.000Z')
      expect(deriveDoseStatus(baseOcc, late)).toBe('unconfirmed')
    })

    it('preserves terminal status regardless of time', () => {
      const takenOcc: DoseOccurrence = { ...baseOcc, status: 'taken' }
      const late = new Date('2026-11-15T12:00:00.000Z')
      expect(deriveDoseStatus(takenOcc, late)).toBe('taken')
    })
  })

  describe('calculateAdherence', () => {
    it('accurately computes percentage adherence rate', () => {
      const mockList: DoseOccurrence[] = [
        { ...sampleMed, id: '1', dueAt: '2026-11-15T08:00:00Z', status: 'taken' } as any,
        { ...sampleMed, id: '2', dueAt: '2026-11-15T12:00:00Z', status: 'taken' } as any,
        { ...sampleMed, id: '3', dueAt: '2026-11-15T16:00:00Z', status: 'skipped' } as any,
        { ...sampleMed, id: '4', dueAt: '2026-11-15T20:00:00Z', status: 'unconfirmed' } as any,
      ]

      const adherence = calculateAdherence(mockList)
      expect(adherence.total).toBe(4)
      expect(adherence.taken).toBe(2)
      expect(adherence.skipped).toBe(1)
      expect(adherence.unconfirmed).toBe(1)
      expect(adherence.rate).toBe(50) // 2 / 4 = 50%
    })

    it('returns 100% adherence when occurrences list is empty', () => {
      const adherence = calculateAdherence([])
      expect(adherence.rate).toBe(100)
    })
  })

  describe('reconcileFutureOccurrences', () => {
    it('cancels only future unconfirmed occurrences and preserves taken history', () => {
      const now = new Date('2026-11-15T10:00:00.000Z')

      const existing: DoseOccurrence[] = [
        // Past taken dose - MUST BE PRESERVED
        {
          id: 'past_taken',
          circleId: 'circle_1',
          medicationId: sampleMed.id,
          medicationVersion: 1,
          dueAt: '2026-11-15T08:00:00.000Z',
          localDate: '2026-11-15',
          localTime: '08:00',
          timezone: 'UTC',
          status: 'taken',
        },
        // Future scheduled dose - MUST BE CANCELLED
        {
          id: 'future_scheduled',
          circleId: 'circle_1',
          medicationId: sampleMed.id,
          medicationVersion: 1,
          dueAt: '2026-11-15T20:00:00.000Z',
          localDate: '2026-11-15',
          localTime: '20:00',
          timezone: 'UTC',
          status: 'scheduled',
        },
      ]

      const newPlan: Medication = {
        ...sampleMed,
        version: 2,
        schedule: {
          times: ['21:00'], // Time changed
          startDate: '2026-11-15',
        },
      }

      const { toCancel, toCreate } = reconcileFutureOccurrences(existing, newPlan, now)

      expect(toCancel).toContain('future_scheduled')
      expect(toCancel).not.toContain('past_taken')
      expect(toCreate.length).toBeGreaterThan(0)
      expect(toCreate.every((o) => o.medicationVersion === 2)).toBe(true)
    })
  })
})
