import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // 1. Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    })

    // 2. Fetch Lead Data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      throw new Error(`Lead not found: ${leadError?.message}`)
    }

    if (!lead.website_url) {
      return new Response(JSON.stringify({
        error: 'Lead does not have a website URL to enrich.',
        status: 'failed'
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Update status to enriching
    await supabase.from('leads').update({ enrichment_status: 'enriching' }).eq('id', leadId)

    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY')
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')

    if (!APIFY_API_KEY) throw new Error('APIFY_API_KEY not configured')
    const targetUrl = lead.website_url
    const companyName = lead.business_name

    // 3. Setup Parallel Promises

    // 3.1: Wappalyzer (Tech Stack) via Apify
    const wappalyzerPromise = fetch(`https://api.apify.com/v2/acts/pocesar~wappalyzer-scraper/run-sync-get-dataset-items?token=${APIFY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startUrls: [{ url: targetUrl }] })
    }).then(res => res.json()).catch(err => {
      console.error('Wappalyzer failed:', err)
      return null
    })

    // 3.2: LinkedIn Company Search via Apify
    const linkedInPromise = fetch(`https://api.apify.com/v2/acts/rockstar_scrapers~linkedin-company-and-employee-scraper/run-sync-get-dataset-items?token=${APIFY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companies: [companyName],
        scrapeEmployees: true,
        maxEmployees: 10
      })
    }).then(res => res.json()).catch(err => {
      console.error('LinkedIn scrape failed:', err)
      return null
    })

    // 3.3 Google PageSpeed
    const pageSpeedMobilePromise = fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&category=performance&category=seo&category=accessibility&category=best-practices&strategy=mobile&key=${GOOGLE_API_KEY}`
    ).then(res => res.json()).catch(err => {
      console.error('PageSpeed failed:', err)
      return null
    })

    // 3.4: Instagram via Apify (search for business name)
    const instagramPromise = fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${APIFY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernames: [companyName.toLowerCase().replace(/[^a-z0-9]/g, '')],
        resultsLimit: 1
      })
    }).then(res => res.json()).catch(err => {
      console.error('Instagram scrape failed:', err)
      return null
    })

    // 4. Await All Promises
    const [wappalyzerData, linkedInRawData, pageSpeedData, instagramRawData] = await Promise.all([
      wappalyzerPromise,
      linkedInPromise,
      pageSpeedMobilePromise,
      instagramPromise
    ])

    // --- Data Processing ---

    // Tech Stack Processing
    let techStack: string[] = []
    if (Array.isArray(wappalyzerData) && wappalyzerData.length > 0 && wappalyzerData[0].technologies) {
      techStack = wappalyzerData[0].technologies.map((t: any) => t.name)
    }

    // LinkedIn Processing
    let decisionMakersToInsert: any[] = []
    let linkedinCompanyData = {}

    if (Array.isArray(linkedInRawData) && linkedInRawData.length > 0) {
      const companyEntry = linkedInRawData.find(item => item.type === 'company' || item.companyUrl)
      if (companyEntry) {
        linkedinCompanyData = {
          url: companyEntry.companyUrl || companyEntry.url,
          followerCount: companyEntry.followerCount,
          employeeCount: companyEntry.employeeCount
        }
      }

      // Filter employees matching C-level/Director roles (including Brazilian titles)
      const employees = linkedInRawData.filter(item => item.type === 'employee' || item.profileUrl)

      employees.forEach(emp => {
        const role = (emp.title || emp.headline || '').toLowerCase()
        if (role.match(/owner|founder|ceo|cmo|diretor|director|manager|gerente|sócio|proprietário/)) {
          decisionMakersToInsert.push({
            lead_id: leadId,
            name: emp.fullName || emp.name,
            role: emp.title || emp.headline,
            linkedin_url: emp.profileUrl || emp.url
          })
        }
      })
    }

    // Insert Decision Makers if any
    if (decisionMakersToInsert.length > 0) {
      await supabase.from('decision_makers').insert(decisionMakersToInsert)
    }

    // PageSpeed Processing
    let psFormatted = {}
    if (pageSpeedData && pageSpeedData.lighthouseResult) {
      const cats = pageSpeedData.lighthouseResult.categories
      psFormatted = {
        performance: Math.round((cats.performance?.score ?? 0) * 100),
        seo: Math.round((cats.seo?.score ?? 0) * 100),
        accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100)
      }
    }

    // Instagram Processing
    let igData = {}
    if (Array.isArray(instagramRawData) && instagramRawData.length > 0) {
      const ig = instagramRawData[0]
      igData = {
        username: ig.username || null,
        fullName: ig.fullName || null,
        biography: ig.biography || null,
        followersCount: ig.followersCount || 0,
        followingCount: ig.followsCount || 0,
        postsCount: ig.postsCount || 0,
        profilePicUrl: ig.profilePicUrl || null,
        isVerified: ig.verified || false,
        externalUrl: ig.externalUrl || null
      }
    }

    // Extract WhatsApp from phone
    let whatsappNumber = null
    if (lead.phone) {
      // Clean the phone and format as WhatsApp link-ready
      const cleaned = lead.phone.replace(/[^0-9+]/g, '')
      if (cleaned.length >= 10) {
        whatsappNumber = cleaned.startsWith('+') ? cleaned : `+55${cleaned}`
      }
    }

    // 5. Update Lead Record with Enrichment findings
    const updatePayload = {
      enrichment_status: 'completed',
      tech_stack: techStack,
      linkedin_data: linkedinCompanyData,
      pagespeed_data: psFormatted,
      instagram_data: igData,
      enrichment_data: {
        whatsapp: whatsappNumber,
        enriched_at: new Date().toISOString()
      },
      enrichment_last_run_at: new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('leads')
      .update(updatePayload)
      .eq('id', leadId)

    if (updateError) throw new Error(`Update failed: ${updateError.message}`)

    return new Response(JSON.stringify({
      success: true,
      message: 'Lead enriched successfully',
      data: updatePayload
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Enrichment failed:', error)

    // Attempt to mark as failed
    try {
      const reqJson = await req.clone().json()
      if (reqJson.leadId) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
        const authHeader = req.headers.get('Authorization') || ''
        const supabase = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: authHeader } }
        })
        await supabase.from('leads').update({ enrichment_status: 'failed' }).eq('id', reqJson.leadId)
      }
    } catch (e) { } // ignore rollback error

    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown exception'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
