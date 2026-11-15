import { type ReactNode } from 'react'
import { cn } from '../lib/utils'

interface SurfaceCardProps {
  children: ReactNode
  className?: string
  /** Override default padding (defaults to p-6 md:p-7) */
  padding?: string
  as?: 'div' | 'article' | 'section' | 'li'
}

/**
 * Solarpunk Organic Card.
 * Mint white surface, 24px organic curve radius, subtle leaf border,
 * green-cast gentle elevation, hover lift 4px with shadow widening.
 */
export function SurfaceCard({
  children,
  className,
  padding = 'p-6 md:p-7',
  as: Tag = 'div',
}: SurfaceCardProps) {
  return (
    <Tag
      className={cn(
        'organic-card rounded-card bg-mint-white border border-leaf/20 shadow-card text-ochre',
        padding,
        className,
      )}
    >
      {children}
    </Tag>
  )
}
