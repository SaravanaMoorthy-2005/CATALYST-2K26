import { useState } from 'react'
import { AppShell } from '../../../components/AppShell'
import { SurfaceCard } from '../../../components/SurfaceCard'
import { Bell, CheckCheck, Clock, AlertTriangle, HelpCircle, Calendar, RefreshCw } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  type: 'dose_reminder' | 'assistance_alert' | 'refill_alert' | 'appointment_reminder'
  isRead: boolean
}

export default function NotificationsPage() {
  const { currentRole } = useAuth()
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'Dose Reminder: Atorvastatin 20mg Due',
      message: 'Scheduled dose for Eleanor Parker is due at 08:00 AM.',
      time: '15 mins ago',
      type: 'dose_reminder',
      isRead: false,
    },
    {
      id: 'notif_2',
      title: 'Assistance Requested by Eleanor',
      message: 'Need help with transportation to Dr. Jenkins appointment tomorrow.',
      time: '1 hour ago',
      type: 'assistance_alert',
      isRead: false,
    },
    {
      id: 'notif_3',
      title: 'Refill Guardian Alert: Metformin Low Supply',
      message: 'Supply has dropped to 8 tablets remaining. Please schedule refill.',
      time: 'Yesterday',
      type: 'refill_alert',
      isRead: true,
    },
    {
      id: 'notif_4',
      title: 'Upcoming Appointment: Cardiology Follow-Up',
      message: 'Appointment tomorrow at 10:30 AM with Dr. Sarah Jenkins.',
      time: '2 days ago',
      type: 'appointment_reminder',
      isRead: true,
    },
  ])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <AppShell currentRole={currentRole}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold text-cc-ink">Notification Center</h1>
            <p className="text-sm text-cc-muted mt-1">
              Real-time care updates, dose reminders, and caregiver escalation alerts.
            </p>
          </div>

          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-cc-border hover:bg-black/5 text-xs font-semibold text-cc-ink"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <SurfaceCard
              key={notif.id}
              className={`p-5 transition-all ${
                !notif.isRead ? 'border-2 border-cc-powder bg-white' : 'bg-white/80 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'assistance_alert'
                      ? 'bg-red-100 text-red-800'
                      : notif.type === 'refill_alert'
                      ? 'bg-amber-100 text-amber-800'
                      : notif.type === 'appointment_reminder'
                      ? 'bg-cc-ice text-blue-900'
                      : 'bg-cc-mint text-green-900'
                  }`}
                >
                  {notif.type === 'assistance_alert' ? (
                    <HelpCircle className="w-5 h-5" />
                  ) : notif.type === 'refill_alert' ? (
                    <RefreshCw className="w-5 h-5" />
                  ) : notif.type === 'appointment_reminder' ? (
                    <Calendar className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline font-bold text-base text-cc-ink">
                      {notif.title}
                    </h3>
                    <span className="text-xs text-cc-muted font-medium">{notif.time}</span>
                  </div>
                  <p className="text-xs text-cc-muted mt-1">{notif.message}</p>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
