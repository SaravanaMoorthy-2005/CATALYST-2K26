import { useState } from 'react'
import { AppShell } from '../../../components/AppShell'
import { SurfaceCard } from '../../../components/SurfaceCard'
import { StatusBadge } from '../../../components/StatusBadge'
import { AccessibleDialog } from '../../../components/AccessibleDialog'
import { Pill, Plus, Clock, AlertTriangle, ShieldCheck, Edit, Pause, Archive } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'

interface MedicationItem {
  id: string
  name: string
  dosage: string
  instructions: string
  times: string[]
  status: 'active' | 'paused' | 'archived'
  stockCount: number
}

export default function MedicationsPage() {
  const { currentRole } = useAuth()
  const [meds, setMeds] = useState<MedicationItem[]>([
    {
      id: 'med_1',
      name: 'Atorvastatin',
      dosage: '20mg Tablet',
      instructions: 'Take 1 tablet with a full glass of water after breakfast.',
      times: ['08:00 AM'],
      status: 'active',
      stockCount: 24,
    },
    {
      id: 'med_2',
      name: 'Metformin',
      dosage: '500mg Tablet',
      instructions: 'Take with lunch to reduce gastrointestinal upset.',
      times: ['01:00 PM'],
      status: 'active',
      stockCount: 8, // Low stock
    },
    {
      id: 'med_3',
      name: 'Lisinopril',
      dosage: '10mg Tablet',
      instructions: 'Take once daily before bedtime. Monitor blood pressure weekly.',
      times: ['08:00 PM'],
      status: 'active',
      stockCount: 45,
    },
  ])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'paused'>('active')
  const [newName, setNewName] = useState('')
  const [newDosage, setNewDosage] = useState('')
  const [newInstructions, setNewInstructions] = useState('')
  const [newTime, setNewTime] = useState('09:00')

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newDosage.trim()) return

    const newMed: MedicationItem = {
      id: `med_${Date.now()}`,
      name: newName,
      dosage: newDosage,
      instructions: newInstructions || 'Take as prescribed by clinician.',
      times: [newTime],
      status: 'active',
      stockCount: 30,
    }

    setMeds([newMed, ...meds])
    setNewName('')
    setNewDosage('')
    setNewInstructions('')
    setIsAddOpen(false)
  }

  const togglePause = (id: string) => {
    setMeds((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === 'active' ? 'paused' : 'active' } : m
      )
    )
  }

  const archiveMed = (id: string) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'archived' } : m))
    )
  }

  const filteredMeds = meds.filter((m) => m.status === activeTab)

  return (
    <AppShell currentRole={currentRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-cc-ink">Medication Management</h1>
            <p className="text-sm text-cc-muted mt-1">
              Authoritative clinician-issued prescription schedules and stock monitoring.
            </p>
          </div>

          {(currentRole === 'owner' || currentRole === 'caregiver') && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-5 py-3 rounded-full bg-cc-ink text-cc-ivory font-headline text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medication</span>
            </button>
          )}
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-cc-border pb-3">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'active'
                ? 'bg-cc-ink text-cc-ivory'
                : 'text-cc-muted hover:text-cc-ink hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            Active Prescriptions ({meds.filter((m) => m.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('paused')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'paused'
                ? 'bg-cc-ink text-cc-ivory'
                : 'text-cc-muted hover:text-cc-ink hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            Paused ({meds.filter((m) => m.status === 'paused').length})
          </button>
        </div>

        {/* Medication Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeds.map((med) => (
            <SurfaceCard key={med.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-cc-mist text-green-900 flex items-center justify-center font-bold">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-xl text-cc-ink">{med.name}</h3>
                      <p className="text-sm font-medium text-cc-muted">{med.dosage}</p>
                    </div>
                  </div>
                  <StatusBadge variant={med.status} />
                </div>

                <div className="my-4 p-3 rounded-xl bg-cc-ivory border border-cc-border text-xs text-cc-ink space-y-1">
                  <p>
                    <strong>Schedule:</strong> Daily at {med.times.join(', ')}
                  </p>
                  <p>
                    <strong>Instructions:</strong> {med.instructions}
                  </p>
                </div>

                {/* Refill stock alert badge */}
                <div className="flex items-center gap-2 text-xs font-semibold mb-4">
                  <span className="text-cc-muted">Refill Supply:</span>
                  <span
                    className={`px-2.5 py-1 rounded-full ${
                      med.stockCount <= 10
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {med.stockCount} doses remaining {med.stockCount <= 10 && '(Low Stock Warning)'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {(currentRole === 'owner' || currentRole === 'caregiver') && (
                <div className="pt-3 border-t border-cc-border flex items-center justify-between text-xs font-semibold">
                  <button
                    onClick={() => togglePause(med.id)}
                    className="flex items-center gap-1.5 text-cc-muted hover:text-cc-ink py-1 px-2 rounded-lg hover:bg-black/5"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>{med.status === 'active' ? 'Pause' : 'Resume'}</span>
                  </button>

                  <button
                    onClick={() => archiveMed(med.id)}
                    className="flex items-center gap-1.5 text-red-600 hover:text-red-800 py-1 px-2 rounded-lg hover:bg-red-50"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive</span>
                  </button>
                </div>
              )}
            </SurfaceCard>
          ))}
        </div>

        {/* ADD MEDICATION DIALOG */}
        <AccessibleDialog
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Add Prescription Medication"
        >
          <form onSubmit={handleAddMedication} className="space-y-4">
            <div>
              <label htmlFor="med-name" className="block text-sm font-semibold text-cc-ink mb-1">
                Medication Name *
              </label>
              <input
                id="med-name"
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Atorvastatin"
                className="w-full h-11 px-3.5 rounded-xl border border-cc-border bg-cc-surface text-cc-ink focus:ring-2 focus:ring-cc-ink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="med-dosage" className="block text-sm font-semibold text-cc-ink mb-1">
                Dosage & Form *
              </label>
              <input
                id="med-dosage"
                type="text"
                required
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                placeholder="e.g. 20mg Tablet"
                className="w-full h-11 px-3.5 rounded-xl border border-cc-border bg-cc-surface text-cc-ink focus:ring-2 focus:ring-cc-ink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="med-time" className="block text-sm font-semibold text-cc-ink mb-1">
                Daily Administration Time *
              </label>
              <input
                id="med-time"
                type="time"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-cc-border bg-cc-surface text-cc-ink focus:ring-2 focus:ring-cc-ink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="med-instructions" className="block text-sm font-semibold text-cc-ink mb-1">
                Clinician Instructions (Optional)
              </label>
              <textarea
                id="med-instructions"
                rows={3}
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                placeholder="e.g. Take with food. Do not chew."
                className="w-full p-3 rounded-xl border border-cc-border bg-cc-surface text-cc-ink focus:ring-2 focus:ring-cc-ink focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2.5 rounded-full border border-cc-border text-cc-ink font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-cc-ink text-cc-ivory font-semibold text-sm hover:opacity-90"
              >
                Save Medication
              </button>
            </div>
          </form>
        </AccessibleDialog>
      </div>
    </AppShell>
  )
}
