import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Search,
  Users,
  ClipboardCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', enabled: true },
  { icon: Search, label: 'Prospector', href: '/dashboard/leads', enabled: true },
  { icon: Users, label: 'Prospects', href: '/dashboard/prospects', enabled: true },
  { icon: ClipboardCheck, label: 'Audits', href: '/dashboard/audits', enabled: true },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics', enabled: false },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', enabled: true },
]

export function Sidebar() {
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const profile = useAuthStore((s) => s.profile)

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(href)
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="flex h-screen flex-col border-r border-border bg-surface"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Zap className="h-4 w-4 text-white" />
        </div>
        {!sidebarCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold text-text-primary"
          >
            BirdBox
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.enabled ? item.href : '#'}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-accent/10 text-accent border-l-2 border-accent'
                : item.enabled
                  ? 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
                  : 'text-text-muted cursor-not-allowed opacity-50'
            )}
            onClick={(e) => !item.enabled && e.preventDefault()}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
            {!sidebarCollapsed && !item.enabled && (
              <span className="ml-auto text-[10px] uppercase tracking-wider text-text-muted">Soon</span>
            )}
          </Link>
        ))}
      </nav>

      {/* User & Collapse */}
      <div className="border-t border-border p-3 space-y-2">
        {!sidebarCollapsed && profile && (
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-accent/20 text-accent text-xs">
                {profile.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-text-primary truncate">
                {profile.full_name ?? 'User'}
              </p>
              <p className="text-xs text-text-muted truncate">
                {profile.agency_name ?? 'Free plan'}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.aside>
  )
}
