import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const TEMPLATE_STYLES: Record<string, string> = {
  'modern-professional':
    'Clean, corporate design with structured card-based layouts, professional navy/white color scheme, clear typography hierarchy, and organized service sections. Think enterprise SaaS or law firm.',
  'bold-creative':
    'Vibrant, attention-grabbing design with bold oversized typography, diagonal section dividers, gradient backgrounds, and energetic layout. Think creative agency or fitness brand.',
  'minimal-elegant':
    'Whitespace-heavy luxury aesthetic with serif headings (Playfair Display), thin borders, muted tones, and refined simplicity. Think high-end restaurant or boutique hotel.',
  'local-business':
    'Warm, approachable design with rounded corners, friendly Nunito font, earth tones, prominent reviews/ratings, and clear call-to-action buttons. Think neighborhood barbershop or bakery.',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { scrapedData, templateId, colors, creatorProfile } = await req.json()

    if (!scrapedData || !templateId || !colors) {
      return new Response(
        JSON.stringify({ success: false, error: 'scrapedData, templateId, and colors are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const styleDescription = TEMPLATE_STYLES[templateId] || TEMPLATE_STYLES['modern-professional']
    const creatorName = creatorProfile?.agency_name || creatorProfile?.full_name || 'Pitch AI'

    const prompt = `You are an expert web designer. Create a complete, production-ready single-page website HTML file.

DESIGN STYLE: ${styleDescription}

BUSINESS INFORMATION:
- Name: ${scrapedData.title || 'Business'}
- Category: ${scrapedData.category || 'General'}
- Description: ${scrapedData.description || ''}
- Hero Text: ${scrapedData.heroText || scrapedData.title || ''}
- Services: ${(scrapedData.services || []).map((s: {name: string}) => s.name).join(', ') || 'Not specified'}
- Phone: ${scrapedData.contact?.phone || ''}
- Email: ${scrapedData.contact?.email || ''}
- Address: ${scrapedData.contact?.address || ''}

TESTIMONIALS:
${(scrapedData.testimonials || []).map((t: { author: string; text: string; rating: number }) => `- "${t.text}" - ${t.author} (${t.rating}/5 stars)`).join('\n') || 'No testimonials available'}

SOCIAL LINKS:
${Object.entries(scrapedData.socialLinks || {}).map(([k, v]) => `- ${k}: ${v}`).join('\n') || 'None'}

COLOR SCHEME:
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}
- Accent: ${colors.accent}

IMAGES (use these exact URLs):
${(scrapedData.images || []).slice(0, 4).map((img: string, i: number) => `- Image ${i + 1}: ${img}`).join('\n') || 'Use solid color backgrounds instead of images'}

STRICT REQUIREMENTS:
1. Output a SINGLE complete HTML file with ALL CSS inlined in a <style> tag (no external stylesheets)
2. Must be fully responsive (mobile-first with media queries for tablet and desktop)
3. Use Google Fonts via <link> tag in the <head> (choose fonts that match the design style)
4. Include these sections in order: Navigation, Hero, About/Description, Services, Testimonials (if available), Contact, Footer
5. Add smooth scroll behavior and subtle CSS transitions/hover effects
6. Footer must include: "Redesigned by ${creatorName}" with a small credit line
7. Include a simple feedback section before the footer with: a 1-5 star rating selector, optional message textarea, and submit button (the form can be non-functional, just styled)
8. Use semantic HTML5 elements (header, nav, main, section, footer)
9. Ensure good contrast ratios for accessibility
10. Do NOT include any JavaScript except for minimal scroll behavior
11. Do NOT use any placeholder text like "Lorem ipsum" — use only the real business data provided above
12. If some data is missing, gracefully omit that section rather than showing empty content

OUTPUT: Return ONLY the complete HTML code. No explanations, no markdown, no code fences.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 16000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', response.status, errorText)
      return new Response(
        JSON.stringify({ success: false, error: `Anthropic API error: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await response.json()
    let html = result.content?.[0]?.text || ''

    // Strip markdown code fences if present
    if (html.startsWith('```html')) {
      html = html.slice(7)
    } else if (html.startsWith('```')) {
      html = html.slice(3)
    }
    if (html.endsWith('```')) {
      html = html.slice(0, -3)
    }
    html = html.trim()

    // Basic validation
    if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Generated content is not valid HTML' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, html }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('generate-pitch error:', err)
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
