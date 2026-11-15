import { useState, useEffect } from 'react'
import { AppShell } from '../../components/AppShell'
import { SurfaceCard } from '../../components/SurfaceCard'
import { Volume2, VolumeX, Globe, Play, Square, Pause, ShieldCheck } from 'lucide-react'
import { useAuth } from '../auth/hooks/useAuth'

export default function CareVoicePage() {
  const { currentRole } = useAuth()
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ta' | 'hi'>('en')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false)
    }
  }, [])

  const contentTranslations = {
    en: {
      title: 'CareVoice Read-Aloud Assistant',
      subtitle: 'Accessible spoken schedule guidance in English, Tamil, and Hindi.',
      greeting: 'Good morning, Eleanor. Here is your daily medication schedule for today.',
      med1: 'At 8:00 AM: Take Atorvastatin 20mg with a full glass of water.',
      med2: 'At 1:00 PM: Take Metformin 500mg with your lunch.',
      med3: 'At 8:00 PM: Take Lisinopril 10mg before bedtime.',
      helpNotice: 'If you need assistance at any time, tap the Need Help button on your screen.',
    },
    ta: {
      title: 'கேர்வாய்ஸ் வாசிப்பு உதவியாளர் (CareVoice)',
      subtitle: 'தமிழ், ஆங்கிலம் மற்றும் இந்தியில் குரல் வழிகாட்டல்.',
      greeting: 'காலை வணக்கம், எலினோர். இன்றைய உங்கள் மருந்து அட்டவணை இதோ.',
      med1: 'காலை 8:00 மணிக்கு: அடோர்வாஸ்டாடின் 20மி.கி மாத்திரையை தண்ணீருடன் எடுத்துக் கொள்ளுங்கள்.',
      med2: 'மதியம் 1:00 மணிக்கு: மெட்ஃபோர்மின் 500மி.கி மாத்திரையை மதிய உணவுடன் எடுத்துக் கொள்ளுங்கள்.',
      med3: 'இரவு 8:00 மணிக்கு: லிசினோப்ரில் 10மி.கி மாத்திரையை படுக்கைக்கு முன் எடுத்துக் கொள்ளுங்கள்.',
      helpNotice: 'உங்களுக்கு உதவி தேவைப்பட்டால், திரையில் உள்ள "Need Help" பொத்தானைத் தொடவும்.',
    },
    hi: {
      title: 'केयरवॉइस ध्वनि सहायक (CareVoice)',
      subtitle: 'अंग्रेजी, तमिल और हिंदी में सुलभ आवाज मार्गदर्शन।',
      greeting: 'शुभ प्रभात, एलेनोर। आज के लिए आपकी दवा अनुसूची यहाँ है।',
      med1: 'सुबह 8:00 बजे: एटोरवास्टेटिन 20mg पानी के साथ लें।',
      med2: 'दोपहर 1:00 बजे: दोपहर के भोजन के साथ मेटफॉर्मिन 500mg लें।',
      med3: 'रात 8:00 बजे: सोने से पहले लिसिनोप्रिल 10mg लें।',
      helpNotice: 'यदि आपको सहायता की आवश्यकता है, तो स्क्रीन पर "Need Help" बटन दबाएं।',
    },
  }

  const currentCopy = contentTranslations[selectedLanguage]

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const fullText = `${currentCopy.greeting}. ${currentCopy.med1}. ${currentCopy.med2}. ${currentCopy.med3}. ${currentCopy.helpNotice}`
    const utterance = new SpeechSynthesisUtterance(fullText)

    if (selectedLanguage === 'ta') {
      utterance.lang = 'ta-IN'
    } else if (selectedLanguage === 'hi') {
      utterance.lang = 'hi-IN'
    } else {
      utterance.lang = 'en-US'
    }

    utterance.rate = 0.9 // Slightly slower for elderly clarity
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <AppShell currentRole={currentRole}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-cc-ink">{currentCopy.title}</h1>
          <p className="text-sm text-cc-muted mt-1">{currentCopy.subtitle}</p>
        </div>

        {/* Language Selection Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              handleStop()
              setSelectedLanguage('en')
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              selectedLanguage === 'en'
                ? 'bg-cc-ink text-cc-lemon'
                : 'bg-cc-surface border border-cc-border text-cc-ink hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            English
          </button>

          <button
            onClick={() => {
              handleStop()
              setSelectedLanguage('ta')
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              selectedLanguage === 'ta'
                ? 'bg-cc-ink text-cc-lemon'
                : 'bg-cc-surface border border-cc-border text-cc-ink hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            தமிழ் (Tamil)
          </button>

          <button
            onClick={() => {
              handleStop()
              setSelectedLanguage('hi')
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              selectedLanguage === 'hi'
                ? 'bg-cc-ink text-cc-lemon'
                : 'bg-cc-surface border border-cc-border text-cc-ink hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>

        {/* Speech Controls Bar */}
        <SurfaceCard className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cc-lemon text-cc-ink flex items-center justify-center">
                {isSpeaking ? <Volume2 className="w-6 h-6 animate-pulse" /> : <Volume2 className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-cc-ink">
                  {isSpeaking ? 'Reading Aloud...' : 'Read Schedule Aloud'}
                </h3>
                <p className="text-xs text-cc-muted">
                  {speechSupported ? 'Clear spoken audio at gentle pace' : 'Web speech not supported in browser'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isSpeaking ? (
                <button
                  onClick={handleSpeak}
                  disabled={!speechSupported}
                  className="px-6 py-3 rounded-full bg-cc-ink text-cc-ivory font-headline text-sm font-bold flex items-center gap-2 hover:opacity-90 shadow-sm"
                  aria-label="Start Read Aloud"
                >
                  <Play className="w-4 h-4 text-cc-lemon fill-cc-lemon" />
                  <span>Start Reading</span>
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="px-6 py-3 rounded-full bg-red-600 text-white font-headline text-sm font-bold flex items-center gap-2 hover:opacity-90 shadow-sm"
                  aria-label="Stop Reading"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop</span>
                </button>
              )}
            </div>
          </div>
        </SurfaceCard>

        {/* Spoken Text Display Card */}
        <SurfaceCard className="p-6 space-y-4">
          <h3 className="font-headline font-bold text-lg text-cc-ink border-b border-cc-border pb-3">
            Schedule Text Transcript
          </h3>

          <p className="text-sm font-semibold text-cc-ink leading-relaxed">
            {currentCopy.greeting}
          </p>

          <div className="space-y-2.5 text-sm">
            <div className="p-3 rounded-xl bg-cc-ivory border border-cc-border text-cc-ink font-medium">
              {currentCopy.med1}
            </div>
            <div className="p-3 rounded-xl bg-cc-ivory border border-cc-border text-cc-ink font-medium">
              {currentCopy.med2}
            </div>
            <div className="p-3 rounded-xl bg-cc-ivory border border-cc-border text-cc-ink font-medium">
              {currentCopy.med3}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cc-lemon/30 border border-cc-lemon text-xs font-semibold text-cc-ink">
            {currentCopy.helpNotice}
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  )
}
