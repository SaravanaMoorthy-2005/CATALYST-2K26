import { type ReactNode } from 'react'
import { InboxIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

/**
 * Accessible empty state illustration with title, description and optional CTA.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-card border border-cc-border bg-cc-surface p-12 text-center',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-cc-mist text-cc-muted"
        aria-hidden="true"
      >
        {icon ?? <InboxIcon className="h-8 w-8" />}
      </div>
      <div className="max-w-xs">
        <p className="font-headline text-lg font-semibold text-cc-ink">{title}</p>
        {description && (
          <p className="mt-1 font-body text-sm text-cc-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
