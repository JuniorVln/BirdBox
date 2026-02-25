import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Search, Globe, Mail, Star, Activity, CheckCircle2, Clock } from 'lucide-react'
import { useLeads } from '@/hooks/useLeads'
import { useI18n } from '@/hooks/useI18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/common/EmptyState'
import { FullPageLoader } from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/lib/animations'

export function ProspectsPage() {
  const navigate = useNavigate()
  const { data: leads, isLoading } = useLeads()
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')

  const enrichmentStatusStyles = {
    pending: { label: t.prospects.status.pending, icon: Clock, color: 'text-gray-400 bg-gray-500/10' },
    enriching: { label: t.prospects.status.enriching, icon: Activity, color: 'text-blue-400 bg-blue-500/10' },
    completed: { label: t.prospects.status.completed, icon: CheckCircle2, color: 'text-green-400 bg-green-500/10' },
    failed: { label: t.prospects.status.failed, icon: Star, color: 'text-red-400 bg-red-500/10' },
  }

  const filtered = leads?.filter((lead) =>
    lead.business_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) return <FullPageLoader />

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{t.prospects.title}</h2>
          <p className="text-text-secondary">{t.prospects.description}</p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/leads')}
          className="bg-accent hover:bg-accent-hover text-white"
        >
          <Search className="mr-2 h-4 w-4" />
          {t.prospects.findNewLeads}
        </Button>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Input
          placeholder={t.leads.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-surface border-border"
        />
      </motion.div>

      {(!filtered || filtered.length === 0) ? (
        <EmptyState
          icon={Users}
          title={t.prospects.noLeadsYet}
          description={t.prospects.noLeadsYetDescription}
        />
      ) : (
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lead) => {
            const statusKey = (lead.enrichment_status || 'pending') as keyof typeof enrichmentStatusStyles
            const statusConfig = enrichmentStatusStyles[statusKey] ?? enrichmentStatusStyles.pending
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={lead.id}
                onClick={() => navigate(`/dashboard/prospects/${lead.id}`)}
                className="flex flex-col gap-4 p-5 rounded-lg bg-surface border border-border hover:border-accent/50 cursor-pointer transition-all hover:shadow-lg group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-1">{lead.business_name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-text-secondary">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      <span>{lead.rating ?? 'N/A'}</span>
                      <span className="text-text-muted text-xs">({lead.review_count ?? 0})</span>
                    </div>
                  </div>
                  <div className={cn("px-2 py-1 rounded text-[10px] flex items-center gap-1 font-medium", statusConfig.color)}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-text-secondary mt-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 shrink-0 text-text-muted" />
                    <span className="truncate">{lead.website_url ?? 'No website'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-text-muted" />
                    <span className="truncate">{lead.email ?? 'No email'}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
