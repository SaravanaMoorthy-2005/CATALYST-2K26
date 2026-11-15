import { Outlet } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

export function RootLayout() {
  useTheme()

  return (
    <div className="min-h-screen bg-cc-ivory dark:bg-[#0F1A1A] text-cc-ink dark:text-white transition-colors duration-200">
      <Outlet />
    </div>
  )
}
