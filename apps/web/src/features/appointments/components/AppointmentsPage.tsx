import { useState } from 'react'
import { AppShell } from '../../../components/AppShell'
import { SurfaceCard } from '../../../components/SurfaceCard'
import { AccessibleDialog } from '../../../components/AccessibleDialog'
import { Calendar, Plus, Clock, MapPin, Stethoscope, CheckCircle, XCircle, FileQuestion } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'

interface AppointmentItem {
  id: string
  title: string
  doctorName: string
  specialty: string
  location: string
  date: string
  time: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  companionQuestions: string[]
}

export default function AppointmentsPage() {
  const { currentRole } = useAuth()
  const [appointments, setAppointments] = useState<AppointmentItem[]>([
    {
      id: 'appt_1',
      title: 'Cardiology Follow-Up',
      doctorName: 'Dr. Sarah Jenkins',
      specialty: 'Cardiologist',
      location: 'St. Jude Medical Center, Suite 402',
      date: '2026-11-16',
      time: '10:30 AM',
      status: 'scheduled',
      companionQuestions: [
        'Ask about reducing evening dizziness after Lisinopril.',
        'Review recent blood pressure log readings.',
      ],
    },
    {
      id: 'appt_2',
      title: 'Routine Geriatric Assessment',
      doctorName: 'Dr. Robert Chen',
      specialty: 'Geriatrician',
      location: 'Metro Health Clinic, Floor 2',
      date: '2026-11-19',
      time: '02:00 PM',
      status: 'scheduled',
      companionQuestions: ['Request prescription renewal for Metformin.'],
    },
    {
      id: 'appt_3',
      title: 'Annual Vision & Glaucoma Check',
      doctorName: 'Dr. Emily Vance',
      specialty: 'Ophthalmologist',
      location: 'Downtown Eye Institute',
      date: '2026-10-10',
      time: '11:00 AM',
      status: 'completed',
      companionQuestions: [],
    },
  ])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedAppt, setSelectedAppt] = useState<AppointmentItem | null>(null)
  const [newQuestion, setNewQuestion] = useState('')

  // Form states
  const [formTitle, setFormTitle] = useState('')
  const [formDoctor, setFormDoctor] = useState('')
  const [formSpecialty, setFormSpecialty] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('10:00')

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim() || !formDate) return

    const newAppt: AppointmentItem = {
      id: `appt_${Date.now()}`,
      title: formTitle,
      doctorName: formDoctor || 'Doctor',
      specialty: formSpecialty || 'General Practice',
      location: formLocation || 'Clinic',
      date: formDate,
      time: formTime,
      status: 'scheduled',
      companionQuestions: [],
    }

    setAppointments([newAppt, ...appointments])
    setIsAddOpen(false)
    setFormTitle('')
    setFormDoctor('')
    setFormSpecialty('')
    setFormLocation('')
  }

  const handleAddQuestion = () => {
    if (!newQuestion.trim() || !selectedAppt) return
    const updated = {
      ...selectedAppt,
      companionQuestions: [...selectedAppt.companionQuestions, newQuestion.trim()],
    }
    setAppointments((prev) => prev.map((a) => (a.id === selectedAppt.id ? updated : a)))
    setSelectedAppt(updated)
    setNewQuestion('')
  }

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    )
  }

  return (
    <AppShell currentRole={currentRole}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-cc-ink">Medical Appointments</h1>
            <p className="text-sm text-cc-muted mt-1">
              Scheduled clinical visits, doctor details, and pre-visit Appointment Companion preparation.
            </p>
          </div>

          {(currentRole === 'owner' || currentRole === 'caregiver') && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-5 py-3 rounded-full bg-cc-ink text-cc-ivory font-headline text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Appointment</span>
            </button>
          )}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appt) => (
            <SurfaceCard key={appt.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      appt.status === 'completed'
                        ? 'bg-gray-100 text-gray-500'
                        : appt.status === 'cancelled'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-cc-ice text-blue-800'
                    }`}
                  >
                    <Calendar className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-headline font-bold text-xl text-cc-ink">{appt.title}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          appt.status === 'completed'
                            ? 'bg-cc-mint text-green-900'
                            : appt.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-cc-ice text-blue-900'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-cc-muted mt-2">
                      <span className="flex items-center gap-1.5 font-medium text-cc-ink">
                        <Stethoscope className="w-4 h-4 text-cc-muted" />
                        {appt.doctorName} ({appt.specialty})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-cc-muted" />
                        {appt.date} at {appt.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-cc-muted" />
                        {appt.location}
                      </span>
                    </div>

                    {/* Pre-visit Appointment Companion snippet */}
                    {appt.companionQuestions.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-cc-mist/60 border border-cc-border">
                        <h4 className="text-xs font-bold text-cc-ink uppercase flex items-center gap-1.5 mb-1.5">
                          <FileQuestion className="w-3.5 h-3.5 text-cc-ink" />
                          Appointment Companion Checklist ({appt.companionQuestions.length} Questions Prepared)
                        </h4>
                        <ul className="text-xs text-cc-ink space-y-1 list-disc list-inside">
                          {appt.companionQuestions.map((q, idx) => (
                            <li key={idx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contextual actions */}
                <div className="flex items-center gap-2 self-end md:self-start">
                  <button
                    onClick={() => setSelectedAppt(appt)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cc-surface border border-cc-border hover:bg-black/5 dark:hover:bg-white/10 text-cc-ink"
                  >
                    Companion Checklist
                  </button>

                  {appt.status === 'scheduled' && (
                    <button
                      onClick={() => handleCancelAppointment(appt.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>

        {/* APPOINTMENT COMPANION MODAL */}
        <AccessibleDialog
          isOpen={!!selectedAppt}
          onClose={() => setSelectedAppt(null)}
          title={`Appointment Companion — ${selectedAppt?.title}`}
        >
          {selectedAppt && (
            <div className="space-y-4">
              <p className="text-xs text-cc-muted">
                Prepare questions in advance so you or your family member can ask your doctor during the consultation.
              </p>

              <div>
                <h4 className="font-headline font-semibold text-sm text-cc-ink mb-2">
                  Prepared Questions for {selectedAppt.doctorName}:
                </h4>
                {selectedAppt.companionQuestions.length === 0 ? (
                  <p className="text-xs text-cc-muted italic">No questions added yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {selectedAppt.companionQuestions.map((q, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-xl bg-cc-ivory border border-cc-border text-xs text-cc-ink flex items-start gap-2"
                      >
                        <span className="font-bold text-blue-700">{idx + 1}.</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-2 border-t border-cc-border">
                <label htmlFor="new-q" className="block text-xs font-semibold text-cc-ink mb-1">
                  Add question for doctor:
                </label>
                <div className="flex gap-2">
                  <input
                    id="new-q"
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g. Any dietary restrictions with this dosage?"
                    className="flex-1 h-10 px-3 rounded-xl border border-cc-border bg-cc-surface text-cc-ink text-xs focus:ring-2 focus:ring-cc-ink focus:outline-none"
                  />
                  <button
                    onClick={handleAddQuestion}
                    className="px-4 py-2 rounded-xl bg-cc-ink text-cc-ivory text-xs font-semibold hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </AccessibleDialog>

        {/* SCHEDULE APPOINTMENT DIALOG */}
        <AccessibleDialog
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Schedule Medical Appointment"
        >
          <form onSubmit={handleCreateAppointment} className="space-y-4">
            <div>
              <label htmlFor="appt-title" className="block text-sm font-semibold text-cc-ink mb-1">
                Appointment Title *
              </label>
              <input
                id="appt-title"
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Cardiology Consultation"
                className="w-full h-11 px-3.5 rounded-xl border border-cc-border text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="appt-doctor" className="block text-sm font-semibold text-cc-ink mb-1">
                  Doctor Name
                </label>
                <input
                  id="appt-doctor"
                  type="text"
                  value={formDoctor}
                  onChange={(e) => setFormDoctor(e.target.value)}
                  placeholder="Dr. Sarah Jenkins"
                  className="w-full h-11 px-3.5 rounded-xl border border-cc-border text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="appt-specialty" className="block text-sm font-semibold text-cc-ink mb-1">
                  Specialty
                </label>
                <input
                  id="appt-specialty"
                  type="text"
                  value={formSpecialty}
                  onChange={(e) => setFormSpecialty(e.target.value)}
                  placeholder="Cardiology"
                  className="w-full h-11 px-3.5 rounded-xl border border-cc-border text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="appt-date" className="block text-sm font-semibold text-cc-ink mb-1">
                  Date *
                </label>
                <input
                  id="appt-date"
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-cc-border text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="appt-time" className="block text-sm font-semibold text-cc-ink mb-1">
                  Time *
                </label>
                <input
                  id="appt-time"
                  type="time"
                  required
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-cc-border text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="appt-location" className="block text-sm font-semibold text-cc-ink mb-1">
                Location or Clinic
              </label>
              <input
                id="appt-location"
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="Hospital / Suite address"
                className="w-full h-11 px-3.5 rounded-xl border border-cc-border text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2.5 rounded-full border border-cc-border text-cc-ink font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-cc-ink text-cc-ivory font-semibold text-sm hover:opacity-90"
              >
                Save Appointment
              </button>
            </div>
          </form>
        </AccessibleDialog>
      </div>
    </AppShell>
  )
}
