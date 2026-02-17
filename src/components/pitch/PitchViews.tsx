import { Eye } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { formatRelativeTime } from '@/lib/utils'
import type { PitchView } from '@/types'

interface PitchViewsProps {
  views: PitchView[]
}

export function PitchViews({ views }: PitchViewsProps) {
  if (!views.length) {
    return (
      <div className="rounded-xl bg-surface border border-border p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Views</h3>
        <EmptyState
          icon={Eye}
          title="No views yet"
          description="Views will appear here when someone opens your pitch link."
          className="py-8"
        />
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-surface border border-border p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Views ({views.length})
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
