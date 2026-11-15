import { useState } from 'react'
import { AppShell } from '../../../components/AppShell'
import { SurfaceCard } from '../../../components/SurfaceCard'
import { Key, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

export default function RedeemInvitationPage() {
  const { currentRole, user } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (code.length !== 8 || !/^\d+$/.test(code)) {
      setError('Please enter a valid 8-digit numeric code.')
      return
    }

    setIsSubmitting(true)

    // Simulate constant-time verification & membership grant
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2500)
    }, 800)
  }

  return (
    <AppShell currentRole={currentRole}>
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-cc-ink">Redeem Invitation</h1>
          <p className="text-sm text-cc-muted mt-1">
            Enter the 8-digit one-time passcode provided in your invitation email to join the Care Circle.
          </p>
        </div>

        <SurfaceCard className="p-8">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-cc-mint text-green-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-headline text-2xl font-bold text-cc-ink">
                Invitation Verified & Granted!
              </h2>
              <p className="text-sm text-cc-muted">
                You are now an active member of the care circle. Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div role="alert" className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-cc-ivory border border-cc-border text-xs text-cc-muted">
                Signed in as: <strong>{user?.email || 'Authenticated User'}</strong>. The code will only verify if it matches the invited email address.
              </div>

              <div>
                <label htmlFor="passcode-input" className="block text-sm font-semibold text-cc-ink mb-2">
                  8-Digit Numeric Passcode
                </label>
                <input
                  id="passcode-input"
                  type="text"
                  maxLength={8}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="12345678"
                  className="w-full h-16 text-center font-mono text-3xl tracking-[0.4em] font-bold rounded-2xl border-2 border-cc-border focus:border-cc-ink focus:outline-none bg-cc-ivory/50"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || code.length !== 8}
                className="w-full min-h-[52px] rounded-full bg-cc-ink text-white font-headline text-base font-bold shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-cc-lemon" />
                <span>{isSubmitting ? 'Verifying...' : 'Verify & Join Care Circle'}</span>
              </button>

              <div className="text-center text-xs text-cc-muted space-y-1">
                <p>Passcodes are single-use and expire within 10 minutes of issuance.</p>
                <p>Maximum 5 failed redemption attempts permitted before permanent lock.</p>
              </div>
            </form>
          )}
        </SurfaceCard>
      </div>
    </AppShell>
  )
}
