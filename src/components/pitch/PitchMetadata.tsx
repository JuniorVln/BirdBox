import { Calendar, Globe, Layout, Eye, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useI18n } from '@/hooks/useI18n'
import type { PitchWithRelations } from '@/types'

interface PitchMetadataProps {
  pitch: PitchWithRelations
}

export function PitchMetadata({ pitch }: PitchMetadataProps) {
  const { t } = useI18n()

  const items = [
    { icon: Globe, label: t.pitchDetail.metadata.website, value: pitch.website_url ?? 'N/A' },
    { icon: Layout, label: t.pitchDetail.metadata.template, value: pitch.template_id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) },
    { icon: Calendar, label: t.pitchDetail.metadata.created, value: formatDate(pitch.created_at) },
    { icon: Eye, label: t.pitchDetail.metadata.views, value: pitch.views?.length ?? 0 },
    { icon: MessageSquare, label: t.pitchDetail.metadata.feedback, value: pitch.feedback?.length ?? 0 },
  ]

  return (
    <div className="rounded-xl bg-surface border border-border p-5 space-y-4">
      <h3 className="text-sm font-semibold text-text-primary">{t.pitchDetail.metadata.title}</h3>
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
