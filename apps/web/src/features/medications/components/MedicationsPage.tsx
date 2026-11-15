import { useState } from 'react'
import {
  Pill,
  Plus,
  Pause,
  Archive,
  Sparkles,
} from 'lucide-react'
import { SurfaceCard } from '../../../components/SurfaceCard'
import { StatusBadge } from '../../../components/StatusBadge'
import { AccessibleDialog } from '../../../components/AccessibleDialog'
import { AppShell } from '../../../components/AppShell'
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
      instructions: 'Take 1 tablet daily with a glass of water after breakfast.',
      times: ['08:00 AM'],
      status: 'active',
      stockCount: 24,
    },
    {
      id: 'med_2',
      name: 'Metformin',
      dosage: '500mg Tablet',
      instructions: 'Take with midday meal.',
      times: ['01:00 PM'],
      status: 'active',
      stockCount: 8, // Triggers Refill Guardian low stock
    },
    {
      id: 'med_3',
      name: 'Lisinopril',
      dosage: '10mg Tablet',
      instructions: 'Take with evening meal.',
      times: ['08:00 PM'],
      status: 'active',
      stockCount: 30,
    },
    {
      id: 'med_4',
      name: 'Hydrochlorothiazide',
      dosage: '12.5mg Capsule',
      instructions: 'Paused by cardiologist pending blood work.',
      times: ['08:00 AM'],
      status: 'paused',
      stockCount: 15,
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
        m.id === id ? { ...m, status: m.status === 'active' ? 'paused' : 'active' } : m,
      ),
    )
  }

  const archiveMed = (id: string) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'archived' } : m)),
    )
  }

  const filteredMeds = meds.filter((m) => m.status === activeTab)

  return (
    <AppShell currentRole={currentRole}>
      <div className="space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-ochre">Medication Management</h1>
            <p className="text-sm text-ochre-warm font-semibold mt-1">
              Authoritative clinician-issued prescription schedules and Refill Guardian stock monitoring.
            </p>
          </div>

          {(currentRole === 'owner' || currentRole === 'caregiver') && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="sun-button px-6 py-3.5 rounded-pill text-sm font-bold flex items-center justify-center gap-2 shadow-sun-button self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Prescription</span>
            </button>
          )}
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2.5 border-b border-leaf/20 pb-3.5">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-5 py-2.5 rounded-pill text-sm font-bold transition-all ${
              activeTab === 'active'
                ? 'sun-button text-white shadow-sm'
                : 'bg-white text-ochre border border-leaf/20 hover:bg-leaf/10'
            }`}
          >
            Active Prescriptions ({meds.filter((m) => m.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('paused')}
            className={`px-5 py-2.5 rounded-pill text-sm font-bold transition-all ${
              activeTab === 'paused'
                ? 'sun-button text-white shadow-sm'
                : 'bg-white text-ochre border border-leaf/20 hover:bg-leaf/10'
            }`}
          >
            Paused ({meds.filter((m) => m.status === 'paused').length})
          </button>
        </div>

        {/* Medication Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMeds.map((med) => (
            <SurfaceCard key={med.id} className="p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="icon-bed w-11 h-11">
                      <Pill className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-xl text-ochre">{med.name}</h3>
                      <p className="text-sm font-bold text-ochre-warm">{med.dosage}</p>
                    </div>
                  </div>
                  <StatusBadge variant={med.status} />
                </div>

                <div className="my-4 p-4 rounded-[18px] bg-white border border-leaf/15 text-xs text-ochre space-y-1.5 shadow-xs">
                  <p>
                    <strong className="text-emerald-950 font-bold">Schedule:</strong> Daily at {med.times.join(', ')}
                  </p>
                  <p>
                    <strong className="text-emerald-950 font-bold">Instructions:</strong> {med.instructions}
                  </p>
                </div>

                {/* Refill stock alert badge */}
                <div className="flex items-center gap-2 text-xs font-bold mb-4">
                  <span className="text-ochre-warm">Refill Supply:</span>
                  <span
                    className={`px-3 py-1 rounded-full border ${
                      med.stockCount <= 10
                        ? 'bg-amber-100 text-amber-950 border-amber-300'
                        : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                    }`}
                  >
                    {med.stockCount} doses remaining {med.stockCount <= 10 && '(Low Stock Warning)'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {(currentRole === 'owner' || currentRole === 'caregiver') && (
                <div className="pt-3.5 border-t border-leaf/20 flex items-center justify-between text-xs font-bold">
                  <button
                    onClick={() => togglePause(med.id)}
                    className="flex items-center gap-1.5 text-ochre hover:text-emerald-950 py-1.5 px-3 rounded-pill hover:bg-leaf/10 transition-colors"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>{med.status === 'active' ? 'Pause' : 'Resume'}</span>
                  </button>

                  <button
                    onClick={() => archiveMed(med.id)}
                    className="flex items-center gap-1.5 text-rose-700 hover:text-rose-900 py-1.5 px-3 rounded-pill hover:bg-rose-50 transition-colors"
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
              <label htmlFor="med-name" className="block text-sm font-bold text-ochre mb-1">
                Medication Name *
              </label>
              <input
                id="med-name"
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Atorvastatin"
                className="soft-input w-full rounded-input border bg-mint-white px-4 py-3 text-ochre placeholder:text-ochre/45 font-sans"
              />
            </div>

            <div>
              <label htmlFor="med-dosage" className="block text-sm font-bold text-ochre mb-1">
                Dosage & Form *
              </label>
              <input
                id="med-dosage"
                type="text"
                required
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                placeholder="e.g. 20mg Tablet"
                className="soft-input w-full rounded-input border bg-mint-white px-4 py-3 text-ochre placeholder:text-ochre/45 font-sans"
              />
            </div>

            <div>
              <label htmlFor="med-time" className="block text-sm font-bold text-ochre mb-1">
                Primary Daily Dose Time *
              </label>
              <input
                id="med-time"
                type="time"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="soft-input w-full rounded-input border bg-mint-white px-4 py-3 text-ochre font-sans"
              />
            </div>

            <div>
              <label htmlFor="med-instructions" className="block text-sm font-bold text-ochre mb-1">
                Patient Instructions & Food Requirements
              </label>
              <textarea
                id="med-instructions"
                rows={3}
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                placeholder="e.g. Take with a full glass of water after meals."
                className="soft-input w-full rounded-input border bg-mint-white px-4 py-3 text-ochre placeholder:text-ochre/45 font-sans"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-5 py-2.5 rounded-pill text-sm font-bold text-ochre hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="sun-button px-6 py-2.5 rounded-pill text-sm font-bold text-white shadow-sun-button flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Save Medication
              </button>
            </div>
          </form>
        </AccessibleDialog>
      </div>
    </AppShell>
  )
}
