import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, ClipboardCheck, Send, Eye } from 'lucide-react'
import { usePitches } from '@/hooks/usePitches'
import { useAudits } from '@/hooks/useAudits'
import { useI18n } from '@/hooks/useI18n'
import { StatCard } from '@/components/dashboard/StatCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'

export function DashboardPage() {
  const { data: prospects } = usePitches()
  const { data: audits } = useAudits()
  const navigate = useNavigate()
  const { t } = useI18n()

  const totalProspects = prospects?.length ?? 0
  const totalAudits = audits?.length ?? 0
  const contacted = prospects?.filter((p) => p.status !== 'draft').length ?? 0
  const opened = prospects?.filter((p) => p.status === 'opened' || p.status === 'feedback').length ?? 0

  const recentAudits = audits?.slice(0, 5) ?? []
  const recentProspects = prospects?.slice(0, 5) ?? []

  const getStatusLabel = (status: string) => {
    if (status === 'draft') return t.dashboard.statusNew
    if (status === 'sent') return t.dashboard.statusContacted
    if (status === 'opened') return t.dashboard.statusOpened
    return t.dashboard.statusResponded
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={staggerItem}>
        <QuickActions />
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label={t.dashboard.prospects} value={totalProspects} />
        <StatCard icon={ClipboardCheck} label={t.dashboard.audits} value={totalAudits} />
        <StatCard icon={Send} label={t.dashboard.contacted} value={contacted} />
        <StatCard icon={Eye} label={t.dashboard.opened} value={opened} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Prospects */}
        <motion.div variants={staggerItem}>
          <h2 className="text-lg font-semibold text-text-primary mb-4">{t.dashboard.recentProspects}</h2>
          {recentProspects.length === 0 ? (
            <div className="p-8 rounded-lg bg-surface border border-border text-center">
              <p className="text-text-muted text-sm">{t.dashboard.noProspectsYet}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentProspects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate('/dashboard/prospects/' + p.id)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border hover:border-accent/30 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{p.business_name}</p>
                    <p className="text-xs text-text-muted">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', {
                    'bg-gray-500/20 text-gray-400': p.status === 'draft',
                    'bg-blue-500/20 text-blue-400': p.status === 'sent',
                    'bg-yellow-500/20 text-yellow-400': p.status === 'opened',
                    'bg-green-500/20 text-green-400': p.status === 'feedback',
                  })}>
                    {getStatusLabel(p.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Audits */}
        <motion.div variants={staggerItem}>
          <h2 className="text-lg font-semibold text-text-primary mb-4">{t.dashboard.recentAudits}</h2>
          {recentAudits.length === 0 ? (
            <div className="p-8 rounded-lg bg-surface border border-border text-center">
              <p className="text-text-muted text-sm">{t.dashboard.noAuditsYet}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentAudits.map((a) => (
                <div
                  key={a.id}
                  onClick={() => a.status === 'completed' && navigate('/dashboard/audits/' + a.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg bg-surface border border-border transition-colors',
                    a.status === 'completed' && 'hover:border-accent/30 cursor-pointer'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{a.business_name}</p>
                    <p className="text-xs text-text-muted truncate">{a.website_url}</p>
                  </div>
                  {a.overall_score !== null && (
                    <span className={cn('text-sm font-bold', {
                      'text-green-400': a.overall_score >= 90,
                      'text-yellow-400': a.overall_score >= 50 && a.overall_score < 90,
                      'text-red-400': a.overall_score < 50,
                    })}>
                      {a.overall_score}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
