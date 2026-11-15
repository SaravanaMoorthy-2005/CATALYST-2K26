import { Bell, Globe, ZoomIn, Sun, Moon, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

interface TopbarProps {
  onToggleMobileNav?: () => void
  unreadAlertCount?: number
  currentLanguage: 'en' | 'ta' | 'hi'
  onLanguageChange: (lang: 'en' | 'ta' | 'hi') => void
  isLargeText: boolean
  onToggleLargeText: () => void
}

export function Topbar({
  onToggleMobileNav,
  unreadAlertCount = 0,
  currentLanguage,
  onLanguageChange,
  isLargeText,
  onToggleLargeText,
}: TopbarProps) {
  const { setMode, isDark } = useTheme()

  return (
    <header className="h-16 px-4 md:px-8 border-b border-cc-border flex items-center justify-between cc-glass-shell sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 rounded-lg text-cc-ink hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="hidden sm:block">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cc-mist text-cc-ink border border-cc-border">
            CareCircle 3.0
          </span>
        </div>
      </div>

      {/* Accessibility, Language & Theme controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language selector */}
        <div className="flex items-center bg-white/90 dark:bg-stone-800 rounded-full border border-cc-border px-2 py-1 text-xs shadow-2xs">
          <Globe className="w-3.5 h-3.5 text-cc-muted mr-1.5" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value as 'en' | 'ta' | 'hi')}
            className="bg-transparent font-medium text-cc-ink focus:outline-none cursor-pointer"
            aria-label="Select Language"
          >
            <option value="en" className="text-stone-900 bg-white">English</option>
            <option value="ta" className="text-stone-900 bg-white">தமிழ் (Tamil)</option>
            <option value="hi" className="text-stone-900 bg-white">हिंदी (Hindi)</option>
          </select>
        </div>

        {/* Text size control */}
        <button
          onClick={onToggleLargeText}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors shadow-2xs ${
            isLargeText
              ? 'bg-cc-ink text-cc-ivory border-cc-ink'
              : 'bg-white/90 dark:bg-stone-800 text-cc-ink border-cc-border hover:bg-white dark:hover:bg-stone-700'
          }`}
          aria-label={isLargeText ? 'Disable large text mode' : 'Enable large text mode'}
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Text</span>
        </button>

        {/* Round Theme Toggle (Sun and Moon icons, active one filled) */}
        <div
          role="radiogroup"
          aria-label="Theme mode"
          className="inline-flex items-center p-0.5 rounded-full bg-black/5 dark:bg-white/10 border border-cc-border shadow-2xs"
        >
          <button
            type="button"
            onClick={() => setMode('light')}
            aria-label="Light theme"
            aria-checked={!isDark}
            role="radio"
            className={`p-1.5 rounded-full transition-all ${
              !isDark
                ? 'bg-cc-ink text-cc-lemon shadow-xs'
                : 'text-cc-muted hover:text-cc-ink'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setMode('dark')}
            aria-label="Dark theme"
            aria-checked={isDark}
            role="radio"
            className={`p-1.5 rounded-full transition-all ${
              isDark
                ? 'bg-cc-powder text-cc-ink shadow-xs'
                : 'text-cc-muted hover:text-cc-ink'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-full bg-white/90 dark:bg-stone-800 border border-cc-border text-cc-ink hover:bg-white dark:hover:bg-stone-700 transition-colors shadow-2xs"
          aria-label={`View Notifications (${unreadAlertCount} unread)`}
        >
          <Bell className="w-4 h-4" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
              {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
