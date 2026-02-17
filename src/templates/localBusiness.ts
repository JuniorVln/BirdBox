import type { ScrapedData, PitchColors, Profile } from '@/types'

function generateStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  let stars = ''
  for (let i = 0; i < full; i++) {
    stars += '<span class="star full">&#9733;</span>'
  }
  if (half) {
    stars += '<span class="star half">&#9733;</span>'
  }
  for (let i = 0; i < empty; i++) {
    stars += '<span class="star empty">&#9734;</span>'
  }
  return stars
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function generateLocalBusiness(data: ScrapedData, colors: PitchColors, creator: Profile): string {
  const creatorName = escapeHtml(creator.agency_name || creator.full_name || 'Pitch AI')
  const businessName = escapeHtml(data.title)
  const description = escapeHtml(data.description)
  const heroText = escapeHtml(data.heroText)
  const category = escapeHtml(data.category)

  const heroImage = data.images?.[0] || ''
  const aboutImage = data.images?.[1] || ''

  const servicesHtml = data.services
    .map(
      (service, i) => `
      <div class="service-card" style="animation-delay: ${i * 0.1}s">
        ${data.images[i + 2] ? `<div class="service-image"><img src="${escapeHtml(data.images[i + 2])}" alt="${escapeHtml(service.name)}" loading="lazy" /></div>` : `<div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="${colors.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="40" height="40"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></div>`}
        <h3>${escapeHtml(service.name)}</h3>
        <p>${escapeHtml(service.description)}</p>
      </div>`
    )
    .join('')

  const testimonialsHtml = data.testimonials
    .map(
      (t, i) => `
      <div class="testimonial-card" style="animation-delay: ${i * 0.12}s">
        <div class="testimonial-stars">${generateStars(t.rating ?? 5)}</div>
        <blockquote>&ldquo;${escapeHtml(t.text)}&rdquo;</blockquote>
        <div class="testimonial-author">
          <div class="author-avatar">${escapeHtml(t.author.charAt(0).toUpperCase())}</div>
          <span>${escapeHtml(t.author)}</span>
        </div>
      </div>`
    )
    .join('')

  const aboutParagraphs = data.bodyText
    .slice(0, 3)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('')

  const socialLinksHtml = Object.entries(data.socialLinks)
    .map(([platform, url]) => {
      const label = escapeHtml(platform.charAt(0).toUpperCase() + platform.slice(1))
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${label}">${label}</a>`
    })
    .join('')

  const phone = data.contact.phone ? escapeHtml(data.contact.phone) : ''
  const email = data.contact.email ? escapeHtml(data.contact.email) : ''
  const address = data.contact.address ? escapeHtml(data.contact.address) : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${description}" />
  <title>${businessName} — ${category}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    *,
    *::before,
    *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary: ${colors.primary};
      --secondary: ${colors.secondary};
      --accent: ${colors.accent};
      --warm-bg: #FFF9F5;
      --warm-card: #FFFFFF;
      --warm-text: #3D2C1E;
      --warm-muted: #7A6558;
      --warm-border: #F0E6DD;
      --warm-highlight: #FFF0E6;
      --radius: 14px;
      --radius-lg: 20px;
      --shadow-sm: 0 2px 8px rgba(61,44,30,0.06);
      --shadow-md: 0 4px 20px rgba(61,44,30,0.08);
      --shadow-lg: 0 8px 40px rgba(61,44,30,0.12);
      --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: var(--warm-text);
      background: var(--warm-bg);
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    a {
      color: var(--primary);
      text-decoration: none;
      transition: color var(--transition);
    }

    a:hover {
      color: var(--accent);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* ===================== NAV ===================== */
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(255,249,245,0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--warm-border);
      padding: 0 24px;
      transition: box-shadow var(--transition);
    }

    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 68px;
    }

    .nav-brand {
      font-weight: 800;
      font-size: 1.3rem;
      color: var(--primary);
      letter-spacing: -0.02em;
    }

    .nav-links {
      display: flex;
      gap: 32px;
      list-style: none;
    }

    .nav-links a {
      color: var(--warm-muted);
      font-weight: 600;
      font-size: 0.92rem;
      letter-spacing: 0.01em;
      position: relative;
      transition: color var(--transition);
    }

    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--accent);
      border-radius: 2px;
      transition: width var(--transition);
    }

    .nav-links a:hover {
      color: var(--primary);
    }

    .nav-links a:hover::after {
      width: 100%;
    }

    .nav-cta {
      background: var(--primary);
      color: #fff !important;
      padding: 10px 24px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.9rem;
      transition: transform var(--transition), box-shadow var(--transition);
    }

    .nav-cta:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      color: #fff !important;
    }

    .nav-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
    }

    .nav-toggle span {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--warm-text);
      margin: 5px 0;
      border-radius: 2px;
      transition: var(--transition);
    }

    /* ===================== HERO ===================== */
    .hero {
      margin-top: 68px;
      padding: 100px 24px 80px;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, var(--warm-highlight) 0%, var(--warm-bg) 50%, #fff 100%);
    }

    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, ${colors.primary}10 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--warm-card);
      border: 1px solid var(--warm-border);
      padding: 8px 18px;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
    }

    .hero-badge::before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
    }

    .hero h1 {
      font-size: 3.2rem;
      font-weight: 800;
      line-height: 1.15;
      color: var(--warm-text);
      margin-bottom: 20px;
      letter-spacing: -0.03em;
    }

    .hero h1 span {
      color: var(--primary);
    }

    .hero-description {
      font-size: 1.15rem;
      color: var(--warm-muted);
      max-width: 520px;
      margin-bottom: 36px;
      line-height: 1.8;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 32px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 1rem;
      font-family: inherit;
      cursor: pointer;
      transition: transform var(--transition), box-shadow var(--transition);
      border: none;
      text-align: center;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .btn-primary {
      background: var(--primary);
      color: #fff;
      box-shadow: 0 4px 20px ${colors.primary}40;
    }

    .btn-primary:hover {
      box-shadow: 0 6px 28px ${colors.primary}55;
      color: #fff;
    }

    .btn-outline {
      background: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);
    }

    .btn-outline:hover {
      background: var(--primary);
      color: #fff;
    }

    .hero-trust {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 32px;
      font-size: 0.88rem;
      color: var(--warm-muted);
    }

    .hero-trust-stars {
      color: #F5A623;
      font-size: 1.1rem;
      letter-spacing: 2px;
    }

    .hero-image {
      position: relative;
      z-index: 1;
    }

    .hero-image img {
      width: 100%;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      object-fit: cover;
      aspect-ratio: 4/3;
    }

    .hero-image::after {
      content: '';
      position: absolute;
      inset: 12px;
      border: 2px solid ${colors.primary}25;
      border-radius: calc(var(--radius-lg) + 4px);
      pointer-events: none;
    }

    /* ===================== SECTION BASE ===================== */
    section {
      padding: 90px 24px;
    }

    .section-header {
      text-align: center;
      max-width: 640px;
      margin: 0 auto 56px;
    }

    .section-label {
      display: inline-block;
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--accent);
      margin-bottom: 12px;
    }

    .section-header h2 {
      font-size: 2.4rem;
      font-weight: 800;
      line-height: 1.2;
      color: var(--warm-text);
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }

    .section-header p {
      font-size: 1.08rem;
      color: var(--warm-muted);
      line-height: 1.7;
    }

    /* ===================== ABOUT ===================== */
    .about {
      background: var(--warm-card);
    }

    .about-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }

    .about-image img {
      width: 100%;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      object-fit: cover;
      aspect-ratio: 4/3;
    }

    .about-content h2 {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 20px;
      color: var(--warm-text);
      letter-spacing: -0.02em;
    }

    .about-content p {
      color: var(--warm-muted);
      margin-bottom: 16px;
      font-size: 1.05rem;
      line-height: 1.8;
    }

    .about-highlights {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 28px;
    }

    .highlight-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--warm-text);
    }

    .highlight-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--warm-highlight);
      color: var(--primary);
      flex-shrink: 0;
    }

    /* ===================== SERVICES ===================== */
    .services {
      background: var(--warm-bg);
    }

    .services-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }

    .service-card {
      background: var(--warm-card);
      border-radius: var(--radius);
      padding: 32px 28px;
      border: 1px solid var(--warm-border);
      transition: transform var(--transition), box-shadow var(--transition);
      position: relative;
      overflow: hidden;
    }

    .service-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      opacity: 0;
      transition: opacity var(--transition);
    }

    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .service-card:hover::before {
      opacity: 1;
    }

    .service-image {
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 20px;
    }

    .service-image img {
      width: 100%;
      aspect-ratio: 16/10;
      object-fit: cover;
    }

    .service-icon {
      width: 60px;
      height: 60px;
      border-radius: 14px;
      background: var(--warm-highlight);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .service-card h3 {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--warm-text);
    }

    .service-card p {
      color: var(--warm-muted);
      font-size: 0.95rem;
      line-height: 1.7;
    }

    /* ===================== TESTIMONIALS ===================== */
    .testimonials {
      background: var(--warm-card);
    }

    .testimonials-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }

    .testimonial-card {
      background: var(--warm-bg);
      border-radius: var(--radius);
      padding: 32px 28px;
      border: 1px solid var(--warm-border);
      transition: transform var(--transition), box-shadow var(--transition);
    }

    .testimonial-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
    }

    .testimonial-stars {
      margin-bottom: 16px;
      font-size: 1.2rem;
      letter-spacing: 2px;
    }

    .star.full {
      color: #F5A623;
    }

    .star.half {
      color: #F5A623;
      opacity: 0.6;
    }

    .star.empty {
      color: #DDD0C5;
    }

    .testimonial-card blockquote {
      color: var(--warm-text);
      font-size: 1rem;
      line-height: 1.75;
      margin-bottom: 20px;
      font-style: italic;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .author-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.05rem;
    }

    .testimonial-author span {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--warm-text);
    }

    /* ===================== CONTACT ===================== */
    .contact {
      background: var(--warm-bg);
    }

    .contact-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
      background: var(--warm-card);
      border-radius: var(--radius);
      border: 1px solid var(--warm-border);
    }

    .contact-item-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--warm-highlight);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .contact-item-icon svg {
      width: 22px;
      height: 22px;
      stroke: var(--primary);
    }

    .contact-item-content h4 {
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--warm-muted);
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .contact-item-content p {
      font-weight: 600;
      font-size: 1.05rem;
      color: var(--warm-text);
    }

    .contact-item-content a {
      font-weight: 600;
      font-size: 1.05rem;
      color: var(--primary);
    }

    .map-placeholder {
      width: 100%;
      aspect-ratio: 16/10;
      border-radius: var(--radius);
      background: var(--warm-highlight);
      border: 2px dashed var(--warm-border);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: var(--warm-muted);
      font-weight: 600;
    }

    .map-placeholder svg {
      width: 48px;
      height: 48px;
      stroke: var(--primary);
      opacity: 0.5;
    }

    /* ===================== FEEDBACK FORM ===================== */
    .feedback {
      background: var(--warm-card);
    }

    .feedback-form {
      max-width: 640px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-weight: 700;
      font-size: 0.92rem;
      color: var(--warm-text);
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 14px 18px;
      border-radius: 12px;
      border: 1.5px solid var(--warm-border);
      background: var(--warm-bg);
      font-family: inherit;
      font-size: 1rem;
      color: var(--warm-text);
      transition: border-color var(--transition), box-shadow var(--transition);
      outline: none;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px ${colors.primary}20;
    }

    .form-group textarea {
      min-height: 130px;
      resize: vertical;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-submit {
      margin-top: 8px;
    }

    /* ===================== FOOTER ===================== */
    .footer {
      background: var(--warm-text);
      color: rgba(255,255,255,0.7);
      padding: 60px 24px 32px;
    }

    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 48px;
    }

    .footer-brand {
      font-size: 1.3rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 12px;
    }

    .footer-description {
      font-size: 0.92rem;
      line-height: 1.7;
      max-width: 300px;
    }

    .footer h4 {
      color: #fff;
      font-size: 0.92rem;
      font-weight: 700;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-links a {
      color: rgba(255,255,255,0.6);
      font-size: 0.92rem;
      transition: color var(--transition);
    }

    .footer-links a:hover {
      color: #fff;
    }

    .footer-social {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }

    .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border-radius: 8px;
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.7) !important;
      font-size: 0.82rem;
      font-weight: 600;
      transition: background var(--transition), color var(--transition);
    }

    .social-link:hover {
      background: rgba(255,255,255,0.15);
      color: #fff !important;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 0.85rem;
    }

    .footer-attribution {
      color: rgba(255,255,255,0.45);
      font-size: 0.82rem;
    }

    /* ===================== ANIMATIONS ===================== */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .service-card,
    .testimonial-card {
      animation: fadeInUp 0.6s ease both;
    }

    /* ===================== RESPONSIVE ===================== */
    @media (max-width: 1024px) {
      .hero h1 {
        font-size: 2.6rem;
      }

      .services-grid,
      .testimonials-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 32px;
      }
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
        position: absolute;
        top: 68px;
        left: 0;
        right: 0;
        background: var(--warm-card);
        flex-direction: column;
        padding: 24px;
        gap: 16px;
        border-bottom: 1px solid var(--warm-border);
        box-shadow: var(--shadow-md);
      }

      .nav-links.open {
        display: flex;
      }

      .nav-toggle {
        display: block;
      }

      .hero {
        padding: 80px 24px 60px;
      }

      .hero-inner {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }

      .hero h1 {
        font-size: 2.2rem;
      }

      .hero-description {
        margin-left: auto;
        margin-right: auto;
      }

      .hero-actions {
        justify-content: center;
      }

      .hero-trust {
        justify-content: center;
      }

      .hero-image {
        order: -1;
        max-width: 480px;
        margin: 0 auto;
      }

      .about-grid,
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .section-header h2,
      .about-content h2 {
        font-size: 1.9rem;
      }

      .services-grid,
      .testimonials-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .footer-grid {
        grid-template-columns: 1fr;
        gap: 28px;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .hero {
        padding: 60px 16px 48px;
      }

      .hero h1 {
        font-size: 1.8rem;
      }

      section {
        padding: 60px 16px;
      }

      .btn {
        padding: 12px 24px;
        font-size: 0.92rem;
        width: 100%;
        justify-content: center;
      }

      .about-highlights {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav class="nav">
    <div class="nav-inner">
      <a href="#" class="nav-brand">${businessName}</a>
      <ul class="nav-links" id="navLinks">
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#testimonials">Reviews</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#contact" class="nav-cta">Get in Touch</a></li>
      </ul>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero" id="hero">
    <div class="hero-inner">
      <div class="hero-content">
        <div class="hero-badge">${category}</div>
        <h1>${heroText || `Welcome to <span>${businessName}</span>`}</h1>
        <p class="hero-description">${description}</p>
        <div class="hero-actions">
          ${phone ? `<a href="tel:${phone}" class="btn btn-primary">&#9742; Call Now</a>` : '<a href="#contact" class="btn btn-primary">Get in Touch</a>'}
          <a href="#services" class="btn btn-outline">Our Services</a>
        </div>
        <div class="hero-trust">
          <span class="hero-trust-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span>Trusted by our community</span>
        </div>
      </div>
      ${heroImage ? `<div class="hero-image"><img src="${escapeHtml(heroImage)}" alt="${businessName}" /></div>` : ''}
    </div>
  </section>

  <!-- About -->
  <section class="about" id="about">
    <div class="about-grid">
      ${aboutImage ? `<div class="about-image"><img src="${escapeHtml(aboutImage)}" alt="About ${businessName}" loading="lazy" /></div>` : ''}
      <div class="about-content">
        <span class="section-label">About Us</span>
        <h2>${data.headings[0] ? escapeHtml(data.headings[0]) : `About ${businessName}`}</h2>
        ${aboutParagraphs || `<p>${description}</p>`}
        <div class="about-highlights">
          <div class="highlight-item">
            <div class="highlight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <span>Locally Owned</span>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span>Community Focused</span>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            </div>
            <span>5-Star Rated</span>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span>Reliable Service</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="services" id="services">
    <div class="section-header">
      <span class="section-label">What We Offer</span>
      <h2>Our Services</h2>
      <p>${data.headings[1] ? escapeHtml(data.headings[1]) : `Explore the range of services ${businessName} provides to our valued customers.`}</p>
    </div>
    <div class="services-grid">
      ${servicesHtml}
    </div>
  </section>

  <!-- Testimonials -->
  ${data.testimonials.length > 0 ? `
  <section class="testimonials" id="testimonials">
    <div class="section-header">
      <span class="section-label">What People Say</span>
      <h2>Customer Reviews</h2>
      <p>Hear from the people who trust ${businessName} for their needs.</p>
    </div>
    <div class="testimonials-grid">
      ${testimonialsHtml}
    </div>
  </section>
  ` : ''}

  <!-- Contact -->
  <section class="contact" id="contact">
    <div class="section-header">
      <span class="section-label">Get in Touch</span>
      <h2>Contact Us</h2>
      <p>We would love to hear from you. Reach out today and let us know how we can help.</p>
    </div>
    <div class="contact-grid">
      <div class="contact-info">
        ${phone ? `
        <div class="contact-item">
          <div class="contact-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div class="contact-item-content">
            <h4>Phone</h4>
            <a href="tel:${phone}">${phone}</a>
          </div>
        </div>` : ''}
        ${email ? `
        <div class="contact-item">
          <div class="contact-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div class="contact-item-content">
            <h4>Email</h4>
            <a href="mailto:${email}">${email}</a>
          </div>
        </div>` : ''}
        ${address ? `
        <div class="contact-item">
          <div class="contact-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="contact-item-content">
            <h4>Address</h4>
            <p>${address}</p>
          </div>
        </div>` : ''}
      </div>
      <div class="map-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Map Loading...</span>
        <span style="font-size:0.82rem;opacity:0.7">${address || 'Location'}</span>
      </div>
    </div>
  </section>

  <!-- Feedback Form -->
  <section class="feedback" id="feedback">
    <div class="section-header">
      <span class="section-label">Your Opinion Matters</span>
      <h2>Share Your Feedback</h2>
      <p>Let us know what you think about this redesign. Your input helps us improve.</p>
    </div>
    <form class="feedback-form" action="#" method="POST">
      <div class="form-row">
        <div class="form-group">
          <label for="feedback-name">Your Name</label>
          <input type="text" id="feedback-name" name="name" placeholder="John Doe" required />
        </div>
        <div class="form-group">
          <label for="feedback-email">Email Address</label>
          <input type="email" id="feedback-email" name="email" placeholder="john@example.com" required />
        </div>
      </div>
      <div class="form-group">
        <label for="feedback-rating">Rating</label>
        <select id="feedback-rating" name="rating" required>
          <option value="">Select a rating</option>
          <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733; Excellent</option>
          <option value="4">&#9733;&#9733;&#9733;&#9733; Great</option>
          <option value="3">&#9733;&#9733;&#9733; Good</option>
          <option value="2">&#9733;&#9733; Fair</option>
          <option value="1">&#9733; Needs Work</option>
        </select>
      </div>
      <div class="form-group">
        <label for="feedback-message">Your Feedback</label>
        <textarea id="feedback-message" name="message" placeholder="Tell us what you think about this website design..." required></textarea>
      </div>
      <div class="form-submit">
        <button type="submit" class="btn btn-primary" style="width:100%">Submit Feedback</button>
      </div>
    </form>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">${businessName}</div>
          <p class="footer-description">${description.length > 160 ? description.substring(0, 160) + '...' : description}</p>
          ${Object.keys(data.socialLinks).length > 0 ? `<div class="footer-social">${socialLinksHtml}</div>` : ''}
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#testimonials">Reviews</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul class="footer-links">
            ${data.services.slice(0, 5).map((s) => `<li><a href="#services">${escapeHtml(s.name)}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul class="footer-links">
            ${phone ? `<li><a href="tel:${phone}">${phone}</a></li>` : ''}
            ${email ? `<li><a href="mailto:${email}">${email}</a></li>` : ''}
            ${address ? `<li>${address}</li>` : ''}
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</span>
        <span class="footer-attribution">Redesign by ${creatorName}</span>
      </div>
    </div>
  </footer>

  <!-- Tracking Pixel -->
  <img src="TRACKING_PIXEL_URL" width="1" height="1" style="position:absolute;opacity:0" alt="" />

  <!-- Mobile Nav Toggle Script -->
  <script>
    (function() {
      var toggle = document.getElementById('navToggle');
      var links = document.getElementById('navLinks');
      if (toggle && links) {
        toggle.addEventListener('click', function() {
          links.classList.toggle('open');
        });
        links.querySelectorAll('a').forEach(function(a) {
          a.addEventListener('click', function() {
            links.classList.remove('open');
          });
        });
      }
    })();
  </script>

</body>
</html>`
}
