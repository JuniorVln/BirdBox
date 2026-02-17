import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Lead } from '@/types'

export function useLeads() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['leads', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as unknown as Lead[]
    },
    enabled: !!user,
  })
}

interface CreateLeadInput {
  business_name: string
  address?: string
  phone?: string
  website_url?: string
  email?: string
  rating?: number
  review_count?: number
  category?: string
}

export function useCreateLead() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async (input: CreateLeadInput) => {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          user_id: user!.id,
          ...input,
        })
        .select()
        .single()

      if (error) throw error
      return data as unknown as Lead
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}
