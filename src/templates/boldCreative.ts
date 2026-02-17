import type { ScrapedData, PitchColors, Profile } from '@/types'

export function generateBoldCreative(data: ScrapedData, colors: PitchColors, creator: Profile): string {
  const creatorName = creator.agency_name || creator.full_name || 'Our Agency'
  const businessName = data.title || 'Your Business'
  const heroText = data.heroText || data.description || `Welcome to ${businessName}`
  const aboutText = data.bodyText[0] || data.description || ''
  const aboutExtra = data.bodyText[1] || ''

  const heroImage = data.images[0] || ''
  const aboutImage = data.images[1] || ''

  const socialEntries = Object.entries(data.socialLinks || {})

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  function generateStars(rating?: number): string {
    const r = Math.min(5, Math.max(0, Math.round(rating ?? 5)))
    let stars = ''
    for (let i = 0; i < 5; i++) {
      if (i < r) {
        stars += '<span class="star filled">&#9733;</span>'
      } else {
        stars += '<span class="star">&#9733;</span>'
      }
    }
    return stars
  }

  const servicesHtml = data.services.length > 0
    ? data.services.map((svc, i) => `
        <div class="service-card" style="animation-delay: ${i * 0.1}s">
          <div class="service-number">${String(i + 1).padStart(2, '0')}</div>
          <h3 class="service-title">${escapeHtml(svc.name)}</h3>
          <p class="service-desc">${escapeHtml(svc.description)}</p>
          <div class="service-arrow">&rarr;</div>
        </div>
      `).join('')
    : `
        <div class="service-card">
          <div class="service-number">01</div>
          <h3 class="service-title">Professional Service</h3>
          <p class="service-desc">We deliver high-quality solutions tailored to your needs.</p>
          <div class="service-arrow">&rarr;</div>
        </div>
        <div class="service-card">
          <div class="service-number">02</div>
          <h3 class="service-title">Expert Consultation</h3>
          <p class="service-desc">Guidance from industry professionals to help you grow.</p>
          <div class="service-arrow">&rarr;</div>
        </div>
        <div class="service-card">
          <div class="service-number">03</div>
          <h3 class="service-title">Dedicated Support</h3>
          <p class="service-desc">Round-the-clock assistance for all your needs.</p>
          <div class="service-arrow">&rarr;</div>
        </div>
      `

  const testimonialsHtml = data.testimonials.length > 0
    ? data.testimonials.map((t, i) => `
        <div class="testimonial-card" style="animation-delay: ${i * 0.15}s">
          <div class="testimonial-quote">&ldquo;</div>
          <p class="testimonial-text">${escapeHtml(t.text)}</p>
          <div class="testimonial-stars">${generateStars(t.rating)}</div>
          <div class="testimonial-author">
            <div class="author-avatar">${escapeHtml(t.author.charAt(0).toUpperCase())}</div>
            <span class="author-name">${escapeHtml(t.author)}</span>
          </div>
        </div>
      `).join('')
    : `
        <div class="testimonial-card">
          <div class="testimonial-quote">&ldquo;</div>
          <p class="testimonial-text">Outstanding service and incredible attention to detail. They transformed our vision into reality.</p>
          <div class="testimonial-stars">${generateStars(5)}</div>
          <div class="testimonial-author">
            <div class="author-avatar">A</div>
            <span class="author-name">A Valued Client</span>
          </div>
        </div>
      `

  const contactParts: string[] = []
  if (data.contact.phone) {
    contactParts.push(`
      <div class="contact-item">
        <div class="contact-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
        <div>
          <div class="contact-label">Phone</div>
          <a href="tel:${escapeHtml(data.contact.phone)}" class="contact-value">${escapeHtml(data.contact.phone)}</a>
        </div>
      </div>
    `)
  }
  if (data.contact.email) {
    contactParts.push(`
      <div class="contact-item">
        <div class="contact-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div>
          <div class="contact-label">Email</div>
          <a href="mailto:${escapeHtml(data.contact.email)}" class="contact-value">${escapeHtml(data.contact.email)}</a>
        </div>
      </div>
    `)
  }
  if (data.contact.address) {
    contactParts.push(`
      <div class="contact-item">
        <div class="contact-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div>
          <div class="contact-label">Address</div>
          <span class="contact-value">${escapeHtml(data.contact.address)}</span>
        </div>
      </div>
    `)
  }

  const socialHtml = socialEntries.length > 0
    ? `<div class="social-links">${socialEntries.map(([platform, url]) => `
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="social-link" title="${escapeHtml(platform)}">
          ${escapeHtml(platform.charAt(0).toUpperCase() + platform.slice(1))}
        </a>
      `).join('')}</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(businessName)} — Redesigned</title>
  <meta name="description" content="${escapeHtml(data.description || businessName)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* ========== RESET & BASE ========== */
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a2e;
      background: #ffffff;
      line-height: 1.6;
      overflow-x: hidden;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    /* ========== CSS VARIABLES ========== */
    :root {
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};
      --color-dark: #1a1a2e;
      --color-light: #f8f9fc;
      --color-white: #ffffff;
      --color-gray-100: #f1f3f8;
      --color-gray-200: #e2e6ef;
      --color-gray-400: #9ca3b8;
      --color-gray-600: #5a6178;
      --max-width: 1200px;
      --section-padding: 120px 0;
    }

    /* ========== UTILITY ========== */
    .container {
      width: 100%;
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 24px;
    }

    .section-label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: var(--color-accent);
      margin-bottom: 20px;
    }

    .section-label::before {
      content: '';
      display: inline-block;
      width: 40px;
      height: 2px;
      background: var(--color-accent);
    }

    /* ========== HERO ========== */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      background: var(--color-dark);
      overflow: hidden;
    }

    .hero::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 120px;
      background: var(--color-white);
      clip-path: polygon(0 60%, 100% 0, 100% 100%, 0 100%);
      z-index: 2;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    .hero-bg-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.25;
    }

    .hero-bg-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        var(--color-dark) 0%,
        rgba(26, 26, 46, 0.85) 40%,
        rgba(26, 26, 46, 0.6) 100%
      );
    }

    .hero-accent-shape {
      position: absolute;
      top: -20%;
      right: -10%;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: var(--color-primary);
      opacity: 0.08;
      filter: blur(80px);
    }

    .hero-accent-shape-2 {
      position: absolute;
      bottom: 10%;
      left: -5%;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: var(--color-accent);
      opacity: 0.06;
      filter: blur(60px);
    }

    .hero .container {
      position: relative;
      z-index: 1;
      padding-top: 80px;
      padding-bottom: 160px;
    }

    .hero-content {
      max-width: 800px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 100px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-accent);
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 32px;
      backdrop-filter: blur(10px);
    }

    .hero-badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-accent);
      animation: pulse-dot 2s ease-in-out infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.5); }
    }

    .hero-title {
      font-size: clamp(3rem, 7vw, 5.5rem);
      font-weight: 900;
      line-height: 1.05;
      color: var(--color-white);
      margin-bottom: 28px;
      letter-spacing: -2px;
    }

    .hero-title-accent {
      color: var(--color-primary);
      display: inline;
    }

    .hero-subtitle {
      font-size: clamp(1.05rem, 2vw, 1.3rem);
      font-weight: 400;
      color: rgba(255, 255, 255, 0.65);
      max-width: 600px;
      line-height: 1.7;
      margin-bottom: 48px;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 36px;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      letter-spacing: 0.3px;
    }

    .btn-primary {
      background: var(--color-primary);
      color: var(--color-white);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15), 0 0 0 0 var(--color-primary);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(255, 255, 255, 0.1);
    }

    .btn-outline {
      background: transparent;
      color: var(--color-white);
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-2px);
    }

    /* ========== ABOUT ========== */
    .about {
      padding: var(--section-padding);
      background: var(--color-white);
      position: relative;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }

    .about-image-wrap {
      position: relative;
    }

    .about-image-wrap::before {
      content: '';
      position: absolute;
      top: -20px;
      left: -20px;
      right: 20px;
      bottom: 20px;
      border: 3px solid var(--color-primary);
      border-radius: 20px;
      z-index: 0;
    }

    .about-image {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 480px;
      object-fit: cover;
      border-radius: 20px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.1);
    }

    .about-image-placeholder {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 480px;
      border-radius: 20px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.1);
    }

    .about-image-placeholder-text {
      font-size: 4rem;
      font-weight: 900;
      color: rgba(255, 255, 255, 0.2);
      letter-spacing: -2px;
    }

    .about-content h2 {
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 24px;
      color: var(--color-dark);
      letter-spacing: -1.5px;
    }

    .about-content p {
      font-size: 1.05rem;
      color: var(--color-gray-600);
      line-height: 1.8;
      margin-bottom: 16px;
    }

    .about-stats {
      display: flex;
      gap: 40px;
      margin-top: 40px;
      padding-top: 40px;
      border-top: 1px solid var(--color-gray-200);
    }

    .stat-item {
      text-align: left;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--color-primary);
      line-height: 1;
      letter-spacing: -1px;
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--color-gray-400);
      margin-top: 6px;
      font-weight: 500;
    }

    /* ========== SERVICES ========== */
    .services {
      padding: var(--section-padding);
      background: var(--color-dark);
      position: relative;
      overflow: hidden;
    }

    .services::before {
      content: '';
      position: absolute;
      top: -2px;
      left: 0;
      right: 0;
      height: 120px;
      background: var(--color-white);
      clip-path: polygon(0 0, 100% 0, 100% 40%, 0 100%);
      z-index: 1;
    }

    .services::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 120px;
      background: var(--color-light);
      clip-path: polygon(0 60%, 100% 0, 100% 100%, 0 100%);
      z-index: 1;
    }

    .services .container {
      position: relative;
      z-index: 2;
    }

    .services-header {
      text-align: center;
      max-width: 640px;
      margin: 0 auto 64px;
    }

    .services-header .section-label {
      color: var(--color-accent);
    }

    .services-header h2 {
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      font-weight: 900;
      color: var(--color-white);
      line-height: 1.1;
      letter-spacing: -1.5px;
      margin-bottom: 16px;
    }

    .services-header p {
      font-size: 1.05rem;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.7;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }

    .service-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;
      padding: 40px 32px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .service-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .service-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.12);
      transform: translateY(-4px);
    }

    .service-card:hover::before {
      transform: scaleX(1);
    }

    .service-number {
      font-size: 3rem;
      font-weight: 900;
      color: rgba(255, 255, 255, 0.04);
      line-height: 1;
      margin-bottom: 20px;
      letter-spacing: -2px;
    }

    .service-title {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--color-white);
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }

    .service-desc {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.45);
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .service-arrow {
      font-size: 1.4rem;
      color: var(--color-primary);
      transition: transform 0.3s ease;
    }

    .service-card:hover .service-arrow {
      transform: translateX(6px);
    }

    /* ========== TESTIMONIALS ========== */
    .testimonials {
      padding: var(--section-padding);
      background: var(--color-light);
      position: relative;
    }

    .testimonials-header {
      text-align: center;
      max-width: 640px;
      margin: 0 auto 64px;
    }

    .testimonials-header h2 {
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -1.5px;
      color: var(--color-dark);
      margin-bottom: 16px;
    }

    .testimonials-header p {
      font-size: 1.05rem;
      color: var(--color-gray-600);
      line-height: 1.7;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 24px;
    }

    .testimonial-card {
      background: var(--color-white);
      border-radius: 20px;
      padding: 40px 32px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
      position: relative;
    }

    .testimonial-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    }

    .testimonial-quote {
      font-size: 4rem;
      font-weight: 900;
      color: var(--color-primary);
      line-height: 1;
      opacity: 0.2;
      margin-bottom: -12px;
    }

    .testimonial-text {
      font-size: 1.05rem;
      color: var(--color-gray-600);
      line-height: 1.8;
      margin-bottom: 20px;
    }

    .testimonial-stars {
      margin-bottom: 20px;
      display: flex;
      gap: 2px;
    }

    .star {
      font-size: 1.1rem;
      color: var(--color-gray-200);
    }

    .star.filled {
      color: #f59e0b;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .author-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--color-white);
    }

    .author-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--color-dark);
    }

    /* ========== CONTACT ========== */
    .contact {
      padding: var(--section-padding);
      background: var(--color-white);
      position: relative;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: start;
    }

    .contact-info h2 {
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -1.5px;
      color: var(--color-dark);
      margin-bottom: 16px;
    }

    .contact-info > p {
      font-size: 1.05rem;
      color: var(--color-gray-600);
      line-height: 1.7;
      margin-bottom: 40px;
    }

    .contact-items {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .contact-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: var(--color-light);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary);
      flex-shrink: 0;
    }

    .contact-label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-gray-400);
      margin-bottom: 2px;
    }

    .contact-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-dark);
      text-decoration: none;
    }

    .contact-value:hover {
      color: var(--color-primary);
    }

    .social-links {
      display: flex;
      gap: 12px;
      margin-top: 32px;
      flex-wrap: wrap;
    }

    .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      border-radius: 10px;
      background: var(--color-light);
      color: var(--color-dark);
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: var(--color-primary);
      color: var(--color-white);
      transform: translateY(-2px);
    }

    /* ========== FEEDBACK FORM ========== */
    .feedback-form-wrap {
      background: var(--color-light);
      border-radius: 20px;
      padding: 40px;
    }

    .feedback-form-wrap h3 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-dark);
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .feedback-form-wrap > p {
      font-size: 0.95rem;
      color: var(--color-gray-600);
      margin-bottom: 28px;
      line-height: 1.6;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-dark);
      margin-bottom: 8px;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 14px 18px;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      border: 2px solid var(--color-gray-200);
      border-radius: 12px;
      background: var(--color-white);
      color: var(--color-dark);
      transition: all 0.2s ease;
      outline: none;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.04);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-group select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239ca3b8' stroke-width='2' fill='none'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
      padding-right: 40px;
    }

    .btn-submit {
      width: 100%;
      padding: 16px 36px;
      background: var(--color-primary);
      color: var(--color-white);
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      letter-spacing: 0.3px;
    }

    .btn-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    /* ========== FOOTER ========== */
    .footer {
      background: var(--color-dark);
      position: relative;
      overflow: hidden;
    }

    .footer::before {
      content: '';
      position: absolute;
      top: -2px;
      left: 0;
      right: 0;
      height: 100px;
      background: var(--color-white);
      clip-path: polygon(0 0, 100% 0, 100% 40%, 0 100%);
    }

    .footer-main {
      padding: 120px 0 60px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 60px;
    }

    .footer-brand h3 {
      font-size: 1.6rem;
      font-weight: 900;
      color: var(--color-white);
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }

    .footer-brand p {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.45);
      line-height: 1.7;
      max-width: 360px;
    }

    .footer-col h4 {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: rgba(255, 255, 255, 0.3);
      margin-bottom: 20px;
    }

    .footer-col a {
      display: block;
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.6);
      padding: 6px 0;
      transition: color 0.2s ease;
    }

    .footer-col a:hover {
      color: var(--color-white);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding: 28px 0;
    }

    .footer-bottom-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .footer-copyright {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.35);
    }

    .footer-credit {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.35);
    }

    .footer-credit strong {
      color: var(--color-primary);
      font-weight: 700;
    }

    /* ========== ANIMATIONS ========== */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fade-in-up {
      animation: fadeInUp 0.6s ease forwards;
    }

    /* ========== RESPONSIVE ========== */

    /* Tablet */
    @media (max-width: 1024px) {
      :root {
        --section-padding: 80px 0;
      }

      .about-grid {
        grid-template-columns: 1fr;
        gap: 48px;
      }

      .about-image-wrap {
        max-width: 560px;
      }

      .about-image,
      .about-image-placeholder {
        height: 360px;
      }

      .contact-grid {
        grid-template-columns: 1fr;
        gap: 48px;
      }

      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 40px;
      }

      .footer-brand {
        grid-column: 1 / -1;
      }
    }

    /* Mobile */
    @media (max-width: 640px) {
      :root {
        --section-padding: 64px 0;
      }

      .container {
        padding: 0 16px;
      }

      .hero .container {
        padding-top: 60px;
        padding-bottom: 120px;
      }

      .hero::after,
      .services::before,
      .services::after,
      .footer::before {
        height: 60px;
      }

      .hero-title {
        letter-spacing: -1px;
      }

      .hero-actions {
        flex-direction: column;
      }

      .hero-actions .btn {
        width: 100%;
        justify-content: center;
      }

      .about-stats {
        flex-wrap: wrap;
        gap: 24px;
      }

      .stat-item {
        min-width: 100px;
      }

      .services-grid {
        grid-template-columns: 1fr;
      }

      .testimonials-grid {
        grid-template-columns: 1fr;
      }

      .feedback-form-wrap {
        padding: 28px 20px;
      }

      .footer-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .footer-brand {
        grid-column: 1;
      }

      .footer-bottom-inner {
        flex-direction: column;
        text-align: center;
      }
    }
  </style>
</head>
<body>

  <!-- ========== HERO ========== -->
  <section class="hero">
    <div class="hero-bg">
      ${heroImage
        ? `<img class="hero-bg-image" src="${escapeHtml(heroImage)}" alt="${escapeHtml(businessName)}">`
        : ''
      }
      <div class="hero-bg-gradient"></div>
      <div class="hero-accent-shape"></div>
      <div class="hero-accent-shape-2"></div>
    </div>
    <div class="container">
      <div class="hero-content fade-in-up">
        <div class="hero-badge">
          <span class="hero-badge-dot"></span>
          ${escapeHtml(data.category || 'Professional Services')}
        </div>
        <h1 class="hero-title">
          ${escapeHtml(heroText.split(' ').slice(0, Math.ceil(heroText.split(' ').length / 2)).join(' '))}
          <span class="hero-title-accent">${escapeHtml(heroText.split(' ').slice(Math.ceil(heroText.split(' ').length / 2)).join(' '))}</span>
        </h1>
        <p class="hero-subtitle">${escapeHtml(data.description || 'Delivering excellence and innovation in everything we do. Discover what sets us apart.')}</p>
        <div class="hero-actions">
          <a href="#contact" class="btn btn-primary">Get Started &rarr;</a>
          <a href="#services" class="btn btn-outline">Our Services</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ========== ABOUT ========== -->
  <section class="about" id="about">
    <div class="container">
      <div class="about-grid">
        <div class="about-image-wrap">
          ${aboutImage
            ? `<img class="about-image" src="${escapeHtml(aboutImage)}" alt="About ${escapeHtml(businessName)}">`
            : `<div class="about-image-placeholder"><span class="about-image-placeholder-text">${escapeHtml(businessName.substring(0, 2).toUpperCase())}</span></div>`
          }
        </div>
        <div class="about-content">
          <span class="section-label">About Us</span>
          <h2>${data.headings[0] ? escapeHtml(data.headings[0]) : `About ${escapeHtml(businessName)}`}</h2>
          <p>${escapeHtml(aboutText || `${businessName} is dedicated to providing exceptional services and solutions. With years of experience and a passion for excellence, we help our clients achieve their goals.`)}</p>
          ${aboutExtra ? `<p>${escapeHtml(aboutExtra)}</p>` : ''}
          <div class="about-stats">
            <div class="stat-item">
              <div class="stat-number">10+</div>
              <div class="stat-label">Years Experience</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">Happy Clients</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">98%</div>
              <div class="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ========== SERVICES ========== -->
  <section class="services" id="services">
    <div class="container">
      <div class="services-header">
        <span class="section-label">What We Do</span>
        <h2>${data.headings[1] ? escapeHtml(data.headings[1]) : 'Our Services'}</h2>
        <p>Comprehensive solutions designed to elevate your business and drive measurable results.</p>
      </div>
      <div class="services-grid">
        ${servicesHtml}
      </div>
    </div>
  </section>

  <!-- ========== TESTIMONIALS ========== -->
  <section class="testimonials" id="testimonials">
    <div class="container">
      <div class="testimonials-header">
        <span class="section-label">Testimonials</span>
        <h2>What Our Clients Say</h2>
        <p>Real feedback from the people who matter most.</p>
      </div>
      <div class="testimonials-grid">
        ${testimonialsHtml}
      </div>
    </div>
  </section>

  <!-- ========== CONTACT ========== -->
  <section class="contact" id="contact">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-info">
          <span class="section-label">Get in Touch</span>
          <h2>Let&rsquo;s Start a Conversation</h2>
          <p>Ready to take the next step? Reach out and let us know how we can help.</p>
          <div class="contact-items">
            ${contactParts.join('')}
          </div>
          ${socialHtml}
        </div>
        <div class="feedback-form-wrap">
          <h3>Send Feedback</h3>
          <p>Let us know what you think of this redesign concept.</p>
          <form action="#" method="POST">
            <div class="form-group">
              <label for="feedback-name">Your Name</label>
              <input type="text" id="feedback-name" name="name" placeholder="Jane Doe" required>
            </div>
            <div class="form-group">
              <label for="feedback-email">Email Address</label>
              <input type="email" id="feedback-email" name="email" placeholder="jane@example.com" required>
            </div>
            <div class="form-group">
              <label for="feedback-rating">Rating</label>
              <select id="feedback-rating" name="rating" required>
                <option value="" disabled selected>Select a rating</option>
                <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733; &mdash; Excellent</option>
                <option value="4">&#9733;&#9733;&#9733;&#9733; &mdash; Great</option>
                <option value="3">&#9733;&#9733;&#9733; &mdash; Good</option>
                <option value="2">&#9733;&#9733; &mdash; Fair</option>
                <option value="1">&#9733; &mdash; Poor</option>
              </select>
            </div>
            <div class="form-group">
              <label for="feedback-message">Message</label>
              <textarea id="feedback-message" name="message" placeholder="Share your thoughts on this design..." required></textarea>
            </div>
            <button type="submit" class="btn-submit">Submit Feedback</button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- ========== FOOTER ========== -->
  <footer class="footer">
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>${escapeHtml(businessName)}</h3>
            <p>${escapeHtml(data.description || `${businessName} — delivering quality, innovation, and results.`)}</p>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact">Contact</a>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            ${data.contact.phone ? `<a href="tel:${escapeHtml(data.contact.phone)}">${escapeHtml(data.contact.phone)}</a>` : ''}
            ${data.contact.email ? `<a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a>` : ''}
            ${data.contact.address ? `<a href="#">${escapeHtml(data.contact.address)}</a>` : ''}
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-inner">
          <span class="footer-copyright">&copy; ${new Date().getFullYear()} ${escapeHtml(businessName)}. All rights reserved.</span>
          <span class="footer-credit">Redesign by <strong>${escapeHtml(creatorName)}</strong></span>
        </div>
      </div>
    </div>
  </footer>

  <!-- Tracking Pixel -->
  <img src="TRACKING_PIXEL_URL" width="1" height="1" style="position:absolute;opacity:0" alt="" />

</body>
</html>`
}
