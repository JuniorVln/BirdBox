# PRD — Pitch AI: Automated Web Design Agency Outreach SaaS

**Version:** 1.0
**Date:** 2026-02-15
**Stack:** React + TypeScript + Tailwind CSS + Supabase + Edge Functions

---

## 1. Vision

SaaS platform that automates the cold outreach pipeline for web designers/agencies: discover local businesses → scrape their current website → generate a redesigned version using AI → send personalized outreach email with live preview URL → track engagement.

**Monetization:** Subscription tiers (free trial → paid plans) + potential white-label/box resale.

---

## 2. Core User Flow

```
Find Leads (Google Maps API) 
  → Select Lead 
    → Scrape Website (Firecrawl) 
      → AI Content Analysis 
        → Choose Template 
          → Generate Redesigned Website 
            → Preview & Edit 
              → Send Email (Gmail OAuth) 
                → Track Opens/Location/Feedback
```

---

## 3. Feature Breakdown

### 3.1 Authentication & Onboarding
- **Supabase Auth** — email/password + magic link
- Onboarding flow: name, agency name, profile photo
- Creator profile (displayed on generated websites as "Created by")

### 3.2 Dashboard
- Overview metrics: total pitches, open rate, response rate, active leads
- Recent pitches list with status indicators (draft, sent, opened, feedback received)
- Quick actions: "New Pitch", "Find Leads"

### 3.3 Lead Discovery
- **Input:** Business type + City/Location (e.g., "barbers in Amsterdam")
- **Engine:** Google Maps Places API (or SerpAPI/Outscraper as proxy)
- **Output per lead:**
  - Business name
  - Address
  - Phone
  - Website URL
  - Rating + review count
  - Email (extracted from website via scraping)
- **UI:** Card grid with filters (rating, has website, has email)
- **Action:** "Create Pitch" button per lead → auto-populates pitch creation

### 3.4 Manual Pitch Creation
- Form: Company name + Website URL
- Same flow as auto, just manual input

### 3.5 Website Scraping & Analysis
- **Engine:** Firecrawl API (managed or self-hosted)
- **Extracts:**
  - Page title, meta description
  - Hero text, headings, body copy
  - Images (logos, hero images, gallery)
  - Testimonials/reviews
  - Contact info (phone, email, address)
  - Social links
  - Color palette detection
  - Business category inference
- **Storage:** `scraped_data` JSONB column on `pitches` table

### 3.6 Template System
- 4-6 pre-built responsive website templates:
  - **Modern Professional** — clean, corporate
  - **Bold Creative** — vibrant, agency-style
  - **Minimal Elegant** — whitespace-heavy, luxury feel
  - **Local Business** — warm, approachable
  - **Tech Startup** — gradient-heavy, modern SaaS
  - **Portfolio** — image-centric, gallery-focused
- **AI Template Selection:** Based on business category, the system suggests the best template
- Templates are React components rendered to static HTML for the preview

### 3.7 AI Website Generation
- Takes scraped data + selected template
- **Generates:**
  - Hero section with business name, tagline (AI-generated or scraped)
  - About section
  - Services/features section
  - Testimonials section (from Google reviews)
  - Image gallery (from scraped images)
  - Contact section with map embed
  - Footer with social links
- **Output:** Static HTML page hosted on Supabase Storage (or Vercel/Netlify subdomain)
- Each pitch gets a unique URL: `pitch.app/{pitch_id}`

### 3.8 Pitch Preview & Editing
- Full preview with device toggles: Desktop / Tablet / Mobile
- Color scheme editor (primary, secondary, accent)
- Content editing (inline or form-based)
- Copy pitch URL button
- "Open in new tab" for full preview

### 3.9 Feedback System
- Public-facing feedback form on each generated website
- Business owner can:
  - Rate the design (1-5 stars)
  - Leave text feedback
  - Request specific changes
- Feedback stored and visible in pitch detail view

### 3.10 Email Integration
- **Gmail OAuth 2.0** — connect Gmail account in Settings
- Compose email from pitch detail view
- Pre-filled template with:
  - Recipient name (from lead data)
  - Subject line (customizable)
  - Body with pitch URL
- **Tracking pixel** embedded for open tracking

### 3.11 Email Warm-up (Warmmy.io)
- API integration in Settings
- **Dashboard shows:**
  - Email temperature/health score
  - Daily sending capacity
  - Deliverability score
  - DNS status
  - Emails sent today
- Controls: Enable/Pause/Test warm-up
- Gradual ramp-up visualization

### 3.12 Analytics
- **Per-pitch metrics:**
  - Times opened (with timestamps)
  - Viewer location (IP-based geolocation)
  - Time spent on page
  - Feedback submissions
