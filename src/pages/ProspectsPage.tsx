import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Search, ExternalLink, Globe, Mail, Phone, Star } from 'lucide-react'
import { usePitches } from '@/hooks/usePitches'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/common/EmptyState'
import { FullPageLoader } from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/lib/animations'

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'New', color: 'bg-gray-500/20 text-gray-400' },
  sent: { label: 'Contacted', color: 'bg-blue-500/20 text-blue-400' },
  opened: { label: 'Opened', color: 'bg-yellow-500/20 text-yellow-400' },
  feedback: { label: 'Responded', color: 'bg-green-500/20 text-green-400' },
}

export function ProspectsPage() {
  const navigate = useNavigate()
  const { data: prospects, isLoading } = usePitches()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = prospects?.filter((p) =>
    p.business_name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2 className="text-2xl font-bold text-text-primary">Prospects</h2>
          <p className="text-text-secondary">Your pipeline of business prospects and their status.</p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/leads')}
          className="bg-accent hover:bg-accent-hover text-white"
        >
          <Search className="mr-2 h-4 w-4" />
          Find New Leads
        </Button>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Input
          placeholder="Search prospects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-surface border-border"
        />
      </motion.div>

      {(!filtered || filtered.length === 0) ? (
        <EmptyState
          icon={Users}
          title="No prospects yet"
          description="Use the Prospector to find leads and add them to your pipeline."
        />
      ) : (
        <motion.div variants={staggerItem} className="grid gap-3">
          {filtered.map((prospect) => {
            const status = statusLabels[prospect.status] ?? statusLabels.draft
            return (
              <div
                key={prospect.id}
                onClick={() => navigate(`/dashboard/prospects/${prospect.id}`)}
                className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-border hover:border-accent/30 cursor-pointer transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Globe className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">{prospect.business_name}</p>
                  <p className="text-sm text-text-secondary truncate">{prospect.website_url ?? 'No website'}</p>
                </div>
                <div className="flex items-center gap-3">
                  {prospect.scraped_data?.contact?.email && (
                    <Mail className="h-4 w-4 text-text-muted" />
                  )}
                  {prospect.scraped_data?.contact?.phone && (
                    <Phone className="h-4 w-4 text-text-muted" />
                  )}
                  <span className={cn('text-xs font-medium px-2 py-1 rounded-full', status.color)}>
                    {status.label}
                  </span>
                </div>
              </div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
