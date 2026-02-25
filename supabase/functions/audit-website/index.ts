import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface LighthouseCategory {
  score: number | null
}

interface LighthouseAudit {
  id: string
  title: string
  description: string
  score: number | null
  scoreDisplayMode: string
  displayValue?: string
}

interface PageSpeedResult {
  lighthouseResult: {
    categories: {
      performance: LighthouseCategory
      seo: LighthouseCategory
      accessibility: LighthouseCategory
      'best-practices': LighthouseCategory
    }
    audits: Record<string, LighthouseAudit>
  }
}

function categorizeAudit(auditId: string): 'performance' | 'seo' | 'mobile' | 'accessibility' | 'best-practices' {
  const seoAudits = ['meta-description', 'document-title', 'link-text', 'hreflang', 'canonical', 'robots-txt', 'crawlable-anchors', 'is-crawlable', 'structured-data']
  const perfAudits = ['first-contentful-paint', 'largest-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift', 'interactive', 'server-response-time', 'render-blocking-resources', 'unused-css-rules', 'unused-javascript']
  const a11yAudits = ['color-contrast', 'image-alt', 'label', 'button-name', 'link-name', 'html-has-lang', 'document-title']

  if (seoAudits.includes(auditId)) return 'seo'
  if (perfAudits.includes(auditId)) return 'performance'
  if (a11yAudits.includes(auditId)) return 'accessibility'
  return 'best-practices'
}

function severityFromScore(score: number | null): 'critical' | 'warning' | 'info' {
  if (score === null || score < 0.5) return 'critical'
  if (score < 0.9) return 'warning'
  return 'info'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, business_name } = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'url is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Run PageSpeed Insights for both mobile and desktop
    const strategies = ['mobile', 'desktop'] as const
    const categories = 'performance,seo,accessibility,best-practices'

    const googleApiKey = Deno.env.get('GOOGLE_API_KEY') || ''

    const results = await Promise.all(
      strategies.map(async (strategy) => {
        const apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
          + '?url=' + encodeURIComponent(url)
          + '&category=' + categories
          + '&strategy=' + strategy
          + (googleApiKey ? '&key=' + googleApiKey : '')

        const res = await fetch(apiUrl)
        if (!res.ok) {
          const errText = await res.text()
          console.error('PageSpeed API error (' + strategy + '):', res.status, errText)
          try {
            const parsed = JSON.parse(errText)
            throw new Error(`PageSpeed API error: ${parsed.error?.message || res.status}`)
          } catch {
            throw new Error(`PageSpeed API error: ${res.status}`)
          }
        }
        return res.json() as Promise<PageSpeedResult>
      })
    )

    const [mobileResult, desktopResult] = results

    // Extract scores (0-100 scale)
    const mobileCategories = mobileResult.lighthouseResult.categories
    const desktopCategories = desktopResult.lighthouseResult.categories

    // Use mobile scores as primary (Google prioritizes mobile)
    const scores = {
      performance: Math.round((mobileCategories.performance.score ?? 0) * 100),
      seo: Math.round((mobileCategories.seo.score ?? 0) * 100),
      mobile: Math.round((mobileCategories.performance.score ?? 0) * 100),
      accessibility: Math.round((mobileCategories.accessibility.score ?? 0) * 100),
      bestPractices: Math.round((mobileCategories['best-practices'].score ?? 0) * 100),
    }

    // Extract failing audits as issues
    const issues: { category: string; severity: string; title: string; description: string }[] = []
    const mobileAudits = mobileResult.lighthouseResult.audits

    for (const [auditId, audit] of Object.entries(mobileAudits)) {
      if (audit.score !== null && audit.score < 0.9 && audit.scoreDisplayMode !== 'notApplicable' && audit.scoreDisplayMode !== 'manual') {
        issues.push({
          category: categorizeAudit(auditId),
          severity: severityFromScore(audit.score),
          title: audit.title,
          description: (audit.displayValue ? audit.displayValue + ' — ' : '') + audit.description.replace(/\[.*?\]\(.*?\)/g, '').substring(0, 200),
        })
      }
    }

    // Sort: critical first, then warning, then info
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    issues.sort((a, b) => severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder])

    // Generate recommendations based on scores
    const recommendations: { title: string; description: string; impact: string }[] = []

    if (scores.performance < 50) {
      recommendations.push({
        title: 'Optimize page loading speed',
        description: 'The site loads slowly (score: ' + scores.performance + '/100). Compress images, enable browser caching, and minimize JavaScript to improve user experience.',
        impact: 'high',
      })
    } else if (scores.performance < 80) {
      recommendations.push({
        title: 'Improve page performance',
        description: 'The site has moderate loading speed (score: ' + scores.performance + '/100). Consider lazy-loading images and optimizing CSS delivery.',
        impact: 'medium',
      })
    }

    if (scores.seo < 70) {
      recommendations.push({
        title: 'Fix SEO issues',
        description: 'The site has significant SEO problems (score: ' + scores.seo + '/100). Missing meta tags, poor heading structure, or missing alt text could be costing search visibility.',
        impact: 'high',
      })
    }

    if (scores.mobile < 60) {
      recommendations.push({
        title: 'Improve mobile experience',
        description: 'The site performs poorly on mobile devices (score: ' + scores.mobile + '/100). A modern responsive redesign would significantly improve engagement.',
        impact: 'high',
      })
    }

    if (scores.accessibility < 70) {
      recommendations.push({
        title: 'Address accessibility issues',
        description: 'The site has accessibility problems (score: ' + scores.accessibility + '/100). Color contrast, missing labels, and navigation issues could exclude potential customers.',
        impact: 'medium',
      })
    }

    if (scores.bestPractices < 70) {
      recommendations.push({
        title: 'Update to modern web standards',
        description: 'The site uses outdated practices (score: ' + scores.bestPractices + '/100). Updating to modern standards improves security and performance.',
        impact: 'medium',
      })
    }

    // Generate summary
    const overallScore = Math.round(
      (scores.performance + scores.seo + scores.mobile + scores.accessibility + scores.bestPractices) / 5
    )

    let summary = 'Website audit for ' + (business_name || url) + ': '
    if (overallScore >= 80) {
      summary += 'Overall the website is in good shape (score: ' + overallScore + '/100). '
    } else if (overallScore >= 50) {
      summary += 'The website has several areas for improvement (score: ' + overallScore + '/100). '
    } else {
      summary += 'The website needs significant improvements (score: ' + overallScore + '/100). '
    }

    const criticalCount = issues.filter((i) => i.severity === 'critical').length
    const warningCount = issues.filter((i) => i.severity === 'warning').length
    if (criticalCount > 0) {
      summary += criticalCount + ' critical issues found. '
    }
    if (warningCount > 0) {
      summary += warningCount + ' warnings detected. '
    }

    return new Response(
      JSON.stringify({
        scores,
        issues: issues.slice(0, 20),
        recommendations,
        summary,
        auditData: {
          mobile: {
            performance: scores.performance,
            seo: scores.seo,
            accessibility: scores.accessibility,
            bestPractices: scores.bestPractices,
          },
          desktop: {
            performance: Math.round((desktopCategories.performance.score ?? 0) * 100),
            seo: Math.round((desktopCategories.seo.score ?? 0) * 100),
            accessibility: Math.round((desktopCategories.accessibility.score ?? 0) * 100),
            bestPractices: Math.round((desktopCategories['best-practices'].score ?? 0) * 100),
          },
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('audit-website error:', err)
    // Return 200 with error property so the frontend can read the actual message
    // instead of getting a generic "non-2xx status code" from Supabase client
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
