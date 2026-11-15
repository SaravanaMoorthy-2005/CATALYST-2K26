import { useState, useEffect } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_EVENT = 'careguardian_theme_changed'

function getInitialTheme(): ThemeMode {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('careguardian_theme') as ThemeMode) || 'light'
  }
  return 'light'
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(getInitialTheme)

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>
      if (customEvent.detail && customEvent.detail !== mode) {
        setModeState(customEvent.detail)
      }
    }

    window.addEventListener(THEME_EVENT, handleThemeChange)
    return () => window.removeEventListener(THEME_EVENT, handleThemeChange)
  }, [mode])

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (theme: 'light' | 'dark') => {
      if (theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mediaQuery.matches ? 'dark' : 'light')

      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light')
      }
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      applyTheme(mode)
    }

    localStorage.setItem('careguardian_theme', mode)
  }, [mode])

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('careguardian_theme', newMode)
      window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: newMode }))
    }
  }

  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light'
    setMode(next)
  }

  return { mode, setMode, toggleTheme, isDark: mode === 'dark' }
}
