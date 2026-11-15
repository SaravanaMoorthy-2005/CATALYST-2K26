import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    role: z.enum(['owner', 'caregiver', 'family']).default('owner'),
    timezone: z.string().default('America/New_York'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'owner',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
    },
  })

  async function onSubmit(data: RegisterFormData) {
    setAuthError(null)
    try {
      await signUp(data.email, data.password, data.displayName)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/email-already-in-use') {
        setAuthError('An account with this email already exists.')
      } else {
        setAuthError('Registration failed. Please try again.')
      }
    }
  }

  async function handleGoogleSignUp() {
    setAuthError(null)
    try {
      await signInWithGoogle()
      navigate('/dashboard', { replace: true })
    } catch {
      setAuthError('Google sign-up failed. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-cc-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl font-bold text-cc-ink mb-2">CareCircle</h1>
          <p className="text-cc-muted">Connected Care. Confident Living.</p>
        </div>

        <div className="bg-cc-surface rounded-card shadow-card border border-cc-border p-8">
          <h2 className="font-headline text-2xl font-semibold text-cc-ink mb-6">Create Account</h2>

          {authError && (
            <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              required
              error={errors.displayName?.message}
              {...register('displayName')}
            />

            <Input
              label="Email"
              type="email"
              required
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              required
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="role-select" className="text-sm font-semibold text-cc-ink">
                I am signing up as:
              </label>
              <select
                id="role-select"
                className="w-full h-12 px-4 rounded-xl border border-cc-border bg-cc-surface text-cc-ink font-body text-base focus:outline-none focus:ring-2 focus:ring-cc-ink"
                {...register('role')}
              >
                <option value="owner">Elder / Care Circle Owner</option>
                <option value="caregiver">Professional or Primary Caregiver</option>
                <option value="family">Family Member</option>
              </select>
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
              Create Account
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
            onClick={handleGoogleSignUp}
          >
            Google
          </Button>

          <p className="mt-6 text-center text-sm text-cc-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-cc-ink underline hover:opacity-80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
