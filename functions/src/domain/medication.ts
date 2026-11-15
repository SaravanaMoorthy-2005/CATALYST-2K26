import {
  Medication,
  DoseOccurrence,
  DoseStatus,
} from '@carecircle/shared'

/**
 * Creates deterministic ID for a dose occurrence:
 * `${medId}_v${version}_${localDate}_${localTime.replace(':', '')}`
 */
export function createOccurrenceId(
  medId: string,
  version: number,
  localDate: string,
  localTime: string
): string {
  return `${medId}_v${version}_${localDate}_${localTime.replace(':', '')}`
}

/**
 * Validates dose status transitions.
 * Terminal states: taken, skipped, cancelled (cannot transition directly; corrections are distinct audit events).
 */
export function canTransitionDose(from: DoseStatus, to: DoseStatus): boolean {
  const transitions: Record<DoseStatus, DoseStatus[]> = {
    scheduled: ['due', 'cancelled'],
    due: ['taken', 'skipped', 'unconfirmed', 'cancelled'],
    unconfirmed: ['taken', 'skipped', 'cancelled'],
    taken: [],
    skipped: [],
    cancelled: [],
  }
  return transitions[from]?.includes(to) ?? false
}

/**
 * Derives dynamic dose status given scheduled time, grace periods, and current clock.
 */
export function deriveDoseStatus(occ: DoseOccurrence, now: Date): DoseStatus {
  if (occ.status === 'taken' || occ.status === 'skipped' || occ.status === 'cancelled') {
    return occ.status
  }

  const dueTime = new Date(occ.dueAt).getTime()
  const nowTime = now.getTime()
  const diffMinutes = (nowTime - dueTime) / (1000 * 60)

  // Upcoming / Scheduled: more than 15 minutes before due time
  if (diffMinutes < -15) {
    return 'scheduled'
  }
  // Due: within window [-15m, +30m]
  if (diffMinutes >= -15 && diffMinutes <= 30) {
    return 'due'
  }
  // Unconfirmed: past due by > 30 minutes and not yet recorded
  return 'unconfirmed'
}

/**
 * Calculates medication adherence rate over a given list of occurrences.
 */
export function calculateAdherence(
  occurrences: DoseOccurrence[],
  window?: { from: Date; to: Date }
): {
  rate: number // 0 to 100 percentage
  taken: number
  skipped: number
  unconfirmed: number
  total: number
} {
  const filtered = window
    ? occurrences.filter((occ) => {
        const time = new Date(occ.dueAt).getTime()
        return time >= window.from.getTime() && time <= window.to.getTime()
      })
    : occurrences

  const total = filtered.length
  if (total === 0) {
    return { rate: 100, taken: 0, skipped: 0, unconfirmed: 0, total: 0 }
  }

  const taken = filtered.filter((o) => o.status === 'taken').length
  const skipped = filtered.filter((o) => o.status === 'skipped').length
  const unconfirmed = filtered.filter((o) => o.status === 'unconfirmed' || o.status === 'due').length

  const rate = Math.round((taken / total) * 100)
  return { rate, taken, skipped, unconfirmed, total }
}

/**
 * Generates rolling dose occurrences for a medication between two dates.
 * Injects clock for deterministic testing.
 */
export function generateDoseOccurrences(
  med: Medication,
  fromDateStr: string, // YYYY-MM-DD
  throughDateStr: string, // YYYY-MM-DD
  timezone: string,
  _clock: () => Date = () => new Date()
): DoseOccurrence[] {
  const occurrences: DoseOccurrence[] = []
  const { times, daysOfWeek, startDate, endDate } = med.schedule

  const current = new Date(`${fromDateStr}T00:00:00Z`)
  const end = new Date(`${throughDateStr}T23:59:59Z`)
  const scheduleStart = new Date(`${startDate}T00:00:00Z`)
  const scheduleEnd = endDate ? new Date(`${endDate}T23:59:59Z`) : null

  while (current <= end) {
    const yyyy = current.getUTCFullYear()
    const mm = String(current.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(current.getUTCDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`

    // Check if within medication active range
    if (current >= scheduleStart && (!scheduleEnd || current <= scheduleEnd)) {
      const dayOfWeek = current.getUTCDay()

      if (!daysOfWeek || daysOfWeek.includes(dayOfWeek)) {
        for (const timeStr of times) {
          const occId = createOccurrenceId(med.id, med.version, dateStr, timeStr)
          // Construct UTC ISO string representation
          const dueAt = `${dateStr}T${timeStr}:00.000Z`

          occurrences.push({
            id: occId,
            circleId: med.circleId,
            medicationId: med.id,
            medicationVersion: med.version,
            dueAt,
            localDate: dateStr,
            localTime: timeStr,
            timezone,
            status: 'scheduled',
          })
        }
      }
    }
    current.setUTCDate(current.getUTCDate() + 1)
  }

  return occurrences
}

/**
 * Reconciles occurrences when a medication schedule changes.
 * Returns occurrences to cancel (future unconfirmed/scheduled) and new ones to create.
 * Past taken/skipped occurrences are preserved unchanged.
 */
export function reconcileFutureOccurrences(
  oldOccurrences: DoseOccurrence[],
  newPlan: Medication,
  now: Date
): {
  toCancel: string[]
  toCreate: DoseOccurrence[]
} {
  const nowIso = now.toISOString()
  const todayStr = nowIso.slice(0, 10)

  // Cancel future occurrences that haven't been taken/skipped
  const toCancel = oldOccurrences
    .filter(
      (occ) =>
        occ.dueAt >= nowIso &&
        (occ.status === 'scheduled' || occ.status === 'due' || occ.status === 'unconfirmed')
    )
    .map((o) => o.id)

  // Generate 14 days of new occurrences starting from today
  const futureDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
  const futureDateStr = futureDate.toISOString().slice(0, 10)

  const toCreate = generateDoseOccurrences(
    newPlan,
    todayStr,
    futureDateStr,
    newPlan.timezone,
    () => now
  ).filter((occ) => occ.dueAt >= nowIso)

  return { toCancel, toCreate }
}
