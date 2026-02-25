import { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useScraper } from '@/hooks/useScraper'
import { useCreatePitch } from '@/hooks/usePitches'
import { useGeneratePitch } from '@/hooks/useGeneratePitch'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from '@/hooks/useI18n'
import { StepIndicator } from '@/components/pitch/StepIndicator'
import { PitchForm } from '@/components/pitch/PitchForm'
import { ScrapingProgress } from '@/components/pitch/ScrapingProgress'
import { TemplateSelector } from '@/components/pitch/TemplateSelector'
import { GenerationComplete } from '@/components/pitch/GenerationComplete'
import type { ScrapedData, PitchColors, Lead } from '@/types'

const DEFAULT_COLORS: PitchColors = {
  primary: '#2563eb',
  secondary: '#1e40af',
  accent: '#3b82f6',
}

export function NewPitchPage() {
  const location = useLocation()
  const leadFromState = (location.state as { lead?: Lead })?.lead
  const { t } = useI18n()

  const STEPS = [
    t.newPitch.steps.details,
    t.newPitch.steps.analysis,
    t.newPitch.steps.template,
    t.newPitch.steps.complete
  ]

  const [step, setStep] = useState(0)
  const [businessName, setBusinessName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [leadId, setLeadId] = useState<string | null>(null)
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null)
  const [createdPitchId, setCreatedPitchId] = useState<string | null>(null)

  const { scrape, currentStep, progress } = useScraper()
  const createPitch = useCreatePitch()
  const generatePitch = useGeneratePitch()
  const profile = useAuthStore((s) => s.profile)

  const handleFormSubmit = useCallback(
    async (name: string, url: string) => {
      setBusinessName(name)
      setWebsiteUrl(url)
      setStep(1)

      try {
        const data = await scrape(name, url)
        setScrapedData(data)
        setStep(2)
      } catch {
        setStep(0)
      }
    },
    [scrape]
  )

  // Auto-start from lead if passed via navigation state
  useEffect(() => {
    if (leadFromState && leadFromState.website_url) {
      setLeadId(leadFromState.id)
      handleFormSubmit(leadFromState.business_name, leadFromState.website_url)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTemplateSelect = useCallback(
    async (templateId: string) => {
      if (!scrapedData || !profile) return

      try {
        // Generate HTML via Claude API (falls back to local template)
        const html = await generatePitch.mutateAsync({
          scrapedData,
          templateId,
          colors: DEFAULT_COLORS,
        })

        const pitch = await createPitch.mutateAsync({
          business_name: businessName,
          website_url: websiteUrl,
          scraped_data: scrapedData,
          template_id: templateId,
          generated_html: html,
          colors: DEFAULT_COLORS,
          ...(leadId ? { lead_id: leadId } : {}),
        })
        setCreatedPitchId(pitch.id)
        setStep(3)
      } catch {
        // Error handled by React Query
      }
    },
    [scrapedData, profile, businessName, websiteUrl, leadId, createPitch, generatePitch]
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <StepIndicator steps={STEPS} currentStep={step} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <PitchForm
              onSubmit={handleFormSubmit}
              defaultBusinessName={leadFromState?.business_name}
              defaultWebsiteUrl={leadFromState?.website_url ?? undefined}
            />
          )}
          {step === 1 && <ScrapingProgress currentStep={currentStep} progress={progress} />}
          {step === 2 && scrapedData && (
            <TemplateSelector
              scrapedData={scrapedData}
              onSelect={handleTemplateSelect}
              isGenerating={generatePitch.isPending || createPitch.isPending}
            />
          )}
          {step === 3 && createdPitchId && (
            <GenerationComplete pitchId={createdPitchId} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
