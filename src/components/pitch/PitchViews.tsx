import { Eye } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { formatRelativeTime } from '@/lib/utils'
import { useI18n } from '@/hooks/useI18n'
import type { PitchView } from '@/types'

interface PitchViewsProps {
  views: PitchView[]
}

export function PitchViews({ views }: PitchViewsProps) {
  const { t } = useI18n()

  if (!views.length) {
    return (
      <div className="rounded-xl bg-surface border border-border p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">{t.pitchDetail.views.title}</h3>
        <EmptyState
          icon={Eye}
          title={t.pitchDetail.views.noViews}
          description={t.pitchDetail.views.noViewsDescription}
          className="py-8"
        />
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-surface border border-border p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        {t.pitchDetail.views.titleWithCount.replace('{count}', String(views.length))}
      </h3>
      <div className="space-y-3">
        {views.map((view) => (
          <div key={view.id} className="flex items-center gap-3 text-sm">
            <Eye className="h-3.5 w-3.5 text-text-muted shrink-0" />
            <span className="text-text-secondary">{formatRelativeTime(view.viewed_at)}</span>
            {view.location && (
              <span className="text-text-muted text-xs">
                {(view.location as { city?: string }).city}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
