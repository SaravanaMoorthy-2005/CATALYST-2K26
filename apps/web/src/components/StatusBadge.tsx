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
  { label: string; bg: string; text: string; border: string; Icon: React.ElementType }
> = {
  taken: {
    label: 'Taken',
    bg: 'bg-emerald-100/70',
    text: 'text-emerald-900',
    border: 'border-emerald-300',
    Icon: CheckCircle2,
  },
  skipped: {
    label: 'Skipped',
    bg: 'bg-amber-100/50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    Icon: XCircle,
  },
  due: {
    label: 'Due',
    bg: 'bg-amber-200/60',
    text: 'text-amber-950 font-bold',
    border: 'border-amber-400',
    Icon: Clock,
  },
  unconfirmed: {
    label: 'Unconfirmed',
    bg: 'bg-purple-100/70',
    text: 'text-purple-900',
    border: 'border-purple-300',
    Icon: HelpCircle,
  },
  pending: {
    label: 'Pending',
    bg: 'bg-amber-100/60',
    text: 'text-amber-900',
    border: 'border-amber-300',
    Icon: AlertCircle,
  },
  active: {
    label: 'Active',
    bg: 'bg-emerald-100/80',
    text: 'text-emerald-900 font-semibold',
    border: 'border-emerald-300',
    Icon: Activity,
  },
  paused: {
    label: 'Paused',
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-300',
    Icon: PauseCircle,
  },
  overdue: {
    label: 'Overdue',
    bg: 'bg-rose-100',
    text: 'text-rose-900 font-bold',
    border: 'border-rose-300',
    Icon: TimerOff,
  },
  scheduled: {
    label: 'Scheduled',
    bg: 'bg-sky-100/70',
    text: 'text-sky-900',
    border: 'border-sky-300',
    Icon: Clock,
  },
  archived: {
    label: 'Archived',
    bg: 'bg-stone-100',
    text: 'text-stone-600',
    border: 'border-stone-200',
    Icon: PauseCircle,
  },
}

/**
 * Status badge with both text AND icon — never color alone.
 * Solarpunk organic rounded pill with subtle nature-toned border.
 * Fully accessible: screen readers get the text label.
 */
export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const { label: defaultLabel, bg, text, border, Icon } = variantConfig[variant]
  const displayLabel = label ?? defaultLabel

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-3.5 py-1 text-sm font-semibold font-sans border shadow-sm',
        bg,
        text,
        border,
        className,
      )}
      role="status"
      aria-label={displayLabel}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  )
}
