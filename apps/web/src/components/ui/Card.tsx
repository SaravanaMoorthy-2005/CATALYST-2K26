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
        'organic-card rounded-card bg-mint-white border border-leaf/20 shadow-card p-6 md:p-7 text-ochre',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
