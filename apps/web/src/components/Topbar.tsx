import React from 'react'
import { Bell, Globe, ZoomIn, Eye, Menu } from 'lucide-react'
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
    <header className="h-16 px-4 md:px-8 border-b border-cc-border flex items-center justify-between cc-glass-shell sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 rounded-lg text-cc-ink hover:bg-black/5"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="hidden sm:block">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cc-mist text-cc-ink">
            CareCircle 3.0
          </span>
        </div>
      </div>

      {/* Accessibility & Language controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language selector */}
        <div className="flex items-center bg-white/80 rounded-full border border-cc-border px-2 py-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-cc-muted mr-1.5" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value as 'en' | 'ta' | 'hi')}
            className="bg-transparent font-medium text-cc-ink focus:outline-none cursor-pointer"
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
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            isLargeText
              ? 'bg-cc-ink text-white border-cc-ink'
              : 'bg-white/80 text-cc-ink border-cc-border hover:bg-white'
          }`}
          aria-label={isLargeText ? 'Disable large text mode' : 'Enable large text mode'}
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Text</span>
        </button>

        {/* High contrast toggle */}
        <button
          onClick={onToggleHighContrast}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            isHighContrast
              ? 'bg-cc-ink text-cc-lemon border-cc-ink'
              : 'bg-white/80 text-cc-ink border-cc-border hover:bg-white'
          }`}
          aria-label={isHighContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Contrast</span>
        </button>

        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-full bg-white/80 border border-cc-border text-cc-ink hover:bg-white transition-colors"
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
