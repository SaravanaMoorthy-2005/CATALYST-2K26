import { cn } from '../lib/utils'
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  PauseCircle,
  TimerOff,
  HelpCircle,
  Activity,
} from 'lucide-react'

export type StatusVariant =
  | 'taken'
  | 'skipped'
  | 'due'
  | 'unconfirmed'
  | 'pending'
  | 'active'
  | 'paused'
  | 'overdue'
  | 'scheduled'
  | 'archived'

interface StatusBadgeProps {
  variant: StatusVariant
  /** Override the default label text */
  label?: string
  className?: string
}

const variantConfig: Record<
  StatusVariant,
  { label: string; bg: string; text: string; Icon: React.ElementType }
> = {
  taken: {
    label: 'Taken',
    bg: 'bg-cc-mint',
    text: 'text-green-800',
    Icon: CheckCircle2,
  },
  skipped: {
    label: 'Skipped',
    bg: 'bg-gray-100',
    text: 'text-cc-muted',
    Icon: XCircle,
  },
  due: {
    label: 'Due',
    bg: 'bg-cc-ice',
    text: 'text-blue-800',
    Icon: Clock,
  },
  unconfirmed: {
    label: 'Unconfirmed',
    bg: 'bg-cc-mist',
    text: 'text-green-900',
    Icon: HelpCircle,
  },
  pending: {
    label: 'Pending',
    bg: 'bg-cc-mist',
    text: 'text-green-900',
    Icon: AlertCircle,
  },
  active: {
    label: 'Active',
    bg: 'bg-cc-mint',
    text: 'text-green-800',
    Icon: Activity,
  },
  paused: {
    label: 'Paused',
    bg: 'bg-gray-100',
    text: 'text-cc-muted',
    Icon: PauseCircle,
  },
  overdue: {
    label: 'Overdue',
    bg: 'bg-red-50',
    text: 'text-red-700',
    Icon: TimerOff,
  },
  scheduled: {
    label: 'Scheduled',
    bg: 'bg-cc-ice',
    text: 'text-blue-800',
    Icon: Clock,
  },
  archived: {
    label: 'Archived',
    bg: 'bg-gray-100',
    text: 'text-cc-muted',
    Icon: PauseCircle,
  },
}

/**
 * Status badge with both text AND icon — never color alone.
 * Fully accessible: screen readers get the text label.
 */
export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const { label: defaultLabel, bg, text, Icon } = variantConfig[variant]
  const displayLabel = label ?? defaultLabel

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-sm font-medium font-body',
        bg,
        text,
        className,
      )}
      role="status"
      aria-label={displayLabel}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  )
}
