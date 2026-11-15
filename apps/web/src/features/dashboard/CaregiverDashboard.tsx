import { useState } from 'react'
import {
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Clock,
  Pill,
  Users,
  Activity,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { SurfaceCard } from '../../components/SurfaceCard'
import { StatusBadge } from '../../components/StatusBadge'
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
  const [items, setItems] = useState<AttentionItem[]>([
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
    <div className="space-y-6">
      {/* HEADER: CareCircle Context Bar */}
      <div className="p-4 rounded-2xl bg-white border border-cc-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cc-mint flex items-center justify-center text-green-900 font-bold">
            EP
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-cc-ink">
              Eleanor Parker's Care Circle
            </h2>
            <p className="text-xs text-cc-muted">Timezone: America/New_York (EST) · Active Plan</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            Live Sync Active
          </span>
        </div>
      </div>

      {/* ATTENTION QUEUE (Primary Focus of CarePulse) */}
      <SurfaceCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            <h3 className="font-headline text-xl font-bold text-cc-ink">
              CarePulse Attention Queue
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
            {items.filter((i) => !acknowledgedIds.includes(i.id)).length} Pending Actions
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const isAck = acknowledgedIds.includes(item.id)
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isAck
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : item.urgency === 'high'
                    ? 'bg-red-50/40 border-red-200'
                    : 'bg-white border-cc-border'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          item.urgency === 'high'
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.urgency}
                      </span>
                      <span className="text-xs text-cc-muted font-medium">{item.time}</span>
                    </div>

                    <h4 className="font-headline font-semibold text-base text-cc-ink mt-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-cc-muted mt-0.5">{item.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {!isAck && (
                      <button
                        onClick={() => handleAcknowledge(item.id)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold border border-cc-border hover:bg-white text-cc-ink"
                      >
                        Acknowledge
                      </button>
                    )}

                    <Link
                      to={item.actionRoute}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-cc-ink text-white hover:opacity-90 flex items-center gap-1.5"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SurfaceCard>

      {/* ADHERENCE INSIGHTS & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SurfaceCard className="p-5">
          <div className="flex items-center justify-between text-cc-muted text-xs font-semibold mb-2">
            <span>7-DAY ADHERENCE</span>
            <Activity className="w-4 h-4 text-green-700" />
          </div>
          <div className="font-headline text-3xl font-extrabold text-cc-ink">92%</div>
          <p className="text-xs text-cc-muted mt-1">19 of 21 scheduled doses recorded taken.</p>
        </SurfaceCard>

        <SurfaceCard className="p-5">
          <div className="flex items-center justify-between text-cc-muted text-xs font-semibold mb-2">
            <span>REFILL GUARDIAN</span>
            <RefreshCw className="w-4 h-4 text-blue-700" />
          </div>
          <div className="font-headline text-3xl font-extrabold text-cc-ink">1 Low</div>
          <p className="text-xs text-cc-muted mt-1">Metformin due for refill in 4 days.</p>
        </SurfaceCard>

        <SurfaceCard className="p-5">
          <div className="flex items-center justify-between text-cc-muted text-xs font-semibold mb-2">
            <span>CARESHIFT STATUS</span>
            <Clock className="w-4 h-4 text-purple-700" />
          </div>
          <div className="font-headline text-3xl font-extrabold text-cc-ink">3 Active</div>
          <p className="text-xs text-cc-muted mt-1">2 tasks completed, 1 pending acceptance.</p>
        </SurfaceCard>
      </div>

      {/* QUICK WORKFLOW ACCESS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/tasks"
          className="p-4 rounded-card bg-white border border-cc-border hover:border-cc-ink hover:shadow-card transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-cc-ice text-blue-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-sm text-cc-ink">CareShift</h4>
            <p className="text-xs text-cc-muted">Assign care tasks</p>
          </div>
        </Link>

        <Link
          to="/refills"
          className="p-4 rounded-card bg-white border border-cc-border hover:border-cc-ink hover:shadow-card transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-cc-mint text-green-800 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-sm text-cc-ink">Refill Guardian</h4>
            <p className="text-xs text-cc-muted">Inventory ledger</p>
          </div>
        </Link>

        <Link
          to="/reconciliation"
          className="p-4 rounded-card bg-white border border-cc-border hover:border-cc-ink hover:shadow-card transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-cc-mist text-green-900 flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-sm text-cc-ink">DischargeSync</h4>
            <p className="text-xs text-cc-muted">Reconcile prescriptions</p>
          </div>
        </Link>

        <Link
          to="/care-circle"
          className="p-4 rounded-card bg-white border border-cc-border hover:border-cc-ink hover:shadow-card transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-cc-lemon/50 text-cc-ink flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-sm text-cc-ink">Care Circle</h4>
            <p className="text-xs text-cc-muted">Permissions & Invites</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
