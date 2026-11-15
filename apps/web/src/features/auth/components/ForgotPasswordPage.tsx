import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotFormData = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  })

  async function onSubmit(data: ForgotFormData) {
    setError(null)
    try {
      await sendPasswordReset(data.email)
      setSuccess(true)
    } catch {
      setError('Could not send reset email. Please verify your address.')
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
          <h2 className="font-headline text-2xl font-semibold text-cc-ink mb-2">Reset Password</h2>
          <p className="text-sm text-cc-muted mb-6">
            Enter your email address and we'll send a link to reset your password.
          </p>

          {success ? (
            <div className="p-4 bg-cc-mint border border-green-200 rounded-xl text-green-800 text-sm mb-6">
              Password reset link sent! Check your inbox for instructions.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              {error && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                required
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
                Send Reset Link
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-cc-muted">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-cc-ink underline hover:opacity-80">
              Back to Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
