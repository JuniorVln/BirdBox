import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { templates } from '@/templates'
import { useI18n } from '@/hooks/useI18n'
import type { ScrapedData } from '@/types'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface TemplateSelectorProps {
  scrapedData: ScrapedData
  onSelect: (templateId: string) => void
  isGenerating?: boolean
}

function getRecommendedTemplate(category: string): string {
  const categoryMap: Record<string, string> = {
    barbershop: 'local-business',
    restaurant: 'minimal-elegant',
    dental: 'modern-professional',
    fitness: 'bold-creative',
  }
  return categoryMap[category] ?? 'modern-professional'
}

export function TemplateSelector({ scrapedData, onSelect, isGenerating = false }: TemplateSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const recommendedId = getRecommendedTemplate(scrapedData.category)
  const { t } = useI18n()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">{t.newPitch.templateSelector.title}</h2>
        <p className="text-text-secondary">
          {t.newPitch.templateSelector.description}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid sm:grid-cols-2 gap-4 mb-8"
      >
        {templates.map((template) => {
          const isSelected = selectedId === template.id
          const isRecommended = recommendedId === template.id

          return (
            <motion.button
              key={template.id}
              variants={staggerItem}
              onClick={() => setSelectedId(template.id)}
              className={cn(
                'relative rounded-xl border p-5 text-left transition-all',
                isSelected
                  ? 'border-accent bg-accent/5 ring-1 ring-accent'
                  : 'border-border bg-surface hover:border-accent/30'
              )}
            >
              {isRecommended && (
                <span className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-medium text-white">
                  <Sparkles className="h-3 w-3" />
                  {t.newPitch.templateSelector.aiPick}
                </span>
              )}

              {isSelected && (
                <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}

              {/* Template preview placeholder */}
              <div className={cn(
                'h-32 rounded-lg mb-4 flex items-center justify-center',
                template.id === 'modern-professional' && 'bg-gradient-to-br from-slate-800 to-slate-900',
                template.id === 'bold-creative' && 'bg-gradient-to-br from-purple-900 to-pink-900',
                template.id === 'minimal-elegant' && 'bg-gradient-to-br from-stone-800 to-stone-900',
                template.id === 'local-business' && 'bg-gradient-to-br from-amber-900 to-orange-900',
              )}>
                <span className="text-xs text-white/40 uppercase tracking-wider">{template.name}</span>
              </div>

              <h3 className="text-base font-semibold text-text-primary mb-1">{template.name}</h3>
              <p className="text-sm text-text-secondary mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {template.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] text-text-muted"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      <div className="flex justify-center">
        <Button
          onClick={() => selectedId && onSelect(selectedId)}
          disabled={!selectedId || isGenerating}
          className="bg-accent hover:bg-accent-hover text-white px-8 h-11"
        >
          {isGenerating ? t.newPitch.templateSelector.generating : t.newPitch.templateSelector.generateWebsite}
        </Button>
      </div>
    </div>
  )
}
