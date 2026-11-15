import { CareTaskStatus, CareHandoffReport } from '@carecircle/shared'

export function canTransitionCareTask(from: CareTaskStatus, to: CareTaskStatus): boolean {
  const transitions: Record<CareTaskStatus, CareTaskStatus[]> = {
    pending: ['accepted', 'declined', 'cancelled'],
    accepted: ['in_progress', 'declined', 'cancelled'],
    declined: ['pending', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  }
  return transitions[from]?.includes(to) ?? false
}

export function buildCareHandoff(params: {
  circleId: string
  elderName: string
  fromTime: string
  toTime: string
  dosesTaken: number
  dosesUnconfirmed: number
  completedTasks: string[]
  pendingTasks: string[]
  activeAlerts: string[]
  upcomingAppointments: string[]
}): CareHandoffReport {
  return {
    circleId: params.circleId,
    generatedAt: new Date().toISOString(),
    windowFrom: params.fromTime,
    windowTo: params.toTime,
    elderName: params.elderName,
    dosesTaken: params.dosesTaken,
    dosesUnconfirmed: params.dosesUnconfirmed,
    completedTasks: params.completedTasks,
    pendingTasks: params.pendingTasks,
    activeAlerts: params.activeAlerts,
    upcomingAppointments: params.upcomingAppointments,
    disclaimer:
      'Care Handoff Report is an administrative coordination summary reflecting entered records. Confirm critical patient needs directly with the attending care team.',
  }
}
