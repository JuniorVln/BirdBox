import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface EnrichLeadResponse {
    success: boolean
    message: string
    data?: any
    error?: string
}

export function useEnrichLead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (leadId: string): Promise<EnrichLeadResponse> => {
            // 1. Get current session for auth
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('No active session')

            // 2. Call the enrich-lead Edge Function
            const { data, error } = await supabase.functions.invoke('enrich-lead', {
                body: { leadId },
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            })

            if (error) throw error
            if (data?.error) throw new Error(data.error)

            return data as EnrichLeadResponse
        },
        onSuccess: (_, leadId) => {
            // Invalidate both the list and the single item queries to refresh UI
            queryClient.invalidateQueries({ queryKey: ['leads'] })
            queryClient.invalidateQueries({ queryKey: ['lead', leadId] })
        }
    })
}
