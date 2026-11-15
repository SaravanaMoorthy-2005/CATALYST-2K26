import { SurfaceCard } from '../../components/SurfaceCard'
import { StatusBadge } from '../../components/StatusBadge'
import { Heart, Calendar, CheckCircle2, Users, ShieldCheck, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function FamilyDashboard() {
  return (
    <div className="space-y-7">
      {/* Banner */}
      <div className="p-7 rounded-[26px] bg-gradient-to-r from-sky-100/90 via-mint-white to-emerald-100/90 border border-sky-200/80 flex items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-4">
          <div className="icon-bed icon-bed-sky w-14 h-14 shadow-sm">
            <Heart className="w-7 h-7 text-sky-800" />
          </div>
          <div>
            <h2 className="font-headline font-extrabold text-2xl md:text-3xl text-ochre">Family Care Overview</h2>
            <p className="text-sm text-ochre-warm font-semibold mt-0.5">
              Viewing authorized shared records for Eleanor Vance
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-4 py-1.5 rounded-full text-xs font-bold bg-white text-sky-950 border border-sky-300 shadow-xs">
          Family Access · Authorized View
        </span>
      </div>

      {/* RECENT CARE ACTIVITY */}
      <SurfaceCard className="p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="icon-bed w-11 h-11">
              <CheckCircle2 className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-ochre">
                Recent Care Confirmations
              </h3>
              <p className="text-xs text-ochre-warm font-semibold">Real-time medication ingestion records with SafeDose verification</p>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
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
              actor: 'Confirmed by Caregiver Sarah',
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
              className="p-4 rounded-[20px] bg-white border border-leaf/15 hover:border-leaf/35 hover:shadow-card transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="icon-bed w-9 h-9">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <span className="font-headline font-bold text-lg text-ochre">
                    {entry.med}
                  </span>
                  <p className="text-xs text-ochre-warm font-semibold mt-0.5">{entry.actor} · {entry.time}</p>
                </div>
              </div>
              <StatusBadge variant={entry.status} />
            </div>
          ))}
        </div>
      </SurfaceCard>

      {/* UPCOMING VISITS */}
      <SurfaceCard className="p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="icon-bed icon-bed-sky w-11 h-11">
              <Calendar className="w-6 h-6 text-sky-800" />
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-ochre">
                Upcoming Family Appointments
              </h3>
              <p className="text-xs text-ochre-warm font-semibold">Scheduled clinic visits & companion checklist</p>
            </div>
          </div>
          <Link to="/appointments" className="text-sm font-bold text-emerald-800 hover:underline flex items-center gap-1">
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-5 rounded-[22px] bg-white border border-leaf/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-card transition-all">
          <div>
            <span className="text-xs font-bold text-sky-900 uppercase bg-sky-100 px-2.5 py-0.5 rounded-full">Tomorrow, 10:30 AM</span>
            <h4 className="font-headline font-bold text-xl text-ochre mt-1">
              Dr. Sarah Jenkins (Cardiology)
            </h4>
            <p className="text-xs text-ochre-warm font-semibold mt-0.5">St. Jude Medical Center, Suite 402</p>
          </div>
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-300 self-start sm:self-auto">
            Confirmed Visit
          </span>
        </div>
      </SurfaceCard>

      {/* CARE CIRCLE MEMBERS */}
      <SurfaceCard className="p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-bed w-11 h-11">
            <Users className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold text-ochre">
              Connected Care Circle
            </h3>
            <p className="text-xs text-ochre-warm font-semibold">Authorized members with patient health profile access</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-[20px] bg-white border border-leaf/20 flex items-center gap-3.5 shadow-sm">
            <div className="icon-bed icon-bed-golden w-11 h-11 font-bold text-sm">
              EV
            </div>
            <div>
              <p className="text-base font-bold text-ochre">Eleanor Vance</p>
              <p className="text-xs text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded-full mt-0.5 inline-block">Elder (Owner)</p>
            </div>
          </div>

          <div className="p-4 rounded-[20px] bg-white border border-leaf/20 flex items-center gap-3.5 shadow-sm">
            <div className="icon-bed w-11 h-11 font-bold text-sm">
              SJ
            </div>
            <div>
              <p className="text-base font-bold text-ochre">Sarah Jenkins, RN</p>
              <p className="text-xs text-emerald-900 font-bold bg-emerald-100 px-2 py-0.5 rounded-full mt-0.5 inline-block">Primary Caretaker</p>
            </div>
          </div>

          <div className="p-4 rounded-[20px] bg-white border border-leaf/20 flex items-center gap-3.5 shadow-sm">
            <div className="icon-bed icon-bed-sky w-11 h-11 font-bold text-sm">
              MV
            </div>
            <div>
              <p className="text-base font-bold text-ochre">Marcus Vance</p>
              <p className="text-xs text-sky-900 font-bold bg-sky-100 px-2 py-0.5 rounded-full mt-0.5 inline-block">Family Member</p>
            </div>
          </div>
        </div>
      </SurfaceCard>
    </div>
  )
}
