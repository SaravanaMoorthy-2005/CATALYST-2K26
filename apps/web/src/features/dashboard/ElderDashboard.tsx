import { useState } from 'react'
import {
  Pill,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  AlertTriangle,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { SurfaceCard } from '../../components/SurfaceCard'
import { StatusBadge } from '../../components/StatusBadge'
import { AccessibleDialog } from '../../components/AccessibleDialog'
import { Link } from 'react-router-dom'

interface DoseItem {
  id: string
  medicationName: string
  dosage: string
  time: string
  instructions?: string
  status: 'due' | 'taken' | 'skipped' | 'unconfirmed' | 'scheduled'
  confirmedBy?: string
  confirmedAt?: string
}

export function ElderDashboard() {
  const [doses, setDoses] = useState<DoseItem[]>([
    {
      id: 'dose_1',
      medicationName: 'Atorvastatin',
      dosage: '20mg Tablet',
      time: '08:00 AM',
      instructions: 'Take 1 tablet with a full glass of water after breakfast.',
      status: 'due',
    },
    {
      id: 'dose_2',
      medicationName: 'Metformin',
      dosage: '500mg Tablet',
      time: '01:00 PM',
      instructions: 'Take with lunch.',
      status: 'scheduled',
    },
    {
      id: 'dose_3',
      medicationName: 'Lisinopril',
      dosage: '10mg Tablet',
      time: '08:00 PM',
      instructions: 'Take before bedtime.',
      status: 'scheduled',
    },
  ])

  const [safeDoseModal, setSafeDoseModal] = useState<{
    isOpen: boolean
    dose?: DoseItem
  }>({ isOpen: false })

  const [whyMissedModal, setWhyMissedModal] = useState<{
    isOpen: boolean
    dose?: DoseItem
  }>({ isOpen: false })

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  // Find next due dose
  const nextDose = doses.find((d) => d.status === 'due' || d.status === 'unconfirmed') || doses[0]

  const handleMarkTaken = (doseId: string) => {
    const target = doses.find((d) => d.id === doseId)
    // SafeDose Shield: If already taken, alert user to prevent duplicate ingestion recording
    if (target?.status === 'taken') {
      setSafeDoseModal({ isOpen: true, dose: target })
      return
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setDoses((prev) =>
      prev.map((d) =>
        d.id === doseId
          ? { ...d, status: 'taken', confirmedAt: nowStr, confirmedBy: 'Self' }
          : d
      )
    )

    setFeedbackMessage(`✓ Recorded: ${target?.medicationName} taken at ${nowStr}. SafeDose Shield verified.`)
    setTimeout(() => setFeedbackMessage(null), 5000)
  }

  const handleSkipPrompt = (dose: DoseItem) => {
    setWhyMissedModal({ isOpen: true, dose })
  }

  const handleWhyMissedSelect = (reasonText: string) => {
    if (!whyMissedModal.dose) return
    const doseId = whyMissedModal.dose.id

    setDoses((prev) =>
      prev.map((d) => (d.id === doseId ? { ...d, status: 'skipped' } : d))
    )

    setWhyMissedModal({ isOpen: false })
    setFeedbackMessage(`Logged response: "${reasonText}". Care team has been notified.`)
    setTimeout(() => setFeedbackMessage(null), 5000)
  }

  return (
    <div className="space-y-6">
      {/* Feedback announcement */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-card bg-cc-mint border border-green-300 text-green-900 font-medium shadow-sm flex items-center gap-3 animate-fade-in"
        >
          <ShieldCheck className="w-5 h-5 text-green-700 flex-shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* DOMINANT NEXT-ACTION CARD (The core of CareDay) */}
      <SurfaceCard className="border-2 border-cc-powder bg-white p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cc-lemon/20 rounded-bl-full pointer-events-none" />

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cc-ice text-blue-900 uppercase tracking-wider">
              Next Medication
            </span>
            <span className="text-sm text-cc-muted font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {nextDose.time}
            </span>
          </div>
          <StatusBadge variant={nextDose.status} />
        </div>

        <div className="mb-6">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-cc-ink mb-1">
            {nextDose.medicationName}
          </h2>
          <p className="text-lg text-cc-muted font-medium mb-3">{nextDose.dosage}</p>
          {nextDose.instructions && (
            <div className="p-3 rounded-xl bg-cc-mist text-sm text-cc-ink border border-cc-border">
              <strong>Instructions:</strong> {nextDose.instructions}
            </div>
          )}
        </div>

        {/* Primary Large Buttons (Accessible, min 56px height) */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleMarkTaken(nextDose.id)}
            disabled={nextDose.status === 'taken'}
            className={`flex-1 min-h-[56px] px-6 py-3.5 rounded-full font-headline text-lg font-bold flex items-center justify-center gap-3 transition-all ${
              nextDose.status === 'taken'
                ? 'bg-cc-mint text-green-900 border border-green-300 cursor-default'
                : 'bg-cc-ink text-white hover:opacity-90 active:scale-[0.99] shadow-md'
            }`}
            aria-label={`Mark ${nextDose.medicationName} as Taken`}
          >
            <CheckCircle2 className="w-6 h-6 text-cc-lemon" />
            <span>{nextDose.status === 'taken' ? '✓ Dose Taken' : 'Mark as Taken'}</span>
          </button>

          <button
            onClick={() => handleSkipPrompt(nextDose)}
            disabled={nextDose.status === 'taken' || nextDose.status === 'skipped'}
            className="sm:w-36 min-h-[56px] px-4 py-3.5 rounded-full border-2 border-cc-border hover:bg-black/5 font-body text-base font-semibold text-cc-ink flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
            aria-label={`Skip or report issue for ${nextDose.medicationName}`}
          >
            <XCircle className="w-5 h-5 text-cc-muted" />
            <span>Skip / Reason</span>
          </button>
        </div>
      </SurfaceCard>

      {/* TODAY'S CARE TIMELINE */}
      <SurfaceCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-xl font-bold text-cc-ink flex items-center gap-2">
            <Clock className="w-5 h-5 text-cc-ink" />
            Today's Care Timeline
          </h3>
          <span className="text-xs text-cc-muted font-medium">3 doses scheduled today</span>
        </div>

        <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-cc-border">
          {doses.map((dose) => (
            <div
              key={dose.id}
              className="relative pl-10 flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-white border border-cc-border hover:shadow-sm transition-shadow gap-2"
            >
              <div
                className={`absolute left-2.5 top-5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  dose.status === 'taken'
                    ? 'bg-green-600'
                    : dose.status === 'due'
                    ? 'bg-cc-ink'
                    : 'bg-gray-400'
                }`}
              />

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline font-semibold text-base text-cc-ink">
                    {dose.medicationName}
                  </span>
                  <span className="text-xs text-cc-muted">({dose.dosage})</span>
                </div>
                <p className="text-xs text-cc-muted mt-0.5">{dose.time}</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <StatusBadge variant={dose.status} />
                {dose.status !== 'taken' && dose.status !== 'skipped' && (
                  <button
                    onClick={() => handleMarkTaken(dose.id)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cc-ink text-white hover:opacity-90"
                  >
                    Take
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </SurfaceCard>

      {/* UPCOMING MEDICAL APPOINTMENTS */}
      <SurfaceCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-xl font-bold text-cc-ink flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-700" />
            Upcoming Appointments
          </h3>
          <Link
            to="/appointments"
            className="text-xs font-semibold text-cc-ink hover:underline flex items-center gap-0.5"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-cc-ice border border-blue-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-700 shadow-sm flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                Tomorrow, 10:30 AM
              </span>
              <h4 className="font-headline font-bold text-base text-cc-ink mt-0.5">
                Dr. Sarah Jenkins
              </h4>
              <p className="text-xs text-cc-muted">Cardiology Follow-Up</p>
              <p className="text-xs text-blue-900 mt-2 font-medium">St. Jude Medical Center, Suite 402</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cc-mist border border-green-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green-800 shadow-sm flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-green-900 uppercase tracking-wider">
                Thursday, 02:00 PM
              </span>
              <h4 className="font-headline font-bold text-base text-cc-ink mt-0.5">
                Dr. Robert Chen
              </h4>
              <p className="text-xs text-cc-muted">Routine Geriatric Assessment</p>
              <p className="text-xs text-green-900 mt-2 font-medium">Metro Health Clinic</p>
            </div>
          </div>
        </div>
      </SurfaceCard>

      {/* ONE-TAP NEED HELP BANNER */}
      <div className="p-6 rounded-card bg-cc-lemon/30 border-2 border-cc-lemon flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-cc-ink text-cc-lemon flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-lg text-cc-ink">Need assistance today?</h4>
            <p className="text-sm text-cc-muted">
              One tap connects you with your designated family and caregivers.
            </p>
          </div>
        </div>

        <Link
          to="/assistance"
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-cc-ink text-white font-headline text-base font-bold shadow-md hover:opacity-90 text-center flex-shrink-0"
        >
          Open Need Help
        </Link>
      </div>

      {/* SAFEDOSE SHIELD MODAL */}
      <AccessibleDialog
        isOpen={safeDoseModal.isOpen}
        onClose={() => setSafeDoseModal({ isOpen: false })}
        title="SafeDose Shield Protection"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-headline font-bold text-base">Dose Already Confirmed</h4>
              <p className="text-sm mt-1">
                SafeDose Shield detected that <strong>{safeDoseModal.dose?.medicationName}</strong> was
                already marked as taken at <strong>{safeDoseModal.dose?.confirmedAt || 'an earlier time'}</strong> by{' '}
                <strong>{safeDoseModal.dose?.confirmedBy || 'caregiver'}</strong>.
              </p>
            </div>
          </div>

          <p className="text-sm text-cc-muted">
            To prevent potential double dosing, repeated confirmations for the same occurrence are rejected. If this was marked in error, a caregiver can issue an audited correction.
          </p>

          <button
            onClick={() => setSafeDoseModal({ isOpen: false })}
            className="w-full min-h-[48px] rounded-full bg-cc-ink text-white font-semibold"
          >
            I Understand
          </button>
        </div>
      </AccessibleDialog>

      {/* WHY MISSED? MODAL */}
      <AccessibleDialog
        isOpen={whyMissedModal.isOpen}
        onClose={() => setWhyMissedModal({ isOpen: false })}
        title="Why was this dose missed?"
      >
        <div className="space-y-4">
          <p className="text-sm text-cc-muted">
            Selecting a reason helps your care circle support you. <em>Never take a double dose without clinician instructions.</em>
          </p>

          <div className="space-y-2">
            {[
              { id: 'forgot', label: '🤔 I forgot to take it', desc: 'We will log this and inform your caregiver.' },
              { id: 'unavailable', label: '💊 Medicine unavailable', desc: 'Automatically creates a Refill Guardian task.' },
              { id: 'assistance', label: '🤝 Need assistance with this dose', desc: 'Creates an urgent assistance request.' },
              { id: 'unwell', label: '🤒 Feeling unwell or side effects', desc: 'Alerts your caregiver to check in with you.' },
              { id: 'already_took', label: '✓ Already took it, but forgot to record', desc: 'Records retroactive confirmation.' },
            ].map((reason) => (
              <button
                key={reason.id}
                onClick={() => handleWhyMissedSelect(reason.label)}
                className="w-full text-left p-3.5 rounded-2xl border border-cc-border hover:border-cc-ink hover:bg-cc-ivory transition-all"
              >
                <div className="font-headline font-semibold text-base text-cc-ink">{reason.label}</div>
                <div className="text-xs text-cc-muted mt-0.5">{reason.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </AccessibleDialog>
    </div>
  )
}
