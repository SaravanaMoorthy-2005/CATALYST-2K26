import { useState } from 'react'
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Sun,
  Heart,
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
      instructions: 'Take with evening meal.',
      status: 'scheduled',
    },
  ])

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [safeDoseModal, setSafeDoseModal] = useState<{ isOpen: boolean; dose?: DoseItem }>({
    isOpen: false,
  })
  const [whyMissedModal, setWhyMissedModal] = useState<{ isOpen: boolean; dose?: DoseItem }>({
    isOpen: false,
  })

  // Prioritize due dose, else next scheduled dose
  const nextDose = doses.find((d) => d.status === 'due') || doses[0]

  const handleMarkTaken = (doseId: string) => {
    const target = doses.find((d) => d.id === doseId)
    if (target?.status === 'taken') {
      // SafeDose Shield Trigger: Prevent duplicate digital confirmation
      setSafeDoseModal({ isOpen: true, dose: target })
      return
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setDoses((prev) =>
      prev.map((d) =>
        d.id === doseId
          ? { ...d, status: 'taken', confirmedAt: nowStr, confirmedBy: 'Self' }
          : d,
      ),
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
      prev.map((d) => (d.id === doseId ? { ...d, status: 'skipped' } : d)),
    )

    setWhyMissedModal({ isOpen: false })
    setFeedbackMessage(`Logged response: "${reasonText}". Care team has been notified.`)
    setTimeout(() => setFeedbackMessage(null), 5000)
  }

  return (
    <div className="space-y-8">
      {/* Feedback announcement */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-card bg-emerald-50 border border-emerald-300 text-emerald-950 font-semibold shadow-card flex items-center gap-3 animate-fade-in"
        >
          <div className="icon-bed w-9 h-9">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* DOMINANT NEXT-ACTION CARD (Solarpunk Organic Card) */}
      <SurfaceCard className="border-2 border-leaf/30 bg-mint-white p-7 md:p-9 relative overflow-hidden shadow-card">
        {/* Organic curved sunbeam accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-golden/25 via-leaf/10 to-transparent rounded-bl-[100px] pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="icon-bed icon-bed-golden">
              <Sun className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                Next Scheduled Dose
              </span>
              <div className="text-sm text-ochre font-bold flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Scheduled for {nextDose.time}</span>
              </div>
            </div>
          </div>
          <StatusBadge variant={nextDose.status} />
        </div>

        <div className="mb-7">
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-ochre mb-2">
            {nextDose.medicationName}
          </h2>
          <p className="text-xl text-ochre-warm font-bold mb-4">{nextDose.dosage}</p>
          {nextDose.instructions && (
            <div className="p-4 rounded-[18px] bg-emerald-100/50 text-base text-ochre border border-leaf/20 shadow-sm flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-emerald-950">Instructions:</strong> {nextDose.instructions}
              </div>
            </div>
          )}
        </div>

        {/* Primary Sun Button (Large, Accessible, min 56px height) */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => handleMarkTaken(nextDose.id)}
            disabled={nextDose.status === 'taken'}
            className={`flex-1 min-h-[58px] px-8 py-4 rounded-pill font-headline text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
              nextDose.status === 'taken'
                ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-400 cursor-default'
                : 'sun-button text-white shadow-sun-button'
            }`}
            aria-label={`Mark ${nextDose.medicationName} as Taken`}
          >
            <CheckCircle2 className="w-6 h-6 text-white drop-shadow-sm" />
            <span>{nextDose.status === 'taken' ? '✓ Dose Confirmed Taken' : 'Mark as Taken'}</span>
          </button>

          <button
            onClick={() => handleSkipPrompt(nextDose)}
            disabled={nextDose.status === 'taken' || nextDose.status === 'skipped'}
            className="sm:w-44 min-h-[58px] px-5 py-4 rounded-pill bg-mint-white border-2 border-amber-300 text-amber-950 font-headline text-base font-bold flex items-center justify-center gap-2 hover:bg-amber-100/60 shadow-sm hover:shadow transition-all disabled:opacity-40"
            aria-label={`Skip or report issue for ${nextDose.medicationName}`}
          >
            <XCircle className="w-5 h-5 text-amber-700" />
            <span>Skip / Reason</span>
          </button>
        </div>
      </SurfaceCard>

      {/* TODAY'S CARE TIMELINE */}
      <SurfaceCard className="p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="icon-bed">
              <Clock className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-ochre">
                Today's Care Timeline
              </h3>
              <p className="text-xs text-ochre-warm font-semibold">3 doses scheduled for today</p>
            </div>
          </div>
        </div>

        <div className="space-y-3.5 relative before:absolute before:inset-0 before:left-5 before:w-1 before:bg-gradient-to-b before:from-leaf/30 before:to-golden/30 before:rounded-full">
          {doses.map((dose) => (
            <div
              key={dose.id}
              className="relative pl-12 flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[20px] bg-white border border-leaf/15 hover:border-leaf/35 hover:shadow-card-hover transition-all gap-3"
            >
              <div
                className={`absolute left-3 top-6 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                  dose.status === 'taken'
                    ? 'bg-emerald-600'
                    : dose.status === 'due'
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-stone-300'
                }`}
              >
                {dose.status === 'taken' && <span className="text-white text-[10px]">✓</span>}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline font-bold text-lg text-ochre">
                    {dose.medicationName}
                  </span>
                  <span className="text-xs text-ochre-warm font-semibold">({dose.dosage})</span>
                </div>
                <p className="text-xs text-ochre/70 font-semibold mt-0.5">{dose.time}</p>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <StatusBadge variant={dose.status} />
                {dose.status !== 'taken' && dose.status !== 'skipped' && (
                  <button
                    onClick={() => handleMarkTaken(dose.id)}
                    className="sun-button px-4 py-2 text-xs font-bold text-white rounded-pill"
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
      <SurfaceCard className="p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="icon-bed icon-bed-sky">
              <Calendar className="w-5 h-5 text-sky-800" />
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-ochre">
                Upcoming Doctor Appointments
              </h3>
              <p className="text-xs text-ochre-warm font-semibold">Upcoming clinic visits and check-ins</p>
            </div>
          </div>
          <Link
            to="/appointments"
            className="text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
          >
            View Calendar <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-[22px] bg-sky-50/70 border border-sky-200/80 flex items-start gap-3.5 shadow-sm hover:shadow-card transition-all">
            <div className="icon-bed icon-bed-sky w-12 h-12 flex-shrink-0">
              <Calendar className="w-6 h-6 text-sky-800" />
            </div>
            <div>
              <span className="text-xs font-bold text-sky-900 uppercase tracking-wider bg-sky-100 px-2.5 py-0.5 rounded-full">
                Tomorrow, 10:30 AM
              </span>
              <h4 className="font-headline font-bold text-lg text-ochre mt-1">
                Dr. Sarah Jenkins
              </h4>
              <p className="text-xs text-ochre-warm font-semibold">Cardiology Follow-Up</p>
              <p className="text-xs text-sky-950 mt-2 font-medium">St. Jude Medical Center, Suite 402</p>
            </div>
          </div>

          <div className="p-5 rounded-[22px] bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3.5 shadow-sm hover:shadow-card transition-all">
            <div className="icon-bed w-12 h-12 flex-shrink-0">
              <Heart className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Thursday, 02:00 PM
              </span>
              <h4 className="font-headline font-bold text-lg text-ochre mt-1">
                Dr. Robert Chen
              </h4>
              <p className="text-xs text-ochre-warm font-semibold">Routine Geriatric Assessment</p>
              <p className="text-xs text-emerald-950 mt-2 font-medium">Metro Health Clinic</p>
            </div>
          </div>
        </div>
      </SurfaceCard>

      {/* ONE-TAP NEED HELP BANNER (Solarpunk Warm Gradient Band) */}
      <div className="p-7 rounded-[26px] bg-gradient-to-r from-amber-100 via-amber-50 to-emerald-100 border-2 border-golden/50 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-card hover:shadow-card-hover transition-all">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-sun-button">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-headline font-extrabold text-xl text-ochre">Need assistance today?</h4>
            <p className="text-sm text-ochre-warm font-semibold mt-0.5">
              One tap alerts your designated family members and caregivers instantly.
            </p>
          </div>
        </div>

        <Link
          to="/assistance"
          className="w-full sm:w-auto px-8 py-4 rounded-pill sun-button text-white font-headline text-base font-bold shadow-sun-button text-center flex-shrink-0"
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
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
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

          <p className="text-sm text-ochre-warm font-medium">
            To protect your safety and prevent double dosing, repeated digital confirmations for the same occurrence are blocked. If marked in error, a caregiver can issue an audited correction.
          </p>

          <button
            onClick={() => setSafeDoseModal({ isOpen: false })}
            className="w-full min-h-[50px] rounded-pill sun-button text-white font-bold"
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
          <p className="text-sm text-ochre-warm font-medium">
            Selecting a reason helps your care circle support you. <em>Never take a double dose without clinician instructions.</em>
          </p>

          <div className="space-y-2.5">
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
                className="w-full text-left p-4 rounded-[18px] border border-leaf/25 bg-mint-white hover:border-leaf hover:shadow-card hover:-translate-y-0.5 transition-all"
              >
                <div className="font-headline font-bold text-base text-ochre">{reason.label}</div>
                <div className="text-xs text-ochre-warm font-medium mt-0.5">{reason.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </AccessibleDialog>
    </div>
  )
}
