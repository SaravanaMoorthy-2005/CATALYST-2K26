import { useState, useEffect } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('careguardian_theme') as ThemeMode) || 'light'
    }
    return 'light'
  })

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

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return { mode, setMode, toggleTheme, isDark: mode === 'dark' }
}
