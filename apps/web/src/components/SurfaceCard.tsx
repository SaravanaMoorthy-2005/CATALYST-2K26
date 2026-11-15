import { type ReactNode } from 'react'
import { cn } from '../lib/utils'

interface SurfaceCardProps {
  children: ReactNode
  className?: string
  /** Override default padding (defaults to p-6) */
  padding?: string
  as?: 'div' | 'article' | 'section' | 'li'
}

/**
 * Reusable white surface card.
 * 22px radius, card shadow, cc-surface background, cc-border border.
 */
export function SurfaceCard({
  children,
  className,
  padding = 'p-6',
  as: Tag = 'div',
}: SurfaceCardProps) {
  return (
    <Tag
      className={cn(
        'rounded-card bg-cc-surface dark:bg-[#1B2B2B] shadow-card border border-cc-border dark:border-white/50 text-cc-ink dark:text-[#F5F5F5] transition-colors',
        padding,
        className,
      )}
    >
      {children}
    </Tag>
  )
}
