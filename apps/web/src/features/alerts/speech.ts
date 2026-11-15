// Web Speech API accessible read-aloud helper for CareGuardian Due Alerts

export function speakAlertText(text: string, lang: 'en' | 'ta' | 'hi') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

  try {
    window.speechSynthesis.cancel() // Stop any previous speech

    const utterance = new SpeechSynthesisUtterance(text)
    const langMap: Record<'en' | 'ta' | 'hi', string> = {
      en: 'en-IN',
      ta: 'ta-IN',
      hi: 'hi-IN',
    }

    utterance.lang = langMap[lang]
    utterance.rate = 0.88 // Slightly slower, calm cadence for elderly comprehension
    utterance.pitch = 1.0

    // Match appropriate voice if available
    const voices = window.speechSynthesis.getVoices()
    const matchingVoice = voices.find((v) => v.lang.startsWith(lang) || v.lang === langMap[lang])
    if (matchingVoice) {
      utterance.voice = matchingVoice
    }

    window.speechSynthesis.speak(utterance)
  } catch {
    // Speech synthesis unavailable
  }
}

export function stopAlertSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