- **Aggregate dashboard:**
  - Total pitches sent
  - Overall open rate
  - Response/feedback rate
  - Conversion funnel visualization

### 3.13 Settings
- **Profile:** Name, photo, agency name, portfolio links (LinkedIn, Twitter, website)
- **Email:** Gmail connection status, connected account display
- **Warm-up:** Warmmy.io connection, health dashboard
- **API Keys:** Firecrawl, Google Maps, Warmmy.io
- **Templates:** Default template preference
- **Branding:** Default colors, logo for generated websites

---

## 4. Data Model (Supabase)

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (FK auth.users) | PK |
| full_name | text | |
| agency_name | text | |
| avatar_url | text | |
| linkedin_url | text | |
| twitter_url | text | |
| website_url | text | |
| created_at | timestamptz | |

### `leads`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid (FK profiles) | |
| business_name | text | |
| address | text | |
| phone | text | |
| website_url | text | |
| email | text | |
| rating | numeric | |
| review_count | int | |
| category | text | |
| google_maps_data | jsonb | Raw API response |
| created_at | timestamptz | |

### `pitches`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid (FK profiles) | |
| lead_id | uuid (FK leads) | nullable for manual |
| business_name | text | |
| website_url | text | Original URL |
| scraped_data | jsonb | Firecrawl output |
| template_id | text | Template key |
| generated_html | text | Final HTML |
| preview_url | text | Public URL |
| colors | jsonb | {primary, secondary, accent} |
| status | text | draft/sent/opened/feedback |
| email_sent_at | timestamptz | |
| created_at | timestamptz | |

### `pitch_views`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| pitch_id | uuid (FK pitches) | |
| viewed_at | timestamptz | |
| ip_address | text | |
| location | jsonb | {city, country, lat, lng} |
| user_agent | text | |
| duration_seconds | int | |

### `pitch_feedback`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| pitch_id | uuid (FK pitches) | |
| rating | int | 1-5 |
| message | text | |
| contact_email | text | |
| created_at | timestamptz | |

### `email_settings`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid (FK profiles) | |
| gmail_access_token | text | encrypted |
| gmail_refresh_token | text | encrypted |
| gmail_email | text | |
| warmup_enabled | boolean | |
| warmup_api_key | text | encrypted |
| warmup_holder_uid | text | |
| warmup_temperature | numeric | |
| daily_capacity | int | |
| updated_at | timestamptz | |

---

## 5. API Integrations

| Service | Purpose | Key Endpoints |
|---------|---------|---------------|
| **Google Maps Places API** | Lead discovery | Nearby Search, Place Details |
| **Firecrawl** | Website scraping | `/scrape`, `/crawl` |
| **Gmail API (OAuth 2.0)** | Send emails | `messages.send` |
| **Warmmy.io** | Email warm-up | `/mailboxes`, `/health` |
| **IP Geolocation** | View tracking | ip-api.com or similar |
| **Anthropic Claude API** | Content generation | Messages API for taglines, copy |

---

## 6. Non-Functional Requirements

- **Performance:** Pitch generation < 30 seconds end-to-end
- **Security:** All API keys encrypted at rest, RLS on all tables, OAuth tokens in secure storage
- **Responsiveness:** Full mobile support for dashboard, generated websites must be fully responsive
- **SEO:** Generated websites should have proper meta tags (even though they're pitches)
- **Rate Limiting:** Respect all API rate limits, queue heavy operations

---

## 7. Phase Roadmap

| Phase | Scope |
|-------|-------|
| **P0 — MVP** | Auth, manual pitch creation, website scraping (Firecrawl), template selection, AI website generation, pitch preview, public pitch URL |
| **P1 — Leads** | Google Maps lead discovery, auto-populate pitch from lead, email extraction from scraped sites |
| **P2 — Outreach** | Gmail OAuth, email compose/send from pitch, open tracking pixel, view analytics |
| **P3 — Warmup** | Warmmy.io integration, email health dashboard, capacity management |
| **P4 — Polish** | Advanced analytics, feedback system, inline content editing, color customization, scroll/hover animations |

---

## 8. Key Technical Decisions

1. **Generated websites as static HTML** in Supabase Storage — no server needed for hosting pitches
2. **Edge Functions** for scraping orchestration, email sending, and webhook handling
3. **Tracking pixel** — 1x1 transparent PNG served via Edge Function that logs the view
4. **Template rendering** — Server-side React rendering (or string template interpolation) to produce static HTML
5. **Firecrawl managed** for MVP, self-hosted option later for cost optimization
