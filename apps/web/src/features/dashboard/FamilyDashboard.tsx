import React from 'react'
import { SurfaceCard } from '../../components/SurfaceCard'
import { StatusBadge } from '../../components/StatusBadge'
import { Heart, Calendar, Clock, CheckCircle2, Users, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function FamilyDashboard() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-card bg-cc-ice border border-blue-200 dark:border-blue-900/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-2xl text-cc-ink">Family Care Overview</h2>
            <p className="text-sm text-cc-muted">
              Viewing authorized shared records for Eleanor Parker
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-cc-surface text-blue-900 dark:text-blue-200 border border-blue-100 dark:border-blue-900/30">
          Family Access · View Only
        </span>
      </div>

      {/* RECENT CARE ACTIVITY */}
      <SurfaceCard className="p-6">
        <h3 className="font-headline text-xl font-bold text-cc-ink mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-700" />
          Recent Care Confirmations
        </h3>

        <div className="space-y-3">
          {[
            {
              med: 'Atorvastatin 20mg',
              time: 'Today, 08:05 AM',
              status: 'taken' as const,
              actor: 'Taken by Eleanor (Self)',
            },
            {
              med: 'Metformin 500mg',
              time: 'Yesterday, 01:15 PM',
              status: 'taken' as const,
              actor: 'Confirmed by Caregiver John',
            },
            {
              med: 'Lisinopril 10mg',
              time: 'Yesterday, 08:00 PM',
              status: 'taken' as const,
              actor: 'Taken by Eleanor (Self)',
            },
          ].map((entry, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-cc-surface border border-cc-border flex items-center justify-between"
            >
              <div>
                <span className="font-headline font-semibold text-base text-cc-ink">
                  {entry.med}
                </span>
                <p className="text-xs text-cc-muted mt-0.5">{entry.actor} · {entry.time}</p>
              </div>
              <StatusBadge variant={entry.status} />
            </div>
          ))}
        </div>
      </SurfaceCard>

      {/* UPCOMING VISITS */}
      <SurfaceCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-xl font-bold text-cc-ink flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-700 dark:text-blue-300" />
            Upcoming Family Appointments
          </h3>
          <Link to="/appointments" className="text-xs font-semibold text-cc-ink hover:underline">
            View Details
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-cc-ivory border border-cc-border flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase">Tomorrow, 10:30 AM</span>
            <h4 className="font-headline font-bold text-base text-cc-ink mt-0.5">
              Dr. Sarah Jenkins (Cardiology)
            </h4>
            <p className="text-xs text-cc-muted">St. Jude Medical Center, Suite 402</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cc-surface border border-cc-border text-cc-ink">
            Confirmed
          </span>
        </div>
      </SurfaceCard>

      {/* CARE CIRCLE MEMBERS */}
      <SurfaceCard className="p-6">
        <h3 className="font-headline text-xl font-bold text-cc-ink mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-cc-ink" />
          Connected Care Circle
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-cc-surface border border-cc-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cc-lemon text-cc-ink font-bold flex items-center justify-center text-sm">
              EP
            </div>
            <div>
              <p className="text-sm font-bold text-cc-ink">Eleanor Parker</p>
              <p className="text-xs text-cc-muted">Elder (Owner)</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-cc-surface border border-cc-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cc-mist text-green-900 dark:text-green-200 font-bold flex items-center justify-center text-sm">
              JD
            </div>
            <div>
              <p className="text-sm font-bold text-cc-ink">John Doe</p>
              <p className="text-xs text-cc-muted">Primary Caregiver</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-cc-surface border border-cc-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cc-ice text-blue-900 dark:text-blue-200 font-bold flex items-center justify-center text-sm">
              SP
            </div>
            <div>
              <p className="text-sm font-bold text-cc-ink">Sarah Parker</p>
              <p className="text-xs text-cc-muted">Family Member</p>
            </div>
          </div>
        </div>
      </SurfaceCard>
    </div>
  )
}
