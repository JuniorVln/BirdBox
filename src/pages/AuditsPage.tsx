import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardCheck, Globe, Loader2, AlertCircle } from 'lucide-react'
import { useAudits, useRunAudit } from '@/hooks/useAudits'
import { useI18n } from '@/hooks/useI18n'
import { ScoreGauge } from '@/components/audit/ScoreGauge'
import { EmptyState } from '@/components/common/EmptyState'
import { FullPageLoader } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useToast } from '@/hooks/use-toast'

export function AuditsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: audits, isLoading } = useAudits()
  const runAudit = useRunAudit()
  const { toast } = useToast()
  const { t } = useI18n()

  const [url, setUrl] = useState('')
  const [businessName, setBusinessName] = useState('')

  // Auto-fill from query params (from prospect page)
  useEffect(() => {
    const paramUrl = searchParams.get('url')
    const paramName = searchParams.get('name')
    const prospectId = searchParams.get('prospect')
    if (paramUrl) setUrl(paramUrl)
    if (paramName) setBusinessName(paramName)
    // Auto-run if coming from prospect
    if (paramUrl && paramName && prospectId) {
      handleRunAudit(paramName, paramUrl, prospectId)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRunAudit = async (name?: string, auditUrl?: string, pitchId?: string) => {
    const targetUrl = auditUrl || url
    const targetName = name || businessName || targetUrl

    if (!targetUrl) {
      toast({ title: t.audits.urlRequired, description: t.audits.urlRequiredDescription, variant: 'destructive' })
      return
    }

    try {
      const audit = await runAudit.mutateAsync({
        business_name: targetName,
        website_url: targetUrl,
        pitch_id: pitchId,
      })
      navigate('/dashboard/audits/' + audit.id)
    } catch (err) {
      toast({
        title: t.audits.auditFailed,
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) return <FullPageLoader />

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-text-primary">{t.audits.title}</h2>
        <p className="text-text-secondary">{t.audits.description}</p>
      </motion.div>

      {/* Quick audit form */}
      <motion.div variants={staggerItem} className="flex gap-3">
        <Input
          placeholder={t.audits.businessName}
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="max-w-[200px] bg-surface border-border"
        />
        <Input
          placeholder={t.audits.urlPlaceholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-surface border-border"
        />
        <Button
          onClick={() => handleRunAudit()}
          disabled={runAudit.isPending || !url}
          className="bg-accent hover:bg-accent-hover text-white"
        >
          {runAudit.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ClipboardCheck className="mr-2 h-4 w-4" />
          )}
          {runAudit.isPending ? t.audits.auditing : t.audits.runAudit}
        </Button>
      </motion.div>

      {(!audits || audits.length === 0) ? (
        <EmptyState
          icon={ClipboardCheck}
          title={t.audits.noAuditsYet}
          description={t.audits.noAuditsYetDescription}
        />
      ) : (
        <motion.div variants={staggerItem} className="grid gap-3">
          {audits.map((audit) => (
            <div
              key={audit.id}
              onClick={() => audit.status === 'completed' && navigate('/dashboard/audits/' + audit.id)}
              className={cn(
                'flex items-center gap-4 p-4 rounded-lg bg-surface border border-border transition-colors',
                audit.status === 'completed' && 'hover:border-accent/30 cursor-pointer'
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                {audit.status === 'running' ? (
                  <Loader2 className="h-5 w-5 text-accent animate-spin" />
                ) : audit.status === 'failed' ? (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                ) : (
                  <Globe className="h-5 w-5 text-accent" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">{audit.business_name}</p>
                <p className="text-sm text-text-secondary truncate">{audit.website_url}</p>
              </div>

              {audit.status === 'completed' && audit.overall_score !== null && (
                <div className="flex items-center gap-4">
                  <ScoreGauge score={audit.overall_score} label={t.audits.overall} size="sm" />
                </div>
              )}

              {audit.status === 'running' && (
                <span className="text-xs text-yellow-400 font-medium">{t.audits.analyzing}</span>
              )}
              {audit.status === 'failed' && (
                <span className="text-xs text-red-400 font-medium">{t.audits.failed}</span>
              )}

              <span className="text-xs text-text-muted">
                {new Date(audit.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
