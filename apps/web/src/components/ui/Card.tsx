import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section' | 'li'
}

export function Card({ children, className, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-card bg-cc-surface shadow-card border border-cc-border p-6',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
