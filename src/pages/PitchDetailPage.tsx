import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePitch } from '@/hooks/usePitches'
import { useI18n } from '@/hooks/useI18n'
import { PitchActionBar } from '@/components/pitch/PitchActionBar'
import { PitchPreview } from '@/components/pitch/PitchPreview'
import { PitchMetadata } from '@/components/pitch/PitchMetadata'
import { PitchViews } from '@/components/pitch/PitchViews'
import { PitchFeedbackList } from '@/components/pitch/PitchFeedbackList'
import { FullPageLoader } from '@/components/common/LoadingSpinner'
import { ErrorState } from '@/components/common/ErrorState'
import { fadeInUp } from '@/lib/animations'

export function PitchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: pitch, isLoading, error, refetch } = usePitch(id!)
  const { t } = useI18n()

  if (isLoading) {
    return <FullPageLoader text={t.pitchDetail.loading} />
  }

  if (error || !pitch) {
    return (
      <ErrorState
        title={t.pitchDetail.notFound}
        message={t.pitchDetail.notFoundDescription}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <PitchActionBar pitch={pitch} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview — takes 2/3 */}
        <div className="lg:col-span-2">
          {pitch.generated_html ? (
            <PitchPreview html={pitch.generated_html} />
          ) : (
            <div className="rounded-xl border border-border bg-surface flex items-center justify-center h-[500px]">
              <p className="text-text-muted">{t.pitchDetail.noPreview}</p>
            </div>
          )}
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-4">
          <PitchMetadata pitch={pitch} />
          <PitchViews views={pitch.views ?? []} />
          <PitchFeedbackList feedback={pitch.feedback ?? []} />
        </div>
      </div>
    </motion.div>
  )
}
