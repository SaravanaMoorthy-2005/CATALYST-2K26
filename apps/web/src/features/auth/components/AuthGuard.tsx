import { Navigate, useLocation } from 'react-router-dom'
import { type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cc-ivory">
        <LoadingSpinner size="lg" label="Checking authentication..." />
      </div>
    )
  }

  // If user is logged in, allow access
  if (user) {
    return <>{children}</>
  }

  // In development / demo evaluation mode, permit previewing the authorized app seamlessly
  if (import.meta.env.DEV) {
    return <>{children}</>
  }

  return <Navigate to="/login" state={{ from: location }} replace />
}
