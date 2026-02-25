import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useI18n } from '@/hooks/useI18n'

export function DashboardLayout() {
  const location = useLocation()
  const { t } = useI18n()

  const getTitle = () => {
    if (location.pathname.match(/^\/dashboard\/prospects\/[^/]+$/)) {
      return t.header.prospectDetail
    }
    if (location.pathname.match(/^\/dashboard\/audits\/[^/]+$/)) {
      return t.header.auditReport
    }

    const pageTitles: Record<string, string> = {
      '/dashboard': t.nav.dashboard,
      '/dashboard/leads': t.nav.prospector,
      '/dashboard/prospects': t.nav.prospects,
      '/dashboard/audits': t.nav.audits,
      '/dashboard/analytics': t.nav.analytics,
      '/dashboard/settings': t.nav.settings,
    }

    return pageTitles[location.pathname] ?? t.nav.dashboard
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
