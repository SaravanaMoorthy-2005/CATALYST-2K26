import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from '../../lib/i18n'
import { alertSound } from './sound'
import { speakAlertText, stopAlertSpeech } from './speech'

interface CareGuardianAlertScreenProps {
  initialTheme?: 'light' | 'dark'
  initialLanguage?: 'en' | 'ta' | 'hi'
  onResponse?: (action: 'taken' | 'later' | 'skip' | 'call') => void
  showOnlyScreen?: boolean
}

export function CareGuardianAlertScreen({
  initialTheme = 'light',
  initialLanguage = 'en',
  onResponse,
  showOnlyScreen = false,
}: CareGuardianAlertScreenProps) {
  const { t, i18n } = useTranslation()

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('careguardian_theme') as 'light' | 'dark') || initialTheme
    }
    return initialTheme
  })

  const [currentLang, setCurrentLang] = useState<'en' | 'ta' | 'hi'>(
    (i18n.language as 'en' | 'ta' | 'hi') || initialLanguage,
  )

  const [isWaitingLong, setIsWaitingLong] = useState(false)
  const [responseStatus, setResponseStatus] = useState<string | null>(null)
  const [isSoundMuted, setIsSoundMuted] = useState(alertSound.getIsMuted())
  const [showCallFamilyModal, setShowCallFamilyModal] = useState(false)
  const timerRef = useRef<number | null>(null)

  // Start sound, speech, and timeout on mount
  useEffect(() => {
    alertSound.start()

    // Speak initial announcement per language
    const speechMap: Record<'en' | 'ta' | 'hi', string> = {
      en: 'Time for your medicine: Diabetes medicine, 1:00 PM after food.',
      ta: 'மருந்து சாப்பிடும் நேரம்: சர்க்கரை நோய் மருந்து, பிற்பகல் 1:00 உணவுக்குப் பின்.',
      hi: 'दवा लेने का समय: डायबिटीज़ की दवा, दोपहर 1:00 बजे खाने के बाद.',
    }
    speakAlertText(speechMap[currentLang], currentLang)

    // Unanswered after interval -> display "Still waiting for your answer"
    timerRef.current = window.setTimeout(() => {
      setIsWaitingLong(true)
    }, 12000)

    return () => {
      alertSound.stop()
      stopAlertSpeech()
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [currentLang])

  const handleLanguageChange = (lang: 'en' | 'ta' | 'hi') => {
    setCurrentLang(lang)
    changeLanguage(lang)
  }

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('careguardian_theme', newTheme)
    }
  }

  const handleAction = (action: 'taken' | 'later' | 'skip' | 'call') => {
    alertSound.stop()
    stopAlertSpeech()

    if (action === 'call') {
      setShowCallFamilyModal(true)
      onResponse?.(action)
      return
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (action === 'taken') {
      setResponseStatus(`${t('due.takenMessage', 'Recorded as taken at')} ${nowStr}`)
    } else if (action === 'later') {
      setResponseStatus(t('due.snoozedMessage', 'Reminder snoozed for 15 minutes.'))
    } else if (action === 'skip') {
      setResponseStatus(t('due.skippedMessage', 'Dose skipped. Care team informed.'))
    }

    onResponse?.(action)
  }

  const toggleSound = () => {
    const nextMuted = !isSoundMuted
    setIsSoundMuted(nextMuted)
    alertSound.setMuted(nextMuted)
  }

  // Exact Palettes:
  // Light: bg #FFFFFF, card #F4F1EC, text #1A1A1A, primary #0B5D5E, alert #B45309
  // Dark:  bg #0F1A1A, card #1B2B2B, text #F5F5F5, primary #5EC4C4, alert #F5A524
  const isDark = theme === 'dark'

  const colors = {
    bg: isDark ? '#0F1A1A' : '#FFFFFF',
    card: isDark ? '#1B2B2B' : '#F4F1EC',
    text: isDark ? '#FFFFFF' : '#000000',
    primary: isDark ? '#5EC4C4' : '#0B5D5E',
    primaryText: isDark ? '#0F1A1A' : '#FFFFFF',
    alert: isDark ? '#F5A524' : '#B45309',
    secondaryBorder: isDark ? '#5EC4C4' : '#0B5D5E',
    secondaryText: isDark ? '#5EC4C4' : '#0B5D5E',
    tertiaryBorder: isDark ? '#FFFFFF' : '#6B7280',
    tertiaryText: isDark ? '#FFFFFF' : '#000000',
  }

  // Dynamic Font family per language
  const fontFamily =
    currentLang === 'ta'
      ? "'Noto Sans Tamil', 'Atkinson Hyperlegible', sans-serif"
      : currentLang === 'hi'
      ? "'Noto Sans Devanagari', 'Atkinson Hyperlegible', sans-serif"
      : "'Atkinson Hyperlegible', sans-serif"

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-heading"
      aria-describedby="alert-medicine-line"
      className="flex flex-col select-none overflow-hidden"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily,
        width: '100%',
        maxWidth: showOnlyScreen ? '420px' : '460px',
        minHeight: '880px',
        aspectRatio: '9 / 19.5',
        padding: '24px',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP BAR
          Left: Language switcher (English, தமிழ், हिन्दी)
          Right: Theme toggle (Sun / Moon)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: '16px', gap: '16px' }}
      >
        {/* Language Switcher Pills */}
        <div
          role="group"
          aria-label="Language Switcher"
          className="inline-flex items-center"
          style={{ gap: '6px' }}
        >
          {(
            [
              { code: 'en', label: 'English' },
              { code: 'ta', label: 'தமிழ்' },
              { code: 'hi', label: 'हिन्दी' },
            ] as const
          ).map((item) => {
            const isActive = currentLang === item.code
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleLanguageChange(item.code)}
                style={{
                  backgroundColor: isActive ? colors.primary : 'transparent',
                  color: isActive ? colors.primaryText : colors.text,
                  border: `2px solid ${colors.primary}`,
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  lineHeight: 1.2,
                  outline: 'none',
                }}
                aria-pressed={isActive}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Right controls: Theme Toggle + Sound Mute Toggle */}
        <div className="flex items-center" style={{ gap: '8px' }}>
          {/* Mute toggle button */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isSoundMuted ? 'Unmute alert chime' : 'Mute alert chime'}
            title={isSoundMuted ? 'Unmute alert chime' : 'Mute alert chime'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '999px',
              backgroundColor: isSoundMuted ? (isDark ? '#333333' : '#E5E7EB') : colors.card,
              border: `2px solid ${isDark ? '#4A4A4A' : '#D1D5DB'}`,
              color: colors.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isSoundMuted ? (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              ) : (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </>
              )}
            </svg>
          </button>

          {/* Theme Toggle (Sun and Moon icons, active filled) */}
          <div
            role="radiogroup"
            aria-label="Theme mode"
            className="inline-flex items-center"
            style={{
              borderRadius: '999px',
              border: `2px solid ${isDark ? '#4A4A4A' : '#D1D5DB'}`,
              backgroundColor: colors.card,
              padding: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              aria-label="Light mode"
              aria-checked={!isDark}
              role="radio"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '999px',
                backgroundColor: !isDark ? colors.primary : 'transparent',
                color: !isDark ? colors.primaryText : colors.text,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {/* Sun icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" fill={!isDark ? 'currentColor' : 'none'} />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              aria-label="Dark mode"
              aria-checked={isDark}
              role="radio"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '999px',
                backgroundColor: isDark ? colors.primary : 'transparent',
                color: isDark ? colors.primaryText : colors.text,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {/* Moon icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. LARGE ALERT BANNER
          Thick coloured left border, bell icon, Heading, Medicine, Time
         ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: colors.card,
          borderLeft: `8px solid ${colors.alert}`,
          padding: '24px 20px',
          borderRadius: '4px 12px 12px 4px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          {/* Bell Icon */}
          <div style={{ color: colors.alert, flexShrink: 0, marginTop: '4px' }}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Heading (32 pt bold) */}
            <h1
              id="alert-heading"
              style={{
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: 1.25,
                margin: '0 0 12px 0',
                color: colors.text,
                letterSpacing: '-0.02em',
                wordBreak: 'break-word',
              }}
            >
              {t('due.heading')}
            </h1>

            {/* Medicine Line (22 pt) */}
            <p
              id="alert-medicine-line"
              style={{
                fontSize: '22px',
                fontWeight: 600,
                lineHeight: 1.35,
                margin: '0 0 8px 0',
                color: colors.text,
                wordBreak: 'break-word',
              }}
            >
              {t('due.medicineLine')}
            </p>

            {/* Time Line (20 pt) */}
            <p
              style={{
                fontSize: '20px',
                fontWeight: 400,
                lineHeight: 1.4,
                margin: 0,
                color: colors.text,
                wordBreak: 'break-word',
              }}
            >
              {t('due.timeLine')}
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SMALL STATUS LINE
          Clock icon + [PENDING LINE] (20 pt)
         ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          paddingLeft: '4px',
        }}
        aria-live="polite"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.alert}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>

        <span
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: colors.text,
            lineHeight: 1.3,
          }}
        >
          {isWaitingLong ? t('due.stillWaiting') : t('due.pending')}
        </span>
      </div>

      {/* Optional feedback banner if action taken */}
      {responseStatus && (
        <div
          role="status"
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '8px',
            backgroundColor: colors.card,
            border: `2px solid ${colors.primary}`,
            fontSize: '18px',
            fontWeight: 700,
            color: colors.text,
            textAlign: 'center',
          }}
        >
          {responseStatus}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. THREE VERY LARGE FULL-WIDTH STACKED BUTTONS
          Each >= 72px tall, 12px corners, 24 pt bold label, simple outline icon:
          - Primary (solid colour, check icon): [TAKEN]
          - Secondary (outlined, clock icon): [LATER]
          - Tertiary (outlined, grey, skip icon): [SKIP]
         ───────────────────────────────────────────────────────────── */}
      <div
        className="flex flex-col"
        style={{
          gap: '16px',
          marginBottom: '24px',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {/* Primary: TAKEN */}
        <button
          type="button"
          onClick={() => handleAction('taken')}
          style={{
            width: '100%',
            minHeight: '76px',
            borderRadius: '12px',
            backgroundColor: colors.primary,
            color: colors.primaryText,
            border: 'none',
            fontSize: '24px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            cursor: 'pointer',
            padding: '16px 20px',
            outline: 'none',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
          className="focus-visible:ring-4 focus-visible:ring-offset-2 active:opacity-90"
          aria-label={t('due.taken')}
        >
          {/* Simple check outline icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span style={{ wordBreak: 'break-word' }}>{t('due.taken')}</span>
        </button>

        {/* Secondary: REMIND ME LATER */}
        <button
          type="button"
          onClick={() => handleAction('later')}
          style={{
            width: '100%',
            minHeight: '76px',
            borderRadius: '12px',
            backgroundColor: 'transparent',
            color: colors.secondaryText,
            border: `3px solid ${colors.secondaryBorder}`,
            fontSize: '24px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            cursor: 'pointer',
            padding: '16px 20px',
            outline: 'none',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
          className="focus-visible:ring-4 focus-visible:ring-offset-2 active:opacity-90"
          aria-label={t('due.later')}
        >
          {/* Simple clock outline icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{ wordBreak: 'break-word' }}>{t('due.later')}</span>
        </button>

        {/* Tertiary: SKIP */}
        <button
          type="button"
          onClick={() => handleAction('skip')}
          style={{
            width: '100%',
            minHeight: '76px',
            borderRadius: '12px',
            backgroundColor: 'transparent',
            color: colors.tertiaryText,
            border: `3px solid ${colors.tertiaryBorder}`,
            fontSize: '24px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            cursor: 'pointer',
            padding: '16px 20px',
            outline: 'none',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
          className="focus-visible:ring-4 focus-visible:ring-offset-2 active:opacity-90"
          aria-label={t('due.skip')}
        >
          {/* Simple skip forward outline icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
          <span style={{ wordBreak: 'break-word' }}>{t('due.skip')}</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. BOTTOM TEXT LINK
          [CALL FAMILY] (20 pt, underlined)
         ───────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <button
          type="button"
          onClick={() => handleAction('call')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            color: colors.text,
            fontSize: '20px',
            fontWeight: 700,
            textDecoration: 'underline',
            textUnderlineOffset: '6px',
            cursor: 'pointer',
            fontFamily,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          }}
          className="focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {/* Phone icon */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>{t('due.callFamily')}</span>
        </button>
      </div>

      {/* Care Circle Family Contact Modal */}
      {showCallFamilyModal && (
        <div
          role="dialog"
          aria-labelledby="family-dialog-title"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: colors.card,
              color: colors.text,
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '360px',
              border: `2px solid ${colors.primary}`,
            }}
          >
            <h2
              id="family-dialog-title"
              style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 16px 0' }}
            >
              {t('due.callFamily')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <a
                href="tel:5550192834"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: colors.bg,
                  color: colors.text,
                  border: `2px solid ${colors.primary}`,
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                <span>Sarah (Nurse)</span>
                <span>📞 Call</span>
              </a>
              <a
                href="tel:5550198822"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: colors.bg,
                  color: colors.text,
                  border: `2px solid ${colors.primary}`,
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                <span>Marcus (Son)</span>
                <span>📞 Call</span>
              </a>
            </div>
            <button
              type="button"
              onClick={() => setShowCallFamilyModal(false)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: colors.primary,
                color: colors.primaryText,
                border: 'none',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
