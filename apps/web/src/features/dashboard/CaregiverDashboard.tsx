import { useState } from 'react'
import {
  RefreshCw,
  Clock,
  Pill,
  Users,
  Activity,
  ArrowRight,
  ShieldAlert,
  HeartPulse,
  Sparkles,
} from 'lucide-react'
import { SurfaceCard } from '../../components/SurfaceCard'
import { Link } from 'react-router-dom'

interface AttentionItem {
  id: string
  type: 'unconfirmed_dose' | 'help_request' | 'low_stock' | 'task_overdue'
  title: string
  subtitle: string
  urgency: 'high' | 'medium' | 'low'
  time: string
  actionLabel: string
  actionRoute: string
}

export function CaregiverDashboard() {
  const [items] = useState<AttentionItem[]>([
    {
      id: 'item_1',
      type: 'help_request',
      title: 'Assistance Request: Contact Caregiver',
      subtitle: 'Elder tapped "Need Help" regarding appointment transport.',
      urgency: 'high',
      time: '12 mins ago',
      actionLabel: 'Respond to Request',
      actionRoute: '/assistance',
    },
    {
      id: 'item_2',
      type: 'unconfirmed_dose',
      title: 'Unconfirmed Dose: Atorvastatin 20mg',
      subtitle: 'Scheduled at 08:00 AM. 45 minutes past due window.',
      urgency: 'high',
      time: '45 mins past due',
      actionLabel: 'Verify Dose',
      actionRoute: '/medications',
    },
    {
      id: 'item_3',
      type: 'low_stock',
      title: 'Refill Guardian: Metformin 500mg Low Stock',
      subtitle: 'Estimated 4 days remaining (8 tablets left).',
      urgency: 'medium',
      time: 'Stock < 5 days',
      actionLabel: 'View Refill Task',
      actionRoute: '/refills',
    },
    {
      id: 'item_4',
      type: 'task_overdue',
      title: 'CareShift Task: Morning Vitals Check',
      subtitle: 'Assigned to Shift Member. Incomplete.',
      urgency: 'medium',
      time: 'Overdue by 1 hr',
      actionLabel: 'Complete Task',
      actionRoute: '/tasks',
    },
  ])

  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([])

  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds((prev) => [...prev, id])
  }

  return (
    <div className="space-y-7">
      {/* HEADER: CareCircle Context Bar */}
      <div className="p-5 rounded-[22px] bg-mint-white border border-leaf/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-3.5">
          <div className="icon-bed w-12 h-12 text-base font-extrabold bg-gradient-to-br from-leaf to-golden text-white shadow-sm">
            EV
          </div>
          <div>
            <h2 className="font-headline font-bold text-xl text-ochre">
              Eleanor Vance's Care Circle
            </h2>
            <p className="text-xs text-ochre-warm font-semibold">Active Care Plan · Primary Caregiver: Sarah Jenkins, RN</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            Live Sync Active
          </span>
        </div>
      </div>

      {/* ATTENTION QUEUE (Primary Focus of CarePulse) */}
      <SurfaceCard className="p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="icon-bed w-11 h-11 bg-rose-100 text-rose-800">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-ochre">
                CarePulse Attention Queue
              </h3>
              <p className="text-xs text-ochre-warm font-semibold">Prioritized clinical and caregiver follow-up actions</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            {items.filter((i) => !acknowledgedIds.includes(i.id)).length} Actions Needed
          </span>
        </div>

        <div className="space-y-3.5">
          {items.map((item) => {
            const isAck = acknowledgedIds.includes(item.id)
            return (
              <div
                key={item.id}
                className={`p-5 rounded-[20px] border transition-all ${
                  isAck
                    ? 'bg-stone-50 border-stone-200 opacity-60'
                    : item.urgency === 'high'
                    ? 'bg-rose-50/50 border-rose-200 shadow-sm'
                    : 'bg-white border-leaf/15 hover:border-leaf/35 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          item.urgency === 'high'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {item.urgency} Priority
                      </span>
                      <span className="text-xs text-ochre/70 font-semibold">{item.time}</span>
                    </div>

                    <h4 className="font-headline font-bold text-base text-ochre">
                      {item.title}
                    </h4>
                    <p className="text-xs text-ochre-warm font-semibold mt-0.5">{item.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                    {!isAck && (
                      <button
                        onClick={() => handleAcknowledge(item.id)}
                        className="px-3.5 py-2 rounded-pill text-xs font-bold text-ochre border border-stone-300 hover:bg-stone-100 transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                    <Link
                      to={item.actionRoute}
                      className="sun-button px-5 py-2 text-xs font-bold text-white rounded-pill flex items-center gap-1 shadow-sm"
                    >
                      {item.actionLabel}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SurfaceCard>

      {/* CAREGIVER QUICK HUB & CLINICAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SurfaceCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="icon-bed">
              <Activity className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-xs text-ochre-warm font-bold uppercase tracking-wider">7-Day Adherence</p>
              <h4 className="font-headline font-extrabold text-3xl text-ochre">94.8%</h4>
            </div>
          </div>
          <p className="text-xs text-emerald-800 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            +2.4% adherence vs previous week
          </p>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="icon-bed icon-bed-golden">
              <RefreshCw className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="text-xs text-ochre-warm font-bold uppercase tracking-wider">Refill Guardian</p>
              <h4 className="font-headline font-extrabold text-3xl text-ochre">1 Low Stock</h4>
            </div>
          </div>
          <Link to="/refills" className="text-xs text-amber-900 font-bold hover:underline flex items-center gap-1">
            Review inventory ledger <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="icon-bed icon-bed-sky">
              <Clock className="w-5 h-5 text-sky-800" />
            </div>
            <div>
              <p className="text-xs text-ochre-warm font-bold uppercase tracking-wider">CareShift Handoff</p>
              <h4 className="font-headline font-extrabold text-3xl text-ochre">Ready</h4>
            </div>
          </div>
          <Link to="/tasks" className="text-xs text-sky-900 font-bold hover:underline flex items-center gap-1">
            Generate 24h summary <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </SurfaceCard>
      </div>

      {/* QUICK WORKFLOW NAVIGATION CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Medications', route: '/medications', icon: Pill, desc: 'Schedules & Doses' },
          { label: 'Care Tasks', route: '/tasks', icon: Clock, desc: 'Assign & Handoff' },
          { label: 'Refills', route: '/refills', icon: RefreshCw, desc: 'Ledger & Supply' },
          { label: 'Care Circle', route: '/care-circle', icon: Users, desc: 'Roster & Passcodes' },
        ].map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              to={action.route}
              className="organic-card p-5 rounded-[22px] bg-mint-white border border-leaf/20 hover:border-leaf/40 hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="icon-bed w-12 h-12 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-emerald-700" />
              </div>
              <span className="font-headline font-bold text-base text-ochre">{action.label}</span>
              <span className="text-[11px] text-ochre-warm font-semibold">{action.desc}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
