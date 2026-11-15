import { Outlet } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

export function RootLayout() {
  useTheme()

  return (
    <div className="min-h-screen bg-cc-ivory text-cc-ink transition-colors duration-200">
      <Outlet />
    </div>
  )
}
