export interface Profile {
  id: string
  full_name: string | null
  agency_name: string | null
  avatar_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  website_url: string | null
  created_at: string
}

export interface Lead {
  id: string
  user_id: string
  business_name: string
  address: string | null
  phone: string | null
  website_url: string | null
  email: string | null
  rating: number | null
  review_count: number | null
  category: string | null
  google_maps_data: Record<string, unknown> | null
  created_at: string
}

export interface ScrapedData {
  title: string
  description: string
  heroText: string
  headings: string[]
  bodyText: string[]
  images: string[]
  testimonials: { author: string; text: string; rating?: number }[]
  contact: {
    phone?: string
    email?: string
    address?: string
  }
  socialLinks: Record<string, string>
  colors: string[]
  category: string
  services: { name: string; description: string }[]
}

export interface PitchColors {
  primary: string
  secondary: string
  accent: string
}

export interface Pitch {
  id: string
  user_id: string
  lead_id: string | null
  business_name: string
  website_url: string | null
  scraped_data: ScrapedData | null
  template_id: string
  generated_html: string | null
  preview_url: string | null
  colors: PitchColors
  status: 'draft' | 'sent' | 'opened' | 'feedback'
  email_sent_at: string | null
  created_at: string
  updated_at: string
}

export interface PitchView {
  id: string
  pitch_id: string
  viewed_at: string
  ip_address: string | null
  location: {
    city?: string
    country?: string
    lat?: number
    lng?: number
  } | null
  user_agent: string | null
  duration_seconds: number | null
}

export interface PitchFeedback {
  id: string
  pitch_id: string
  rating: number
  message: string | null
  contact_email: string | null
  created_at: string
}

export interface EmailSettings {
  id: string
  user_id: string
  gmail_access_token: string | null
  gmail_refresh_token: string | null
  gmail_email: string | null
  warmup_enabled: boolean
  warmup_api_key: string | null
  warmup_holder_uid: string | null
  warmup_temperature: number
  daily_capacity: number
  updated_at: string
}

export interface TemplateConfig {
  id: string
  name: string
  description: string
  thumbnail: string
  categories: string[]
  generate: (data: ScrapedData, colors: PitchColors, creator: Profile) => string
}

export interface PitchWithRelations extends Pitch {
  views?: PitchView[]
  feedback?: PitchFeedback[]
}

export interface AuditIssue {
  category: 'performance' | 'seo' | 'mobile' | 'accessibility' | 'best-practices'
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
}

export interface AuditRecommendation {
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
}

export interface Audit {
  id: string
  user_id: string
  pitch_id: string | null
  business_name: string
  website_url: string
  overall_score: number | null
  performance_score: number | null
  seo_score: number | null
  mobile_score: number | null
  accessibility_score: number | null
  best_practices_score: number | null
  audit_data: Record<string, unknown> | null
  summary: string | null
  issues: AuditIssue[]
  recommendations: AuditRecommendation[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  error_message: string | null
  created_at: string
  completed_at: string | null
}
