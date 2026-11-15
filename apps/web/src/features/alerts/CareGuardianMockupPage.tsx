import { useState } from 'react'
import { CareGuardianAlertScreen } from './CareGuardianAlertScreen'
import { Link } from 'react-router-dom'
import { ArrowLeft, Volume2, VolumeX, Smartphone } from 'lucide-react'
import { alertSound } from './sound'

export default function CareGuardianMockupPage() {
  const [viewMode, setViewMode] = useState<'single' | 'comparison'>('single')
  const [isMuted, setIsMuted] = useState(alertSound.getIsMuted())

  const toggleSound = () => {
    const next = !isMuted
    setIsMuted(next)
    alertSound.setMuted(next)
  }

  return (
    <div className="min-h-screen bg-cc-ivory text-cc-ink flex flex-col items-center py-6 px-4">
      {/* Top Controller Bar */}
      <div className="w-full max-w-4xl mb-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-cc-surface rounded-2xl border border-cc-border shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-cc-mist hover:bg-black/5 dark:hover:bg-white/10 text-cc-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-cc-ink">CareGuardian UI Mockup</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200">
              Portrait 9:19.5
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute / Unmute Sound */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              isMuted
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'Sound Muted' : 'Sound Active'}</span>
          </button>

          {/* Single Screen vs Comparison */}
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'comparison' : 'single')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            <span>{viewMode === 'single' ? 'Compare Light & Dark' : 'Single Screen'}</span>
          </button>
        </div>
      </div>

      {/* Screen Presentation Container:
          Strict flat colours only, straight-on, portrait 9:19.5,
          no phone frame, no hands, no shadows, no 3D tilt as required */}
      {viewMode === 'single' ? (
        <div className="flex flex-col items-center">
          <p className="text-xs text-stone-500 font-semibold mb-2 uppercase tracking-wider">
            Flat Smartphone Screen (9:19.5) · Interactive
          </p>
          <div
            className="border-2 border-stone-300 relative overflow-hidden"
            style={{
              width: '412px',
              maxWidth: '100%',
              aspectRatio: '9 / 19.5',
              boxSizing: 'border-box',
            }}
          >
            <CareGuardianAlertScreen showOnlyScreen />
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-start justify-center gap-8 w-full max-w-5xl">
          {/* Light Mode Mockup */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">
              Light Mode (WCAG AAA)
            </span>
            <div
              className="border-2 border-stone-300 relative overflow-hidden"
              style={{
                width: '390px',
                maxWidth: '100%',
                aspectRatio: '9 / 19.5',
                boxSizing: 'border-box',
              }}
            >
              <CareGuardianAlertScreen initialTheme="light" showOnlyScreen />
            </div>
          </div>

          {/* Dark Mode Mockup */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">
              Dark Mode (WCAG AAA)
            </span>
            <div
              className="border-2 border-stone-800 relative overflow-hidden"
              style={{
                width: '390px',
                maxWidth: '100%',
                aspectRatio: '9 / 19.5',
                boxSizing: 'border-box',
              }}
            >
              <CareGuardianAlertScreen initialTheme="dark" showOnlyScreen />
            </div>
          </div>
        </div>
      )}

      {/* Brief Test Checklist footer */}
      <div className="w-full max-w-4xl mt-8 p-5 bg-cc-surface rounded-2xl border border-cc-border text-xs text-cc-muted">
        <h4 className="font-bold text-sm text-cc-ink mb-2">CareGuardian Alert Verification Checklist:</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc list-inside">
          <li><strong>Flat 9:19.5 Screen:</strong> No gradients, phone frames, hands, shadows, or 3D tilt.</li>
          <li><strong>Language Switcher:</strong> English, தமிழ், हिन्दी pill buttons; active one filled.</li>
          <li><strong>Theme Toggle:</strong> Sun/Moon round toggle; light & dark modes meet WCAG AAA.</li>
          <li><strong>Banner & Left Border:</strong> Bell icon with thick coloured alert border (#B45309 / #F5A524).</li>
          <li><strong>Stacked Buttons:</strong> 72px+ touch targets, 12px corners, 24pt bold text with outline icons.</li>
          <li><strong>Audio & Vibration:</strong> Web Audio gentle chime + Web Speech API read-aloud.</li>
        </ul>
      </div>
    </div>
  )
}
