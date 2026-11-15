import { useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { SurfaceCard } from '../../components/SurfaceCard'
import { AccessibleDialog } from '../../components/AccessibleDialog'
import { Clock, CheckCircle2, UserCheck, Plus, FileText, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../auth/hooks/useAuth'

interface TaskItem {
  id: string
  title: string
  type: string
  assignedTo: string
  dueAt: string
  status: 'pending' | 'accepted' | 'declined' | 'completed'
  notes?: string
}

export default function CareShiftPage() {
  const { currentRole } = useAuth()
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task_1',
      title: 'Morning Vitals & Blood Pressure Check',
      type: 'wellbeing_check',
      assignedTo: 'John Doe',
      dueAt: '09:00 AM Today',
      status: 'accepted',
      notes: 'Log systolic and diastolic in health notes.',
    },
    {
      id: 'task_2',
      title: 'Pick Up Metformin Refill from Pharmacy',
      type: 'refill_collection',
      assignedTo: 'Sarah Parker',
      dueAt: '03:00 PM Tomorrow',
      status: 'pending',
      notes: 'Walgreens on 5th Ave.',
    },
    {
      id: 'task_3',
      title: 'Transport to Cardiology Appointment',
      type: 'appointment_transport',
      assignedTo: 'John Doe',
      dueAt: '10:00 AM Nov 16',
      status: 'pending',
      notes: 'Pick up 30 minutes before appointment.',
    },
  ])

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [isHandoffOpen, setIsHandoffOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newAssignee, setNewAssignee] = useState('John Doe')
  const [newDue, setNewDue] = useState('')

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      title: newTitle,
      type: 'general_care',
      assignedTo: newAssignee,
      dueAt: newDue || 'Today',
      status: 'pending',
    }

    setTasks([newTask, ...tasks])
    setIsNewTaskOpen(false)
    setNewTitle('')
  }

  const handleAccept = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'accepted' } : t))
    )
  }

  const handleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'completed' } : t))
    )
  }

  return (
    <AppShell currentRole={currentRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-cc-ink">CareShift Collaboration</h1>
            <p className="text-sm text-cc-muted mt-1">
              Caregiver task assignments, shift coordination, handoff summaries, and responsibility handovers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHandoffOpen(true)}
              className="px-4 py-2.5 rounded-full border border-cc-border hover:bg-black/5 text-xs font-semibold text-cc-ink flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-cc-ink" />
              <span>Generate Handoff Report</span>
            </button>

            {(currentRole === 'owner' || currentRole === 'caregiver') && (
              <button
                onClick={() => setIsNewTaskOpen(true)}
                className="px-5 py-2.5 rounded-full bg-cc-ink text-cc-ivory font-headline text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-sm"
              >
                <Plus className="w-4 h-4 text-cc-lemon" />
                <span>Create Care Task</span>
              </button>
            )}
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <SurfaceCard key={task.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      task.status === 'completed'
                        ? 'bg-cc-mint text-green-900'
                        : task.status === 'accepted'
                        ? 'bg-cc-ice text-blue-900'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-headline font-bold text-lg text-cc-ink">{task.title}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          task.status === 'completed'
                            ? 'bg-cc-mint text-green-900'
                            : task.status === 'accepted'
                            ? 'bg-cc-ice text-blue-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <p className="text-xs text-cc-muted mt-1">
                      Assigned to: <strong className="text-cc-ink">{task.assignedTo}</strong> · Due: {task.dueAt}
                    </p>
                    {task.notes && <p className="text-xs text-cc-muted mt-0.5">{task.notes}</p>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleAccept(task.id)}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-cc-ink text-cc-ivory hover:opacity-90"
                    >
                      Accept Task
                    </button>
                  )}

                  {task.status === 'accepted' && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-cc-mint text-green-900 dark:text-green-200 border border-green-300 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Complete</span>
                    </button>
                  )}
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>

        {/* CREATE TASK MODAL */}
        <AccessibleDialog
          isOpen={isNewTaskOpen}
          onClose={() => setIsNewTaskOpen(false)}
          title="Create CareShift Task"
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label htmlFor="task-title" className="block text-sm font-semibold text-cc-ink mb-1">
                Task Description *
              </label>
              <input
                id="task-title"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Prepare light dinner / check medication"
                className="w-full h-11 px-3.5 rounded-xl border border-cc-border bg-cc-surface text-cc-ink text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="task-assignee" className="block text-sm font-semibold text-cc-ink mb-1">
                Assign To *
              </label>
              <select
                id="task-assignee"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-cc-border bg-cc-surface text-cc-ink text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
              >
                <option value="John Doe" className="bg-cc-surface text-cc-ink">John Doe (Primary Caregiver)</option>
                <option value="Sarah Parker" className="bg-cc-surface text-cc-ink">Sarah Parker (Family)</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-due" className="block text-sm font-semibold text-cc-ink mb-1">
                Due Date & Time
              </label>
              <input
                id="task-due"
                type="text"
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                placeholder="e.g. Today at 06:00 PM"
                className="w-full h-11 px-3.5 rounded-xl border border-cc-border bg-cc-surface text-cc-ink text-sm focus:ring-2 focus:ring-cc-ink focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsNewTaskOpen(false)}
                className="px-4 py-2.5 rounded-full border border-cc-border text-cc-ink font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-cc-ink text-cc-ivory font-semibold text-sm hover:opacity-90"
              >
                Create Task
              </button>
            </div>
          </form>
        </AccessibleDialog>

        {/* CARE HANDOFF REPORT MODAL */}
        <AccessibleDialog
          isOpen={isHandoffOpen}
          onClose={() => setIsHandoffOpen(false)}
          title="Care Handoff Shift Summary"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-cc-ivory border border-cc-border text-xs text-cc-muted">
              Snapshot Window: Past 24 Hours · Eleanor Parker's Care Circle
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-cc-mint border border-green-200">
                <span className="font-bold text-green-900 block mb-1">Medication Adherence Summary:</span>
                <p className="text-green-800">✓ 3 of 3 scheduled doses confirmed taken during this shift period.</p>
              </div>

              <div className="p-3 rounded-xl bg-cc-ice border border-blue-200 dark:border-blue-900/40">
                <span className="font-bold text-blue-900 dark:text-blue-200 block mb-1">Upcoming Responsibilities for Next Shift:</span>
                <p className="text-blue-800 dark:text-blue-300">• Cardiology visit transport at 10:30 AM tomorrow.</p>
                <p className="text-blue-800 dark:text-blue-300">• Pick up Metformin refill (Refill Guardian warning active).</p>
              </div>
            </div>

            <p className="text-[11px] text-cc-muted italic">
              Care Handoff Report is an administrative coordination summary. Confirm urgent patient needs directly with the attending care team.
            </p>

            <button
              onClick={() => setIsHandoffOpen(false)}
              className="w-full min-h-[44px] rounded-full bg-cc-ink text-cc-ivory font-semibold text-xs hover:opacity-90"
            >
              Close Summary
            </button>
          </div>
        </AccessibleDialog>
      </div>
    </AppShell>
  )
}
