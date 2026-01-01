import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface SaveLeadRequest {
  bot_id: string;
  session_id: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  conversation_snapshot?: { role: 'user' | 'assistant'; content: string }[];
  source_url?: string;
  metadata?: Record<string, unknown>;
}

// Async function to trigger webhooks (non-blocking)
async function triggerWebhooks(
  supabase: any,
  botId: string,
  eventType: string,
  payload: Record<string, unknown>
) {
  try {
    // Fetch active webhooks for this bot and event
    const { data: webhooks } = await supabase
      .from('ab_bot_webhooks')
      .select('id, url, secret_key, headers')
      .eq('bot_id', botId)
      .eq('is_active', true)
      .contains('events', [eventType]);

    if (!webhooks || webhooks.length === 0) return;

    console.log(`Triggering ${webhooks.length} webhook(s) for ${eventType}`);

    // Fire webhooks asynchronously (don't await)
    (webhooks as any[]).forEach(async (webhook: any) => {
      try {
        const payloadString = JSON.stringify(payload);
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Webhook-Event': eventType,
          'X-Webhook-Timestamp': new Date().toISOString(),
          ...(webhook.headers || {}),
        };

        // Generate HMAC signature if secret key exists
        if (webhook.secret_key) {
          const encoder = new TextEncoder();
          const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(webhook.secret_key),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
          );
          const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadString));
          const signatureHex = Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
          headers['X-Webhook-Signature'] = `sha256=${signatureHex}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(webhook.url, {
          method: 'POST',
          headers,
          body: payloadString,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Log the delivery
        await supabase.from('ab_bot_webhook_logs').insert({
          webhook_id: webhook.id,
          event_type: eventType,
          payload,
          response_status: response.status,
          response_body: (await response.text().catch(() => '')).substring(0, 5000),
        });

        console.log(`Webhook ${webhook.id} delivered: ${response.status}`);
      } catch (err) {
        console.error(`Webhook ${webhook.id} failed:`, err);
        await supabase.from('ab_bot_webhook_logs').insert({
          webhook_id: webhook.id,
          event_type: eventType,
          payload,
          error_message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    });
  } catch (err) {
    console.error('Error triggering webhooks:', err);
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      bot_id, 
      session_id, 
      name, 
      email, 
      phone, 
      message, 
      conversation_snapshot = [],
      source_url,
      metadata = {}
    } = await req.json() as SaveLeadRequest;

    // Validate required fields
    if (!bot_id || !session_id) {
      return new Response(JSON.stringify({ error: 'Missing bot_id or session_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Saving lead for bot: ${bot_id}, session: ${session_id}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify bot exists and is public (for anonymous access)
    const { data: bot, error: botError } = await supabase
      .from('ab_bots')
      .select('id, is_public')
      .eq('id', bot_id)
      .single();

    if (botError || !bot) {
      console.error('Bot not found:', botError);
      return new Response(JSON.stringify({ error: 'Bot not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch lead settings to validate required fields (use maybeSingle to handle missing settings)
    const { data: leadSettings, error: settingsError } = await supabase
      .from('ab_bot_lead_settings')
      .select('*')
      .eq('bot_id', bot_id)
      .maybeSingle();
    
    if (settingsError) {
      console.warn('Could not fetch lead settings:', settingsError);
    }

    if (leadSettings?.enabled) {
      // Validate required fields based on settings
      const errors: string[] = [];
      
      if (leadSettings.name_required && leadSettings.collect_name && !name) {
        errors.push('Name is required');
      }
      if (leadSettings.email_required && leadSettings.collect_email && !email) {
        errors.push('Email is required');
      }
      if (leadSettings.phone_required && leadSettings.collect_phone && !phone) {
        errors.push('Phone is required');
      }
      if (leadSettings.message_required && leadSettings.collect_message && !message) {
        errors.push('Message is required');
      }

      if (errors.length > 0) {
        return new Response(JSON.stringify({ error: errors.join(', ') }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Check if lead with same session already exists
    const { data: existingLead } = await supabase
      .from('ab_bot_leads')
      .select('id')
      .eq('bot_id', bot_id)
      .eq('session_id', session_id)
      .maybeSingle();

    let leadId: string;

    if (existingLead) {
      // Update existing lead
      const { data: updatedLead, error: updateError } = await supabase
        .from('ab_bot_leads')
        .update({
          name,
          email,
          phone,
          message,
          conversation_snapshot,
          source_url,
          metadata,
        })
        .eq('id', existingLead.id)
        .select('id')
        .single();

      if (updateError) {
        console.error('Error updating lead:', updateError);
        throw updateError;
      }

      leadId = updatedLead.id;
      console.log(`Updated existing lead: ${leadId}`);

      // Trigger lead.updated webhooks
      triggerWebhooks(supabase, bot_id, 'lead.updated', {
        event: 'lead.updated',
        timestamp: new Date().toISOString(),
        bot_id,
        data: { id: leadId, name, email, phone, message, source_url, updated_at: new Date().toISOString() },
      });
    } else {
      // Insert new lead
      const { data: newLead, error: insertError } = await supabase
        .from('ab_bot_leads')
        .insert({
          bot_id,
          session_id,
          name,
          email,
          phone,
          message,
          conversation_snapshot,
          source_url,
          metadata,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error inserting lead:', insertError);
        throw insertError;
      }

      leadId = newLead.id;
      console.log(`Created new lead: ${leadId}`);

      // Trigger lead.created webhooks
      triggerWebhooks(supabase, bot_id, 'lead.created', {
        event: 'lead.created',
        timestamp: new Date().toISOString(),
        bot_id,
        data: { id: leadId, name, email, phone, message, source_url, created_at: new Date().toISOString() },
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      lead_id: leadId,
      session_id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error saving lead:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
