import { useNavigate } from 'react-router-dom'
import { FileText, ExternalLink } from 'lucide-react'
import { cn, formatRelativeTime, truncate } from '@/lib/utils'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import type { Pitch } from '@/types'

interface RecentPitchesProps {
  pitches: Pitch[] | undefined
  isLoading: boolean
  onNewPitch: () => void
}

export function RecentPitches({ pitches, isLoading, onNewPitch }: RecentPitchesProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg bg-surface" />
        ))}
      </div>
    )
  }

  if (!pitches?.length) {
    return (
      <EmptyState
        icon={FileText}
        title="No pitches yet"
        description="Create your first pitch to start landing clients with AI-powered website redesigns."
        actionLabel="Create Pitch"
        onAction={onNewPitch}
      />
    )
  }

  return (
    <div className="space-y-2">
      {pitches.slice(0, 8).map((pitch) => (
        <button
          key={pitch.id}
          onClick={() => navigate(`/dashboard/pitches/${pitch.id}`)}
          className={cn(
            'flex w-full items-center gap-4 rounded-lg bg-surface border border-border p-4',
            'hover:border-accent/30 transition-all text-left'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised shrink-0">
            <FileText className="h-5 w-5 text-text-muted" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {truncate(pitch.business_name, 40)}
            </p>
            <p className="text-xs text-text-muted">{formatRelativeTime(pitch.created_at)}</p>
          </div>
          <StatusBadge status={pitch.status} />
          <ExternalLink className="h-4 w-4 text-text-muted shrink-0" />
        </button>
      ))}
    </div>
  )
}
