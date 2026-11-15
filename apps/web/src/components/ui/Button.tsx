import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const variantMap = {
  // Primary = Solarpunk Sun Button (135° leaf-to-golden gradient, shadow, hover rotation & lift)
  primary:
    'sun-button text-white focus-visible:ring-golden-deep/50',
  // Secondary = Solarpunk Organic Button (Mint white, leaf green border, hover lift)
  secondary:
    'bg-mint-white text-ochre border-1.5 border-leaf/40 hover:border-leaf hover:bg-leaf/10 shadow-sm hover:shadow-md focus-visible:ring-leaf hover:-translate-y-0.5 active:scale-[0.98]',
  ghost:
    'bg-transparent text-ochre hover:bg-leaf-wash hover:text-leaf-dark focus-visible:ring-leaf',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 shadow-md hover:shadow-lg focus-visible:ring-rose-500 hover:-translate-y-0.5 active:scale-[0.98]',
}

const sizeMap = {
  sm: 'px-4 py-2 text-sm min-h-[40px] rounded-pill',
  md: 'px-6 py-3 text-base min-h-[48px] rounded-pill font-semibold',
  lg: 'px-8 py-4 text-lg min-h-[56px] rounded-pill font-bold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-sans tracking-wide transition-all duration-300 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
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
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
