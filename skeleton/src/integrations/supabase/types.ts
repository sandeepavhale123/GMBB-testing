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
      ab_bot_api_keys: {
        Row: {
          bot_id: string
          created_at: string | null
          gemini_key_encrypted: string | null
          id: string
          openai_key_encrypted: string | null
          updated_at: string | null
        }
        Insert: {
          bot_id: string
          created_at?: string | null
          gemini_key_encrypted?: string | null
          id?: string
          openai_key_encrypted?: string | null
          updated_at?: string | null
        }
        Update: {
          bot_id?: string
          created_at?: string | null
          gemini_key_encrypted?: string | null
          id?: string
          openai_key_encrypted?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_bot_api_keys_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: true
            referencedRelation: "ab_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_bot_appointments: {
        Row: {
          booking_link_clicked: boolean
          bot_id: string
          created_at: string
          id: string
          lead_id: string | null
          metadata: Json | null
          session_id: string
          triggered_by_keyword: string | null
        }
        Insert: {
          booking_link_clicked?: boolean
          bot_id: string
          created_at?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          session_id: string
          triggered_by_keyword?: string | null
        }
        Update: {
          booking_link_clicked?: boolean
          bot_id?: string
          created_at?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          session_id?: string
          triggered_by_keyword?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_bot_appointments_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "ab_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ab_bot_appointments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "ab_bot_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_bot_calendar_settings: {
        Row: {
          booking_instruction: string | null
          booking_link: string | null
          bot_id: string
          created_at: string
          enabled: boolean
          id: string
          trigger_keywords: string[] | null
          updated_at: string
        }
        Insert: {
          booking_instruction?: string | null
          booking_link?: string | null
          bot_id: string
          created_at?: string
          enabled?: boolean
          id?: string
          trigger_keywords?: string[] | null
          updated_at?: string
        }
        Update: {
          booking_instruction?: string | null
          booking_link?: string | null
          bot_id?: string
          created_at?: string
          enabled?: boolean
          id?: string
          trigger_keywords?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_bot_calendar_settings_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: true
            referencedRelation: "ab_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_bot_lead_settings: {
        Row: {
          bot_id: string
          collect_email: boolean
          collect_message: boolean
          collect_name: boolean
          collect_phone: boolean
          created_at: string
          email_required: boolean
          enabled: boolean
          form_description: string | null
          form_title: string | null
          id: string
          message_required: boolean
          name_required: boolean
          phone_required: boolean
          privacy_policy_url: string | null
          submit_button_text: string | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          bot_id: string
          collect_email?: boolean
          collect_message?: boolean
          collect_name?: boolean
          collect_phone?: boolean
          created_at?: string
          email_required?: boolean
          enabled?: boolean
          form_description?: string | null
          form_title?: string | null
          id?: string
          message_required?: boolean
          name_required?: boolean
          phone_required?: boolean
          privacy_policy_url?: string | null
          submit_button_text?: string | null
          trigger_type?: string
          updated_at?: string
        }
        Update: {
          bot_id?: string
          collect_email?: boolean
          collect_message?: boolean
          collect_name?: boolean
          collect_phone?: boolean
          created_at?: string
          email_required?: boolean
          enabled?: boolean
          form_description?: string | null
          form_title?: string | null
          id?: string
          message_required?: boolean
          name_required?: boolean
          phone_required?: boolean
          privacy_policy_url?: string | null
          submit_button_text?: string | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_bot_lead_settings_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: true
            referencedRelation: "ab_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_bot_leads: {
        Row: {
          bot_id: string
          conversation_snapshot: Json | null
          created_at: string
          email: string | null
          id: string
          message: string | null
          metadata: Json | null
          name: string | null
          phone: string | null
          session_id: string
          source_url: string | null
        }
        Insert: {
          bot_id: string
          conversation_snapshot?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          session_id: string
          source_url?: string | null
        }
        Update: {
          bot_id?: string
          conversation_snapshot?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          session_id?: string
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_bot_leads_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "ab_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_bots: {
        Row: {
          allowed_domains: string[] | null
          created_at: string
          embed_settings: Json | null
          fallback_message: string | null
          id: string
          intent: string | null
          is_active: boolean
          is_public: boolean | null
          max_tokens: number | null
          model_name: string
          model_provider: string
          name: string
          owner_id: string | null
          project_id: string | null
          retrieval_count: number | null
          similarity_threshold: number | null
          status: string
          system_prompt: string | null
          temperature: number | null
          updated_at: string
          user_message_template: string | null
        }
        Insert: {
          allowed_domains?: string[] | null
          created_at?: string
          embed_settings?: Json | null
          fallback_message?: string | null
          id?: string
          intent?: string | null
          is_active?: boolean
          is_public?: boolean | null
          max_tokens?: number | null
          model_name?: string
          model_provider?: string
          name?: string
          owner_id?: string | null
          project_id?: string | null
          retrieval_count?: number | null
          similarity_threshold?: number | null
          status?: string
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string
          user_message_template?: string | null
        }
        Update: {
          allowed_domains?: string[] | null
          created_at?: string
          embed_settings?: Json | null
          fallback_message?: string | null
          id?: string
          intent?: string | null
          is_active?: boolean
          is_public?: boolean | null
          max_tokens?: number | null
          model_name?: string
          model_provider?: string
          name?: string
          owner_id?: string | null
          project_id?: string | null
          retrieval_count?: number | null
          similarity_threshold?: number | null
          status?: string
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string
          user_message_template?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_bots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_chat_logs: {
        Row: {
          bot_id: string
          bot_response: string | null
          chunks_retrieved: number
          created_at: string
          id: string
          response_time_ms: number | null
          session_id: string
          top_similarity: number | null
          used_fallback: boolean
          user_message: string
        }
        Insert: {
          bot_id: string
          bot_response?: string | null
          chunks_retrieved?: number
          created_at?: string
          id?: string
          response_time_ms?: number | null
          session_id: string
          top_similarity?: number | null
          used_fallback?: boolean
          user_message: string
        }
        Update: {
          bot_id?: string
          bot_response?: string | null
          chunks_retrieved?: number
          created_at?: string
          id?: string
          response_time_ms?: number | null
          session_id?: string
          top_similarity?: number | null
          used_fallback?: boolean
          user_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_chat_logs_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "ab_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_company_info: {
        Row: {
          bot_id: string
          business_hours: string | null
          company_address: string | null
          company_name: string | null
          company_profile: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          established_date: string | null
          id: string
          industry: string | null
          logo_url: string | null
          phone_number: string | null
          product_description: string | null
          service_description: string | null
          social_media_links: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          bot_id: string
          business_hours?: string | null
          company_address?: string | null
          company_name?: string | null
          company_profile?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          established_date?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          phone_number?: string | null
          product_description?: string | null
          service_description?: string | null
          social_media_links?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          bot_id?: string
          business_hours?: string | null
          company_address?: string | null
          company_name?: string | null
          company_profile?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          established_date?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          phone_number?: string | null
          product_description?: string | null
          service_description?: string | null
          social_media_links?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_company_info_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: true
            referencedRelation: "ab_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_knowledge_embeddings: {
        Row: {
          bot_id: string
          chunk_index: number
          chunk_text: string
          created_at: string | null
          embedding: string | null
          id: string
          knowledge_source_id: string | null
        }
        Insert: {
          bot_id: string
          chunk_index: number
          chunk_text: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          knowledge_source_id?: string | null
        }
        Update: {
          bot_id?: string
          chunk_index?: number
          chunk_text?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          knowledge_source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_knowledge_embeddings_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "ab_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ab_knowledge_embeddings_knowledge_source_id_fkey"
            columns: ["knowledge_source_id"]
            isOneToOne: false
            referencedRelation: "ab_knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_knowledge_sources: {
        Row: {
          bot_id: string
          char_count: number
          content: string | null
          created_at: string
          error_message: string | null
          file_name: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          source_type: string
          status: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          bot_id: string
          char_count?: number
          content?: string | null
          created_at?: string
          error_message?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          source_type: string
          status?: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          bot_id?: string
          char_count?: number
          content?: string | null
          created_at?: string
          error_message?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          source_type?: string
          status?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_knowledge_sources_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "ab_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_qa_pairs: {
        Row: {
          answer: string
          created_at: string
          id: string
          knowledge_source_id: string
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          knowledge_source_id: string
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          knowledge_source_id?: string
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_qa_pairs_knowledge_source_id_fkey"
            columns: ["knowledge_source_id"]
            isOneToOne: false
            referencedRelation: "ab_knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_system_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          project_id: string
          system_message: string
          updated_at: string | null
          user_message_template: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          project_id: string
          system_message: string
          updated_at?: string | null
          user_message_template?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          project_id?: string
          system_message?: string
          updated_at?: string | null
          user_message_template?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_system_templates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_usage: {
        Row: {
          bot_id: string
          created_at: string
          id: string
          message_count: number
          period_start: string
          training_chars: number
          updated_at: string
        }
        Insert: {
          bot_id: string
          created_at?: string
          id?: string
          message_count?: number
          period_start?: string
          training_chars?: number
          updated_at?: string
        }
        Update: {
          bot_id?: string
          created_at?: string
          id?: string
          message_count?: number
          period_start?: string
          training_chars?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_usage_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "ab_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_usage_limits: {
        Row: {
          bot_id: string
          created_at: string
          id: string
          max_messages_monthly: number
          max_training_chars: number
          updated_at: string
        }
        Insert: {
          bot_id: string
          created_at?: string
          id?: string
          max_messages_monthly?: number
          max_training_chars?: number
          updated_at?: string
        }
        Update: {
          bot_id?: string
          created_at?: string
          id?: string
          max_messages_monthly?: number
          max_training_chars?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_usage_limits_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: true
            referencedRelation: "ab_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          direction: string | null
          duration: number | null
          from: string | null
          id: string
          recording_url: string | null
          sentiment: string | null
          status: string | null
          summary: string | null
          tags: string[] | null
          timestamp: string | null
          to: string | null
          transcript: string | null
          user_id: string
        }
        Insert: {
          direction?: string | null
          duration?: number | null
          from?: string | null
          id?: string
          recording_url?: string | null
          sentiment?: string | null
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          timestamp?: string | null
          to?: string | null
          transcript?: string | null
          user_id?: string
        }
        Update: {
          direction?: string | null
          duration?: number | null
          from?: string | null
          id?: string
          recording_url?: string | null
          sentiment?: string | null
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          timestamp?: string | null
          to?: string | null
          transcript?: string | null
          user_id?: string
        }
        Relationships: []
      }
      llm_results: {
        Row: {
          brand_mentioned: boolean | null
          citations: Json | null
          created_at: string | null
          domain_mentioned: boolean | null
          id: string
          model_name: string
          prompt_id: string | null
          response_text: string
        }
        Insert: {
          brand_mentioned?: boolean | null
          citations?: Json | null
          created_at?: string | null
          domain_mentioned?: boolean | null
          id?: string
          model_name: string
          prompt_id?: string | null
          response_text: string
        }
        Update: {
          brand_mentioned?: boolean | null
          citations?: Json | null
          created_at?: string | null
          domain_mentioned?: boolean | null
          id?: string
          model_name?: string
          prompt_id?: string | null
          response_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "llm_results_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          external_user_id: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          external_user_id?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          external_user_id?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      project_members: {
        Row: {
          id: string
          project_id: string | null
          role: string | null
          user_email: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          role?: string | null
          user_email: string
        }
        Update: {
          id?: string
          project_id?: string | null
          role?: string | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          domain: string | null
          external_user_id: string | null
          id: string
          location: string | null
          name: string
          owner_id: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          external_user_id?: string | null
          id?: string
          location?: string | null
          name: string
          owner_id?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          external_user_id?: string | null
          id?: string
          location?: string | null
          name?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          project_id: string | null
          selected_models: string[] | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          selected_models?: string[] | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          selected_models?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_bot_access: { Args: { _bot_id: string }; Returns: boolean }
      has_project_access: { Args: { _project_id: string }; Returns: boolean }
      match_knowledge_embeddings: {
        Args: {
          match_bot_id: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          chunk_text: string
          id: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
