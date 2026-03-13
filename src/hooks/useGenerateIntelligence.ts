import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useI18n } from '@/hooks/useI18n'

export function useGenerateIntelligence() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { t } = useI18n()

  return useMutation({
    mutationFn: async (leadId: string) => {
      const { data, error } = await supabase.functions.invoke('generate-intelligence', {
        body: { leadId },
      })

      if (error) throw error
      if (!data?.success) throw new Error(data?.error || 'Intelligence generation failed')

      return data.data
    },
    onSuccess: (_data, leadId) => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] })
    },
    onError: (error: Error) => {
      toast({
        title: t.common.somethingWentWrong,
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}
