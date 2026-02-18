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
import { ProspectsPage } from '@/pages/ProspectsPage'
import { ProspectDetailPage } from '@/pages/ProspectDetailPage'
import { AuditsPage } from '@/pages/AuditsPage'
import { AuditDetailPage } from '@/pages/AuditDetailPage'
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
          <Route path="leads" element={<LeadsPage />} />
          <Route path="prospects" element={<ProspectsPage />} />
          <Route path="prospects/:id" element={<ProspectDetailPage />} />
          <Route path="audits" element={<AuditsPage />} />
          <Route path="audits/:id" element={<AuditDetailPage />} />
          <Route path="analytics" element={<ComingSoon title="Analytics" />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Legacy redirects */}
          <Route path="pitches" element={<Navigate to="/dashboard/prospects" replace />} />
          <Route path="pitches/new" element={<Navigate to="/dashboard/leads" replace />} />
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
