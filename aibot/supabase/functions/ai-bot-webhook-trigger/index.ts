import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TriggerRequest {
  webhook_id?: string;
  bot_id?: string;
  event_type: string;
  payload: Record<string, unknown>;
}

// Generate HMAC-SHA256 signature
async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { webhook_id, bot_id, event_type, payload } = await req.json() as TriggerRequest;

    if (!event_type || !payload) {
      return new Response(JSON.stringify({ error: 'Missing event_type or payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Triggering webhooks for event: ${event_type}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch webhooks to trigger
    let query = supabase
      .from('ab_bot_webhooks')
      .select('*')
      .eq('is_active', true)
      .contains('events', [event_type]);

    if (webhook_id) {
      query = query.eq('id', webhook_id);
    } else if (bot_id) {
      query = query.eq('bot_id', bot_id);
    } else {
      return new Response(JSON.stringify({ error: 'Missing webhook_id or bot_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: webhooks, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching webhooks:', fetchError);
      throw fetchError;
    }

    if (!webhooks || webhooks.length === 0) {
      console.log('No active webhooks found for this event');
      return new Response(JSON.stringify({ success: true, triggered: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${webhooks.length} webhook(s) to trigger`);

    const results = await Promise.allSettled(
      webhooks.map(async (webhook) => {
        const payloadString = JSON.stringify(payload);
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event_type,
          'X-Webhook-Timestamp': new Date().toISOString(),
          ...(webhook.headers || {}),
        };

        // Add HMAC signature if secret key is configured
        if (webhook.secret_key) {
          const signature = await generateSignature(payloadString, webhook.secret_key);
          headers['X-Webhook-Signature'] = `sha256=${signature}`;
        }

        let responseStatus: number | null = null;
        let responseBody: string | null = null;
        let errorMessage: string | null = null;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

          const response = await fetch(webhook.url, {
            method: 'POST',
            headers,
            body: payloadString,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          responseStatus = response.status;
          responseBody = await response.text().catch(() => null);

          console.log(`Webhook ${webhook.id} delivered: ${responseStatus}`);
        } catch (err) {
          errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error(`Webhook ${webhook.id} failed:`, errorMessage);
        }

        // Log the delivery attempt
        await supabase.from('ab_bot_webhook_logs').insert({
          webhook_id: webhook.id,
          event_type,
          payload,
          response_status: responseStatus,
          response_body: responseBody?.substring(0, 5000), // Limit response body size
          error_message: errorMessage,
        });

        return { webhook_id: webhook.id, status: responseStatus, error: errorMessage };
      })
    );

    const successful = results.filter(
      r => r.status === 'fulfilled' && (r.value as { status: number | null }).status !== null && 
           (r.value as { status: number }).status >= 200 && 
           (r.value as { status: number }).status < 300
    ).length;

    return new Response(JSON.stringify({ 
      success: true, 
      triggered: webhooks.length,
      successful,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { error: 'Failed' }),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error triggering webhooks:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
