import { useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { SurfaceCard } from '../../components/SurfaceCard'
import { AccessibleDialog } from '../../components/AccessibleDialog'
import { GitCompare, ShieldAlert, CheckCircle2, XCircle, FileText, ArrowRight, AlertTriangle } from 'lucide-react'
import { useAuth } from '../auth/hooks/useAuth'

interface DiffItem {
  name: string
  action: 'added' | 'changed' | 'discontinued' | 'unchanged'
  currentDetails?: string
  proposedDetails: string
}

export default function DischargeSyncPage() {
  const { currentRole } = useAuth()
  const [proposals, setProposals] = useState([
    {
      id: 'prop_1',
      hospital: 'St. Jude Medical Center — Post-Discharge Summary',
      date: 'Nov 14, 2026',
      status: 'pending_review' as 'pending_review' | 'approved' | 'rejected',
      sourceNote: 'Adjusted hypertensive regimen following hospital discharge.',
      diffs: [
        {
          name: 'Metformin',
          action: 'changed' as const,
          currentDetails: '500mg Tablet — Daily at 01:00 PM',
          proposedDetails: '850mg Tablet — Daily at 01:00 PM (Increased dosage)',
        },
        {
          name: 'Aspirin Low Dose',
          action: 'added' as const,
          proposedDetails: '81mg Tablet — Daily at 08:00 AM (Cardioprotective)',
        },
        {
          name: 'Hydrochlorothiazide',
          action: 'discontinued' as const,
          currentDetails: '25mg Tablet — Discontinued by attending clinician',
          proposedDetails: 'Discontinued',
        },
        {
          name: 'Atorvastatin',
          action: 'unchanged' as const,
          currentDetails: '20mg Tablet — Daily at 08:00 AM',
          proposedDetails: 'Continue unchanged at 20mg Daily',
        },
      ],
    },
  ])

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    proposalId?: string
    action?: 'approve' | 'reject'
  }>({ isOpen: false })

  const [feedback, setFeedback] = useState<string | null>(null)

  const handleDecision = () => {
    if (!confirmModal.proposalId || !confirmModal.action) return

    setProposals((prev) =>
      prev.map((p) =>
        p.id === confirmModal.proposalId
          ? { ...p, status: confirmModal.action === 'approve' ? 'approved' : 'rejected' }
          : p
      )
    )

    const msg =
      confirmModal.action === 'approve'
        ? '✓ DischargeSync approved. Future medication occurrences and reminders reconciled. Past adherence history preserved.'
        : 'DischargeSync proposal rejected.'

    setFeedback(msg)
    setConfirmModal({ isOpen: false })
    setTimeout(() => setFeedback(null), 6000)
  }

  return (
    <AppShell currentRole={currentRole}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-headline text-3xl font-bold text-cc-ink">DischargeSync</h1>
          <p className="text-sm text-cc-muted mt-1">
            Clinical discharge prescription reconciliation, comparative change diffing, and auditable human review.
          </p>
        </div>

        {feedback && (
          <div role="status" className="p-4 rounded-card bg-cc-mint border border-green-300 text-green-900 font-medium">
            {feedback}
          </div>
        )}

        {/* CLINICAL SAFETY BANNER */}
        <div className="p-4 rounded-card bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Mandatory Human Authorization Guard:</strong> DischargeSync compares new hospital or clinician discharge proposals against current regimens. OCR or AI-extracted drafts are <em>never</em> automatically activated. An authorized caregiver or elder must explicitly inspect and approve changes.
          </div>
        </div>

        {/* PROPOSALS LIST */}
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <SurfaceCard key={proposal.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-cc-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cc-muted">
                      Discharge Proposal
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        proposal.status === 'approved'
                          ? 'bg-cc-mint text-green-900'
                          : proposal.status === 'rejected'
                          ? 'bg-red-100 text-red-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {proposal.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="font-headline font-bold text-xl text-cc-ink mt-0.5">
                    {proposal.hospital}
                  </h3>
                  <p className="text-xs text-cc-muted mt-0.5">
                    Visit Date: {proposal.date} · Note: {proposal.sourceNote}
                  </p>
                </div>

                {proposal.status === 'pending_review' && (currentRole === 'owner' || currentRole === 'caregiver') && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setConfirmModal({ isOpen: true, proposalId: proposal.id, action: 'reject' })
                      }
                      className="px-4 py-2 rounded-full border border-cc-border text-xs font-bold text-red-700 hover:bg-red-50"
                    >
                      Reject Changes
                    </button>
                    <button
                      onClick={() =>
                        setConfirmModal({ isOpen: true, proposalId: proposal.id, action: 'approve' })
                      }
                      className="px-5 py-2 rounded-full bg-cc-ink text-cc-ivory text-xs font-bold hover:opacity-90 shadow-sm"
                    >
                      Approve & Reconcile
                    </button>
                  </div>
                )}
              </div>

              {/* Side-by-side comparative diff */}
              <div className="space-y-3">
                <h4 className="font-headline font-bold text-sm text-cc-ink flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-cc-ink" />
                  Prescription Comparative Diff
                </h4>

                <div className="space-y-2.5">
                  {proposal.diffs.map((diff, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-cc-ivory border border-cc-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold uppercase text-[11px] flex-shrink-0 ${
                            diff.action === 'added'
                              ? 'bg-green-100 text-green-800'
                              : diff.action === 'changed'
                              ? 'bg-blue-100 text-blue-800'
                              : diff.action === 'discontinued'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {diff.action === 'added' && '+ Added'}
                          {diff.action === 'changed' && '✏ Changed'}
                          {diff.action === 'discontinued' && '⛔ Discontinued'}
                          {diff.action === 'unchanged' && '✓ Unchanged'}
                        </span>
                        <span className="font-headline font-bold text-base text-cc-ink">
                          {diff.name}
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-cc-ink">
                        {diff.currentDetails && (
                          <div className="text-cc-muted">
                            <span className="font-semibold text-cc-ink">Current: </span>
                            {diff.currentDetails}
                          </div>
                        )}
                        {diff.currentDetails && diff.action !== 'unchanged' && (
                          <ArrowRight className="hidden md:block w-3.5 h-3.5 text-cc-muted flex-shrink-0" />
                        )}
                        <div>
                          <span className="font-semibold text-cc-ink">Proposed: </span>
                          <span className="font-bold text-cc-ink">{diff.proposedDetails}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>

        {/* CONFIRMATION MODAL */}
        <AccessibleDialog
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false })}
          title={confirmModal.action === 'approve' ? 'Confirm Prescription Reconciliation' : 'Reject Proposal'}
        >
          <div className="space-y-4">
            <p className="text-sm text-cc-muted">
              {confirmModal.action === 'approve' ? (
                <>
                  By approving, the active medication schedule will be transactionally updated with the clinician's discharge instructions. Future dose occurrences and reminder jobs will be updated automatically. <strong>All past dose logs and adherence records remain permanently preserved.</strong>
                </>
              ) : (
                'Are you sure you want to reject this discharge proposal? Current medication schedules will remain unmodified.'
              )}
            </p>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false })}
                className="px-4 py-2.5 rounded-full border border-cc-border text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10 text-cc-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleDecision}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm ${
                  confirmModal.action === 'approve'
                    ? 'bg-cc-ink text-cc-ivory hover:opacity-90'
                    : 'bg-red-700 text-white hover:bg-red-800'
                }`}
              >
                {confirmModal.action === 'approve' ? 'Authorize & Apply' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </AccessibleDialog>
      </div>
    </AppShell>
  )
}
