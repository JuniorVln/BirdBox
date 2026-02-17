import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { FullPageLoader } from '@/components/common/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuthStore()

  if (loading) {
    return <FullPageLoader />
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
