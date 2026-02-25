import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ApifyPlace {
  title?: string
  address?: string
  phoneUnformatted?: string
  phone?: string
  website?: string
  totalScore?: number
  reviewsCount?: number
  categoryName?: string
  emails?: string[]
  socialNetworkUrls?: {
    linkedin?: string
    twitter?: string
    instagram?: string
    facebook?: string
  }
  location?: { lat: number; lng: number }
  [key: string]: unknown
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, businessType, location, limit = 10 } = await req.json()

    if (!query && (!businessType || !location)) {
      return new Response(
        JSON.stringify({ success: false, error: 'query or businessType+location required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'APIFY_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const searchQuery = query || `${businessType} in ${location}`
    
    // Apify run-sync-get-dataset-items endpoint for compass/google-maps-extractor
    const apifyUrl = `https://api.apify.com/v2/acts/compass~google-maps-extractor/run-sync-get-dataset-items?token=${apiKey}`
    
    const apifyPayload = {
      searchStringsArray: [searchQuery],
      maxCrawledPlacesPerSearch: limit,
      extractEmailsAndContacts: true,
      maxImages: 1,
      maxReviews: 0,
      language: "en"
    }

    console.log('Calling Apify with payload:', apifyPayload)

    const response = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apifyPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Apify error:', response.status, errorText)
      return new Response(
        JSON.stringify({ success: false, error: 'Apify error: ' + response.status }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await response.json()
    const places: ApifyPlace[] = Array.isArray(result) ? result : []

    const leads = places
      .filter((p: ApifyPlace) => p.title)
      .map((p: ApifyPlace) => ({
        business_name: p.title || 'Unknown',
        address: p.address || null,
        phone: p.phoneUnformatted || p.phone || null,
        website_url: p.website || null,
        email: p.emails && p.emails.length > 0 ? p.emails[0] : null,
        rating: p.totalScore || null,
        review_count: p.reviewsCount || null,
        category: p.categoryName || null,
        google_maps_data: p,
      }))

    return new Response(
      JSON.stringify({ success: true, leads, total: leads.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('search-leads error:', err)
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
