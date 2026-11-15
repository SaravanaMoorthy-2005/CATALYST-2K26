import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '../lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

/**
 * Accessible error state with title, message and optional retry action.
 * Errors are announced immediately via aria-live="assertive".
 */
export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this content. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-card border border-red-100 bg-red-50 p-12 text-center',
        className,
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600"
        aria-hidden="true"
      >
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="max-w-xs">
        <p className="font-headline text-lg font-semibold text-red-800">{title}</p>
        <p className="mt-1 font-body text-sm text-red-700 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex min-h-[48px] items-center gap-2 rounded-pill border border-red-300 bg-white px-5 py-2.5 font-body text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
          type="button"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  )
}
