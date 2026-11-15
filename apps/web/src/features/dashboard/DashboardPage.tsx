import { useState } from 'react'
import { useAuth } from '../auth/hooks/useAuth'
import { AppShell } from '../../components/AppShell'
import { ElderDashboard } from './ElderDashboard'
import { CaregiverDashboard } from './CaregiverDashboard'
import { FamilyDashboard } from './FamilyDashboard'
import { SurfaceCard } from '../../components/SurfaceCard'
import { Calendar as CalendarIcon, Pill, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Role } from '@carecircle/shared'

export default function DashboardPage() {
  const { user, currentRole, setCurrentRole } = useAuth()
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate())

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole)
  }

  // Right utility panel: compact accessible calendar & quick medicine list
  const RightUtilityPanel = (
    <div className="space-y-6">
      {/* COMPACT MONTH CALENDAR */}
      <SurfaceCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-headline font-bold text-base text-cc-ink flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-cc-ink" />
            November 2026
          </h4>
          <div className="flex items-center gap-1">
            <button
              className="p-1 rounded-full hover:bg-black/5 text-cc-muted"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-1 rounded-full hover:bg-black/5 text-cc-muted"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-cc-muted mb-2">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const isToday = day === 15
            const isSelected = day === selectedDate
            const hasEvent = day === 15 || day === 16 || day === 19

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`h-8 rounded-full flex flex-col items-center justify-center font-medium transition-colors relative ${
                  isSelected
                    ? 'bg-cc-ink text-cc-ivory border border-white font-bold'
                    : isToday
                    ? 'bg-cc-lemon text-cc-ink font-bold'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 text-cc-ink'
                }`}
              >
                <span>{day}</span>
                {hasEvent && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-blue-600 absolute bottom-1" />
                )}
              </button>
            )
          })}
        </div>
      </SurfaceCard>

      {/* MY MEDICINES SUMMARY */}
      <SurfaceCard className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-headline font-bold text-base text-cc-ink flex items-center gap-2">
            <Pill className="w-4 h-4 text-cc-ink" />
            Active Prescriptions
          </h4>
          <span className="text-xs text-cc-muted font-semibold">3 Active</span>
        </div>

        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-cc-surface dark:bg-[#162E2E] border border-cc-border dark:border-white/40 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-cc-ink">Atorvastatin</p>
              <p className="text-cc-muted">20mg · Daily at 08:00 AM</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-cc-mint text-green-900 dark:text-green-200 border border-green-300 dark:border-green-800 font-semibold">Taken</span>
          </div>

          <div className="p-3 rounded-xl bg-cc-surface dark:bg-[#162E2E] border border-cc-border dark:border-white/40 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-cc-ink">Metformin</p>
              <p className="text-cc-muted">500mg · Daily at 01:00 PM</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-cc-ice text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800 font-semibold">Due 1 PM</span>
          </div>

          <div className="p-3 rounded-xl bg-cc-surface dark:bg-[#162E2E] border border-cc-border dark:border-white/40 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-cc-ink">Lisinopril</p>
              <p className="text-cc-muted">10mg · Daily at 08:00 PM</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-cc-muted border border-cc-border dark:border-white/30 font-semibold">Due 8 PM</span>
          </div>
        </div>
      </SurfaceCard>

      {/* CARE TEAM WIDGET */}
      <SurfaceCard className="p-5">
        <h4 className="font-headline font-bold text-base text-cc-ink mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-cc-ink" />
          Active Care Circle
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-cc-ink">John Doe</span>
            <span className="text-cc-muted">Caregiver (Primary)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-cc-ink">Sarah Parker</span>
            <span className="text-cc-muted">Family Member</span>
          </div>
        </div>
      </SurfaceCard>
    </div>
  )

  return (
    <AppShell currentRole={currentRole} rightPanel={RightUtilityPanel}>
      {/* ROLE SWITCHER DEMO BANNER */}
      <div className="p-3 bg-cc-surface dark:bg-[#1B2B2B] border border-cc-border dark:border-white/50 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cc-muted uppercase tracking-wider">
            Active Role View:
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cc-ink text-cc-ivory border border-white/40 capitalize">
            {currentRole}
          </span>
        </div>

        <div className="flex items-center gap-1.5" role="group" aria-label="Role Switcher">
          <button
            onClick={() => handleRoleChange('owner')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
              currentRole === 'owner'
                ? 'bg-cc-ink text-cc-lemon border-white/50'
                : 'bg-cc-surface dark:bg-[#162E2E] text-cc-ink dark:text-white border-cc-border dark:border-white/30 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            CareDay (Elder)
          </button>
          <button
            onClick={() => handleRoleChange('caregiver')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
              currentRole === 'caregiver'
                ? 'bg-cc-ink text-cc-lemon border-white/50'
                : 'bg-cc-surface dark:bg-[#162E2E] text-cc-ink dark:text-white border-cc-border dark:border-white/30 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            CarePulse (Caregiver)
          </button>
          <button
            onClick={() => handleRoleChange('family')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
              currentRole === 'family'
                ? 'bg-cc-ink text-cc-lemon border-white/50'
                : 'bg-cc-surface dark:bg-[#162E2E] text-cc-ink dark:text-white border-cc-border dark:border-white/30 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            Family Overview
          </button>
        </div>
      </div>

      {/* CONDITIONAL DASHBOARD RENDERING */}
      {currentRole === 'owner' && <ElderDashboard />}
      {currentRole === 'caregiver' && <CaregiverDashboard />}
      {currentRole === 'family' && <FamilyDashboard />}
    </AppShell>
  )
}
