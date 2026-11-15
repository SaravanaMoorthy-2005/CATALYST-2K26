import { NavLink, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Pill,
  Users,
  Clock,
  HeartPulse,
  RefreshCw,
  GitCompare,
  FileText,
  LogOut,
  HelpCircle,
  Home,
  Sun,
} from 'lucide-react'
import { Role } from '@carecircle/shared'
import { useAuth } from '../features/auth/hooks/useAuth'

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
      className="w-64 flex flex-col justify-between h-full p-4 bg-mint-white/90 border-r border-leaf/20 shadow-sm"
      aria-label="Main Navigation"
    >
      <div>
        {/* Brand header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-leaf to-golden flex items-center justify-center text-white shadow-sun-button">
            <Sun className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-headline font-bold text-xl text-ochre leading-tight">
              CareCircle
            </h1>
            <p className="text-xs text-ochre-warm font-semibold">Solarpunk Healthcare</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav>
          <ul className="space-y-2" role="list">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-pill font-headline text-base font-bold transition-all duration-300 ${
                        item.highlight
                          ? 'sun-button text-white shadow-sun-button'
                          : isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-card'
                          : 'text-ochre hover:bg-leaf/10 hover:text-emerald-950'
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
      <div className="border-t border-leaf/20 pt-4">
        <div className="px-3 py-2 mb-2 flex items-center gap-3">
          <div className="icon-bed w-10 h-10 font-bold text-sm bg-gradient-to-br from-leaf to-golden text-white shadow-xs">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ochre truncate">
              {user?.displayName || 'Eleanor Vance'}
            </p>
            <p className="text-xs text-ochre-warm font-semibold truncate capitalize">{currentRole}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-pill text-sm font-bold text-rose-800 hover:bg-rose-50 transition-colors"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
