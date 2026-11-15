import { Bell, Globe, ZoomIn, Eye, Menu, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'

interface TopbarProps {
  onToggleMobileNav?: () => void
  unreadAlertCount?: number
  currentLanguage: 'en' | 'ta' | 'hi'
  onLanguageChange: (lang: 'en' | 'ta' | 'hi') => void
  isLargeText: boolean
  onToggleLargeText: () => void
  isHighContrast: boolean
  onToggleHighContrast: () => void
}

export function Topbar({
  onToggleMobileNav,
  unreadAlertCount = 0,
  currentLanguage,
  onLanguageChange,
  isLargeText,
  onToggleLargeText,
  isHighContrast,
  onToggleHighContrast,
}: TopbarProps) {
  return (
    <header className="h-16 px-4 md:px-8 border-b border-leaf/20 flex items-center justify-between cc-glass-shell sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 rounded-full text-ochre hover:bg-leaf/10"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            CareCircle Solarpunk
          </span>
        </div>
      </div>

      {/* Accessibility & Language controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language selector */}
        <div className="flex items-center bg-white/90 rounded-full border border-leaf/25 px-2.5 py-1 text-xs shadow-2xs">
          <Globe className="w-3.5 h-3.5 text-ochre-warm mr-1.5" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value as 'en' | 'ta' | 'hi')}
            className="bg-transparent font-bold text-ochre focus:outline-none cursor-pointer"
            aria-label="Select Language"
          >
            <option value="en">English</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="hi">हिंदी (Hindi)</option>
          </select>
        </div>

        {/* Text size control */}
        <button
          onClick={onToggleLargeText}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors shadow-2xs ${
            isLargeText
              ? 'sun-button text-white border-transparent'
              : 'bg-white/90 text-ochre border-leaf/25 hover:bg-leaf/10'
          }`}
          aria-label={isLargeText ? 'Disable large text mode' : 'Enable large text mode'}
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Text</span>
        </button>

        {/* High contrast toggle */}
        <button
          onClick={onToggleHighContrast}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors shadow-2xs ${
            isHighContrast
              ? 'bg-ochre text-golden border-ochre'
              : 'bg-white/90 text-ochre border-leaf/25 hover:bg-leaf/10'
          }`}
          aria-label={isHighContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Contrast</span>
        </button>

        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="relative p-2.5 rounded-full bg-white/90 border border-leaf/25 text-ochre hover:bg-leaf/10 transition-colors shadow-2xs"
          aria-label={`View Notifications (${unreadAlertCount} unread)`}
        >
          <Bell className="w-4 h-4 text-emerald-800" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
              {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
