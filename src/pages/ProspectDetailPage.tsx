import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Globe, Mail, Phone, MapPin, Star, ExternalLink, ClipboardCheck } from 'lucide-react'
import { usePitch } from '@/hooks/usePitches'
import { Button } from '@/components/ui/button'
import { FullPageLoader } from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'New', color: 'bg-gray-500/20 text-gray-400' },
  sent: { label: 'Contacted', color: 'bg-blue-500/20 text-blue-400' },
  opened: { label: 'Opened', color: 'bg-yellow-500/20 text-yellow-400' },
  feedback: { label: 'Responded', color: 'bg-green-500/20 text-green-400' },
}

export function ProspectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: prospect, isLoading } = usePitch(id!)

  if (isLoading) return <FullPageLoader />

  if (!prospect) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-text-primary">Prospect not found</h2>
        <Button variant="outline" onClick={() => navigate('/dashboard/prospects')} className="mt-4">
          Back to Prospects
        </Button>
      </div>
    )
  }

  const status = statusLabels[prospect.status] ?? statusLabels.draft
  const contact = prospect.scraped_data?.contact

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/prospects')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-text-primary">{prospect.business_name}</h2>
            <span className={cn('text-xs font-medium px-2 py-1 rounded-full', status.color)}>
              {status.label}
            </span>
          </div>
          {prospect.website_url && (
            <a
              href={prospect.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline flex items-center gap-1 mt-1"
            >
              <Globe className="h-3 w-3" />
              {prospect.website_url}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <Button
          onClick={() => navigate(`/dashboard/audits?prospect=${prospect.id}&url=${encodeURIComponent(prospect.website_url ?? '')}&name=${encodeURIComponent(prospect.business_name)}`)}
          className="bg-accent hover:bg-accent-hover text-white"
          disabled={!prospect.website_url}
        >
          <ClipboardCheck className="mr-2 h-4 w-4" />
          Run Audit
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Info */}
        <div className="p-5 rounded-lg bg-surface border border-border space-y-3">
          <h3 className="font-semibold text-text-primary">Contact Info</h3>
          {contact?.email && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Mail className="h-4 w-4 text-accent" />
              <span>{contact.email}</span>
            </div>
          )}
          {contact?.phone && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Phone className="h-4 w-4 text-accent" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact?.address && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <MapPin className="h-4 w-4 text-accent" />
              <span>{contact.address}</span>
            </div>
          )}
          {!contact?.email && !contact?.phone && !contact?.address && (
            <p className="text-sm text-text-muted">No contact info available</p>
          )}
        </div>

        {/* Business Info */}
        <div className="p-5 rounded-lg bg-surface border border-border space-y-3">
          <h3 className="font-semibold text-text-primary">Business Info</h3>
          {prospect.scraped_data?.category && (
            <div className="text-sm text-text-secondary">
              <span className="text-text-muted">Category:</span> {prospect.scraped_data.category}
            </div>
          )}
          {prospect.scraped_data?.description && (
            <p className="text-sm text-text-secondary line-clamp-3">{prospect.scraped_data.description}</p>
          )}
          {prospect.scraped_data?.services && prospect.scraped_data.services.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {prospect.scraped_data.services.slice(0, 5).map((s, i) => (
                <span key={i} className="text-xs bg-surface-raised px-2 py-0.5 rounded text-text-secondary">
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Views */}
      {prospect.views && prospect.views.length > 0 && (
        <div className="p-5 rounded-lg bg-surface border border-border">
          <h3 className="font-semibold text-text-primary mb-3">Activity ({prospect.views.length} views)</h3>
          <div className="space-y-2">
            {prospect.views.slice(0, 10).map((view) => (
              <div key={view.id} className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {view.location?.city ? `${view.location.city}, ${view.location.country}` : 'Unknown location'}
                </span>
                <span className="text-text-muted">
                  {new Date(view.viewed_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
