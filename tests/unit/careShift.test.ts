import { describe, it, expect } from 'vitest'
import { canTransitionCareTask, buildCareHandoff } from '../../functions/src/domain/careShift'

describe('CareShift Domain Logic', () => {
  describe('canTransitionCareTask', () => {
    it('allows valid task state transitions', () => {
      expect(canTransitionCareTask('pending', 'accepted')).toBe(true)
      expect(canTransitionCareTask('pending', 'declined')).toBe(true)
      expect(canTransitionCareTask('accepted', 'in_progress')).toBe(true)
      expect(canTransitionCareTask('in_progress', 'completed')).toBe(true)
    })

    it('rejects invalid or backward state transitions', () => {
      expect(canTransitionCareTask('completed', 'in_progress')).toBe(false)
      expect(canTransitionCareTask('completed', 'pending')).toBe(false)
      expect(canTransitionCareTask('cancelled', 'accepted')).toBe(false)
    })
  })

  describe('buildCareHandoff', () => {
    it('generates a redacted snapshot report with mandatory disclaimer', () => {
      const report = buildCareHandoff({
        circleId: 'circle_1',
        elderName: 'Eleanor Parker',
        fromTime: '2026-11-14T08:00:00Z',
        toTime: '2026-11-15T08:00:00Z',
        dosesTaken: 3,
        dosesUnconfirmed: 0,
        completedTasks: ['Morning Vitals'],
        pendingTasks: ['Evening Check'],
        activeAlerts: [],
        upcomingAppointments: ['Cardiology on Nov 16'],
      })

      expect(report.circleId).toBe('circle_1')
      expect(report.elderName).toBe('Eleanor Parker')
      expect(report.dosesTaken).toBe(3)
      expect(report.completedTasks).toContain('Morning Vitals')
      expect(report.disclaimer).toContain('administrative coordination summary')
    })
  })
})
