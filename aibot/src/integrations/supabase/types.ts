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
      ab_bot_webhook_logs: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          response_body: string | null
          response_status: number | null
          webhook_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          response_body?: string | null
          response_status?: number | null
          webhook_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_bot_webhook_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "ab_bot_webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_bot_webhooks: {
        Row: {
          bot_id: string
          created_at: string
          events: string[]
          headers: Json | null
          id: string
          is_active: boolean
          name: string
          secret_key: string | null
          updated_at: string
          url: string
        }
        Insert: {
          bot_id: string
          created_at?: string
          events?: string[]
          headers?: Json | null
          id?: string
          is_active?: boolean
          name: string
          secret_key?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          bot_id?: string
          created_at?: string
          events?: string[]
          headers?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          secret_key?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_bot_webhooks_bot_id_fkey"
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
          show_powered_by: boolean
          similarity_threshold: number | null
          status: string
          subscription_id: string | null
          system_prompt: string | null
          temperature: number | null
          updated_at: string
          user_message_template: string | null
          workspace_id: string | null
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
          show_powered_by?: boolean
          similarity_threshold?: number | null
          status?: string
          subscription_id?: string | null
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string
          user_message_template?: string | null
          workspace_id?: string | null
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
          show_powered_by?: boolean
          similarity_threshold?: number | null
          status?: string
          subscription_id?: string | null
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string
          user_message_template?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_bots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ab_bots_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "ab_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ab_bots_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "ab_workspaces"
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
      ab_payment_history: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          description: string | null
          id: string
          plan_name: string | null
          plan_type: string | null
          status: string
          stripe_invoice_id: string | null
          stripe_invoice_url: string | null
          stripe_payment_intent_id: string | null
          stripe_receipt_url: string | null
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          plan_name?: string | null
          plan_type?: string | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_invoice_url?: string | null
          stripe_payment_intent_id?: string | null
          stripe_receipt_url?: string | null
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          plan_name?: string | null
          plan_type?: string | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_invoice_url?: string | null
          stripe_payment_intent_id?: string | null
          stripe_receipt_url?: string | null
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "ab_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_plans: {
        Row: {
          allowed_integrations: string[] | null
          billing_period: string | null
          can_customize_appearance: boolean
          can_remove_branding: boolean
          created_at: string | null
          description: string | null
          display_order: number
          features: string[] | null
          id: string
          is_active: boolean
          is_popular: boolean
          max_bots: number
          max_messages_monthly: number
          max_team_members: number
          max_training_chars_per_bot: number
          max_workspaces: number
          name: string
          plan_type: string
          price_cents: number
          slug: string
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          allowed_integrations?: string[] | null
          billing_period?: string | null
          can_customize_appearance?: boolean
          can_remove_branding?: boolean
          created_at?: string | null
          description?: string | null
          display_order?: number
          features?: string[] | null
          id?: string
          is_active?: boolean
          is_popular?: boolean
          max_bots?: number
          max_messages_monthly?: number
          max_team_members?: number
          max_training_chars_per_bot?: number
          max_workspaces?: number
          name: string
          plan_type: string
          price_cents?: number
          slug: string
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          allowed_integrations?: string[] | null
          billing_period?: string | null
          can_customize_appearance?: boolean
          can_remove_branding?: boolean
          created_at?: string | null
          description?: string | null
          display_order?: number
          features?: string[] | null
          id?: string
          is_active?: boolean
          is_popular?: boolean
          max_bots?: number
          max_messages_monthly?: number
          max_team_members?: number
          max_training_chars_per_bot?: number
          max_workspaces?: number
          name?: string
          plan_type?: string
          price_cents?: number
          slug?: string
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      ab_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          lifetime_access: boolean | null
          plan_id: string
          purchased_at: string | null
          quantity: number
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          lifetime_access?: boolean | null
          plan_id: string
          purchased_at?: string | null
          quantity?: number
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          lifetime_access?: boolean | null
          plan_id?: string
          purchased_at?: string | null
          quantity?: number
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "ab_plans"
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
      ab_workspace_members: {
        Row: {
          created_at: string | null
          email: string
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          role: Database["public"]["Enums"]["ab_workspace_role"]
          status: string
          user_id: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["ab_workspace_role"]
          status?: string
          user_id?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["ab_workspace_role"]
          status?: string
          user_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "ab_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_workspaces: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
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
      crh_contact_notes: {
        Row: {
          contact_id: string
          created_at: string
          created_by: string
          id: string
          note_text: string
          profile_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          created_by: string
          id?: string
          note_text: string
          profile_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          created_by?: string
          id?: string
          note_text?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crh_contact_notes_contact_fk"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crh_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crh_contact_notes_created_by_fk"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "crh_team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crh_contact_notes_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crh_contacts: {
        Row: {
          assigned_to: string | null
          birthday: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_contacted_at: string | null
          last_name: string
          last_visit_at: string | null
          next_reminder_at: string | null
          phone: string | null
          profile_id: string
          review_requested: boolean
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          birthday?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_contacted_at?: string | null
          last_name: string
          last_visit_at?: string | null
          next_reminder_at?: string | null
          phone?: string | null
          profile_id: string
          review_requested?: boolean
          source: string
          status: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          birthday?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_contacted_at?: string | null
          last_name?: string
          last_visit_at?: string | null
          next_reminder_at?: string | null
          phone?: string | null
          profile_id?: string
          review_requested?: boolean
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crh_contacts_assigned_fk"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "crh_team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crh_contacts_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crh_message_templates: {
        Row: {
          approval_status: string
          body_text: string
          channel: string
          created_at: string
          id: string
          language: string | null
          name: string
          profile_id: string
          updated_at: string
          whatsapp_template_sid: string | null
        }
        Insert: {
          approval_status: string
          body_text: string
          channel: string
          created_at?: string
          id?: string
          language?: string | null
          name: string
          profile_id: string
          updated_at?: string
          whatsapp_template_sid?: string | null
        }
        Update: {
          approval_status?: string
          body_text?: string
          channel?: string
          created_at?: string
          id?: string
          language?: string | null
          name?: string
          profile_id?: string
          updated_at?: string
          whatsapp_template_sid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crh_message_templates_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crh_messages_log: {
        Row: {
          channel: string
          contact_id: string
          id: string
          profile_id: string
          provider: string
          sender_id: string | null
          sent_at: string
          sent_by: string
          status: string
          template_id: string | null
        }
        Insert: {
          channel: string
          contact_id: string
          id?: string
          profile_id: string
          provider: string
          sender_id?: string | null
          sent_at?: string
          sent_by: string
          status: string
          template_id?: string | null
        }
        Update: {
          channel?: string
          contact_id?: string
          id?: string
          profile_id?: string
          provider?: string
          sender_id?: string | null
          sent_at?: string
          sent_by?: string
          status?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crh_messages_log_contact_fk"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crh_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crh_messages_log_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crh_messages_log_sender_fk"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "crh_twilio_senders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crh_messages_log_sent_by_fk"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "crh_team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crh_messages_log_template_fk"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "crh_message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      crh_smtp_accounts: {
        Row: {
          created_at: string
          from_email: string
          from_name: string
          host: string
          id: string
          is_default: boolean
          password_encrypted: string
          port: number
          profile_id: string
          username: string
        }
        Insert: {
          created_at?: string
          from_email: string
          from_name: string
          host: string
          id?: string
          is_default?: boolean
          password_encrypted: string
          port: number
          profile_id: string
          username: string
        }
        Update: {
          created_at?: string
          from_email?: string
          from_name?: string
          host?: string
          id?: string
          is_default?: boolean
          password_encrypted?: string
          port?: number
          profile_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "crh_smtp_accounts_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crh_team_members: {
        Row: {
          created_at: string
          external_user_id: string | null
          id: string
          name: string
          profile_id: string
          role: string
        }
        Insert: {
          created_at?: string
          external_user_id?: string | null
          id?: string
          name: string
          profile_id: string
          role: string
        }
        Update: {
          created_at?: string
          external_user_id?: string | null
          id?: string
          name?: string
          profile_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "crh_team_members_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crh_twilio_accounts: {
        Row: {
          account_sid: string
          auth_token_encrypted: string
          created_at: string
          friendly_name: string | null
          id: string
          profile_id: string
          status: string
        }
        Insert: {
          account_sid: string
          auth_token_encrypted: string
          created_at?: string
          friendly_name?: string | null
          id?: string
          profile_id: string
          status: string
        }
        Update: {
          account_sid?: string
          auth_token_encrypted?: string
          created_at?: string
          friendly_name?: string | null
          id?: string
          profile_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "crh_twilio_accounts_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crh_twilio_senders: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          profile_id: string
          sender_type: string
          sender_value: string
          twilio_account_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          profile_id: string
          sender_type: string
          sender_value: string
          twilio_account_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          profile_id?: string
          sender_type?: string
          sender_value?: string
          twilio_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crh_twilio_senders_account_fk"
            columns: ["twilio_account_id"]
            isOneToOne: false
            referencedRelation: "crh_twilio_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crh_twilio_senders_profile_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ctm_business_call_configs: {
        Row: {
          account_sid: string | null
          api_key: string
          api_secret: string | null
          auth_token: string | null
          business_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          owner_id: string
          provider_id: string
          status_callback_url: string | null
          updated_at: string | null
          verification_error: string | null
          verified_at: string | null
          webhook_url: string | null
        }
        Insert: {
          account_sid?: string | null
          api_key: string
          api_secret?: string | null
          auth_token?: string | null
          business_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          owner_id: string
          provider_id: string
          status_callback_url?: string | null
          updated_at?: string | null
          verification_error?: string | null
          verified_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          account_sid?: string | null
          api_key?: string
          api_secret?: string | null
          auth_token?: string | null
          business_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          owner_id?: string
          provider_id?: string
          status_callback_url?: string | null
          updated_at?: string | null
          verification_error?: string | null
          verified_at?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ctm_business_call_configs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ctm_call_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      ctm_business_hours: {
        Row: {
          business_id: string
          close_time: string | null
          created_at: string | null
          day_of_week: number
          id: string
          is_open: boolean | null
          open_time: string | null
          tracking_number_id: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          close_time?: string | null
          created_at?: string | null
          day_of_week: number
          id?: string
          is_open?: boolean | null
          open_time?: string | null
          tracking_number_id?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          close_time?: string | null
          created_at?: string | null
          day_of_week?: number
          id?: string
          is_open?: boolean | null
          open_time?: string | null
          tracking_number_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ctm_business_hours_tracking_number_id_fkey"
            columns: ["tracking_number_id"]
            isOneToOne: false
            referencedRelation: "ctm_tracking_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      ctm_call_analytics_cache: {
        Row: {
          answered_calls: number | null
          business_id: string
          cached_data: Json | null
          created_at: string | null
          id: string
          incoming_calls: number | null
          missed_call_percentage: number | null
          missed_calls: number | null
          outgoing_calls: number | null
          period_end: string
          period_start: string
          period_type: string
          total_calls: number | null
          total_duration_seconds: number | null
          updated_at: string | null
          voicemail_calls: number | null
        }
        Insert: {
          answered_calls?: number | null
          business_id: string
          cached_data?: Json | null
          created_at?: string | null
          id?: string
          incoming_calls?: number | null
          missed_call_percentage?: number | null
          missed_calls?: number | null
          outgoing_calls?: number | null
          period_end: string
          period_start: string
          period_type: string
          total_calls?: number | null
          total_duration_seconds?: number | null
          updated_at?: string | null
          voicemail_calls?: number | null
        }
        Update: {
          answered_calls?: number | null
          business_id?: string
          cached_data?: Json | null
          created_at?: string | null
          id?: string
          incoming_calls?: number | null
          missed_call_percentage?: number | null
          missed_calls?: number | null
          outgoing_calls?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          total_calls?: number | null
          total_duration_seconds?: number | null
          updated_at?: string | null
          voicemail_calls?: number | null
        }
        Relationships: []
      }
      ctm_call_logs: {
        Row: {
          answered_at: string | null
          business_id: string
          call_notes: string | null
          call_status: string
          called_phone_number: string
          caller_location: Json | null
          caller_name: string | null
          caller_phone_number: string
          contact_id: string | null
          created_at: string | null
          direction: string
          duration_seconds: number | null
          ended_at: string | null
          has_voicemail: boolean | null
          id: string
          is_contact_created: boolean | null
          provider_call_id: string | null
          provider_call_sid: string | null
          provider_id: string | null
          provider_metadata: Json | null
          recording_duration_seconds: number | null
          recording_enabled: boolean | null
          recording_url: string | null
          started_at: string
          tags: string[] | null
          tracking_number_id: string | null
          updated_at: string | null
          voicemail_id: string | null
        }
        Insert: {
          answered_at?: string | null
          business_id: string
          call_notes?: string | null
          call_status: string
          called_phone_number: string
          caller_location?: Json | null
          caller_name?: string | null
          caller_phone_number: string
          contact_id?: string | null
          created_at?: string | null
          direction: string
          duration_seconds?: number | null
          ended_at?: string | null
          has_voicemail?: boolean | null
          id?: string
          is_contact_created?: boolean | null
          provider_call_id?: string | null
          provider_call_sid?: string | null
          provider_id?: string | null
          provider_metadata?: Json | null
          recording_duration_seconds?: number | null
          recording_enabled?: boolean | null
          recording_url?: string | null
          started_at: string
          tags?: string[] | null
          tracking_number_id?: string | null
          updated_at?: string | null
          voicemail_id?: string | null
        }
        Update: {
          answered_at?: string | null
          business_id?: string
          call_notes?: string | null
          call_status?: string
          called_phone_number?: string
          caller_location?: Json | null
          caller_name?: string | null
          caller_phone_number?: string
          contact_id?: string | null
          created_at?: string | null
          direction?: string
          duration_seconds?: number | null
          ended_at?: string | null
          has_voicemail?: boolean | null
          id?: string
          is_contact_created?: boolean | null
          provider_call_id?: string | null
          provider_call_sid?: string | null
          provider_id?: string | null
          provider_metadata?: Json | null
          recording_duration_seconds?: number | null
          recording_enabled?: boolean | null
          recording_url?: string | null
          started_at?: string
          tags?: string[] | null
          tracking_number_id?: string | null
          updated_at?: string | null
          voicemail_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ctm_call_logs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ctm_call_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ctm_call_logs_tracking_number_id_fkey"
            columns: ["tracking_number_id"]
            isOneToOne: false
            referencedRelation: "ctm_tracking_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      ctm_call_providers: {
        Row: {
          api_documentation_url: string | null
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          supported_features: Json | null
          updated_at: string | null
        }
        Insert: {
          api_documentation_url?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          supported_features?: Json | null
          updated_at?: string | null
        }
        Update: {
          api_documentation_url?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          supported_features?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ctm_call_recordings: {
        Row: {
          business_id: string
          call_log_id: string
          created_at: string | null
          duration_seconds: number
          file_format: string | null
          file_size_bytes: number | null
          id: string
          is_processed: boolean | null
          processed_at: string | null
          processing_error: string | null
          provider_metadata: Json | null
          recording_sid: string | null
          recording_url: string
          transcription_text: string | null
          transcription_url: string | null
        }
        Insert: {
          business_id: string
          call_log_id: string
          created_at?: string | null
          duration_seconds: number
          file_format?: string | null
          file_size_bytes?: number | null
          id?: string
          is_processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          provider_metadata?: Json | null
          recording_sid?: string | null
          recording_url: string
          transcription_text?: string | null
          transcription_url?: string | null
        }
        Update: {
          business_id?: string
          call_log_id?: string
          created_at?: string | null
          duration_seconds?: number
          file_format?: string | null
          file_size_bytes?: number | null
          id?: string
          is_processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          provider_metadata?: Json | null
          recording_sid?: string | null
          recording_url?: string
          transcription_text?: string | null
          transcription_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ctm_call_recordings_call_log_id_fkey"
            columns: ["call_log_id"]
            isOneToOne: false
            referencedRelation: "ctm_call_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      ctm_call_routing_rules: {
        Row: {
          after_hours_action: string | null
          after_hours_message: string | null
          business_hours_config: Json | null
          business_id: string
          created_at: string | null
          forward_mode: string | null
          forward_to_app: boolean | null
          forward_to_owner_phone: string | null
          id: string
          recording_consent_message: string | null
          recording_enabled: boolean | null
          timezone: string | null
          tracking_number_id: string
          updated_at: string | null
        }
        Insert: {
          after_hours_action?: string | null
          after_hours_message?: string | null
          business_hours_config?: Json | null
          business_id: string
          created_at?: string | null
          forward_mode?: string | null
          forward_to_app?: boolean | null
          forward_to_owner_phone?: string | null
          id?: string
          recording_consent_message?: string | null
          recording_enabled?: boolean | null
          timezone?: string | null
          tracking_number_id: string
          updated_at?: string | null
        }
        Update: {
          after_hours_action?: string | null
          after_hours_message?: string | null
          business_hours_config?: Json | null
          business_id?: string
          created_at?: string | null
          forward_mode?: string | null
          forward_to_app?: boolean | null
          forward_to_owner_phone?: string | null
          id?: string
          recording_consent_message?: string | null
          recording_enabled?: boolean | null
          timezone?: string | null
          tracking_number_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ctm_call_routing_rules_tracking_number_id_fkey"
            columns: ["tracking_number_id"]
            isOneToOne: true
            referencedRelation: "ctm_tracking_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      ctm_contacts: {
        Row: {
          business_id: string
          company: string | null
          created_at: string | null
          custom_fields: Json | null
          email: string | null
          first_call_id: string | null
          id: string
          is_auto_created: boolean | null
          last_contacted_at: string | null
          name: string | null
          notes: string | null
          phone_number: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          company?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          first_call_id?: string | null
          id?: string
          is_auto_created?: boolean | null
          last_contacted_at?: string | null
          name?: string | null
          notes?: string | null
          phone_number: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          company?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          first_call_id?: string | null
          id?: string
          is_auto_created?: boolean | null
          last_contacted_at?: string | null
          name?: string | null
          notes?: string | null
          phone_number?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ctm_tracking_numbers: {
        Row: {
          business_id: string
          capabilities: Json | null
          country_code: string | null
          created_at: string | null
          friendly_name: string | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          phone_number: string
          phone_number_sid: string | null
          provider_config_id: string
          provider_id: string
          region: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          capabilities?: Json | null
          country_code?: string | null
          created_at?: string | null
          friendly_name?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          phone_number: string
          phone_number_sid?: string | null
          provider_config_id: string
          provider_id: string
          region?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          capabilities?: Json | null
          country_code?: string | null
          created_at?: string | null
          friendly_name?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          phone_number?: string
          phone_number_sid?: string | null
          provider_config_id?: string
          provider_id?: string
          region?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ctm_tracking_numbers_provider_config_id_fkey"
            columns: ["provider_config_id"]
            isOneToOne: false
            referencedRelation: "ctm_business_call_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ctm_tracking_numbers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ctm_call_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      ctm_voicemails: {
        Row: {
          business_id: string
          call_log_id: string
          contact_id: string | null
          created_at: string | null
          duration_seconds: number
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          provider_metadata: Json | null
          provider_voicemail_id: string | null
          read_at: string | null
          recording_url: string
          transcription: string | null
        }
        Insert: {
          business_id: string
          call_log_id: string
          contact_id?: string | null
          created_at?: string | null
          duration_seconds: number
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          provider_metadata?: Json | null
          provider_voicemail_id?: string | null
          read_at?: string | null
          recording_url: string
          transcription?: string | null
        }
        Update: {
          business_id?: string
          call_log_id?: string
          contact_id?: string | null
          created_at?: string | null
          duration_seconds?: number
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          provider_metadata?: Json | null
          provider_voicemail_id?: string | null
          read_at?: string | null
          recording_url?: string
          transcription?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ctm_voicemails_call_log_id_fkey"
            columns: ["call_log_id"]
            isOneToOne: true
            referencedRelation: "ctm_call_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ctm_voicemails_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "ctm_contacts"
            referencedColumns: ["id"]
          },
        ]
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
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          external_user_id?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          external_user_id?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
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
      can_ab_bot_send_message: { Args: { p_bot_id: string }; Returns: boolean }
      can_create_ab_bot: { Args: { p_user_id: string }; Returns: boolean }
      can_customize_ab_appearance: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      can_remove_ab_branding: { Args: { p_user_id: string }; Returns: boolean }
      get_ab_usage_stats: {
        Args: { p_user_id: string }
        Returns: {
          total_bots: number
          total_messages_this_month: number
          total_team_members: number
          total_training_chars: number
          total_workspaces: number
        }[]
      }
      get_ab_workspace_role: {
        Args: { _workspace_id: string }
        Returns: Database["public"]["Enums"]["ab_workspace_role"]
      }
      get_user_ab_plan: {
        Args: { p_user_id: string }
        Returns: {
          allowed_integrations: string[]
          can_customize_appearance: boolean
          can_remove_branding: boolean
          max_bots: number
          max_messages_monthly: number
          max_team_members: number
          max_training_chars_per_bot: number
          max_workspaces: number
          plan_id: string
          plan_name: string
          plan_type: string
          quantity: number
          subscription_status: string
        }[]
      }
      has_ab_workspace_access: {
        Args: { _workspace_id: string }
        Returns: boolean
      }
      has_ab_workspace_role: {
        Args: {
          _min_role: Database["public"]["Enums"]["ab_workspace_role"]
          _workspace_id: string
        }
        Returns: boolean
      }
      has_bot_access: { Args: { _bot_id: string }; Returns: boolean }
      has_crh_profile_access: {
        Args: { _profile_id: string }
        Returns: boolean
      }
      has_ctm_business_access: {
        Args: { _business_id: string }
        Returns: boolean
      }
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
      ab_workspace_role: "owner" | "admin" | "editor" | "viewer"
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
      ab_workspace_role: ["owner", "admin", "editor", "viewer"],
    },
  },
} as const
