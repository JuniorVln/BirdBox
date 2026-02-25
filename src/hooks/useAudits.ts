import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Audit } from '@/types'

export function useAudits() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['audits', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as unknown as Audit[]
    },
    enabled: !!user,
  })
}

export function useAudit(id: string) {
  return useQuery({
    queryKey: ['audit', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as unknown as Audit
    },
    enabled: !!id,
  })
}

interface RunAuditInput {
  business_name: string
  website_url: string
  pitch_id?: string
}

export function useRunAudit() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async (input: RunAuditInput) => {
      // 1. Create audit record with 'pending' status
      const { data: audit, error: insertError } = await supabase
        .from('audits')
        .insert({
          user_id: user!.id,
          business_name: input.business_name,
          website_url: input.website_url,
          pitch_id: input.pitch_id ?? null,
          status: 'running',
        } as any)
        .select()
        .single() as any

      if (insertError) throw insertError

      try {
        // 2. Call the audit edge function
        const { data: fnData, error: fnError } = await supabase.functions.invoke('audit-website', {
          body: {
            url: input.website_url,
            business_name: input.business_name,
          },
        })

        if (fnError) throw fnError

        // Edge function may return 200 but contain an error field for expected failures
        if (fnData?.error) throw new Error(fnData.error)

        // 3. Update audit with results
        const result = fnData as {
          scores: {
            performance: number
            seo: number
            mobile: number
            accessibility: number
            bestPractices: number
          }
          issues: Audit['issues']
          recommendations: Audit['recommendations']
          summary: string
          auditData: Record<string, unknown>
        }

        const overallScore = Math.round(
          (result.scores.performance +
            result.scores.seo +
            result.scores.mobile +
            result.scores.accessibility +
            result.scores.bestPractices) / 5
        )

        const { data: updated, error: updateError } = await supabase
          .from('audits')
          // @ts-expect-error Supabase types mismatch
          .update({
            status: 'completed',
            overall_score: overallScore,
            performance_score: result.scores.performance,
            seo_score: result.scores.seo,
            mobile_score: result.scores.mobile,
            accessibility_score: result.scores.accessibility,
            best_practices_score: result.scores.bestPractices,
            audit_data: result.auditData as unknown as Record<string, unknown>,
            summary: result.summary,
            issues: result.issues as unknown as Record<string, unknown>,
            recommendations: result.recommendations as unknown as Record<string, unknown>,
            completed_at: new Date().toISOString(),
          } as any)
          .eq('id', audit.id)
          .select()
          .single() as any

        if (updateError) throw updateError
        return updated as unknown as Audit
      } catch (err) {
        // Mark audit as failed (audits table not in generated types, cast needed)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('audits').update({
          status: 'failed',
          error_message: err instanceof Error ? err.message : 'Unknown error',
        }).eq('id', audit.id)
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] })
    },
  })
}
