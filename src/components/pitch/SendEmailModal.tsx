import { useState, useEffect } from 'react'
import { Mail, ExternalLink, Copy, Check, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMarkPitchSent } from '@/hooks/usePitches'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from '@/hooks/useI18n'
import {
  generateEmailSubject,
  generateEmailBody,
  generateGmailComposeUrl,
} from '@/lib/emailTemplates'
import type { Pitch } from '@/types'

interface SendEmailModalProps {
  pitch: Pitch
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendEmailModal({ pitch, open, onOpenChange }: SendEmailModalProps) {
  const profile = useAuthStore((s) => s.profile)
  const markSent = useMarkPitchSent()
  const { t } = useI18n()

  const publicUrl = `${window.location.origin}/p/${pitch.id}`
  const senderName = profile?.agency_name || profile?.full_name || 'Pitch AI'

  const recipientEmail =
    pitch.scraped_data?.contact?.email || ''

  const [to, setTo] = useState(recipientEmail)
  const [subject, setSubject] = useState(generateEmailSubject(pitch.business_name))
  const [body, setBody] = useState(generateEmailBody(pitch.business_name, publicUrl, senderName))
  const [copied, setCopied] = useState(false)
  const [markedSent, setMarkedSent] = useState(false)

  useEffect(() => {
    if (open) {
      setTo(recipientEmail)
      setSubject(generateEmailSubject(pitch.business_name))
      setBody(generateEmailBody(pitch.business_name, publicUrl, senderName))
      setCopied(false)
      setMarkedSent(false)
    }
  }, [open, pitch.business_name, publicUrl, senderName, recipientEmail])

  const handleOpenGmail = () => {
    const url = generateGmailComposeUrl(to, subject, body)
    window.open(url, '_blank')
  }

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMarkSent = async () => {
    await markSent.mutateAsync(pitch.id)
    setMarkedSent(true)
    setTimeout(() => onOpenChange(false), 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border text-text-primary sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-text-primary">
            <Mail className="h-5 w-5 text-accent" />
            {t.pitchDetail.sendEmailModal.title.replace('{name}', pitch.business_name)}
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            {t.pitchDetail.sendEmailModal.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs">{t.pitchDetail.sendEmailModal.to}</Label>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="bg-surface-raised border-border text-text-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs">{t.pitchDetail.sendEmailModal.subject}</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-surface-raised border-border text-text-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs">{t.pitchDetail.sendEmailModal.message}</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="bg-surface-raised border-border text-text-primary resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={handleOpenGmail}
              className="bg-accent hover:bg-accent-hover flex-1 gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {t.pitchDetail.sendEmailModal.openGmail}
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyEmail}
              className="border-border text-text-secondary hover:text-text-primary gap-2"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              {copied ? t.pitchDetail.sendEmailModal.copied : t.pitchDetail.sendEmailModal.copyEmail}
            </Button>
          </div>

          <div className="border-t border-border pt-3">
            {markedSent ? (
              <div className="flex items-center justify-center gap-2 text-green-400 py-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">{t.pitchDetail.sendEmailModal.markedAsSent}</span>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={handleMarkSent}
                disabled={markSent.isPending}
                className="w-full border-border text-text-secondary hover:text-text-primary gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                {markSent.isPending ? t.pitchDetail.sendEmailModal.updating : t.pitchDetail.sendEmailModal.markAsSent}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
