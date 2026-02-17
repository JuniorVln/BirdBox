import { MessageSquare, Star } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { formatRelativeTime } from '@/lib/utils'
import type { PitchFeedback } from '@/types'

interface PitchFeedbackListProps {
  feedback: PitchFeedback[]
}

export function PitchFeedbackList({ feedback }: PitchFeedbackListProps) {
  if (!feedback.length) {
    return (
      <div className="rounded-xl bg-surface border border-border p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Feedback</h3>
        <EmptyState
          icon={MessageSquare}
          title="No feedback yet"
          description="Feedback from business owners will appear here."
          className="py-8"
        />
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-surface border border-border p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Feedback ({feedback.length})
      </h3>
      <div className="space-y-4">
        {feedback.map((fb) => (
          <div key={fb.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < (fb.rating ?? 0) ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-700'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-text-muted">{formatRelativeTime(fb.created_at)}</span>
            </div>
            {fb.message && (
              <p className="text-sm text-text-secondary">{fb.message}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
