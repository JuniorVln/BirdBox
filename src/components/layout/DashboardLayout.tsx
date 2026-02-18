import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/leads': 'Prospector',
  '/dashboard/prospects': 'Prospects',
  '/dashboard/audits': 'Audits',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/settings': 'Settings',
}

export function DashboardLayout() {
  const location = useLocation()

  const getTitle = () => {
    if (location.pathname.match(/^\/dashboard\/prospects\/[^/]+$/)) {
      return 'Prospect Detail'
    }
    if (location.pathname.match(/^\/dashboard\/audits\/[^/]+$/)) {
      return 'Audit Report'
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
