import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TrackAppointmentRequest {
  bot_id: string;
  session_id: string;
  lead_id?: string;
  triggered_by_keyword?: string;
  booking_link_clicked?: boolean;
  metadata?: Record<string, unknown>;
}

// Webhook interface for type safety
interface Webhook {
  id: string;
  bot_id: string;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  secret_key: string | null;
  headers: Record<string, string> | null;
}

// Trigger webhooks for events
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function triggerWebhooks(
  supabase: any,
  botId: string,
  eventType: string,
  payload: Record<string, unknown>
): Promise<void> {
  try {
    // Find active webhooks for this bot that subscribe to this event
    const { data: webhooksData, error } = await supabase
      .from('ab_bot_webhooks')
      .select('*')
      .eq('bot_id', botId)
      .eq('is_active', true)
      .contains('events', [eventType]);

    if (error) {
      console.error('Error fetching webhooks:', error);
      return;
    }

    const webhooks = webhooksData as Webhook[] | null;

    if (!webhooks || webhooks.length === 0) {
      console.log(`No active webhooks for event: ${eventType}`);
      return;
    }

    console.log(`Triggering ${webhooks.length} webhook(s) for event: ${eventType}`);

    // Trigger each webhook
    for (const webhook of webhooks) {
      const webhookPayload = {
        event: eventType,
        timestamp: new Date().toISOString(),
        bot_id: botId,
        data: payload,
      };

      try {
        // Build headers
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(webhook.headers || {}),
        };

        // Add HMAC signature if secret key is configured
        if (webhook.secret_key) {
          const encoder = new TextEncoder();
          const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(webhook.secret_key),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
          );
          const signature = await crypto.subtle.sign(
            'HMAC',
            key,
            encoder.encode(JSON.stringify(webhookPayload))
          );
          headers['X-Webhook-Signature'] = btoa(String.fromCharCode(...new Uint8Array(signature)));
        }

        // Send webhook with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(webhook.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(webhookPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseBody = await response.text().catch(() => null);

        // Log the delivery
        await supabase.from('ab_bot_webhook_logs').insert({
          webhook_id: webhook.id,
          event_type: eventType,
          payload: webhookPayload,
          response_status: response.status,
          response_body: responseBody?.substring(0, 1000) || null,
          error_message: response.ok ? null : `HTTP ${response.status}`,
        });

        console.log(`Webhook ${webhook.name} delivered: ${response.status}`);
      } catch (webhookError) {
        console.error(`Webhook ${webhook.name} failed:`, webhookError);
        
        // Log the error
        await supabase.from('ab_bot_webhook_logs').insert({
          webhook_id: webhook.id,
          event_type: eventType,
          payload: { event: eventType, timestamp: new Date().toISOString(), bot_id: botId, data: payload },
          response_status: null,
          response_body: null,
          error_message: webhookError instanceof Error ? webhookError.message : 'Unknown error',
        });
      }
    }
  } catch (error) {
    console.error('Error in triggerWebhooks:', error);
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
      lead_id,
      triggered_by_keyword,
      booking_link_clicked = false,
      metadata = {}
    } = await req.json() as TrackAppointmentRequest;

    // Validate required fields
    if (!bot_id || !session_id) {
      return new Response(JSON.stringify({ error: 'Missing bot_id or session_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Tracking appointment for bot: ${bot_id}, session: ${session_id}, keyword: ${triggered_by_keyword}, link_clicked: ${booking_link_clicked}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify bot exists
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

    // Check if there's already an appointment record for this session
    const { data: existingAppointment } = await supabase
      .from('ab_bot_appointments')
      .select('id, booking_link_clicked')
      .eq('bot_id', bot_id)
      .eq('session_id', session_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let appointmentId: string;

    if (existingAppointment && booking_link_clicked) {
      // Update existing appointment to mark link as clicked
      const { data: updated, error: updateError } = await supabase
        .from('ab_bot_appointments')
        .update({
          booking_link_clicked: true,
          metadata: { ...metadata, clicked_at: new Date().toISOString() },
        })
        .eq('id', existingAppointment.id)
        .select('id')
        .single();

      if (updateError) {
        console.error('Error updating appointment:', updateError);
        throw updateError;
      }

      appointmentId = updated.id;
      console.log(`Updated appointment click: ${appointmentId}`);
      
      // Fire booking.link_clicked webhook
      triggerWebhooks(supabase, bot_id, 'booking.link_clicked', {
        appointment_id: appointmentId,
        session_id,
        lead_id: lead_id || null,
      });
    } else if (!existingAppointment || triggered_by_keyword) {
      // Insert new appointment record (for new trigger)
      const { data: newAppointment, error: insertError } = await supabase
        .from('ab_bot_appointments')
        .insert({
          bot_id,
          session_id,
          lead_id: lead_id || null,
          triggered_by_keyword,
          booking_link_clicked,
          metadata,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error inserting appointment:', insertError);
        throw insertError;
      }

      appointmentId = newAppointment.id;
      console.log(`Created new appointment: ${appointmentId}`);
      
      // If this is a new record with link already clicked, fire the webhook
      if (booking_link_clicked) {
        triggerWebhooks(supabase, bot_id, 'booking.link_clicked', {
          appointment_id: appointmentId,
          session_id,
          lead_id: lead_id || null,
        });
      }
    } else {
      appointmentId = existingAppointment.id;
    }

    return new Response(JSON.stringify({ 
      success: true,
      appointment_id: appointmentId,
      session_id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error tracking appointment:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
