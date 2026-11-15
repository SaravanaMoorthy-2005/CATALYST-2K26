import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint ? `${inputId}-hint` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-bold text-ochre flex items-center justify-between">
            <span>{label}</span>
            {props.required && <span aria-hidden="true" className="text-amber-600 font-semibold text-xs ml-1">(Required)</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          className={cn(
            'soft-input w-full rounded-input border bg-mint-white px-4 py-3',
            'text-ochre placeholder:text-ochre/45 font-sans text-base',
            'transition-all duration-200 ease-out',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-200'
              : 'border-leaf/30 focus:border-leaf focus:ring-4 focus:ring-leaf/20',
            className,
          )}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs text-ochre/70">{hint}</p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-rose-700 font-medium">{error}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
