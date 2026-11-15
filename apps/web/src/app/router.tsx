import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { RootLayout } from './RootLayout'
import { AuthGuard } from '../features/auth/components/AuthGuard'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

const LoginPage = lazy(() => import('../features/auth/components/LoginPage'))
const RegisterPage = lazy(() => import('../features/auth/components/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('../features/auth/components/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'))
const MedicationsPage = lazy(() => import('../features/medications/components/MedicationsPage'))
const AppointmentsPage = lazy(() => import('../features/appointments/components/AppointmentsPage'))
const CareCirclePage = lazy(() => import('../features/care-circle/components/CareCirclePage'))
const RedeemInvitationPage = lazy(() => import('../features/care-circle/components/RedeemInvitationPage'))
const AssistancePage = lazy(() => import('../features/assistance/AssistancePage'))
const RefillsPage = lazy(() => import('../features/refills/RefillsPage'))
const DischargeSyncPage = lazy(() => import('../features/reconciliation/DischargeSyncPage'))
const CareShiftPage = lazy(() => import('../features/care-shift/CareShiftPage'))
const CarePassportPage = lazy(() => import('../features/passport/CarePassportPage'))
const CareVoicePage = lazy(() => import('../features/accessibility/CareVoicePage'))
const NotificationsPage = lazy(() => import('../features/notifications/components/NotificationsPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cc-ivory">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: 'register', element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense> },
      { path: 'forgot-password', element: <Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense> },
      {
        path: 'dashboard',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><DashboardPage /></Suspense></AuthGuard>,
      },
      {
        path: 'medications',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><MedicationsPage /></Suspense></AuthGuard>,
      },
      {
        path: 'appointments',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><AppointmentsPage /></Suspense></AuthGuard>,
      },
      {
        path: 'care-circle',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><CareCirclePage /></Suspense></AuthGuard>,
      },
      {
        path: 'redeem-invite',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><RedeemInvitationPage /></Suspense></AuthGuard>,
      },
      {
        path: 'assistance',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><AssistancePage /></Suspense></AuthGuard>,
      },
      {
        path: 'refills',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><RefillsPage /></Suspense></AuthGuard>,
      },
      {
        path: 'reconciliation',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><DischargeSyncPage /></Suspense></AuthGuard>,
      },
      {
        path: 'tasks',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><CareShiftPage /></Suspense></AuthGuard>,
      },
      {
        path: 'passport',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><CarePassportPage /></Suspense></AuthGuard>,
      },
      {
        path: 'voice',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><CareVoicePage /></Suspense></AuthGuard>,
      },
      {
        path: 'notifications',
        element: <AuthGuard><Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense></AuthGuard>,
      },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
])
