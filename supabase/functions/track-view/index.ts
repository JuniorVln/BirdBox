import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 1x1 transparent PNG
const PIXEL = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x62, 0x00, 0x00, 0x00, 0x02,
  0x00, 0x01, 0xe5, 0x27, 0xde, 0xfc, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
  0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
])

serve(async (req) => {
  const url = new URL(req.url)
  const pitchId = url.searchParams.get('pid')

  if (!pitchId) {
    return new Response(PIXEL, {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('cf-connecting-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || ''

    // Fetch geolocation (best-effort, non-blocking for response)
    let location = null
    try {
      if (ip && ip !== 'unknown' && ip !== '127.0.0.1') {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=city,country,lat,lon`)
        if (geoRes.ok) {
          const geo = await geoRes.json()
          if (geo.city) {
            location = { city: geo.city, country: geo.country, lat: geo.lat, lng: geo.lon }
          }
        }
      }
    } catch {
      // Geolocation is best-effort
    }

    // Insert view record
    await supabase.from('pitch_views').insert({
      pitch_id: pitchId,
      ip_address: ip,
      user_agent: userAgent,
      location,
    })

    // Auto-update pitch status: sent → opened
    const { data: pitch } = await supabase
      .from('pitches')
      .select('status')
      .eq('id', pitchId)
      .single()

    if (pitch?.status === 'sent') {
      await supabase
        .from('pitches')
        .update({ status: 'opened' })
        .eq('id', pitchId)
    }
  } catch (err) {
    console.error('track-view error:', err)
  }

  // Always return the pixel regardless of errors
  return new Response(PIXEL, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
})
