import { useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { SurfaceCard } from '../../components/SurfaceCard'
import { FileText, Download, ShieldCheck, Printer, Heart, AlertCircle, Phone } from 'lucide-react'
import { useAuth } from '../auth/hooks/useAuth'

export default function CarePassportPage() {
  const { currentRole } = useAuth()
  const [exported, setExported] = useState(false)

  const handlePrintExport = () => {
    window.print()
    setExported(true)
  }

  return (
    <AppShell currentRole={currentRole}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-cc-ink">CarePassport</h1>
            <p className="text-sm text-cc-muted mt-1">
              Authorized clinical health summary for doctor visits, hospital admissions, and emergency responders.
            </p>
          </div>

          <button
            onClick={handlePrintExport}
            className="px-5 py-2.5 rounded-full bg-cc-ink text-white font-headline text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-sm self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-cc-lemon" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        {exported && (
          <div role="status" className="p-3.5 rounded-xl bg-cc-mint border border-green-200 text-green-900 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-700" />
            <span>CarePassport export logged to care circle audit trail.</span>
          </div>
        )}

        {/* PASSPORT SUMMARY DOCUMENT */}
        <SurfaceCard className="p-8 border-2 border-cc-powder bg-white space-y-6 shadow-md print:shadow-none print:border-none">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b border-cc-border pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full bg-cc-ink" />
                <span className="text-xs font-bold uppercase tracking-widest text-cc-muted">
                  Official CareCircle Health Summary
                </span>
              </div>
              <h2 className="font-headline text-3xl font-extrabold text-cc-ink">Eleanor Parker</h2>
              <p className="text-xs text-cc-muted mt-1">
                DOB: 1948-06-22 (Age 78) · Primary Language: English · Blood Type: O+
              </p>
            </div>

            <div className="text-right text-xs text-cc-muted">
              <p>As-Of Date:</p>
              <p className="font-bold text-cc-ink">Nov 15, 2026</p>
            </div>
          </div>

          {/* EMERGENCY CONTACTS */}
          <div>
            <h3 className="font-headline font-bold text-base text-cc-ink mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-cc-ink" />
              Designated Emergency Contacts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-cc-ivory border border-cc-border text-xs">
                <span className="font-bold text-cc-ink block">John Doe (Primary Caregiver)</span>
                <span className="text-cc-muted">Relationship: Professional Caregiver</span>
                <p className="font-mono text-cc-ink font-semibold mt-1">+1 (555) 234-5678</p>
              </div>

              <div className="p-3.5 rounded-xl bg-cc-ivory border border-cc-border text-xs">
                <span className="font-bold text-cc-ink block">Sarah Parker (Daughter)</span>
                <span className="text-cc-muted">Relationship: Family Member</span>
                <p className="font-mono text-cc-ink font-semibold mt-1">+1 (555) 876-5432</p>
              </div>
            </div>
          </div>

          {/* DOCUMENTED ALLERGIES & SENSITIVITIES */}
          <div>
            <h3 className="font-headline font-bold text-base text-cc-ink mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Documented Drug Allergies
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                Penicillin (Hives / Rash)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                Sulfa Antibiotics
              </span>
            </div>
          </div>

          {/* ACTIVE CLINICAL MEDICATIONS */}
          <div>
            <h3 className="font-headline font-bold text-base text-cc-ink mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-blue-700" />
              Current Active Medications
            </h3>

            <div className="space-y-2">
              {[
                { name: 'Atorvastatin', dose: '20mg Tablet', schedule: 'Daily at 08:00 AM', instructions: 'Take with full glass of water after breakfast' },
                { name: 'Metformin', dose: '500mg Tablet', schedule: 'Daily at 01:00 PM', instructions: 'Take with lunch' },
                { name: 'Lisinopril', dose: '10mg Tablet', schedule: 'Daily at 08:00 PM', instructions: 'Take before bedtime' },
              ].map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-cc-ivory border border-cc-border flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-cc-ink text-sm">{m.name}</span>
                    <span className="text-cc-muted ml-2">({m.dose})</span>
                    <p className="text-cc-muted mt-0.5">{m.instructions}</p>
                  </div>
                  <span className="font-medium text-cc-ink">{m.schedule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="pt-4 border-t border-cc-border text-[11px] text-cc-muted">
            <strong>Notice:</strong> CarePassport is generated from patient-reported and caregiver-entered records in CareCircle. It does not replace certified EHR records. Always consult licensed medical professionals for diagnosis and treatment.
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  )
}
