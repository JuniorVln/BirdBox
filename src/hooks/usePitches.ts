import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Pitch, ScrapedData, PitchColors, PitchWithRelations } from '@/types'

export function usePitches() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['pitches', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pitches')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as unknown as Pitch[]
    },
    enabled: !!user, // Enable if mock user exists
  })
}

export function usePitch(id: string) {
  return useQuery({
    queryKey: ['pitch', id],
    queryFn: async () => {
      const [pitchRes, viewsRes, feedbackRes] = await Promise.all([
        supabase.from('pitches').select('*').eq('id', id).single(),
        supabase
          .from('pitch_views')
          .select('*')
          .eq('pitch_id', id)
          .order('viewed_at', { ascending: false }),
        supabase
          .from('pitch_feedback')
          .select('*')
          .eq('pitch_id', id)
          .order('created_at', { ascending: false }),
      ])

      if (pitchRes.error) throw pitchRes.error
      if (viewsRes.error) throw viewsRes.error
      if (feedbackRes.error) throw feedbackRes.error

      return {
        ...(pitchRes.data as unknown as Pitch),
        views: viewsRes.data ?? [],
        feedback: feedbackRes.data ?? [],
      } as PitchWithRelations
    },
    enabled: !!id,
  })
}

interface CreatePitchInput {
  business_name: string
  website_url: string
  scraped_data: ScrapedData
  template_id: string
  generated_html: string
  colors: PitchColors
  lead_id?: string
}

export function useCreatePitch() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async (input: CreatePitchInput) => {
      const { data, error } = await supabase
        .from('pitches')
        .insert({
          user_id: user!.id,
          business_name: input.business_name,
          website_url: input.website_url,
          scraped_data: input.scraped_data,
          template_id: input.template_id,
          generated_html: input.generated_html,
          colors: input.colors,
          status: 'draft',
          ...(input.lead_id ? { lead_id: input.lead_id } : {}),
        } as any)
        .select()
        .single()

      if (error) throw error
      return data as unknown as Pitch
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pitches'] })
    },
  })
}

export function useUpdatePitch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Pitch>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('pitches')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as unknown as Pitch
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pitches'] })
      queryClient.invalidateQueries({ queryKey: ['pitch', data.id] })
    },
  })
}

export function useMarkPitchSent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('pitches')
        .update({ status: 'sent', email_sent_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as unknown as Pitch
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pitches'] })
      queryClient.invalidateQueries({ queryKey: ['pitch', data.id] })
    },
  })
}

export function useDeletePitch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('pitches').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pitches'] })
    },
  })
}
