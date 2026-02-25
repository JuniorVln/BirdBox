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
          ...(input as any),
        } as any)
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

export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      // Fetch lead and its relations (Decision Makers, Intelligence)
      const [leadRes, dmRes, intelRes] = await Promise.all([
        supabase.from('leads').select('*').eq('id', id).single(),
        supabase.from('decision_makers').select('*').eq('lead_id', id),
        supabase.from('lead_intelligence').select('*').eq('lead_id', id).maybeSingle()
      ])

      if (leadRes.error) throw leadRes.error
      // Ignore errors for optional relations

      return {
        ...(leadRes.data as any),
        decision_makers: dmRes.data || [],
        intelligence: intelRes.data || null
      } as Lead & { decision_makers: any[], intelligence: any }
    },
    enabled: !!id,
  })
}
