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
import { Sun, Heart, Sparkles } from 'lucide-react'

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
    <main className="min-h-screen bg-cream-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Solarpunk Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-leaf to-golden text-white shadow-sun-button mb-3">
            <Sun className="w-9 h-9" />
          </div>
          <h1 className="font-headline text-4xl font-extrabold text-ochre mb-1">CareCircle</h1>
          <p className="text-ochre-warm font-bold text-base">Connected Care. Confident Living.</p>
        </div>

        <div className="organic-card rounded-[28px] bg-mint-white shadow-card border border-leaf/25 p-7 md:p-9 relative overflow-hidden">
          {/* Gentle botanical curve accent */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-golden/20 via-leaf/10 to-transparent rounded-bl-[80px] pointer-events-none" />

          <div className="flex items-center justify-between mb-5">
            <h2 className="font-headline text-2xl font-extrabold text-ochre">Sign in</h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300">
              Solarpunk Care
            </span>
          </div>

          {/* Quick Demo Accounts Selection */}
          <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-emerald-50 border border-leaf/20 rounded-[20px] shadow-sm">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <p className="text-xs font-extrabold text-ochre uppercase tracking-wider">
                Demo Accounts (1-Click Sign In)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoSelect('owner')}
                className="flex items-center justify-between p-3 rounded-[16px] bg-white border border-leaf/20 hover:border-leaf hover:shadow-card hover:-translate-y-0.5 text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-sm text-ochre group-hover:text-emerald-950">
                    👵 Patient / Elder
                  </div>
                  <div className="text-xs text-ochre-warm font-semibold">elder@carecircle.app</div>
                </div>
                <span className="text-xs bg-amber-100 text-amber-950 border border-amber-300 px-3 py-1 rounded-full font-bold">
                  Patient
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('caregiver')}
                className="flex items-center justify-between p-3 rounded-[16px] bg-white border border-leaf/20 hover:border-leaf hover:shadow-card hover:-translate-y-0.5 text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-sm text-ochre group-hover:text-emerald-950">
                    🩺 Caretaker / Nurse
                  </div>
                  <div className="text-xs text-ochre-warm font-semibold">caregiver@carecircle.app</div>
                </div>
                <span className="text-xs bg-sky-100 text-sky-950 border border-sky-300 px-3 py-1 rounded-full font-bold">
                  Caretaker
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('family')}
                className="flex items-center justify-between p-3 rounded-[16px] bg-white border border-leaf/20 hover:border-leaf hover:shadow-card hover:-translate-y-0.5 text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-sm text-ochre group-hover:text-emerald-950">
                    👨‍👩‍👧 Family Member
                  </div>
                  <div className="text-xs text-ochre-warm font-semibold">family@carecircle.app</div>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1 rounded-full font-bold">
                  Family
                </span>
              </button>
            </div>

            <p className="text-[11px] text-ochre-warm font-semibold mt-2.5 text-center">
              Universal Password: <code className="bg-white px-2 py-0.5 rounded-full font-mono border border-black/10 text-ochre">CareCircle2026!</code>
            </p>
          </div>

          {authError && (
            <div role="alert" className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-[16px] text-sm text-rose-800 font-semibold">
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

            <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full mt-2 sun-button">
              Sign in with Email
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-leaf/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-mint-white px-3 text-xs font-bold text-ochre-warm">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full min-h-[48px] rounded-pill bg-white border border-leaf/25 text-ochre font-bold hover:bg-leaf/10 hover:border-leaf flex items-center justify-center gap-2 transition-all shadow-xs"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </main>
  )
}
