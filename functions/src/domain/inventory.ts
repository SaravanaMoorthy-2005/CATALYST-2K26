import {
  InventoryLedgerEntry,
  Medication,
  ProposedMedication,
} from '@carecircle/shared'

export interface InventoryEstimate {
  estimatedRemaining: number
  unit: string
  isEstimate: true
  disclaimer: string
  isLowStock: boolean
  daysRemaining: number
}

/**
 * Estimates remaining inventory from ledger entries and confirmed dose administrations.
 * Discloses estimation uncertainty explicitly as mandated by clinical safety rules.
 */
export function estimateInventory(
  ledger: InventoryLedgerEntry[],
  confirmedAdministrations: number,
  dailyDoseCount: number = 1,
  lowStockThreshold: number = 7
): InventoryEstimate {
  let netStock = 0
  let unit = 'doses'

  for (const entry of ledger) {
    if (entry.unit) unit = entry.unit
    netStock += entry.quantity
  }

  // Deduct confirmed administrations if not already logged as ledger administration entries
  const administrationsInLedger = ledger
    .filter((e) => e.type === 'administration')
    .reduce((sum, e) => sum + Math.abs(e.quantity), 0)

  const unrecordedAdministrations = Math.max(0, confirmedAdministrations - administrationsInLedger)
  const estimatedRemaining = Math.max(0, netStock - unrecordedAdministrations)

  const daysRemaining = dailyDoseCount > 0 ? Math.floor(estimatedRemaining / dailyDoseCount) : 0
  const isLowStock = estimatedRemaining <= lowStockThreshold || daysRemaining <= 5

  return {
    estimatedRemaining,
    unit,
    isEstimate: true,
    disclaimer:
      'Inventory count is an automated approximation based on reported doses and restock records. Verify physical supply before taking clinical action.',
    isLowStock,
    daysRemaining,
  }
}

/**
 * Compares current medications against proposed prescription changes (DischargeSync).
 * Categorizes diff into: added, changed, discontinued, unchanged.
 */
export function diffMedicationPlans(
  currentMeds: Medication[],
  proposedMeds: ProposedMedication[]
): {
  added: string[]
  changed: { name: string; changes: string }[]
  discontinued: string[]
  unchanged: string[]
} {
  const currentMap = new Map<string, Medication>()
  for (const m of currentMeds) {
    currentMap.set(m.name.trim().toLowerCase(), m)
  }

  const proposedMap = new Map<string, ProposedMedication>()
  for (const p of proposedMeds) {
    proposedMap.set(p.name.trim().toLowerCase(), p)
  }

  const added: string[] = []
  const changed: { name: string; changes: string }[] = []
  const unchanged: string[] = []
  const discontinued: string[] = []

  // Check proposed against current
  for (const [key, prop] of proposedMap.entries()) {
    if (!currentMap.has(key)) {
      if (prop.action !== 'discontinue') {
        added.push(`${prop.name} (${prop.dosage})`)
      }
    } else {
      const curr = currentMap.get(key)!
      if (prop.action === 'discontinue') {
        discontinued.push(curr.name)
      } else {
        const changesList: string[] = []
        if (curr.dosage !== prop.dosage) {
          changesList.push(`Dosage changed: "${curr.dosage}" → "${prop.dosage}"`)
        }
        if (curr.instructions !== prop.instructions) {
          changesList.push('Instructions updated')
        }
        if (JSON.stringify(curr.schedule.times) !== JSON.stringify(prop.schedule.times)) {
          changesList.push(
            `Times changed: [${curr.schedule.times.join(', ')}] → [${prop.schedule.times.join(', ')}]`
          )
        }

        if (changesList.length > 0) {
          changed.push({
            name: prop.name,
            changes: changesList.join('; '),
          })
        } else {
          unchanged.push(prop.name)
        }
      }
    }
  }

  // Check current meds that were omitted from proposal
  for (const [key, curr] of currentMap.entries()) {
    if (!proposedMap.has(key) && curr.status === 'active') {
      discontinued.push(curr.name)
    }
  }

  return { added, changed, discontinued, unchanged }
}
