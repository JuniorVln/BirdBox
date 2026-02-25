import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { FullPageLoader } from '@/components/common/LoadingSpinner'
import { useI18n } from '@/hooks/useI18n'

export function PublicPitchPage() {
  const { id } = useParams<{ id: string }>()
  const viewRecorded = useRef(false)
  const { t } = useI18n()

  const { data: pitch, isLoading, error } = useQuery<{ id: string; generated_html: string | null; business_name: string; status: string } | null, Error>({
    queryKey: ['public-pitch', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pitches')
        .select('id, generated_html, business_name, status')
        .eq('id', id!)
        .single()

      if (error) throw error
      return data as { id: string; generated_html: string | null; business_name: string; status: string }
    },
    enabled: !!id,
  })

  // Record view and auto-update status
  useEffect(() => {
    if (pitch && !viewRecorded.current) {
      viewRecorded.current = true

        // Record the view
        ; (supabase as any).from('pitch_views').insert({
          pitch_id: pitch.id,
          user_agent: navigator.userAgent,
        }).then(() => {
          // View recorded silently
        })

      // Auto-update status: sent → opened
      if (pitch.status === 'sent') {
        ; (supabase as any)
          .from('pitches')
          .update({ status: 'opened' })
          .eq('id', pitch.id)
          .then(() => {
            // Status updated silently
          })
      }
    }
  }, [pitch])

  if (isLoading) {
    return <FullPageLoader text={t.publicPitch.loading} />
  }

  if (error || !pitch?.generated_html) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.publicPitch.notFound}</h1>
          <p className="text-gray-500">{t.publicPitch.notFoundDescription}</p>
        </div>
      </div>
    )
  }

  return (
    <iframe
      srcDoc={pitch.generated_html}
      className="w-full h-screen border-0"
      title={pitch.business_name ?? t.publicPitch.title}
      sandbox="allow-same-origin allow-forms"
    />
  )
}
