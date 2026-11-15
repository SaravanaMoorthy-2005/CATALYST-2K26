import { cn } from '../lib/utils'

interface SkeletonProps {
  className?: string
}

/** Single skeleton shimmer block. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-cc-border',
        className,
      )}
      aria-hidden="true"
    />
  )
}

/** Full-page or section loading skeleton with an accessible label. */
interface LoadingSkeletonProps {
  /** Text announced to screen readers */
  label?: string
  rows?: number
  className?: string
}

export function LoadingSkeleton({
  label = 'Loading content, please wait…',
  rows = 3,
  className,
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn('space-y-3', className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-10 w-full rounded-card', i === rows - 1 && 'w-3/4')}
        />
      ))}
    </div>
  )
}

/** Card-shaped skeleton — matches SurfaceCard dimensions. */
export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-cc-border bg-cc-surface p-6 shadow-card',
        className,
      )}
      role="status"
      aria-label="Loading…"
    >
      <span className="sr-only">Loading…</span>
      <div className="space-y-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}
