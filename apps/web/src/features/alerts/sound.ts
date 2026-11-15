// Web Audio API gentle alert sound and haptic vibration engine

class AlertSoundService {
  private audioCtx: AudioContext | null = null
  private intervalId: number | null = null
  private isMuted: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.isMuted = localStorage.getItem('careguardian_sound_muted') === 'true'
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
    if (typeof window !== 'undefined') {
      localStorage.setItem('careguardian_sound_muted', String(muted))
    }
    if (muted) {
      this.stop()
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted
  }

  private playGentleChime() {
    if (this.isMuted || typeof window === 'undefined') return

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass()
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume()
      }

      const now = this.audioCtx.currentTime

      // First note (C5 - 523.25Hz)
      const osc1 = this.audioCtx.createOscillator()
      const gain1 = this.audioCtx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(523.25, now)
      gain1.gain.setValueAtTime(0.12, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
      osc1.connect(gain1)
      gain1.connect(this.audioCtx.destination)
      osc1.start(now)
      osc1.stop(now + 0.5)

      // Second note (E5 - 659.25Hz)
      const osc2 = this.audioCtx.createOscillator()
      const gain2 = this.audioCtx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(659.25, now + 0.15)
      gain2.gain.setValueAtTime(0.15, now + 0.15)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65)
      osc2.connect(gain2)
      gain2.connect(this.audioCtx.destination)
      osc2.start(now + 0.15)
      osc2.stop(now + 0.7)
    } catch {
      // AudioContext not allowed before user interaction
    }

    // Trigger gentle vibration pattern if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200])
      } catch {
        // vibration blocked
      }
    }
  }

  public start() {
    this.stop()
    this.playGentleChime()
    // Repeat gentle chime every 4 seconds until user acknowledges
    this.intervalId = window.setInterval(() => {
      this.playGentleChime()
    }, 4000)
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(0)
      } catch {
        // ignore
      }
    }
  }
}

export const alertSound = new AlertSoundService()
