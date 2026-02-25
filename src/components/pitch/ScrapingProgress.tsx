import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useI18n } from '@/hooks/useI18n'

interface ScrapingProgressProps {
  currentStep: string
  progress: number
}

export function ScrapingProgress({ currentStep, progress }: ScrapingProgressProps) {
  const { t } = useI18n()

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 mx-auto mb-6"
      >
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </motion.div>

      <h2 className="text-xl font-bold text-text-primary mb-2">{t.newPitch.scraping.title}</h2>
      <p className="text-text-secondary text-sm mb-8">
        {t.newPitch.scraping.description}
      </p>

      <Progress value={progress} className="h-2 mb-4 bg-surface-raised" />

      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-accent font-medium"
        >
          {currentStep}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
