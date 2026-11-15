import {
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

interface AccessibleDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  /** ID for aria-labelledby — auto-generated if omitted */
  titleId?: string
  children: ReactNode
  className?: string
  /** Where to render the portal (defaults to document.body) */
  portalTarget?: HTMLElement
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Accessible modal dialog with:
 * - Focus trap (Tab / Shift+Tab stays inside)
 * - Escape key closes
 * - aria-modal="true", role="dialog", aria-labelledby
 * - Returns focus to the trigger element on close
 * - Scroll-locks body while open
 */
export function AccessibleDialog({
  isOpen,
  onClose,
  title,
  titleId = 'cc-dialog-title',
  children,
  className,
  portalTarget,
}: AccessibleDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  // Store the element that opened the dialog so we can return focus.
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement
    }
  }, [isOpen])

  // Move focus into the dialog and lock body scroll.
  useEffect(() => {
    if (!isOpen) return

    const dialog = dialogRef.current
    if (!dialog) return

    const firstFocusable = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    firstFocusable?.focus()

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prevOverflow
      // Return focus to the element that triggered the dialog.
      const trigger = triggerRef.current
      if (trigger instanceof HTMLElement) trigger.focus()
    }
  }, [isOpen])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const dialog = dialogRef.current
      if (!dialog) return

      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.closest('[aria-hidden="true"]'))

      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onClose],
  )

  if (!isOpen) return null

  const content = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-cc-ink/40 transition-opacity duration-200"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          'pointer-events-none',
        )}
      >
        <div
          className={cn(
            'pointer-events-auto w-full max-w-lg rounded-dialog bg-cc-surface shadow-elevated',
            'outline-none',
            className,
          )}
        >
          {/* Dialog header */}
          <div className="flex items-start justify-between border-b border-cc-border px-6 py-4">
            <h2
              id={titleId}
              className="font-headline text-xl font-semibold text-cc-ink leading-tight"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-cc-muted transition-colors hover:bg-cc-mist hover:text-cc-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-powder focus-visible:ring-offset-2"
              type="button"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Dialog body */}
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </>
  )

  return createPortal(content, portalTarget ?? document.body)
}
