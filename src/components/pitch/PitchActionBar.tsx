import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, ExternalLink, Trash2, Check, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useDeletePitch } from '@/hooks/usePitches'
import { SendEmailModal } from '@/components/pitch/SendEmailModal'
import { useI18n } from '@/hooks/useI18n'
import type { Pitch } from '@/types'

interface PitchActionBarProps {
  pitch: Pitch
}

export function PitchActionBar({ pitch }: PitchActionBarProps) {
  const navigate = useNavigate()
  const deletePitch = useDeletePitch()
  const [copied, setCopied] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const { t } = useI18n()

  const publicUrl = `${window.location.origin}/p/${pitch.id}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpen = () => {
    window.open(publicUrl, '_blank')
  }

  const handleDelete = async () => {
    if (window.confirm(t.pitchDetail.actions.deleteConfirm)) {
      await deletePitch.mutateAsync(pitch.id)
      navigate('/dashboard/pitches')
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text-primary">{pitch.business_name}</h1>
              <StatusBadge status={pitch.status} />
            </div>
            <p className="text-xs text-text-muted">{pitch.website_url}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pitch.generated_html && (
            <Button
              size="sm"
              onClick={() => setEmailModalOpen(true)}
              className="bg-accent hover:bg-accent-hover gap-2"
            >
              <Mail className="h-3.5 w-3.5" />
              {t.pitchDetail.actions.sendEmail}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="border-border text-text-secondary hover:text-text-primary gap-2"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? t.pitchDetail.actions.copied : t.pitchDetail.actions.copyUrl}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpen}
            className="border-border text-text-secondary hover:text-text-primary gap-2"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t.pitchDetail.actions.openPreview}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="border-border text-red-400 hover:text-red-300 hover:border-red-800 gap-2"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <SendEmailModal
        pitch={pitch}
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
      />
    </>
  )
}
