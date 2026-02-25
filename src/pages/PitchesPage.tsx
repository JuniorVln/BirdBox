import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, FileText } from 'lucide-react'
import { usePitches } from '@/hooks/usePitches'
import { useI18n } from '@/hooks/useI18n'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, truncate } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/lib/animations'

export function PitchesPage() {
  const { data: pitches, isLoading } = usePitches()
  const navigate = useNavigate()
  const { t } = useI18n()

  const formatPitchesTotal = (count: number) => {
    return count === 1
      ? t.pitches.pitchTotal.replace('{count}', String(count))
      : t.pitches.pitchesTotal.replace('{count}', String(count))
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{t.pitches.allPitches}</h2>
          <p className="text-sm text-text-secondary">
            {formatPitchesTotal(pitches?.length ?? 0)}
          </p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/pitches/new')}
          className="bg-accent hover:bg-accent-hover text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t.pitches.newPitch}
        </Button>
      </motion.div>

      <motion.div variants={staggerItem}>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg bg-surface" />
            ))}
          </div>
        ) : !pitches?.length ? (
          <EmptyState
            icon={FileText}
            title={t.pitches.noPitchesYet}
            description={t.pitches.noPitchesDescription}
            actionLabel={t.pitches.createPitch}
            onAction={() => navigate('/dashboard/pitches/new')}
          />
        ) : (
          <div className="space-y-2">
            {pitches.map((pitch) => (
              <button
                key={pitch.id}
                onClick={() => navigate(`/dashboard/pitches/${pitch.id}`)}
                className="flex w-full items-center gap-4 rounded-lg bg-surface border border-border p-4 hover:border-accent/30 transition-all text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised shrink-0">
                  <FileText className="h-5 w-5 text-text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {truncate(pitch.business_name, 50)}
                  </p>
                  <p className="text-xs text-text-muted">
                    {pitch.template_id} &middot; {formatDate(pitch.created_at)}
                  </p>
                </div>
                <StatusBadge status={pitch.status} />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
