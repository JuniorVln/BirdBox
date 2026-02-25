import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function buildLeadContext(lead: Record<string, unknown>, decisionMakers: Record<string, unknown>[]): string {
  const sections: string[] = []

  sections.push(`BUSINESS PROFILE:
- Name: ${lead.business_name}
- Category: ${lead.category || 'Unknown'}
- Address: ${lead.address || 'Unknown'}
- Phone: ${lead.phone || 'Not available'}
- Email: ${lead.email || 'Not found — outreach will need to be via website contact form or LinkedIn'}
- Website: ${lead.website_url || 'No website'}
- Google Rating: ${lead.rating ? `${lead.rating}/5 (${lead.review_count} reviews)` : 'No rating data'}`)

  const techStack = lead.tech_stack as string[] | undefined
  if (techStack && techStack.length > 0) {
    sections.push(`TECH STACK (detected via Wappalyzer):\n${techStack.join(', ')}`)
  } else {
    sections.push(`TECH STACK: Not detected (could be custom-built or blocking detection)`)
  }

  const ps = lead.pagespeed_data as Record<string, unknown> | undefined
  if (ps && Object.keys(ps).length > 0) {
    sections.push(`WEBSITE PERFORMANCE (Google PageSpeed - Mobile):
- Performance: ${ps.performance ?? 'N/A'}/100
- SEO: ${ps.seo ?? 'N/A'}/100
- Accessibility: ${ps.accessibility ?? 'N/A'}/100
- Best Practices: ${ps.bestPractices ?? 'N/A'}/100`)
  } else {
    sections.push(`WEBSITE PERFORMANCE: Not measured`)
  }

  const ig = lead.instagram_data as Record<string, unknown> | undefined
  if (ig && ig.username) {
    sections.push(`INSTAGRAM:
- Username: @${ig.username}
- Followers: ${(ig.followersCount as number)?.toLocaleString() || 0}
- Posts: ${ig.postsCount || 0}
- Bio: ${ig.biography || 'None'}
- Verified: ${ig.isVerified ? 'Yes' : 'No'}`)
  } else {
    sections.push(`INSTAGRAM: Not found or no social presence`)
  }

  const li = lead.linkedin_data as Record<string, unknown> | undefined
  if (li && Object.keys(li).length > 0) {
    sections.push(`LINKEDIN:
- Followers: ${li.followerCount || 'Unknown'}
- Employees: ${li.employeeCount || 'Unknown'}`)
  }

  if (decisionMakers.length > 0) {
    const dmList = decisionMakers
      .map((dm) => `- ${dm.name} (${dm.role || 'Role unknown'})${dm.linkedin_url ? ` — ${dm.linkedin_url}` : ''}`)
      .join('\n')
    sections.push(`DECISION MAKERS (from LinkedIn):\n${dmList}`)
  } else {
    sections.push(`DECISION MAKERS: Not identified`)
  }

  const enrichmentData = lead.enrichment_data as Record<string, unknown> | undefined
  if (enrichmentData?.whatsapp) {
    sections.push(`WHATSAPP: ${enrichmentData.whatsapp} (direct contact available)`)
  }

  return sections.join('\n\n')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { leadId } = await req.json()

    if (!leadId) {
      return new Response(JSON.stringify({ error: 'leadId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const authHeader = req.headers.get('Authorization')!

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    })

    // Fetch lead + decision makers in parallel
    const [leadRes, dmRes] = await Promise.all([
      supabase.from('leads').select('*').eq('id', leadId).single(),
      supabase.from('decision_makers').select('*').eq('lead_id', leadId),
    ])

    if (leadRes.error || !leadRes.data) {
      throw new Error(`Lead not found: ${leadRes.error?.message}`)
    }

    const lead = leadRes.data as Record<string, unknown>
    const decisionMakers = (dmRes.data || []) as Record<string, unknown>[]

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured')

    const context = buildLeadContext(lead, decisionMakers)

    const prompt = `You are a senior sales intelligence analyst for a web design agency. Analyze the following business data and produce a structured intelligence report to help close a new website project deal.

${context}

Based on this data, return a JSON object with EXACTLY this structure (pure JSON, no markdown, no code fences):
{
  "ai_summary": "2-3 sentences: what this business does, its current digital presence quality, and the key opportunity",
  "identified_pain_points": [
    {"pain_point": "concise label", "evidence": "specific data point or observation from the provided data", "severity": "high|medium|low"}
  ],
  "recommended_services": ["Service A", "Service B"],
  "outreach_script_email": "Subject: [short subject line]\\n\\nHi [First Name],\\n\\n[personalized email body under 120 words. Reference specific data points. End with a clear low-friction CTA.]\\n\\n[Signature]",
  "outreach_script_linkedin": "Hi [First Name], [personalized LinkedIn message under 60 words. Reference one specific pain point. End with a question.]",
  "health_score": <integer 0-100 based on overall digital presence quality>,
  "is_qualified": <true if they have a website with measurable issues, false if no website or already excellent>,
  "disqualification_reason": <null if qualified, otherwise a short string explaining why>
}

Guidelines:
- health_score: base on PageSpeed scores (weighted 50%), social presence (20%), tech modernity (15%), ratings (15%)
- If no PageSpeed data, estimate based on available signals
- Recommended services: be specific (e.g., "Mobile-first website redesign", "Core Web Vitals optimization", "Local SEO setup") not generic
- Pain points: cite actual numbers (e.g., "Performance score of 23/100 on mobile")
- Scripts: use the decision maker name if available, otherwise use "[Owner's name]"
- Keep scripts conversational, not salesy`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Anthropic API error: ${response.status} — ${errorText}`)
    }

    const result = await response.json()
    let rawText: string = result.content?.[0]?.text || ''

    // Strip markdown fences if present
    rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()

    let intelligence: Record<string, unknown>
    try {
      intelligence = JSON.parse(rawText)
    } catch {
      console.error('Raw AI response:', rawText)
      throw new Error('Failed to parse AI response as JSON')
    }

    // Upsert into lead_intelligence (one record per lead)
    const { data: saved, error: upsertError } = await supabase
      .from('lead_intelligence')
      .upsert(
        {
          lead_id: leadId,
          ai_summary: intelligence.ai_summary || null,
          identified_pain_points: intelligence.identified_pain_points || [],
          recommended_services: intelligence.recommended_services || [],
          outreach_script_email: intelligence.outreach_script_email || null,
          outreach_script_linkedin: intelligence.outreach_script_linkedin || null,
          health_score: typeof intelligence.health_score === 'number' ? intelligence.health_score : null,
          is_qualified: intelligence.is_qualified !== false,
          disqualification_reason: intelligence.disqualification_reason || null,
          generated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'lead_id' }
      )
      .select()
      .single()

    if (upsertError) throw new Error(`Failed to save intelligence: ${upsertError.message}`)

    return new Response(JSON.stringify({ success: true, data: saved }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('generate-intelligence error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
