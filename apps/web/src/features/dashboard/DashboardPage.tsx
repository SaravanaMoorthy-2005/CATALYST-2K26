import { useState } from 'react'
import { useAuth } from '../auth/hooks/useAuth'
import { AppShell } from '../../components/AppShell'
import { ElderDashboard } from './ElderDashboard'
import { CaregiverDashboard } from './CaregiverDashboard'
import { FamilyDashboard } from './FamilyDashboard'
import { SurfaceCard } from '../../components/SurfaceCard'
import { Calendar as CalendarIcon, Pill, Users, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Role } from '@carecircle/shared'

export default function DashboardPage() {
  const { currentRole, setCurrentRole } = useAuth()
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate())

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole)
  }

  // Right utility panel: Solarpunk compact accessible calendar & quick medicine list
  const RightUtilityPanel = (
    <div className="space-y-6">
      {/* COMPACT MONTH CALENDAR */}
      <SurfaceCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="icon-bed w-8 h-8">
              <CalendarIcon className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="font-headline font-bold text-base text-ochre">
              November 2026
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-full hover:bg-leaf/10 text-ochre-warm transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 rounded-full hover:bg-leaf/10 text-ochre-warm transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-ochre-warm mb-2">
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
                className={`h-8 rounded-full flex flex-col items-center justify-center font-bold transition-all relative ${
                  isSelected
                    ? 'sun-button text-white shadow-sm'
                    : isToday
                    ? 'bg-amber-200/80 text-amber-950 border border-amber-300'
                    : 'hover:bg-leaf/10 text-ochre'
                }`}
              >
                <span>{day}</span>
                {hasEvent && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute bottom-1" />
                )}
              </button>
            )
          })}
        </div>
      </SurfaceCard>

      {/* MY MEDICINES SUMMARY */}
      <SurfaceCard className="p-6">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="icon-bed w-8 h-8">
              <Pill className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="font-headline font-bold text-base text-ochre">
              Active Prescriptions
            </h4>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
            3 Active
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-[16px] bg-white border border-leaf/15 flex items-center justify-between text-xs shadow-xs">
            <div>
              <p className="font-bold text-ochre text-sm">Atorvastatin</p>
              <p className="text-ochre-warm font-semibold">20mg · Daily at 08:00 AM</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold border border-emerald-200">
              Taken
            </span>
          </div>

          <div className="p-3.5 rounded-[16px] bg-white border border-leaf/15 flex items-center justify-between text-xs shadow-xs">
            <div>
              <p className="font-bold text-ochre text-sm">Metformin</p>
              <p className="text-ochre-warm font-semibold">500mg · Daily at 01:00 PM</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 font-bold border border-amber-300">
              Due 1 PM
            </span>
          </div>

          <div className="p-3.5 rounded-[16px] bg-white border border-leaf/15 flex items-center justify-between text-xs shadow-xs">
            <div>
              <p className="font-bold text-ochre text-sm">Lisinopril</p>
              <p className="text-ochre-warm font-semibold">10mg · Daily at 08:00 PM</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-950 font-bold border border-sky-200">
              Due 8 PM
            </span>
          </div>
        </div>
      </SurfaceCard>

      {/* CARE TEAM WIDGET */}
      <SurfaceCard className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="icon-bed w-8 h-8">
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <h4 className="font-headline font-bold text-base text-ochre">
            Care Circle
          </h4>
        </div>
        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-[14px] bg-white border border-leaf/15 flex items-center justify-between">
            <span className="font-bold text-ochre text-sm">Sarah Jenkins, RN</span>
            <span className="text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">Primary Caretaker</span>
          </div>
          <div className="p-2.5 rounded-[14px] bg-white border border-leaf/15 flex items-center justify-between">
            <span className="font-bold text-ochre text-sm">Marcus Vance</span>
            <span className="text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full font-bold">Family</span>
          </div>
        </div>
      </SurfaceCard>
    </div>
  )

  return (
    <AppShell currentRole={currentRole} rightPanel={RightUtilityPanel}>
      <div className="space-y-6">
        {/* ROLE SWITCHER SOLARPUNK BANNER */}
        <div className="p-3.5 bg-mint-white border border-leaf/25 rounded-[20px] flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="icon-bed w-7 h-7">
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="text-xs font-bold text-ochre-warm uppercase tracking-wider">
              Active Portal View:
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-950 border border-amber-300 capitalize">
              {currentRole}
            </span>
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="Role Switcher">
            <button
              onClick={() => handleRoleChange('owner')}
              className={`px-4 py-2 rounded-pill text-xs font-bold transition-all ${
                currentRole === 'owner'
                  ? 'sun-button text-white shadow-sm'
                  : 'bg-white text-ochre border border-leaf/20 hover:bg-leaf/10'
              }`}
            >
              👵 CareDay (Elder)
            </button>
            <button
              onClick={() => handleRoleChange('caregiver')}
              className={`px-4 py-2 rounded-pill text-xs font-bold transition-all ${
                currentRole === 'caregiver'
                  ? 'sun-button text-white shadow-sm'
                  : 'bg-white text-ochre border border-leaf/20 hover:bg-leaf/10'
              }`}
            >
              🩺 CarePulse (Caregiver)
            </button>
            <button
              onClick={() => handleRoleChange('family')}
              className={`px-4 py-2 rounded-pill text-xs font-bold transition-all ${
                currentRole === 'family'
                  ? 'sun-button text-white shadow-sm'
                  : 'bg-white text-ochre border border-leaf/20 hover:bg-leaf/10'
              }`}
            >
              👨‍👩‍👧 Family Overview
            </button>
          </div>
        </div>

        {/* CONDITIONAL DASHBOARD RENDERING */}
        {currentRole === 'owner' && <ElderDashboard />}
        {currentRole === 'caregiver' && <CaregiverDashboard />}
        {currentRole === 'family' && <FamilyDashboard />}
      </div>
    </AppShell>
  )
}
