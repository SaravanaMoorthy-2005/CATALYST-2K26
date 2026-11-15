import { useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { SurfaceCard } from '../../components/SurfaceCard'
import { HelpCircle, Pill, Calendar, PhoneCall, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react'
import { useAuth } from '../auth/hooks/useAuth'

export default function AssistancePage() {
  const { currentRole } = useAuth()
  const [activeRequest, setActiveRequest] = useState<{
    id: string
    kind: string
    status: 'open' | 'acknowledged' | 'resolved'
    acknowledgedBy?: string
    timestamp: string
  } | null>(null)

  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSendHelp = (kind: string, defaultTitle: string) => {
    setIsSubmitting(true)
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setTimeout(() => {
      setActiveRequest({
        id: `assist_${Date.now()}`,
        kind: defaultTitle,
        status: 'open',
        timestamp: nowStr,
      })
      setIsSubmitting(false)
      setNote('')
    }, 600)
  }

  // Simulated caregiver acknowledgment
  const handleSimulateAck = () => {
    if (!activeRequest) return
    setActiveRequest({
      ...activeRequest,
      status: 'acknowledged',
      acknowledgedBy: 'John Doe (Caregiver)',
    })
  }

  const handleResolve = () => {
    setActiveRequest(null)
  }

  return (
    <AppShell currentRole={currentRole}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-cc-ink">Care Assistance</h1>
          <p className="text-sm text-cc-muted mt-1">
            Tap an option below to immediately notify your active family and caregivers.
          </p>
        </div>

        {/* NON-EMERGENCY REGULATORY DISCLAIMER */}
        <div
          role="note"
          className="p-4 rounded-card bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs"
        >
          <ShieldAlert className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="block font-bold mb-0.5">Important Safety Notice:</strong>
            CareCircle is a family and caregiver collaboration platform, not an emergency response service. If you are experiencing a life-threatening medical emergency, chest pain, or severe difficulty breathing, please immediately call <strong>911</strong> or your local emergency dispatch.
          </div>
        </div>

        {/* ACTIVE REQUEST STATUS CARD */}
        {activeRequest && (
          <SurfaceCard className="p-6 border-2 border-cc-lemon bg-white shadow-md animate-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeRequest.status === 'acknowledged'
                      ? 'bg-cc-mint text-green-900'
                      : 'bg-cc-lemon text-cc-ink'
                  }`}
                >
                  {activeRequest.status === 'acknowledged' ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <HelpCircle className="w-7 h-7 animate-pulse" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cc-muted">
                      Active Assistance Request
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        activeRequest.status === 'acknowledged'
                          ? 'bg-cc-mint text-green-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {activeRequest.status === 'acknowledged' ? 'Acknowledged' : 'Dispatched / Open'}
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-xl text-cc-ink mt-0.5">
                    {activeRequest.kind}
                  </h3>
                  <p className="text-xs text-cc-muted mt-0.5">Dispatched at {activeRequest.timestamp}</p>
                  {activeRequest.acknowledgedBy && (
                    <p className="text-sm font-semibold text-green-800 mt-2">
                      ✓ Acknowledged by {activeRequest.acknowledgedBy}. They are responding now.
                    </p>
                  )}
                </div>
              </div>

              {activeRequest.status === 'open' ? (
                <button
                  onClick={handleSimulateAck}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-cc-border hover:bg-black/5"
                >
                  Simulate Caregiver Ack
                </button>
              ) : (
                <button
                  onClick={handleResolve}
                  className="px-4 py-2 rounded-full bg-cc-ink text-white text-xs font-bold hover:opacity-90"
                >
                  Resolve Request
                </button>
              )}
            </div>
          </SurfaceCard>
        )}

        {/* 4 PROMINENT ONE-TAP ASSISTANCE CONTROLS (Elder-friendly, min 80px height) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleSendHelp('medication', 'Medication Assistance')}
            disabled={isSubmitting}
            className="p-6 rounded-card bg-white border-2 border-cc-border hover:border-cc-ink hover:shadow-card transition-all text-left flex items-center gap-4 min-h-[96px] active:scale-[0.99]"
            aria-label="Request Medication Assistance"
          >
            <div className="w-14 h-14 rounded-2xl bg-cc-mist text-green-900 flex items-center justify-center flex-shrink-0">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg text-cc-ink">Medication Help</h2>
              <p className="text-xs text-cc-muted mt-0.5">Difficulty taking or finding dose</p>
            </div>
          </button>

          <button
            onClick={() => handleSendHelp('appointment', 'Appointment Transport Help')}
            disabled={isSubmitting}
            className="p-6 rounded-card bg-white border-2 border-cc-border hover:border-cc-ink hover:shadow-card transition-all text-left flex items-center gap-4 min-h-[96px] active:scale-[0.99]"
            aria-label="Request Appointment Transport Assistance"
          >
            <div className="w-14 h-14 rounded-2xl bg-cc-ice text-blue-900 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg text-cc-ink">Appointment Transport</h2>
              <p className="text-xs text-cc-muted mt-0.5">Need a ride to doctor visit</p>
            </div>
          </button>

          <button
            onClick={() => handleSendHelp('contact', 'Contact Caregiver Prompt')}
            disabled={isSubmitting}
            className="p-6 rounded-card bg-white border-2 border-cc-border hover:border-cc-ink hover:shadow-card transition-all text-left flex items-center gap-4 min-h-[96px] active:scale-[0.99]"
            aria-label="Prompt Caregiver to Call"
          >
            <div className="w-14 h-14 rounded-2xl bg-cc-lemon/60 text-cc-ink flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg text-cc-ink">Call Me Please</h2>
              <p className="text-xs text-cc-muted mt-0.5">Ask caregiver to phone me</p>
            </div>
          </button>

          <button
            onClick={() => handleSendHelp('other', 'General Care Assistance')}
            disabled={isSubmitting}
            className="p-6 rounded-card bg-white border-2 border-cc-border hover:border-cc-ink hover:shadow-card transition-all text-left flex items-center gap-4 min-h-[96px] active:scale-[0.99]"
            aria-label="Request General Care Assistance"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg text-cc-ink">Other Care Help</h2>
              <p className="text-xs text-cc-muted mt-0.5">Groceries, check-in, or comfort</p>
            </div>
          </button>
        </div>

        {/* Optional Note Field */}
        <SurfaceCard className="p-5">
          <label htmlFor="assist-note" className="block text-sm font-semibold text-cc-ink mb-1.5">
            Add optional message for your caregivers:
          </label>
          <input
            id="assist-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. My ride cancelled for tomorrow's appointment."
            className="w-full h-12 px-4 rounded-xl border border-cc-border text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
          />
        </SurfaceCard>
      </div>
    </AppShell>
  )
}
