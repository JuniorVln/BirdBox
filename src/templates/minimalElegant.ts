import type { ScrapedData, PitchColors, Profile } from '@/types'

export function generateMinimalElegant(data: ScrapedData, colors: PitchColors, creator: Profile): string {
  const creatorName = creator.agency_name || creator.full_name || 'Our Agency'

  const heroImage = data.images[0] || ''
  const aboutImage = data.images[1] || ''

  function generateStars(rating?: number): string {
    const r = Math.min(5, Math.max(0, Math.round(rating ?? 5)))
    let stars = ''
    for (let i = 0; i < 5; i++) {
      stars += i < r
        ? '<span class="star filled">&#9733;</span>'
        : '<span class="star">&#9734;</span>'
    }
    return `<div class="stars">${stars}</div>`
  }

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  const servicesHtml = data.services.length > 0
    ? data.services.map(s => `
        <div class="service-card">
          <h3>${escapeHtml(s.name)}</h3>
          <div class="service-divider"></div>
          <p>${escapeHtml(s.description)}</p>
        </div>
      `).join('')
    : ''

  const testimonialsHtml = data.testimonials.length > 0
    ? data.testimonials.map(t => `
        <div class="testimonial-card">
          <blockquote>
            <p>&ldquo;${escapeHtml(t.text)}&rdquo;</p>
          </blockquote>
          ${generateStars(t.rating)}
          <cite>&mdash; ${escapeHtml(t.author)}</cite>
        </div>
      `).join('')
    : ''

  const socialLinksHtml = Object.entries(data.socialLinks)
    .map(([platform, url]) => `<a href="${escapeHtml(url)}" class="social-link" target="_blank" rel="noopener noreferrer">${escapeHtml(platform)}</a>`)
    .join('<span class="social-sep">/</span>')

  const contactParts: string[] = []
  if (data.contact.phone) {
    contactParts.push(`
      <div class="contact-item">
        <span class="contact-label">Phone</span>
        <a href="tel:${escapeHtml(data.contact.phone)}">${escapeHtml(data.contact.phone)}</a>
      </div>
    `)
  }
  if (data.contact.email) {
    contactParts.push(`
      <div class="contact-item">
        <span class="contact-label">Email</span>
        <a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a>
      </div>
    `)
  }
  if (data.contact.address) {
    contactParts.push(`
      <div class="contact-item">
        <span class="contact-label">Address</span>
        <span>${escapeHtml(data.contact.address)}</span>
      </div>
    `)
  }

  const aboutText = data.bodyText[0] || data.description
  const secondaryText = data.bodyText[1] || ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.title)}</title>
  <meta name="description" content="${escapeHtml(data.description)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <style>
    /* ===== Reset & Base ===== */
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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 300;
      font-size: 16px;
      line-height: 1.7;
      color: #2c2c2c;
      background-color: #faf9f7;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    a {
      color: ${colors.primary};
      text-decoration: none;
      transition: color 0.3s ease, opacity 0.3s ease;
    }

    a:hover {
      opacity: 0.7;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
      font-weight: 500;
      line-height: 1.2;
      color: #1a1a1a;
    }

    /* ===== Layout ===== */
    .container {
      max-width: 1140px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .section {
      padding: 100px 0;
    }

    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }

    .section-header h2 {
      font-size: 2.5rem;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }

    .section-header .subtitle {
      font-size: 1.05rem;
      color: #777;
      font-weight: 300;
      max-width: 560px;
      margin: 0 auto;
    }

    .section-divider {
      width: 48px;
      height: 1px;
      background-color: ${colors.primary};
      margin: 24px auto;
      opacity: 0.5;
    }

    /* ===== Animations ===== */
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

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .animate-in {
      animation: fadeInUp 0.8s ease-out both;
    }

    .animate-fade {
      animation: fadeIn 1s ease-out both;
    }

    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }

    /* ===== Navigation ===== */
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(250, 249, 247, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }

    .nav-brand {
      font-family: 'Playfair Display', serif;
      font-size: 1.35rem;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: -0.01em;
    }

    .nav-links {
      display: flex;
      gap: 32px;
      list-style: none;
    }

    .nav-links a {
      font-size: 0.85rem;
      font-weight: 400;
      color: #555;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transition: color 0.3s ease;
    }

    .nav-links a:hover {
      color: ${colors.primary};
      opacity: 1;
    }

    .nav-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }

    .nav-toggle span {
      display: block;
      width: 24px;
      height: 1.5px;
      background: #1a1a1a;
      transition: all 0.3s ease;
    }

    /* ===== Hero ===== */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      background-color: #f5f4f0;
    }

    .hero-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: center;
      padding-top: 72px;
    }

    .hero-content {
      animation: fadeInUp 1s ease-out both;
    }

    .hero-tag {
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: ${colors.primary};
      margin-bottom: 24px;
      display: inline-block;
    }

    .hero h1 {
      font-size: 3.5rem;
      letter-spacing: -0.03em;
      margin-bottom: 24px;
      line-height: 1.1;
    }

    .hero p {
      font-size: 1.1rem;
      color: #666;
      max-width: 480px;
      margin-bottom: 40px;
      line-height: 1.8;
    }

    .hero-cta {
      display: inline-block;
      padding: 16px 40px;
      background: ${colors.primary};
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: all 0.4s ease;
    }

    .hero-cta:hover {
      background: ${colors.secondary};
      color: #fff;
      opacity: 1;
    }

    .hero-image {
      position: relative;
      animation: fadeIn 1.2s ease-out 0.3s both;
    }

    .hero-image img {
      width: 100%;
      height: 520px;
      object-fit: cover;
    }

    .hero-image::after {
      content: '';
      position: absolute;
      top: -16px;
      right: -16px;
      width: 100%;
      height: 100%;
      border: 1px solid ${colors.primary};
      opacity: 0.2;
      z-index: -1;
    }

    /* ===== About ===== */
    .about {
      background: #fff;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }

    .about-image img {
      width: 100%;
      height: 440px;
      object-fit: cover;
    }

    .about-content h2 {
      font-size: 2.25rem;
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }

    .about-content .about-divider {
      width: 40px;
      height: 1px;
      background: ${colors.primary};
      margin: 20px 0 24px;
      opacity: 0.5;
    }

    .about-content p {
      color: #555;
      margin-bottom: 16px;
      font-size: 1rem;
    }

    /* ===== Services ===== */
    .services {
      background: #faf9f7;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .service-card {
      background: #fff;
      padding: 48px 36px;
      border: 1px solid #eee;
      transition: all 0.4s ease;
    }

    .service-card:hover {
      border-color: ${colors.primary};
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
    }

    .service-card h3 {
      font-size: 1.35rem;
      margin-bottom: 12px;
      letter-spacing: -0.01em;
    }

    .service-divider {
      width: 24px;
      height: 1px;
      background: ${colors.accent};
      margin-bottom: 16px;
    }

    .service-card p {
      font-size: 0.95rem;
      color: #777;
      line-height: 1.7;
    }

    /* ===== Testimonials ===== */
    .testimonials {
      background: #fff;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 40px;
    }

    .testimonial-card {
      padding: 40px;
      border: 1px solid #eee;
      background: #faf9f7;
      transition: border-color 0.3s ease;
    }

    .testimonial-card:hover {
      border-color: ${colors.primary};
    }

    .testimonial-card blockquote p {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem;
      font-style: italic;
      color: #444;
      line-height: 1.8;
      margin-bottom: 20px;
    }

    .stars {
      margin-bottom: 12px;
    }

    .star {
      font-size: 1rem;
      color: #ccc;
      letter-spacing: 2px;
    }

    .star.filled {
      color: ${colors.accent};
    }

    .testimonial-card cite {
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-size: 0.85rem;
      font-weight: 500;
      color: #999;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    /* ===== Contact ===== */
    .contact {
      background: #faf9f7;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .contact-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .contact-label {
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #999;
    }

    .contact-item a,
    .contact-item span {
      font-size: 1.05rem;
      color: #333;
    }

    .contact-item a:hover {
      color: ${colors.primary};
    }

    .social-links-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 8px;
    }

    .social-link {
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #555;
    }

    .social-link:hover {
      color: ${colors.primary};
      opacity: 1;
    }

    .social-sep {
      color: #ccc;
      font-size: 0.75rem;
    }

    /* ===== Feedback Form ===== */
    .feedback-form {
      background: #fff;
      padding: 48px 40px;
      border: 1px solid #eee;
    }

    .feedback-form h3 {
      font-size: 1.5rem;
      margin-bottom: 8px;
    }

    .feedback-form .form-subtitle {
      color: #999;
      font-size: 0.9rem;
      margin-bottom: 32px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 8px;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 14px 16px;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      font-weight: 300;
      color: #333;
      background: #faf9f7;
      border: 1px solid #e0ddd8;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      border-color: ${colors.primary};
    }

    .form-group textarea {
      min-height: 120px;
      resize: vertical;
    }

    .form-submit {
      display: inline-block;
      padding: 14px 36px;
      background: ${colors.primary};
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: all 0.4s ease;
    }

    .form-submit:hover {
      background: ${colors.secondary};
    }

    /* ===== Footer ===== */
    .footer {
      background: #1a1a1a;
      color: #888;
      padding: 60px 0 40px;
    }

    .footer-inner {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 40px;
      flex-wrap: wrap;
    }

    .footer-brand {
      font-family: 'Playfair Display', serif;
      font-size: 1.2rem;
      color: #ddd;
      margin-bottom: 8px;
    }

    .footer p {
      font-size: 0.85rem;
      line-height: 1.6;
      max-width: 320px;
    }

    .footer-bottom {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .footer-bottom p {
      font-size: 0.8rem;
      color: #666;
    }

    .footer-attribution {
      font-size: 0.8rem;
      color: #666;
    }

    .footer-attribution a {
      color: ${colors.accent};
      font-weight: 400;
    }

    /* ===== Responsive ===== */

    /* Tablet */
    @media (max-width: 960px) {
      .hero-inner {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }

      .hero h1 {
        font-size: 2.75rem;
      }

      .hero p {
        margin-left: auto;
        margin-right: auto;
      }

      .hero-image::after {
        display: none;
      }

      .hero-image img {
        height: 380px;
      }

      .about-grid {
        grid-template-columns: 1fr;
        gap: 48px;
      }

      .services-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .contact-grid {
        grid-template-columns: 1fr;
        gap: 48px;
      }

      .section {
        padding: 72px 0;
      }

      .section-header h2 {
        font-size: 2rem;
      }
    }

    /* Mobile */
    @media (max-width: 640px) {
      body {
        font-size: 15px;
      }

      .nav-links {
        display: none;
        position: absolute;
        top: 72px;
        left: 0;
        right: 0;
        background: rgba(250, 249, 247, 0.98);
        flex-direction: column;
        padding: 24px;
        gap: 20px;
        border-bottom: 1px solid #eee;
      }

      .nav-links.active {
        display: flex;
      }

      .nav-toggle {
        display: flex;
      }

      .hero {
        min-height: auto;
        padding: 120px 0 64px;
      }

      .hero h1 {
        font-size: 2.1rem;
      }

      .hero-image img {
        height: 280px;
      }

      .services-grid {
        grid-template-columns: 1fr;
      }

      .testimonials-grid {
        grid-template-columns: 1fr;
      }

      .section {
        padding: 56px 0;
      }

      .section-header {
        margin-bottom: 40px;
      }

      .section-header h2 {
        font-size: 1.75rem;
      }

      .service-card {
        padding: 32px 24px;
      }

      .testimonial-card {
        padding: 28px 24px;
      }

      .feedback-form {
        padding: 32px 24px;
      }

      .footer-inner {
        flex-direction: column;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
    }
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav class="nav">
    <div class="container nav-inner">
      <a href="#" class="nav-brand">${escapeHtml(data.title)}</a>
      <button class="nav-toggle" aria-label="Toggle menu" onclick="document.querySelector('.nav-links').classList.toggle('active')">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links">
        <li><a href="#about">About</a></li>
        ${data.services.length > 0 ? '<li><a href="#services">Services</a></li>' : ''}
        ${data.testimonials.length > 0 ? '<li><a href="#testimonials">Testimonials</a></li>' : ''}
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <div class="hero-inner">
        <div class="hero-content">
          <span class="hero-tag">${escapeHtml(data.category)}</span>
          <h1>${escapeHtml(data.heroText || data.title)}</h1>
          <p>${escapeHtml(data.description)}</p>
          <a href="#contact" class="hero-cta">Get in Touch</a>
        </div>
        ${heroImage ? `
        <div class="hero-image">
          <img src="${escapeHtml(heroImage)}" alt="${escapeHtml(data.title)}" />
        </div>
        ` : ''}
      </div>
    </div>
  </section>

  <!-- About -->
  <section id="about" class="section about">
    <div class="container">
      <div class="about-grid">
        ${aboutImage ? `
        <div class="about-image animate-in">
          <img src="${escapeHtml(aboutImage)}" alt="About ${escapeHtml(data.title)}" />
        </div>
        ` : ''}
        <div class="about-content animate-in delay-2" ${!aboutImage ? 'style="grid-column: 1 / -1; max-width: 680px; margin: 0 auto; text-align: center;"' : ''}>
          <h2>${escapeHtml(data.headings[0] || 'About Us')}</h2>
          <div class="about-divider"></div>
          <p>${escapeHtml(aboutText)}</p>
          ${secondaryText ? `<p>${escapeHtml(secondaryText)}</p>` : ''}
        </div>
      </div>
    </div>
  </section>

  ${data.services.length > 0 ? `
  <!-- Services -->
  <section id="services" class="section services">
    <div class="container">
      <div class="section-header animate-in">
        <h2>${escapeHtml(data.headings[1] || 'Our Services')}</h2>
        <div class="section-divider"></div>
        <p class="subtitle">What we offer</p>
      </div>
      <div class="services-grid">
        ${servicesHtml}
      </div>
    </div>
  </section>
  ` : ''}

  ${data.testimonials.length > 0 ? `
  <!-- Testimonials -->
  <section id="testimonials" class="section testimonials">
    <div class="container">
      <div class="section-header animate-in">
        <h2>Client Testimonials</h2>
        <div class="section-divider"></div>
        <p class="subtitle">Hear from those who trust us</p>
      </div>
      <div class="testimonials-grid">
        ${testimonialsHtml}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Contact -->
  <section id="contact" class="section contact">
    <div class="container">
      <div class="section-header animate-in">
        <h2>Get in Touch</h2>
        <div class="section-divider"></div>
        <p class="subtitle">We&rsquo;d love to hear from you</p>
      </div>
      <div class="contact-grid">
        <div class="contact-info animate-in delay-1">
          ${contactParts.join('')}
          ${socialLinksHtml ? `
          <div class="contact-item">
            <span class="contact-label">Follow Us</span>
            <div class="social-links-row">${socialLinksHtml}</div>
          </div>
          ` : ''}
        </div>
        <div class="animate-in delay-2">
          <form class="feedback-form" action="#" method="POST">
            <h3>Send Feedback</h3>
            <p class="form-subtitle">Let us know how we can improve</p>
            <div class="form-group">
              <label for="feedback-name">Your Name</label>
              <input type="text" id="feedback-name" name="name" placeholder="Jane Doe" required />
            </div>
            <div class="form-group">
              <label for="feedback-email">Email Address</label>
              <input type="email" id="feedback-email" name="email" placeholder="you@example.com" required />
            </div>
            <div class="form-group">
              <label for="feedback-rating">Rating</label>
              <select id="feedback-rating" name="rating">
                <option value="5">5 &mdash; Excellent</option>
                <option value="4">4 &mdash; Very Good</option>
                <option value="3">3 &mdash; Good</option>
                <option value="2">2 &mdash; Fair</option>
                <option value="1">1 &mdash; Poor</option>
              </select>
            </div>
            <div class="form-group">
              <label for="feedback-message">Message</label>
              <textarea id="feedback-message" name="message" placeholder="Share your thoughts..."></textarea>
            </div>
            <button type="submit" class="form-submit">Submit Feedback</button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <div>
          <div class="footer-brand">${escapeHtml(data.title)}</div>
          <p>${escapeHtml(data.description.substring(0, 160))}</p>
        </div>
        <div>
          ${contactParts.length > 0 ? `
          ${data.contact.phone ? `<p>${escapeHtml(data.contact.phone)}</p>` : ''}
          ${data.contact.email ? `<p>${escapeHtml(data.contact.email)}</p>` : ''}
          ` : ''}
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${escapeHtml(data.title)}. All rights reserved.</p>
        <p class="footer-attribution">Redesign by <a href="#">${escapeHtml(creatorName)}</a></p>
      </div>
    </div>
  </footer>

  <!-- Tracking Pixel -->
  <img src="TRACKING_PIXEL_URL" width="1" height="1" style="position:absolute;opacity:0" />

</body>
</html>`
}
