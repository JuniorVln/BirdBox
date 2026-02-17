import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/pitches': 'Pitches',
  '/dashboard/pitches/new': 'New Pitch',
  '/dashboard/leads': 'Find Leads',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/settings': 'Settings',
}

export function DashboardLayout() {
  const location = useLocation()

  const getTitle = () => {
    // Check for pitch detail route
    if (location.pathname.match(/^\/dashboard\/pitches\/[^/]+$/) && location.pathname !== '/dashboard/pitches/new') {
      return 'Pitch Detail'
    }
    return pageTitles[location.pathname] ?? 'Dashboard'
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={getTitle()} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
