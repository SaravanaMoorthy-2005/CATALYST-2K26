import React, { useState } from 'react'
import { SidebarNav } from './SidebarNav'
import { Topbar } from './Topbar'
import { Role } from '@carecircle/shared'
import { Home, Pill, Calendar, Users, HelpCircle } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface AppShellProps {
  children: React.ReactNode
  currentRole?: Role
  rightPanel?: React.ReactNode
}

export function AppShell({ children, currentRole = 'owner', rightPanel }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ta' | 'hi'>('en')
  const [isLargeText, setIsLargeText] = useState(false)

  return (
    <div
      className={`min-h-screen flex flex-col bg-cc-ivory text-cc-ink transition-colors duration-200 ${
        isLargeText ? 'text-lg' : 'text-base'
      }`}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block flex-shrink-0">
          <SidebarNav currentRole={currentRole} />
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="relative z-10 w-64 bg-white h-full shadow-2xl">
              <SidebarNav
                currentRole={currentRole}
                onCloseMobile={() => setMobileNavOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar
            onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
            currentLanguage={language}
            onLanguageChange={setLanguage}
            isLargeText={isLargeText}
            onToggleLargeText={() => setIsLargeText(!isLargeText)}
          />

          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className={rightPanel ? 'lg:col-span-8 space-y-6' : 'lg:col-span-12 space-y-6'}>
                {children}
              </div>

              {/* Optional Right Utility Column */}
              {rightPanel && (
                <div className="lg:col-span-4 space-y-6">
                  {rightPanel}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Accessible Mobile Bottom Navigation Bar */}
      <nav
        className="md:hidden border-t border-cc-border bg-white/95 backdrop-blur-md px-3 py-2 flex items-center justify-around z-40 sticky bottom-0"
        aria-label="Mobile Bottom Navigation"
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 text-xs font-medium ${
              isActive ? 'text-cc-ink font-bold' : 'text-cc-muted'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Today</span>
        </NavLink>

        <NavLink
          to="/medications"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 text-xs font-medium ${
              isActive ? 'text-cc-ink font-bold' : 'text-cc-muted'
            }`
          }
        >
          <Pill className="w-5 h-5" />
          <span>Meds</span>
        </NavLink>

        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 text-xs font-medium ${
              isActive ? 'text-cc-ink font-bold' : 'text-cc-muted'
            }`
          }
        >
          <Calendar className="w-5 h-5" />
          <span>Visits</span>
        </NavLink>

        <NavLink
          to="/care-circle"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 text-xs font-medium ${
              isActive ? 'text-cc-ink font-bold' : 'text-cc-muted'
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span>Circle</span>
        </NavLink>

        {currentRole === 'owner' && (
          <NavLink
            to="/assistance"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-1 text-xs font-bold ${
                isActive ? 'text-red-700 font-extrabold' : 'text-red-600'
              }`
            }
          >
            <HelpCircle className="w-5 h-5" />
            <span>Help</span>
          </NavLink>
        )}
      </nav>
    </div>
  )
}
