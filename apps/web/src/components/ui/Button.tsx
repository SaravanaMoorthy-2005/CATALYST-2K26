import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const variantMap = {
  primary: 'bg-cc-ink text-cc-ivory hover:bg-cc-ink/90 focus-visible:ring-cc-ink',
  secondary: 'bg-cc-powder text-cc-ink hover:bg-cc-powder/80 focus-visible:ring-cc-powder',
  ghost: 'bg-transparent text-cc-ink hover:bg-cc-ink/5 focus-visible:ring-cc-ink',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
}

const sizeMap = {
  sm: 'px-3 py-1.5 text-sm rounded-pill',
  md: 'px-5 py-2.5 text-base rounded-pill',
  lg: 'px-8 py-4 text-lg rounded-pill',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-body font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantMap[variant],
          sizeMap[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            {children}
          </span>
        ) : children}
      </button>
    )
  },
)

Button.displayName = 'Button'
