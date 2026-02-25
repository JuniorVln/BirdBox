import { motion } from 'framer-motion'
import { CheckCircle, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/useI18n'

interface GenerationCompleteProps {
  pitchId: string
}

export function GenerationComplete({ pitchId }: GenerationCompleteProps) {
  const navigate = useNavigate()
  const { t } = useI18n()

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 mx-auto mb-6"
      >
        <CheckCircle className="h-8 w-8 text-green-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-text-primary mb-2">{t.newPitch.complete.title}</h2>
        <p className="text-text-secondary text-sm mb-8">
          {t.newPitch.complete.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => navigate(`/dashboard/pitches/${pitchId}`)}
            className="bg-accent hover:bg-accent-hover text-white"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {t.newPitch.complete.viewPitch}
          </Button>
          <Button
            onClick={() => navigate('/dashboard/pitches')}
            variant="outline"
            className="border-border text-text-secondary hover:text-text-primary"
          >
            {t.newPitch.complete.goToPitches}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
