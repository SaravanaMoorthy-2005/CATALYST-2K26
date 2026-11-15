import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Pill,
  Users,
  AlertCircle,
  Clock,
  HeartPulse,
  RefreshCw,
  GitCompare,
  FileText,
  LogOut,
  HelpCircle,
  Home,
  BellRing,
} from 'lucide-react'
import { Role } from '@carecircle/shared'
import { useAuth } from '../features/auth/hooks/useAuth'
import { Logo } from './Logo'

interface SidebarNavProps {
  currentRole: Role
  onCloseMobile?: () => void
}

export function SidebarNav({ currentRole, onCloseMobile }: SidebarNavProps) {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // Role-specific navigation links
  const getNavItems = () => {
    if (currentRole === 'owner') {
      return [
        { to: '/dashboard', label: 'CareDay (Today)', icon: Home },
        { to: '/medications', label: 'My Medicines', icon: Pill },
        { to: '/appointments', label: 'Appointments', icon: Calendar },
        { to: '/care-circle', label: 'My Care Circle', icon: Users },
        { to: '/passport', label: 'CarePassport', icon: FileText },
        { to: '/due-alert', label: 'Medicine Due Alert', icon: BellRing },
        { to: '/assistance', label: 'Need Help', icon: HelpCircle, highlight: true },
      ]
    }

    if (currentRole === 'caregiver') {
      return [
        { to: '/dashboard', label: 'CarePulse', icon: HeartPulse },
        { to: '/medications', label: 'Medications', icon: Pill },
        { to: '/appointments', label: 'Appointments', icon: Calendar },
        { to: '/tasks', label: 'CareShift Tasks', icon: Clock },
        { to: '/refills', label: 'Refill Guardian', icon: RefreshCw },
        { to: '/reconciliation', label: 'DischargeSync', icon: GitCompare },
        { to: '/care-circle', label: 'Care Circle', icon: Users },
        { to: '/due-alert', label: 'Medicine Due Alert', icon: BellRing },
        { to: '/passport', label: 'CarePassport', icon: FileText },
      ]
    }

    // Family Member
    return [
      { to: '/dashboard', label: 'Family Overview', icon: Home },
      { to: '/medications', label: 'Medications View', icon: Pill },
      { to: '/appointments', label: 'Appointments', icon: Calendar },
      { to: '/care-circle', label: 'Care Circle', icon: Users },
      { to: '/passport', label: 'CarePassport', icon: FileText },
    ]
  }

  const navItems = getNavItems()

  return (
    <aside
      className="w-64 flex flex-col justify-between h-full p-4 cc-glass-shell border-r border-cc-border"
      aria-label="Main Navigation"
    >
      <div>
        {/* Brand header with Logo */}
        <div className="px-3 py-3 mb-5">
          <Logo showText size={42} />
        </div>

        {/* Navigation list */}
        <nav>
          <ul className="space-y-1.5" role="list">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-full font-body text-base font-medium transition-all ${
                        item.highlight
                          ? 'bg-cc-lemon text-cc-ink font-semibold shadow-sm hover:opacity-90'
                          : isActive
                          ? 'bg-cc-ink text-white font-semibold shadow-sm'
                          : 'text-cc-ink hover:bg-white/80'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* User info & Logout */}
      <div className="border-t border-cc-border pt-4">
        <div className="px-3 py-2 mb-2 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-cc-mist flex items-center justify-center text-cc-ink font-semibold text-sm">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-cc-ink truncate">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs text-cc-muted truncate capitalize">{currentRole}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
