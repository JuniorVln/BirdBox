import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Globe, ExternalLink, AlertTriangle, AlertCircle, Info, Lightbulb } from 'lucide-react'
import { useAudit } from '@/hooks/useAudits'
import { ScoreGauge, ScoreBar } from '@/components/audit/ScoreGauge'
import { Button } from '@/components/ui/button'
import { FullPageLoader } from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'
import type { AuditIssue, AuditRecommendation } from '@/types'

const severityIcon = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const severityColor = {
  critical: 'text-red-400 bg-red-400/10',
  warning: 'text-yellow-400 bg-yellow-400/10',
  info: 'text-blue-400 bg-blue-400/10',
}

const impactColor = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-blue-400',
}

export function AuditDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: audit, isLoading } = useAudit(id!)

  if (isLoading) return <FullPageLoader />

  if (!audit) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-text-primary">Audit not found</h2>
        <Button variant="outline" onClick={() => navigate('/dashboard/audits')} className="mt-4">
          Back to Audits
        </Button>
      </div>
    )
  }

  const issues = (audit.issues ?? []) as AuditIssue[]
  const recommendations = (audit.recommendations ?? []) as AuditRecommendation[]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/audits')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-text-primary">{audit.business_name}</h2>
          <a
            href={audit.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline flex items-center gap-1"
          >
            <Globe className="h-3 w-3" />
            {audit.website_url}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        {audit.overall_score !== null && (
          <ScoreGauge score={audit.overall_score} label="Overall" size="lg" />
        )}
      </div>

      {/* Score Cards */}
      {audit.status === 'completed' && (
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col items-center p-4 rounded-lg bg-surface border border-border">
            <ScoreGauge score={audit.performance_score ?? 0} label="Performance" size="md" />
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-surface border border-border">
            <ScoreGauge score={audit.seo_score ?? 0} label="SEO" size="md" />
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-surface border border-border">
            <ScoreGauge score={audit.mobile_score ?? 0} label="Mobile" size="md" />
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-surface border border-border">
            <ScoreGauge score={audit.accessibility_score ?? 0} label="A11y" size="md" />
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-surface border border-border">
            <ScoreGauge score={audit.best_practices_score ?? 0} label="Best Practices" size="md" />
          </div>
        </div>
      )}

      {/* Summary */}
      {audit.summary && (
        <div className="p-4 rounded-lg bg-surface border border-border">
          <p className="text-text-secondary text-sm">{audit.summary}</p>
        </div>
      )}

      {/* Score Bars (compact view) */}
      {audit.status === 'completed' && (
        <div className="p-5 rounded-lg bg-surface border border-border space-y-3">
          <h3 className="font-semibold text-text-primary mb-4">Score Breakdown</h3>
          <ScoreBar score={audit.performance_score ?? 0} label="Performance" />
          <ScoreBar score={audit.seo_score ?? 0} label="SEO" />
          <ScoreBar score={audit.mobile_score ?? 0} label="Mobile" />
          <ScoreBar score={audit.accessibility_score ?? 0} label="Accessibility" />
          <ScoreBar score={audit.best_practices_score ?? 0} label="Best Practices" />
        </div>
      )}

      {/* Issues */}
      {issues.length > 0 && (
        <div className="p-5 rounded-lg bg-surface border border-border">
          <h3 className="font-semibold text-text-primary mb-4">
            Issues Found ({issues.length})
          </h3>
          <div className="space-y-2">
            {issues.map((issue, i) => {
              const Icon = severityIcon[issue.severity] ?? Info
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-bg">
                  <div className={cn('mt-0.5 p-1 rounded', severityColor[issue.severity])}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{issue.title}</p>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{issue.description}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted shrink-0">
                    {issue.category}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="p-5 rounded-lg bg-surface border border-border">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-text-primary">{rec.title}</p>
                  <span className={cn('text-[10px] uppercase font-bold', impactColor[rec.impact])}>
                    {rec.impact} impact
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failed state */}
      {audit.status === 'failed' && (
        <div className="p-5 rounded-lg bg-red-400/5 border border-red-400/20 text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400 font-medium">Audit failed</p>
          <p className="text-sm text-text-muted mt-1">{audit.error_message ?? 'Unknown error'}</p>
        </div>
      )}
    </motion.div>
  )
}
