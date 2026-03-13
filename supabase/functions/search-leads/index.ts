import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Configure GOOGLE_API_KEY in Supabase Dashboard → Settings → Edge Functions → Secrets
const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')

interface PlaceResult {
  displayName?: { text: string }
  formattedAddress?: string
  nationalPhoneNumber?: string
  websiteUri?: string
  rating?: number
  userRatingCount?: number
  primaryTypeDisplayName?: { text: string }
  googleMapsUri?: string
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

    if (!GOOGLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'GOOGLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const searchQuery = query || `${businessType} ${location}`
    const maxResults = Math.min(limit, 20) // Places API max is 20

    console.log('Calling Google Places API with query:', searchQuery)

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.primaryTypeDisplayName,places.googleMapsUri',
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        maxResultCount: maxResults,
        languageCode: 'pt-BR',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Places error:', response.status, errorText)
      return new Response(
        JSON.stringify({ success: false, error: `Google Places API error: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await response.json()
    const places: PlaceResult[] = result.places || []

    const leads = places
      .filter((p) => p.displayName?.text)
      .map((p) => ({
        business_name: p.displayName!.text,
        address: p.formattedAddress || null,
        phone: p.nationalPhoneNumber || null,
        website_url: p.websiteUri || null,
        email: null, // Places API doesn't return emails
        rating: p.rating || null,
        review_count: p.userRatingCount || null,
        category: p.primaryTypeDisplayName?.text || null,
        google_maps_data: {
          googleMapsUri: p.googleMapsUri,
          source: 'google_places_api',
        },
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
