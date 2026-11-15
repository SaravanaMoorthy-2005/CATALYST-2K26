import { useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { SurfaceCard } from '../../components/SurfaceCard'
import { AccessibleDialog } from '../../components/AccessibleDialog'
import { RefreshCw, Plus, AlertTriangle, ShieldCheck, CheckCircle2, History, Package } from 'lucide-react'
import { useAuth } from '../auth/hooks/useAuth'

interface InventoryItem {
  medicationId: string
  name: string
  dosage: string
  estimatedStock: number
  unit: string
  daysRemaining: number
  isLowStock: boolean
  lastRestocked: string
}

interface LedgerLog {
  id: string
  medName: string
  type: string
  quantity: number
  date: string
  recordedBy: string
}

export default function RefillsPage() {
  const { currentRole } = useAuth()
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      medicationId: 'med_1',
      name: 'Atorvastatin',
      dosage: '20mg Tablet',
      estimatedStock: 24,
      unit: 'tablets',
      daysRemaining: 24,
      isLowStock: false,
      lastRestocked: 'Oct 28, 2026',
    },
    {
      medicationId: 'med_2',
      name: 'Metformin',
      dosage: '500mg Tablet',
      estimatedStock: 8,
      unit: 'tablets',
      daysRemaining: 4,
      isLowStock: true, // LOW STOCK WARNING
      lastRestocked: 'Oct 15, 2026',
    },
    {
      medicationId: 'med_3',
      name: 'Lisinopril',
      dosage: '10mg Tablet',
      estimatedStock: 45,
      unit: 'tablets',
      daysRemaining: 45,
      isLowStock: false,
      lastRestocked: 'Nov 02, 2026',
    },
  ])

  const [ledger, setLedger] = useState<LedgerLog[]>([
    {
      id: 'log_1',
      medName: 'Lisinopril',
      type: 'Restock (+30)',
      quantity: 30,
      date: 'Nov 02, 2026',
      recordedBy: 'Caregiver John',
    },
    {
      id: 'log_2',
      medName: 'Atorvastatin',
      type: 'Restock (+30)',
      quantity: 30,
      date: 'Oct 28, 2026',
      recordedBy: 'Caregiver John',
    },
    {
      id: 'log_3',
      medName: 'Metformin',
      type: 'Administration (-1)',
      quantity: -1,
      date: 'Yesterday',
      recordedBy: 'Dose Recorded Taken',
    },
  ])

  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [selectedMedId, setSelectedMedId] = useState(inventory[0]?.medicationId)
  const [restockQty, setRestockQty] = useState('30')
  const [restockNotes, setRestockNotes] = useState('')

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const qty = parseInt(restockQty, 10)
    if (isNaN(qty) || qty <= 0) return

    const targetMed = inventory.find((i) => i.medicationId === selectedMedId)
    if (!targetMed) return

    const nowStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })

    // Update inventory item
    setInventory((prev) =>
      prev.map((i) =>
        i.medicationId === selectedMedId
          ? {
              ...i,
              estimatedStock: i.estimatedStock + qty,
              daysRemaining: i.daysRemaining + qty,
              isLowStock: i.estimatedStock + qty <= 10,
              lastRestocked: nowStr,
            }
          : i
      )
    )

    // Append to ledger
    setLedger([
      {
        id: `log_${Date.now()}`,
        medName: targetMed.name,
        type: `Restock (+${qty})`,
        quantity: qty,
        date: nowStr,
        recordedBy: 'Caregiver (Manual)',
      },
      ...ledger,
    ])

    setIsRestockOpen(false)
  }

  return (
    <AppShell currentRole={currentRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-cc-ink">Refill Guardian</h1>
            <p className="text-sm text-cc-muted mt-1">
              Medication inventory ledger, low-stock projections, and prescription replenishment tracking.
            </p>
          </div>

          {(currentRole === 'owner' || currentRole === 'caregiver') && (
            <button
              onClick={() => setIsRestockOpen(true)}
              className="px-5 py-2.5 rounded-full bg-cc-ink text-white font-headline text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-sm"
            >
              <Plus className="w-4 h-4 text-cc-lemon" />
              <span>Record Restock</span>
            </button>
          )}
        </div>

        {/* Clinical Disclaimer on Inventory Estimation */}
        <div className="p-4 rounded-card bg-blue-50 border border-blue-200 text-blue-950 text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Automated Approximation Notice:</strong> All supply counts are estimates calculated from opening stock, confirmed administrations, and restock records. Always verify physical supply before making clinical or purchasing decisions.
          </div>
        </div>

        {/* INVENTORY TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inventory.map((item) => (
            <SurfaceCard
              key={item.medicationId}
              className={`p-6 relative overflow-hidden flex flex-col justify-between ${
                item.isLowStock ? 'border-2 border-red-300 bg-red-50/20' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-headline font-bold text-xl text-cc-ink">{item.name}</h3>
                  {item.isLowStock && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Low Stock
                    </span>
                  )}
                </div>
                <p className="text-xs text-cc-muted font-medium mb-4">{item.dosage}</p>

                <div className="space-y-1 mb-4">
                  <div className="font-headline text-3xl font-extrabold text-cc-ink">
                    {item.estimatedStock}{' '}
                    <span className="text-sm font-normal text-cc-muted">{item.unit}</span>
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      item.isLowStock ? 'text-red-700' : 'text-green-800'
                    }`}
                  >
                    ~{item.daysRemaining} days of supply remaining
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-cc-border flex items-center justify-between text-xs text-cc-muted">
                <span>Last Restocked:</span>
                <span className="font-semibold text-cc-ink">{item.lastRestocked}</span>
              </div>
            </SurfaceCard>
          ))}
        </div>

        {/* INVENTORY AUDIT LEDGER */}
        <SurfaceCard className="p-6">
          <h3 className="font-headline text-xl font-bold text-cc-ink mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-cc-ink" />
            Inventory Audit Ledger
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Inventory ledger table">
              <thead>
                <tr className="border-b border-cc-border text-cc-muted font-semibold">
                  <th className="pb-2.5">Medication</th>
                  <th className="pb-2.5">Transaction Type</th>
                  <th className="pb-2.5">Quantity</th>
                  <th className="pb-2.5">Date</th>
                  <th className="pb-2.5">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cc-border">
                {ledger.map((log) => (
                  <tr key={log.id} className="hover:bg-black/5 transition-colors">
                    <td className="py-3 font-bold text-cc-ink">{log.medName}</td>
                    <td className="py-3 font-medium text-cc-ink">{log.type}</td>
                    <td
                      className={`py-3 font-mono font-bold ${
                        log.quantity > 0 ? 'text-green-700' : 'text-cc-ink'
                      }`}
                    >
                      {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                    </td>
                    <td className="py-3 text-cc-muted">{log.date}</td>
                    <td className="py-3 text-cc-muted">{log.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>

        {/* RESTOCK MODAL */}
        <AccessibleDialog
          isOpen={isRestockOpen}
          onClose={() => setIsRestockOpen(false)}
          title="Record Restock / Inventory Adjustment"
        >
          <form onSubmit={handleRestockSubmit} className="space-y-4">
            <div>
              <label htmlFor="restock-med" className="block text-sm font-semibold text-cc-ink mb-1">
                Select Medication *
              </label>
              <select
                id="restock-med"
                value={selectedMedId}
                onChange={(e) => setSelectedMedId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-cc-border text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none bg-white"
              >
                {inventory.map((m) => (
                  <option key={m.medicationId} value={m.medicationId}>
                    {m.name} ({m.dosage}) — Current: {m.estimatedStock} {m.unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="restock-qty" className="block text-sm font-semibold text-cc-ink mb-1">
                Restock Quantity (Doses/Tablets) *
              </label>
              <input
                id="restock-qty"
                type="number"
                min={1}
                required
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-cc-border text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="restock-notes" className="block text-sm font-semibold text-cc-ink mb-1">
                Pharmacy / Prescription Notes (Optional)
              </label>
              <input
                id="restock-notes"
                type="text"
                value={restockNotes}
                onChange={(e) => setRestockNotes(e.target.value)}
                placeholder="e.g. Walgreens RX #98421 refill picked up"
                className="w-full h-11 px-3.5 rounded-xl border border-cc-border text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRestockOpen(false)}
                className="px-4 py-2.5 rounded-full border border-cc-border font-semibold text-sm hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-cc-ink text-white font-semibold text-sm hover:opacity-90"
              >
                Save Restock
              </button>
            </div>
          </form>
        </AccessibleDialog>
      </div>
    </AppShell>
  )
}
