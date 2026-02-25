export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audits: {
        Row: {
          accessibility_score: number | null
          audit_data: Json | null
          best_practices_score: number | null
          business_name: string
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          issues: Json | null
          mobile_score: number | null
          overall_score: number | null
          performance_score: number | null
          pitch_id: string | null
          recommendations: Json | null
          seo_score: number | null
          status: string | null
          summary: string | null
          user_id: string
          website_url: string
        }
        Insert: {
          accessibility_score?: number | null
          audit_data?: Json | null
          best_practices_score?: number | null
          business_name: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          issues?: Json | null
          mobile_score?: number | null
          overall_score?: number | null
          performance_score?: number | null
          pitch_id?: string | null
          recommendations?: Json | null
          seo_score?: number | null
          status?: string | null
          summary?: string | null
          user_id: string
          website_url: string
        }
        Update: {
          accessibility_score?: number | null
          audit_data?: Json | null
          best_practices_score?: number | null
          business_name?: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          issues?: Json | null
          mobile_score?: number | null
          overall_score?: number | null
          performance_score?: number | null
          pitch_id?: string | null
          recommendations?: Json | null
          seo_score?: number | null
          status?: string | null
          summary?: string | null
          user_id?: string
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "audits_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_makers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          lead_id: string
          linkedin_url: string | null
          name: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          lead_id: string
          linkedin_url?: string | null
          name: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          lead_id?: string
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decision_makers_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      email_settings: {
        Row: {
          daily_capacity: number | null
          gmail_access_token: string | null
          gmail_email: string | null
          gmail_refresh_token: string | null
          id: string
          updated_at: string | null
          user_id: string
          warmup_api_key: string | null
          warmup_enabled: boolean | null
          warmup_holder_uid: string | null
          warmup_temperature: number | null
        }
        Insert: {
          daily_capacity?: number | null
          gmail_access_token?: string | null
          gmail_email?: string | null
          gmail_refresh_token?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          warmup_api_key?: string | null
          warmup_enabled?: boolean | null
          warmup_holder_uid?: string | null
          warmup_temperature?: number | null
        }
        Update: {
          daily_capacity?: number | null
          gmail_access_token?: string | null
          gmail_email?: string | null
          gmail_refresh_token?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          warmup_api_key?: string | null
          warmup_enabled?: boolean | null
          warmup_holder_uid?: string | null
          warmup_temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_intelligence: {
        Row: {
          ai_summary: string | null
          disqualification_reason: string | null
          generated_at: string | null
          health_score: number | null
          id: string
          identified_pain_points: Json | null
          is_qualified: boolean | null
          lead_id: string
          outreach_script_email: string | null
          outreach_script_linkedin: string | null
          recommended_services: Json | null
          updated_at: string | null
        }
        Insert: {
          ai_summary?: string | null
          disqualification_reason?: string | null
          generated_at?: string | null
          health_score?: number | null
          id?: string
          identified_pain_points?: Json | null
          is_qualified?: boolean | null
          lead_id: string
          outreach_script_email?: string | null
          outreach_script_linkedin?: string | null
          recommended_services?: Json | null
          updated_at?: string | null
        }
        Update: {
          ai_summary?: string | null
          disqualification_reason?: string | null
          generated_at?: string | null
          health_score?: number | null
          id?: string
          identified_pain_points?: Json | null
          is_qualified?: boolean | null
          lead_id?: string
          outreach_script_email?: string | null
          outreach_script_linkedin?: string | null
          recommended_services?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_intelligence_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          business_name: string
          category: string | null
          created_at: string | null
          email: string | null
          enrichment_data: Json | null
          enrichment_last_run_at: string | null
          enrichment_status:
            | Database["public"]["Enums"]["enrichment_status_enum"]
            | null
          google_maps_data: Json | null
          id: string
          instagram_data: Json | null
          linkedin_data: Json | null
          pagespeed_data: Json | null
          phone: string | null
          rating: number | null
          review_count: number | null
          scraped_content: Json | null
          tech_stack: Json | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          category?: string | null
          created_at?: string | null
          email?: string | null
          enrichment_data?: Json | null
          enrichment_last_run_at?: string | null
          enrichment_status?:
            | Database["public"]["Enums"]["enrichment_status_enum"]
            | null
          google_maps_data?: Json | null
          id?: string
          instagram_data?: Json | null
          linkedin_data?: Json | null
          pagespeed_data?: Json | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          scraped_content?: Json | null
          tech_stack?: Json | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          category?: string | null
          created_at?: string | null
          email?: string | null
          enrichment_data?: Json | null
          enrichment_last_run_at?: string | null
          enrichment_status?:
            | Database["public"]["Enums"]["enrichment_status_enum"]
            | null
          google_maps_data?: Json | null
          id?: string
          instagram_data?: Json | null
          linkedin_data?: Json | null
          pagespeed_data?: Json | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          scraped_content?: Json | null
          tech_stack?: Json | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_feedback: {
        Row: {
          contact_email: string | null
          created_at: string | null
          id: string
          message: string | null
          pitch_id: string
          rating: number | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          pitch_id: string
          rating?: number | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          pitch_id?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pitch_feedback_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitches"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_views: {
        Row: {
          duration_seconds: number | null
          id: string
          ip_address: string | null
          location: Json | null
          pitch_id: string
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          duration_seconds?: number | null
          id?: string
          ip_address?: string | null
          location?: Json | null
          pitch_id: string
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          duration_seconds?: number | null
          id?: string
          ip_address?: string | null
          location?: Json | null
          pitch_id?: string
          user_agent?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pitch_views_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitches"
            referencedColumns: ["id"]
          },
        ]
      }
      pitches: {
        Row: {
          business_name: string
          colors: Json | null
          created_at: string | null
          email_sent_at: string | null
          generated_html: string | null
          id: string
          lead_id: string | null
          preview_url: string | null
          scraped_data: Json | null
          status: string | null
          template_id: string | null
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          business_name: string
          colors?: Json | null
          created_at?: string | null
          email_sent_at?: string | null
          generated_html?: string | null
          id?: string
          lead_id?: string | null
          preview_url?: string | null
          scraped_data?: Json | null
          status?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          business_name?: string
          colors?: Json | null
          created_at?: string | null
          email_sent_at?: string | null
          generated_html?: string | null
          id?: string
          lead_id?: string | null
          preview_url?: string | null
          scraped_data?: Json | null
          status?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pitches_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pitches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agency_name: string | null
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          linkedin_url: string | null
          twitter_url: string | null
          website_url: string | null
        }
        Insert: {
          agency_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          linkedin_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
        }
        Update: {
          agency_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          linkedin_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      enrichment_status_enum: "pending" | "enriching" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      enrichment_status_enum: ["pending", "enriching", "completed", "failed"],
    },
  },
} as const
