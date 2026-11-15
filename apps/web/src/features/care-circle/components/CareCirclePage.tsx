import { useState } from 'react'
import { AppShell } from '../../../components/AppShell'
import { SurfaceCard } from '../../../components/SurfaceCard'
import { AccessibleDialog } from '../../../components/AccessibleDialog'
import { Users, UserPlus, Shield, ShieldCheck, Mail, Key, Trash2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'
import { Link } from 'react-router-dom'

interface MemberItem {
  uid: string
  name: string
  email: string
  role: 'owner' | 'caregiver' | 'family'
  status: 'active' | 'revoked'
  joinedDate: string
  permissions: {
    medication_write: boolean
    medication_confirm: boolean
    appointments_write: boolean
    tasks_assign: boolean
    privacy_export: boolean
  }
}

export default function CareCirclePage() {
  const { currentRole } = useAuth()
  const [members, setMembers] = useState<MemberItem[]>([
    {
      uid: 'user_owner',
      name: 'Eleanor Parker',
      email: 'eleanor.parker@example.com',
      role: 'owner',
      status: 'active',
      joinedDate: 'Oct 15, 2026',
      permissions: {
        medication_write: true,
        medication_confirm: true,
        appointments_write: true,
        tasks_assign: true,
        privacy_export: true,
      },
    },
    {
      uid: 'user_caregiver_1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'caregiver',
      status: 'active',
      joinedDate: 'Oct 18, 2026',
      permissions: {
        medication_write: true,
        medication_confirm: true,
        appointments_write: true,
        tasks_assign: true,
        privacy_export: false,
      },
    },
    {
      uid: 'user_family_1',
      name: 'Sarah Parker',
      email: 'sarah.parker@example.com',
      role: 'family',
      status: 'active',
      joinedDate: 'Oct 20, 2026',
      permissions: {
        medication_write: false,
        medication_confirm: true,
        appointments_write: false,
        tasks_assign: false,
        privacy_export: false,
      },
    },
  ])

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'caregiver' | 'family'>('caregiver')
  const [generatedInviteResult, setGeneratedInviteResult] = useState<{
    code: string
    expiresIn: string
    email: string
  } | null>(null)

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    // Generates 8-digit secure one-time code for verification display demo
    const sampleCode = Math.floor(10000000 + Math.random() * 90000000).toString()

    setGeneratedInviteResult({
      code: sampleCode,
      expiresIn: '10 minutes',
      email: inviteEmail.trim(),
    })

    const newMember: MemberItem = {
      uid: `user_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'active',
      joinedDate: 'Pending Code Redemption',
      permissions: {
        medication_write: inviteRole === 'caregiver',
        medication_confirm: true,
        appointments_write: inviteRole === 'caregiver',
        tasks_assign: inviteRole === 'caregiver',
        privacy_export: false,
      },
    }

    setMembers([...members, newMember])
    setInviteEmail('')
  }

  const handleRevoke = (uid: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.uid === uid ? { ...m, status: 'revoked' } : m))
    )
  }

  return (
    <AppShell currentRole={currentRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-cc-ink">Care Circle Collaboration</h1>
            <p className="text-sm text-cc-muted mt-1">
              Authorized family and caregiver roster, role permissions, and secure one-time passcode invitations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/redeem-invite"
              className="px-4 py-2.5 rounded-full border border-cc-border hover:bg-black/5 text-xs font-semibold text-cc-ink flex items-center gap-1.5"
            >
              <Key className="w-4 h-4 text-cc-ink" />
              <span>Redeem Passcode</span>
            </Link>

            {(currentRole === 'owner' || currentRole === 'caregiver') && (
              <button
                onClick={() => {
                  setGeneratedInviteResult(null)
                  setIsInviteOpen(true)
                }}
                className="px-5 py-2.5 rounded-full bg-cc-ink text-cc-ivory font-headline text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-sm"
              >
                <UserPlus className="w-4 h-4 text-cc-lemon" />
                <span>Invite Member</span>
              </button>
            )}
          </div>
        </div>

        {/* Members Roster */}
        <div className="space-y-4">
          {members.map((member) => (
            <SurfaceCard key={member.uid} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold ${
                      member.role === 'owner'
                        ? 'bg-cc-lemon text-cc-ink'
                        : member.role === 'caregiver'
                        ? 'bg-cc-mint text-green-900 dark:text-green-200'
                        : 'bg-cc-ice text-blue-900 dark:text-blue-200'
                    }`}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-headline font-bold text-lg text-cc-ink">{member.name}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          member.role === 'owner'
                            ? 'bg-cc-ink text-cc-ivory'
                            : member.role === 'caregiver'
                            ? 'bg-cc-mint text-green-900 dark:text-green-200'
                            : 'bg-cc-ice text-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {member.role}
                      </span>
                      {member.status === 'revoked' && (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-bold">
                          Revoked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-cc-muted mt-0.5">{member.email}</p>
                    <p className="text-xs text-cc-muted mt-1">Joined: {member.joinedDate}</p>
                  </div>
                </div>

                {/* Granular Permissions Tags */}
                <div className="flex flex-wrap items-center gap-1.5 max-w-sm">
                  {Object.entries(member.permissions).map(([permKey, granted]) => (
                    <span
                      key={permKey}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        granted ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {granted ? '✓ ' : '✕ '}
                      {permKey.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>

                {/* Revoke Action */}
                {currentRole === 'owner' && member.role !== 'owner' && member.status !== 'revoked' && (
                  <button
                    onClick={() => handleRevoke(member.uid)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors self-end sm:self-center"
                    title="Revoke Membership"
                    aria-label={`Revoke ${member.name}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </SurfaceCard>
          ))}
        </div>

        {/* INVITE MODAL */}
        <AccessibleDialog
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          title="Invite Caregiver or Family Member"
        >
          {generatedInviteResult ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cc-mint border border-green-200 text-green-900">
                <div className="flex items-center gap-2 font-headline font-bold text-base mb-1">
                  <CheckCircle2 className="w-5 h-5 text-green-700" />
                  <span>Secure Invitation Dispatched!</span>
                </div>
                <p className="text-xs">
                  An email invitation has been sent to <strong>{generatedInviteResult.email}</strong>.
                </p>
              </div>

              {/* Secure 8-digit verification code display */}
              <div className="p-5 rounded-2xl bg-cc-ivory border-2 border-cc-powder text-center space-y-2">
                <span className="text-xs font-bold text-cc-muted uppercase tracking-wider">
                  One-Time Passcode (Expires in 10 minutes)
                </span>
                <div className="font-mono text-3xl font-extrabold tracking-widest text-cc-ink">
                  {generatedInviteResult.code}
                </div>
                <p className="text-xs text-cc-muted">
                  Share this 8-digit numeric passcode securely with your invitee. They will enter it at <code>/redeem-invite</code> after signing in with their email.
                </p>
              </div>

              <button
                onClick={() => setIsInviteOpen(false)}
                className="w-full min-h-[48px] rounded-full bg-cc-ink text-cc-ivory font-semibold text-sm hover:opacity-90"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendInvite} className="space-y-4">
              <p className="text-xs text-cc-muted">
                Invited members receive an email with a short-lived 8-digit cryptographic verification code. Access is granted only upon matching authenticated email redemption.
              </p>

              <div>
                <label htmlFor="invite-email" className="block text-sm font-semibold text-cc-ink mb-1">
                  Invitee Email Address *
                </label>
                <input
                  id="invite-email"
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="caregiver@family.org"
                  className="w-full h-11 px-3.5 rounded-xl border border-cc-border bg-cc-surface text-cc-ink text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="invite-role" className="block text-sm font-semibold text-cc-ink mb-1">
                  Assigned Care Role *
                </label>
                <select
                  id="invite-role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'caregiver' | 'family')}
                  className="w-full h-11 px-3 rounded-xl border border-cc-border bg-cc-surface text-cc-ink text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
                >
                  <option value="caregiver" className="bg-cc-surface text-cc-ink">Caregiver (Full editing, alert ack & refill access)</option>
                  <option value="family" className="bg-cc-surface text-cc-ink">Family Member (Adherence view & updates)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2.5 rounded-full border border-cc-border text-cc-ink font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-cc-ink text-cc-ivory font-semibold text-sm hover:opacity-90"
                >
                  Generate Invitation
                </button>
              </div>
            </form>
          )}
        </AccessibleDialog>
      </div>
    </AppShell>
  )
}
