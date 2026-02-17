import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SerpApiPlace {
  title?: string
  address?: string
  phone?: string
  website?: string
  rating?: number
  reviews?: number
  type?: string
  thumbnail?: string
  gps_coordinates?: { latitude: number; longitude: number }
  [key: string]: unknown
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, businessType, location, limit = 20 } = await req.json()

    if (!query && (!businessType || !location)) {
      return new Response(
        JSON.stringify({ success: false, error: 'query or businessType+location required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('SERPAPI_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'SERPAPI_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const searchQuery = query || `${businessType} in ${location}`
    const params = new URLSearchParams({
      engine: 'google_maps',
      q: searchQuery,
      type: 'search',
      api_key: apiKey,
    })

    const response = await fetch(
      `https://serpapi.com/search.json?${params}`
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('SerpAPI error:', response.status, errorText)
      return new Response(
        JSON.stringify({ success: false, error: 'SerpAPI error: ' + response.status }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await response.json()

    const places: SerpApiPlace[] = result.local_results || []

    const leads = places
      .filter((p: SerpApiPlace) => p.title)
      .slice(0, limit)
      .map((p: SerpApiPlace) => ({
        business_name: p.title || 'Unknown',
        address: p.address || null,
        phone: p.phone || null,
        website_url: p.website || null,
        email: null,
        rating: p.rating || null,
        review_count: p.reviews || null,
        category: p.type || null,
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
