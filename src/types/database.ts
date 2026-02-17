export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          agency_name: string | null
          avatar_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          website_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          agency_name?: string | null
          avatar_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          agency_name?: string | null
          avatar_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
          created_at?: string
        }
      }
      leads: {
        Row: {
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
          google_maps_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          address?: string | null
          phone?: string | null
          website_url?: string | null
          email?: string | null
          rating?: number | null
          review_count?: number | null
          category?: string | null
          google_maps_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          address?: string | null
          phone?: string | null
          website_url?: string | null
          email?: string | null
          rating?: number | null
          review_count?: number | null
          category?: string | null
          google_maps_data?: Json | null
          created_at?: string
        }
      }
      pitches: {
        Row: {
          id: string
          user_id: string
          lead_id: string | null
          business_name: string
          website_url: string | null
          scraped_data: Json | null
          template_id: string
          generated_html: string | null
          preview_url: string | null
          colors: Json
          status: string
          email_sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lead_id?: string | null
          business_name: string
          website_url?: string | null
          scraped_data?: Json | null
          template_id?: string
          generated_html?: string | null
          preview_url?: string | null
          colors?: Json
          status?: string
          email_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lead_id?: string | null
          business_name?: string
          website_url?: string | null
          scraped_data?: Json | null
          template_id?: string
          generated_html?: string | null
          preview_url?: string | null
          colors?: Json
          status?: string
          email_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pitch_views: {
        Row: {
          id: string
          pitch_id: string
          viewed_at: string
          ip_address: string | null
          location: Json | null
          user_agent: string | null
          duration_seconds: number | null
        }
        Insert: {
          id?: string
          pitch_id: string
          viewed_at?: string
          ip_address?: string | null
          location?: Json | null
          user_agent?: string | null
          duration_seconds?: number | null
        }
        Update: {
          id?: string
          pitch_id?: string
          viewed_at?: string
          ip_address?: string | null
          location?: Json | null
          user_agent?: string | null
          duration_seconds?: number | null
        }
      }
      pitch_feedback: {
        Row: {
          id: string
          pitch_id: string
          rating: number | null
          message: string | null
          contact_email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          pitch_id: string
          rating?: number | null
          message?: string | null
          contact_email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          pitch_id?: string
          rating?: number | null
          message?: string | null
          contact_email?: string | null
          created_at?: string
        }
      }
      email_settings: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          gmail_access_token?: string | null
          gmail_refresh_token?: string | null
          gmail_email?: string | null
          warmup_enabled?: boolean
          warmup_api_key?: string | null
          warmup_holder_uid?: string | null
          warmup_temperature?: number
          daily_capacity?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gmail_access_token?: string | null
          gmail_refresh_token?: string | null
          gmail_email?: string | null
          warmup_enabled?: boolean
          warmup_api_key?: string | null
          warmup_holder_uid?: string | null
          warmup_temperature?: number
          daily_capacity?: number
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
