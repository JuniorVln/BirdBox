import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type PitchStatus = 'draft' | 'sent' | 'opened' | 'feedback'

const statusConfig: Record<PitchStatus, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  },
  sent: {
    label: 'Sent',
    className: 'bg-blue-950 text-blue-300 border-blue-800',
  },
  opened: {
    label: 'Opened',
    className: 'bg-green-950 text-green-300 border-green-800',
  },
  feedback: {
    label: 'Feedback',
    className: 'bg-purple-950 text-purple-300 border-purple-800',
  },
}

interface StatusBadgeProps {
  status: PitchStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', config.className, className)}>
      {config.label}
    </Badge>
  )
}
