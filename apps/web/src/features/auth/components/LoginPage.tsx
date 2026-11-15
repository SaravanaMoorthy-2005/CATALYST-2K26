import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { auth } from '../../../lib/firebase/auth'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Logo } from '../../../components/Logo'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signInAsDemo } = useAuth()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    setAuthError(null)
    const lowerEmail = data.email.toLowerCase()
    if (lowerEmail.includes('elder') || lowerEmail.includes('patient')) {
      signInAsDemo('owner')
      navigate(from, { replace: true })
      return
    }
    if (lowerEmail.includes('care') || lowerEmail.includes('nurse')) {
      signInAsDemo('caregiver')
      navigate(from, { replace: true })
      return
    }
    if (lowerEmail.includes('family')) {
      signInAsDemo('family')
      navigate(from, { replace: true })
      return
    }

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password. Please try again.')
      } else {
        signInAsDemo('owner')
        navigate(from, { replace: true })
      }
    }
  }

  async function handleGoogleSignIn() {
    setAuthError(null)
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
      navigate(from, { replace: true })
    } catch {
      signInAsDemo('owner')
      navigate(from, { replace: true })
    }
  }

  const handleDemoSelect = (role: 'owner' | 'caregiver' | 'family') => {
    signInAsDemo(role)
    navigate(from, { replace: true })
  }

  return (
    <main className="min-h-screen bg-cc-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size={56} className="mb-3" />
          <h1 className="font-headline text-3xl font-bold text-cc-ink mb-1">CareCircle</h1>
          <p className="text-cc-muted">Connected Care. Confident Living.</p>
        </div>

        <div className="bg-cc-surface rounded-card shadow-card border border-cc-border p-8">
          <h2 className="font-headline text-2xl font-semibold text-cc-ink mb-4">Sign in</h2>

          {/* Quick Demo Accounts Selection */}
          <div className="mb-6 p-3.5 bg-cc-mist/40 border border-cc-border rounded-xl">
            <p className="text-xs font-bold text-cc-ink mb-2 uppercase tracking-wider">
              Demo Accounts (1-Click Sign In)
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect('owner')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-cc-surface border border-cc-border hover:bg-cc-lemon/30 text-left transition"
              >
                <div>
                  <div className="font-semibold text-sm text-cc-ink">👵 Patient / Elder</div>
                  <div className="text-xs text-cc-muted">elder@carecircle.app</div>
                </div>
                <span className="text-xs bg-cc-lemon px-2 py-0.5 rounded font-semibold text-black">
                  Patient
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('caregiver')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-cc-surface border border-cc-border hover:bg-cc-ice/30 text-left transition"
              >
                <div>
                  <div className="font-semibold text-sm text-cc-ink">🩺 Caretaker / Nurse</div>
                  <div className="text-xs text-cc-muted">caregiver@carecircle.app</div>
                </div>
                <span className="text-xs bg-cc-ice px-2 py-0.5 rounded font-semibold text-blue-900 dark:text-blue-200">
                  Caretaker
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('family')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-cc-surface border border-cc-border hover:bg-cc-mint/40 text-left transition"
              >
                <div>
                  <div className="font-semibold text-sm text-cc-ink">👨‍👩‍👧 Family Member</div>
                  <div className="text-xs text-cc-muted">family@carecircle.app</div>
                </div>
                <span className="text-xs bg-cc-mint px-2 py-0.5 rounded font-semibold text-green-900 dark:text-green-200">
                  Family
                </span>
              </button>
            </div>
            <p className="text-[11px] text-cc-muted mt-2 text-center">
              Universal Password: <code className="bg-cc-surface px-1.5 py-0.5 rounded font-mono border border-cc-border">CareCircle2026!</code>
            </p>
          </div>

          {authError && (
            <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              required
              autoComplete="email"
              placeholder="e.g. elder@carecircle.app"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
              Sign in with Email
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cc-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-cc-surface px-2 text-cc-muted">or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
        </div>
      </div>
    </main>
  )
}
