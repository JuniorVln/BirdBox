import type { ScrapedData, PitchColors, Profile } from '@/types'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function generateStars(rating: number = 5): string {
  const full = Math.floor(rating)
  const empty = 5 - full
  return '★'.repeat(full) + '☆'.repeat(empty)
}

export function generateModernProfessional(data: ScrapedData, colors: PitchColors, creator: Profile): string {
  const servicesHtml = data.services
    .map(
      (s) => `
      <div class="service-card">
        <h3>${escapeHtml(s.name)}</h3>
        <p>${escapeHtml(s.description)}</p>
      </div>`
    )
    .join('')

  const testimonialsHtml = data.testimonials
    .map(
      (t) => `
      <div class="testimonial-card">
        <div class="stars">${generateStars(t.rating)}</div>
        <p class="quote">&ldquo;${escapeHtml(t.text)}&rdquo;</p>
        <p class="author">${escapeHtml(t.author)}</p>
      </div>`
    )
    .join('')

  const socialLinksHtml = Object.entries(data.socialLinks)
    .map(
      ([platform, url]) =>
        `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(platform.charAt(0).toUpperCase() + platform.slice(1))}</a>`
    )
    .join('')

  const heroImage = data.images[0] ? `background-image: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('${data.images[0]}');` : `background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(data.description)}">
  <title>${escapeHtml(data.title)} — Redesigned</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --primary: ${colors.primary};
      --secondary: ${colors.secondary};
      --accent: ${colors.accent};
      --text: #1a1a2e;
      --text-light: #555;
      --text-muted: #888;
      --bg: #ffffff;
      --bg-light: #f8f9fc;
      --border: #e5e7eb;
      --radius: 8px;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--text);
      background: var(--bg);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 1140px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* ===== HEADER ===== */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 16px 0;
    }

    .header .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
      text-decoration: none;
    }

    .header-nav { display: flex; gap: 24px; align-items: center; }
    .header-nav a {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-light);
      text-decoration: none;
      transition: color 0.2s;
    }
    .header-nav a:hover { color: var(--primary); }

    .header-cta {
      background: var(--primary);
      color: white !important;
      padding: 8px 20px;
      border-radius: var(--radius);
      font-weight: 600;
      transition: opacity 0.2s;
    }
    .header-cta:hover { opacity: 0.9; }

    /* ===== HERO ===== */
    .hero {
      ${heroImage}
      background-size: cover;
      background-position: center;
      min-height: 90vh;
      display: flex;
      align-items: center;
      padding-top: 80px;
      color: white;
    }

    .hero-content { max-width: 640px; }
    .hero h1 {
      font-size: 52px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .hero p {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 32px;
      line-height: 1.7;
    }
    .hero-btn {
      display: inline-block;
      background: var(--accent);
      color: white;
      padding: 14px 32px;
      border-radius: var(--radius);
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .hero-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }

    /* ===== ABOUT ===== */
    .about {
      padding: 100px 0;
      background: var(--bg);
    }
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }
    .about-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 12px;
    }
    .about-image-placeholder {
      width: 100%;
      height: 400px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--bg-light), #e2e8f0);
    }
    .section-label {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary);
      margin-bottom: 12px;
    }
    .section-title {
      font-size: 36px;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 20px;
      letter-spacing: -0.01em;
    }
    .section-text {
      font-size: 16px;
      color: var(--text-light);
      line-height: 1.8;
    }

    /* ===== SERVICES ===== */
    .services {
      padding: 100px 0;
      background: var(--bg-light);
    }
    .services-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .service-card {
      background: white;
      padding: 32px;
      border-radius: 12px;
      border: 1px solid var(--border);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.08);
    }
    .service-card h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text);
    }
    .service-card p {
      font-size: 14px;
      color: var(--text-light);
      line-height: 1.6;
    }

    /* ===== TESTIMONIALS ===== */
    .testimonials {
      padding: 100px 0;
      background: var(--bg);
    }
    .testimonials-header { text-align: center; margin-bottom: 60px; }
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .testimonial-card {
      background: var(--bg-light);
      padding: 32px;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
    .testimonial-card .stars {
      color: #f59e0b;
      font-size: 16px;
      margin-bottom: 12px;
      letter-spacing: 2px;
    }
    .testimonial-card .quote {
      font-size: 15px;
      color: var(--text-light);
      line-height: 1.7;
      margin-bottom: 16px;
      font-style: italic;
    }
    .testimonial-card .author {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }

    /* ===== CONTACT ===== */
    .contact {
      padding: 100px 0;
      background: var(--bg-light);
    }
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
    }
    .contact-info { display: flex; flex-direction: column; gap: 24px; }
    .contact-item h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 4px;
    }
    .contact-item p {
      font-size: 15px;
      color: var(--text-light);
    }
    .contact-item a {
      color: var(--primary);
      text-decoration: none;
    }

    /* ===== FEEDBACK ===== */
    .feedback-form {
      background: white;
      padding: 32px;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
    .feedback-form h3 {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .form-group { margin-bottom: 16px; }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--text);
    }
    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-family: inherit;
      font-size: 14px;
      background: var(--bg-light);
      color: var(--text);
      outline: none;
      transition: border-color 0.2s;
    }
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      border-color: var(--primary);
    }
    .form-group textarea { resize: vertical; min-height: 100px; }
    .form-submit {
      background: var(--primary);
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: var(--radius);
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: opacity 0.2s;
      width: 100%;
    }
    .form-submit:hover { opacity: 0.9; }

    /* ===== FOOTER ===== */
    .footer {
      padding: 60px 0 40px;
      background: var(--text);
      color: rgba(255,255,255,0.7);
    }
    .footer-grid {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 40px;
      margin-bottom: 40px;
    }
    .footer-brand .logo { color: white; }
    .footer-brand p { font-size: 14px; margin-top: 12px; max-width: 300px; line-height: 1.6; }
    .footer-links { display: flex; gap: 40px; }
    .footer-links a {
      font-size: 14px;
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-links a:hover { color: white; }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }
    .footer-bottom a {
      color: var(--accent);
      text-decoration: none;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .hero h1 { font-size: 40px; }
      .services-grid { grid-template-columns: repeat(2, 1fr); }
      .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .header-nav { display: none; }
      .hero { min-height: 70vh; }
      .hero h1 { font-size: 32px; }
      .hero p { font-size: 16px; }
      .about-grid { grid-template-columns: 1fr; gap: 32px; }
      .about-image, .about-image-placeholder { height: 260px; }
      .services-grid { grid-template-columns: 1fr; }
      .testimonials-grid { grid-template-columns: 1fr; }
      .contact-grid { grid-template-columns: 1fr; gap: 40px; }
      .section-title { font-size: 28px; }
      .footer-grid { flex-direction: column; }
      .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header class="header">
    <div class="container">
      <a href="#" class="logo">${escapeHtml(data.title)}</a>
      <nav class="header-nav">
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#testimonials">Reviews</a>
        <a href="#contact" class="header-cta">Contact Us</a>
      </nav>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h1>${escapeHtml(data.heroText || data.title)}</h1>
        <p>${escapeHtml(data.description)}</p>
        <a href="#contact" class="hero-btn">Get in Touch</a>
      </div>
    </div>
  </section>

  <!-- About -->
  <section id="about" class="about">
    <div class="container">
      <div class="about-grid">
        <div>
          <p class="section-label">About Us</p>
          <h2 class="section-title">${escapeHtml(data.headings[0] || 'Who We Are')}</h2>
          <p class="section-text">${escapeHtml(data.bodyText[0] || data.description)}</p>
          ${data.bodyText[1] ? `<p class="section-text" style="margin-top:16px">${escapeHtml(data.bodyText[1])}</p>` : ''}
        </div>
        ${data.images[1] ? `<img src="${data.images[1]}" alt="About ${escapeHtml(data.title)}" class="about-image">` : '<div class="about-image-placeholder"></div>'}
      </div>
    </div>
  </section>

  <!-- Services -->
  <section id="services" class="services">
    <div class="container">
      <div class="services-header">
        <p class="section-label">What We Offer</p>
        <h2 class="section-title">${escapeHtml(data.headings[1] || 'Our Services')}</h2>
      </div>
      <div class="services-grid">
        ${servicesHtml}
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section id="testimonials" class="testimonials">
    <div class="container">
      <div class="testimonials-header">
        <p class="section-label">What People Say</p>
        <h2 class="section-title">${escapeHtml(data.headings[2] || 'Client Reviews')}</h2>
      </div>
      <div class="testimonials-grid">
        ${testimonialsHtml}
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="contact">
    <div class="container">
      <div class="contact-grid">
        <div>
          <p class="section-label">Get in Touch</p>
          <h2 class="section-title">${escapeHtml(data.headings[3] || 'Contact Us')}</h2>
          <p class="section-text" style="margin-bottom:32px">${escapeHtml(data.bodyText[2] || 'We\'d love to hear from you. Reach out to us today.')}</p>
          <div class="contact-info">
            ${data.contact.phone ? `<div class="contact-item"><h3>Phone</h3><p><a href="tel:${escapeHtml(data.contact.phone)}">${escapeHtml(data.contact.phone)}</a></p></div>` : ''}
            ${data.contact.email ? `<div class="contact-item"><h3>Email</h3><p><a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a></p></div>` : ''}
            ${data.contact.address ? `<div class="contact-item"><h3>Address</h3><p>${escapeHtml(data.contact.address)}</p></div>` : ''}
          </div>
        </div>

        <!-- Feedback Form -->
        <div class="feedback-form">
          <h3>Share Your Feedback</h3>
          <form action="#" method="POST">
            <div class="form-group">
              <label for="rating">Rating</label>
              <select id="rating" name="rating">
                <option value="5">★★★★★ Excellent</option>
                <option value="4">★★★★☆ Great</option>
                <option value="3">★★★☆☆ Good</option>
                <option value="2">★★☆☆☆ Fair</option>
                <option value="1">★☆☆☆☆ Poor</option>
              </select>
            </div>
            <div class="form-group">
              <label for="message">Your Feedback</label>
              <textarea id="message" name="message" placeholder="What do you think of this redesign?"></textarea>
            </div>
            <div class="form-group">
              <label for="email">Your Email (optional)</label>
              <input type="email" id="email" name="contact_email" placeholder="you@example.com">
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
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="#" class="logo">${escapeHtml(data.title)}</a>
          <p>${escapeHtml(data.description)}</p>
        </div>
        <div class="footer-links">
          ${socialLinksHtml}
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} ${escapeHtml(data.title)}. All rights reserved.</span>
        <span>Redesign by <a href="#">${escapeHtml(creator.full_name ?? creator.agency_name ?? 'Pitch AI')}</a></span>
      </div>
    </div>
  </footer>

  <!-- Tracking Pixel -->
  <img src="TRACKING_PIXEL_URL" width="1" height="1" style="position:absolute;opacity:0" alt="">

</body>
</html>`
}
