import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const matches = text.match(emailRegex) || []
  // Filter out common non-useful emails
  const blacklist = ['noreply@', 'no-reply@', 'mailer-daemon@', 'postmaster@', 'webmaster@']
  return [...new Set(matches)].filter(
    (e) => !blacklist.some((b) => e.toLowerCase().startsWith(b))
  )
}

function extractPhones(text: string): string[] {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g
  const matches = text.match(phoneRegex) || []
  return [...new Set(matches.map((p) => p.trim()).filter((p) => p.length >= 7))]
}

function extractSocialLinks(html: string): Record<string, string> {
  const social: Record<string, string> = {}
  const patterns: [string, RegExp][] = [
    ['facebook', /https?:\/\/(www\.)?facebook\.com\/[^\s"'<>]+/gi],
    ['instagram', /https?:\/\/(www\.)?instagram\.com\/[^\s"'<>]+/gi],
    ['twitter', /https?:\/\/(www\.)?(twitter|x)\.com\/[^\s"'<>]+/gi],
    ['linkedin', /https?:\/\/(www\.)?linkedin\.com\/[^\s"'<>]+/gi],
    ['yelp', /https?:\/\/(www\.)?yelp\.com\/[^\s"'<>]+/gi],
  ]
  for (const [name, regex] of patterns) {
    const match = html.match(regex)
    if (match) social[name] = match[0]
  }
  return social
}

function parseScrapedContent(
  markdown: string,
  html: string,
  metadata: Record<string, unknown>,
  businessName: string
) {
  const lines = markdown.split('\n').filter((l) => l.trim())

  // Extract headings
  const headings = lines
    .filter((l) => l.startsWith('#'))
    .map((l) => l.replace(/^#+\s*/, ''))
    .slice(0, 10)

  // Extract body text (non-heading, non-link lines)
  const bodyText = lines
    .filter((l) => !l.startsWith('#') && !l.startsWith('[') && !l.startsWith('!') && l.length > 30)
    .slice(0, 10)

  // Extract images from markdown
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  const images: string[] = []
  let imgMatch
  while ((imgMatch = imageRegex.exec(markdown)) !== null) {
    if (imgMatch[2] && !imgMatch[2].includes('data:')) {
      images.push(imgMatch[2])
    }
  }

  // Extract emails and phones from both markdown and html
  const allText = markdown + ' ' + html
  const emails = extractEmails(allText)
  const phones = extractPhones(allText)

  // Extract social links from HTML
  const socialLinks = extractSocialLinks(html)

  // Try to extract services (look for list items after service-related headings)
  const services: { name: string; description: string }[] = []
  let inServicesSection = false
  for (const line of lines) {
    if (/services|what we (do|offer)|our (work|offerings)/i.test(line)) {
      inServicesSection = true
      continue
    }
    if (inServicesSection) {
      if (line.startsWith('#')) break
      const cleaned = line.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').trim()
      if (cleaned.length > 2 && cleaned.length < 200) {
        const separatorMatch = cleaned.match(/^([^:\-]+)[:\-]\s*(.+)$/)
        if (separatorMatch) {
          services.push({ name: separatorMatch[1].trim(), description: separatorMatch[2].trim() })
        } else {
          services.push({ name: cleaned, description: '' })
        }
      }
      if (services.length >= 8) break
    }
  }

  // Try to extract testimonials
  const testimonials: { author: string; text: string; rating: number }[] = []
  let inTestimonialSection = false
  let currentTestimonial = ''
  for (const line of lines) {
    if (/testimonials?|reviews?|what (our )?(clients?|customers?) say/i.test(line)) {
      inTestimonialSection = true
      continue
    }
    if (inTestimonialSection) {
      if (line.startsWith('#') && testimonials.length > 0) break
      if (line.startsWith('>') || line.startsWith('"')) {
        currentTestimonial = line.replace(/^[>"]\s*/, '').replace(/"$/, '')
      } else if (currentTestimonial && line.startsWith('—') || line.startsWith('-')) {
        testimonials.push({
          author: line.replace(/^[—-]\s*/, '').trim(),
          text: currentTestimonial,
          rating: 5,
        })
        currentTestimonial = ''
      }
      if (testimonials.length >= 3) break
    }
  }

  // Extract color palette from HTML (inline styles, CSS)
  const colorRegex = /#[0-9a-fA-F]{6}/g
  const colorsFound = html.match(colorRegex) || []
  const colorCounts = colorsFound.reduce((acc: Record<string, number>, c: string) => {
    acc[c.toLowerCase()] = (acc[c.toLowerCase()] || 0) + 1
    return acc
  }, {})
  const colorPalette = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([c]) => c)

  // Infer category from content
  const allContentLower = allText.toLowerCase()
  const categories: [string, string[]][] = [
    ['restaurant', ['restaurant', 'menu', 'dining', 'cuisine', 'chef', 'reservation']],
    ['salon', ['salon', 'barber', 'haircut', 'styling', 'beauty']],
    ['dental', ['dental', 'dentist', 'teeth', 'orthodont', 'smile']],
    ['fitness', ['gym', 'fitness', 'workout', 'training', 'exercise']],
    ['legal', ['attorney', 'lawyer', 'legal', 'law firm', 'litigation']],
    ['medical', ['doctor', 'medical', 'clinic', 'health', 'patient']],
    ['retail', ['shop', 'store', 'buy', 'product', 'shopping']],
    ['technology', ['software', 'tech', 'digital', 'app', 'developer']],
  ]
  let businessCategory = 'business'
  let maxScore = 0
  for (const [cat, keywords] of categories) {
    const score = keywords.filter((k) => allContentLower.includes(k)).length
    if (score > maxScore) {
      maxScore = score
      businessCategory = cat
    }
  }

  return {
    title: (metadata.title as string) || headings[0] || businessName,
    description: (metadata.description as string) || bodyText[0] || '',
    heroText: headings[0] || businessName,
    headings,
    bodyText,
    images: images.slice(0, 6),
    testimonials,
    contact: {
      phone: phones[0] || '',
      email: emails[0] || '',
      address: '',
    },
    socialLinks,
    colors: colorPalette.length >= 3 ? colorPalette : ['#2563eb', '#1e40af', '#3b82f6'],
    category: businessCategory,
    services,
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, businessName } = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'url is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'FIRECRAWL_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
        onlyMainContent: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Firecrawl API error:', response.status, errorText)
      return new Response(
        JSON.stringify({ success: false, error: `Firecrawl API error: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await response.json()

    if (!result.success || !result.data) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl returned no data' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { markdown = '', html = '', metadata = {} } = result.data
    const scrapedData = parseScrapedContent(markdown, html, metadata, businessName || 'Business')

    return new Response(
      JSON.stringify({ success: true, data: scrapedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('scrape-website error:', err)
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
