import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { getTemplateById } from '@/templates'
import type { ScrapedData, PitchColors } from '@/types'

interface GeneratePitchParams {
  scrapedData: ScrapedData
  templateId: string
  colors: PitchColors
}

export function useGeneratePitch() {
  const profile = useAuthStore((s) => s.profile)

  return useMutation({
    mutationFn: async (params: GeneratePitchParams): Promise<string> => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-pitch', {
          body: {
            scrapedData: params.scrapedData,
            templateId: params.templateId,
            colors: params.colors,
            creatorProfile: profile,
          },
        })

        if (error) throw error
        if (!data?.success) throw new Error(data?.error || 'Generation failed')

        return data.html
      } catch (err) {
        console.warn('Claude generation failed, falling back to template:', err)

        // Fallback to local template generator
        const template = getTemplateById(params.templateId)
        if (!template) throw new Error('Template not found')

        return template.generate(params.scrapedData, params.colors, profile!)
      }
    },
  })
}
