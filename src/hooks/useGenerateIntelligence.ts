import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useGenerateIntelligence() {
  const queryClient = useQueryClient()

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
      // Refresh the lead query so the intelligence tab renders immediately
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] })
    },
  })
}
