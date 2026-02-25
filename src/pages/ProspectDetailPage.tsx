import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Globe, Mail, Phone, MapPin, Star, Activity, User, MonitorSmartphone, BrainCircuit, Play, CheckCircle2, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react'
import { useLead } from '@/hooks/useLeads'
import { useEnrichLead } from '@/hooks/useEnrichLead'
import { useGenerateIntelligence } from '@/hooks/useGenerateIntelligence'
import { useI18n } from '@/hooks/useI18n'
import { Button } from '@/components/ui/button'
import { FullPageLoader } from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

export function ProspectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useI18n()

  const { data: lead, isLoading } = useLead(id!)
  const { mutate: enrichLead, isPending: isEnriching } = useEnrichLead()
  const { mutate: generateIntelligence, isPending: isGeneratingIntelligence } = useGenerateIntelligence()

  const [activeTab, setActiveTab] = useState<'overview' | 'network' | 'tech' | 'intelligence'>('overview')

  if (isLoading) return <FullPageLoader />

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-text-primary">Lead not found</h2>
        <Button variant="outline" onClick={() => navigate('/dashboard/prospects')} className="mt-4">
          {t.common.back}
        </Button>
      </div>
    )
  }

  const isEnrichmentDone = lead.enrichment_status === 'completed'
  const isEnrichmentFailed = lead.enrichment_status === 'failed'

  const handleEnrich = () => {
    if (!lead.website_url) {
      alert(t.prospectDetail.noWebsiteAlert)
      return
    }
    enrichLead(lead.id)
  }

  const tabs = [
    { id: 'overview', label: t.prospectDetail.overview, icon: MapPin },
    { id: 'network', label: t.prospectDetail.network, icon: User },
    { id: 'tech', label: t.prospectDetail.techStack, icon: MonitorSmartphone },
    { id: 'intelligence', label: t.prospectDetail.intelligence, icon: BrainCircuit },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* War Room Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/prospects')} className="mt-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-text-primary">{lead.business_name}</h2>
              {isEnrichmentDone && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-medium border border-green-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {t.prospectDetail.enriched}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-secondary">
              {lead.website_url && (
                <a href={lead.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-accent hover:underline">
                  <Globe className="h-4 w-4" />
                  {new URL(lead.website_url).hostname}
                </a>
              )}
              {lead.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  {lead.rating} ({lead.review_count} {t.prospectDetail.reviews})
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pl-12 md:pl-0">
          <Button
            onClick={() => navigate(`/dashboard/audits?prospect=${lead.id}&url=${encodeURIComponent(lead.website_url ?? '')}&name=${encodeURIComponent(lead.business_name)}`)}
            variant="outline"
            className="border-border text-text-secondary hover:text-text-primary bg-surface"
            disabled={!lead.website_url}
          >
            {t.prospectDetail.lightAudit}
          </Button>

          <Button
            onClick={handleEnrich}
            disabled={isEnriching || isEnrichmentDone}
            className="bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20"
          >
            {isEnriching ? (
              <><Activity className="mr-2 h-4 w-4 animate-spin" /> {t.prospectDetail.enriching}</>
            ) : isEnrichmentDone ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> {t.prospectDetail.dataEnriched}</>
            ) : (
              <><Play className="mr-2 h-4 w-4 fill-white" /> {t.prospectDetail.deepEnrich}</>
            )}
          </Button>
        </div>
      </div>

      {isEnrichmentFailed && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-red-400 w-5 h-5 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-400">{t.prospectDetail.enrichmentFailed}</h4>
            <p className="text-sm text-red-400/80">{t.prospectDetail.enrichmentFailedDescription}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border mt-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
              activeTab === tab.id ? "text-accent" : "text-text-secondary hover:text-text-primary"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="pt-4 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="grid md:grid-cols-2 gap-4">
              {/* Contact Info */}
              <div className="p-6 bg-surface border border-border rounded-lg space-y-4">
                <h3 className="font-semibold text-lg text-text-primary border-b border-border pb-3">
                  {t.prospectDetail.contactInfo}
                </h3>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center"><Phone className="w-4 h-4 text-text-secondary" /></div>
                    <div>
                      <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{t.prospectDetail.phone}</p>
                      <p className="text-sm text-text-primary">{lead.phone || t.common.unknown}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center"><Mail className="w-4 h-4 text-text-secondary" /></div>
                    <div>
                      <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{t.prospectDetail.emailLabel}</p>
                      <p className="text-sm text-text-primary">{lead.email || t.common.unknown}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center"><MapPin className="w-4 h-4 text-text-secondary" /></div>
                    <div>
                      <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{t.prospectDetail.address}</p>
                      <p className="text-sm text-text-primary">{lead.address || t.common.unknown}</p>
                    </div>
                  </div>
                  {(lead as any).enrichment_data?.whatsapp && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{t.prospectDetail.whatsapp}</p>
                        <a href={`https://wa.me/${(lead as any).enrichment_data.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-400 hover:underline">{(lead as any).enrichment_data.whatsapp}</a>
                      </div>
                    </div>
                  )}
                  {(lead as any).instagram_data?.username && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{t.prospectDetail.instagram}</p>
                        <a href={`https://instagram.com/${(lead as any).instagram_data.username}`} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-400 hover:underline">@{(lead as any).instagram_data.username}</a>
                        {(lead as any).instagram_data.followersCount > 0 && (
                          <span className="text-xs text-text-muted ml-2">({(lead as any).instagram_data.followersCount.toLocaleString()} {t.prospectDetail.followers})</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Profile */}
              <div className="p-6 bg-surface border border-border rounded-lg space-y-4">
                <h3 className="font-semibold text-lg text-text-primary border-b border-border pb-3">
                  {t.prospectDetail.businessProfile}
                </h3>
                <div className="space-y-4 pt-2">
                  <div>
                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">{t.prospectDetail.category}</p>
                    <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded text-sm">{lead.category || t.prospectDetail.uncategorized}</span>
                  </div>
                  {lead.pagespeed_data && Object.keys(lead.pagespeed_data).length > 0 && (
                    <div>
                      <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-2">{t.prospectDetail.performanceBaseline}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(lead.pagespeed_data).map(([key, val]) => (
                          <div key={key} className="bg-surface-raised p-2 rounded flex justify-between items-center text-sm">
                            <span className="capitalize text-text-secondary">{key}</span>
                            <span className={cn("font-medium", Number(val) >= 90 ? "text-green-400" : Number(val) >= 50 ? "text-yellow-400" : "text-red-400")}>{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'network' && (
            <motion.div key="network" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
              {!isEnrichmentDone ? (
                <div className="text-center py-20 bg-surface border border-border rounded-lg border-dashed">
                  <User className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <h3 className="text-text-primary font-medium">{t.prospectDetail.noNetworkData}</h3>
                  <p className="text-text-secondary text-sm max-w-sm mx-auto mt-1">{t.prospectDetail.noNetworkDataDescription}</p>
                </div>
              ) : lead.decision_makers?.length === 0 ? (
                <div className="text-center py-20 bg-surface border border-border rounded-lg">
                  <p className="text-text-secondary">{t.prospectDetail.noDecisionMakers}</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lead.decision_makers?.map(person => (
                    <div key={person.id} className="bg-surface border border-border p-5 rounded-lg hover:border-accent/30 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg mb-3">
                        {person.name.charAt(0)}
                      </div>
                      <h4 className="font-semibold text-text-primary truncate">{person.name}</h4>
                      <p className="text-sm text-text-secondary truncate mt-0.5">{person.role || t.prospectDetail.unknownRole}</p>
                      {person.linkedin_url && (
                        <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-xs text-blue-400 hover:underline">
                          {t.prospectDetail.viewLinkedIn}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'tech' && (
            <motion.div key="tech" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
              {!isEnrichmentDone ? (
                <div className="text-center py-20 bg-surface border border-border rounded-lg border-dashed">
                  <MonitorSmartphone className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <h3 className="text-text-primary font-medium">{t.prospectDetail.noTechData}</h3>
                  <p className="text-text-secondary text-sm max-w-sm mx-auto mt-1">{t.prospectDetail.noTechDataDescription}</p>
                </div>
              ) : (!lead.tech_stack || lead.tech_stack.length === 0) ? (
                <div className="text-center py-20 bg-surface border border-border rounded-lg">
                  <p className="text-text-secondary">{t.prospectDetail.noTechDetected}</p>
                </div>
              ) : (
                <div className="bg-surface border border-border p-6 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {lead.tech_stack.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 bg-surface-raised border border-border rounded-md text-sm text-text-secondary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'intelligence' && (
            <motion.div key="int" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
              {!lead.intelligence ? (
                <div className="text-center py-20 bg-surface border border-border rounded-lg border-dashed bg-accent/5">
                  <BrainCircuit className={cn("w-10 h-10 mx-auto mb-3", isGeneratingIntelligence ? "text-accent animate-pulse" : "text-accent/50")} />
                  <h3 className="text-accent font-medium">{t.prospectDetail.intelligencePending}</h3>
                  <p className="text-text-secondary text-sm max-w-sm mx-auto mt-1">{t.prospectDetail.intelligencePendingDescription}</p>
                  <Button
                    onClick={() => generateIntelligence(lead.id)}
                    disabled={isGeneratingIntelligence || !isEnrichmentDone}
                    className="mt-4 bg-accent hover:bg-accent-hover text-white"
                  >
                    {isGeneratingIntelligence ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.common.loading}</>
                    ) : (
                      <><BrainCircuit className="mr-2 h-4 w-4" />{t.prospectDetail.analyzeOpportunity}</>
                    )}
                  </Button>
                  {!isEnrichmentDone && (
                    <p className="text-xs text-text-muted mt-2">Run "Deep Enrich" first to unlock this</p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-surface border border-border p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="text-yellow-400 w-5 h-5" />
                      <h3 className="font-semibold text-lg">{t.prospectDetail.aiSummary}</h3>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{lead.intelligence.ai_summary}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-surface border border-border p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-4 text-red-400">{t.prospectDetail.identifiedPainPoints}</h3>
                      <ul className="space-y-4 border-l-2 border-red-500/20 pl-4">
                        {lead.intelligence.identified_pain_points.map((pt: any, i: number) => (
                          <li key={i}>
                            <p className="font-medium text-text-primary text-sm">{pt.pain_point}</p>
                            <p className="text-xs text-text-muted mt-1 bg-surface-raised p-2 rounded">{pt.evidence}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-surface border border-border p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-4 text-green-400">{t.prospectDetail.recommendedApproach}</h3>
                      <h4 className="text-sm font-medium text-text-muted mb-2">{t.prospectDetail.pitchTheseServices}</h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {lead.intelligence.recommended_services.map((opt: string) => (
                          <span key={opt} className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded text-xs font-bold">{opt}</span>
                        ))}
                      </div>

                      <h4 className="text-sm font-medium text-text-muted mb-2">{t.prospectDetail.emailScripts}</h4>
                      <div className="bg-background border border-border p-3 rounded text-sm text-text-secondary whitespace-pre-wrap font-mono">
                        {lead.intelligence.outreach_script_email || t.prospectDetail.noScriptGenerated}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </motion.div>
  )
}
