import { Calendar, Globe, Layout, Eye, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { PitchWithRelations } from '@/types'

interface PitchMetadataProps {
  pitch: PitchWithRelations
}

export function PitchMetadata({ pitch }: PitchMetadataProps) {
  const items = [
    { icon: Globe, label: 'Website', value: pitch.website_url ?? 'N/A' },
    { icon: Layout, label: 'Template', value: pitch.template_id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) },
    { icon: Calendar, label: 'Created', value: formatDate(pitch.created_at) },
    { icon: Eye, label: 'Views', value: pitch.views?.length ?? 0 },
    { icon: MessageSquare, label: 'Feedback', value: pitch.feedback?.length ?? 0 },
  ]

  return (
    <div className="rounded-xl bg-surface border border-border p-5 space-y-4">
      <h3 className="text-sm font-semibold text-text-primary">Details</h3>
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-3">
          <item.icon className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-text-muted">{item.label}</p>
            <p className="text-sm text-text-primary truncate">{String(item.value)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
