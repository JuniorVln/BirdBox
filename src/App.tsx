import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Toaster } from '@/components/ui/toaster'

// Pages
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { PitchesPage } from '@/pages/PitchesPage'
import { NewPitchPage } from '@/pages/NewPitchPage'
import { PitchDetailPage } from '@/pages/PitchDetailPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { PublicPitchPage } from '@/pages/PublicPitchPage'
import { LeadsPage } from '@/pages/LeadsPage'

export function App() {
  // Initialize auth listener
  useAuth()

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/p/:id" element={<PublicPitchPage />} />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="pitches" element={<PitchesPage />} />
          <Route path="pitches/new" element={<NewPitchPage />} />
          <Route path="pitches/:id" element={<PitchDetailPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="analytics" element={<ComingSoon title="Analytics" />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="text-4xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-text-secondary">This feature is coming soon.</p>
    </div>
  )
}
