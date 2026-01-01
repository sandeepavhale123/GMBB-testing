import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GLOBAL_OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// Anti-hallucination prompt to enforce context-only answers
const ANTI_HALLUCINATION_PROMPT = `

CRITICAL RULES - You MUST follow these strictly:
1. ONLY answer using information from the provided context
2. If the context does not contain relevant information, respond with: "I don't have that information in my knowledge base."
3. NEVER guess or make up information about prices, hours, policies, locations, or any factual data
4. NEVER provide information not explicitly stated in the context
5. If unsure, suggest the user contact the business directly
6. Be concise and accurate - do not elaborate beyond what the context provides
7. Do not invent product names, service offerings, or contact details`;

interface ChatRequest {
  bot_id: string;
  message: string;
  session_id?: string;
  lead_id?: string;
  conversation_history?: { role: 'user' | 'assistant'; content: string }[];
}

interface CalendarSettings {
  enabled: boolean;
  booking_link: string | null;
  trigger_keywords: string[];
  booking_instruction: string | null;
}

interface BotConfig {
  id: string;
  project_id: string;
  system_prompt: string | null;
  user_message_template: string | null;
  model_provider: string;
  model_name: string;
  temperature: number | null;
  max_tokens: number | null;
  fallback_message: string | null;
  is_public: boolean;
  allowed_domains: string[];
  embed_settings: Record<string, unknown>;
  // Phase 2: Retrieval tuning settings
  similarity_threshold: number | null;
  retrieval_count: number | null;
}

// Simple XOR-based encryption for API keys (basic obfuscation)
const ENCRYPTION_KEY = Deno.env.get('JWT_SECRET_KEY') || 'default-key';

function decryptApiKey(encrypted: string | null): string | null {
  if (!encrypted) return null;
  try {
    // Base64 decode then XOR with key
    const decoded = atob(encrypted);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    return result;
  } catch {
    return null;
  }
}

// Validate origin against allowed domains
function validateOrigin(origin: string | null, allowedDomains: string[]): boolean {
  // If no domains specified, allow all (for backward compatibility)
  if (!allowedDomains || allowedDomains.length === 0) {
    return true;
  }
  
  if (!origin) {
    return false;
  }
  
  try {
    const originHost = new URL(origin).hostname;
    
    // ALWAYS allow Lovable development/preview domains for testing
    const lovableDomains = [
      'lovableproject.com',
      'lovable.dev',
      'lovable.app',
      'localhost'
    ];
    
    const isLovableDomain = lovableDomains.some(domain => 
      originHost === domain || originHost.endsWith(`.${domain}`)
    );
    
    if (isLovableDomain) {
      console.log(`Lovable development domain allowed: ${originHost}`);
      return true;
    }
    
    // Check against user-configured allowed domains
    return allowedDomains.some(domain => {
      // Exact match or subdomain match
      return originHost === domain || originHost.endsWith(`.${domain}`);
    });
  } catch {
    return false;
  }
}

// Generate embedding for query
async function generateQueryEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI Embeddings API error:', error);
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.data[0].embedding;
}

// Check if message contains any of the trigger keywords
function checkCalendarKeywords(message: string, keywords: string[]): string | null {
  if (!keywords || keywords.length === 0) return null;
  
  const lowerMessage = message.toLowerCase();
  for (const keyword of keywords) {
    if (keyword && lowerMessage.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }
  return null;
}

// Detect if message is a simple greeting/small-talk
const GREETING_PATTERNS = [
  /^(hi|hello|hey|hiya|howdy|greetings|good\s*(morning|afternoon|evening|day))[\s!?.]*$/i,
  /^(what'?s\s*up|sup|yo)[\s!?.]*$/i,
  /^(thanks|thank\s*you|ty|thx)[\s!?.]*$/i,
  /^(bye|goodbye|see\s*you|later|cya)[\s!?.]*$/i,
  /^(how\s*are\s*you|how'?s\s*it\s*going|how\s*do\s*you\s*do)[\s!?.]*$/i,
];

function isGreeting(message: string): boolean {
  const trimmed = message.trim();
  return GREETING_PATTERNS.some(pattern => pattern.test(trimmed));
}

// Generate a friendly greeting response using the LLM
async function generateGreetingResponse(
  systemPrompt: string,
  userMessage: string,
  openaiApiKey: string,
  model: string
): Promise<string> {
  const greetingSystemPrompt = `${systemPrompt}

The user is greeting you. Respond in a friendly, welcoming manner. Keep your response brief (1-2 sentences). 
Ask how you can help them today. Stay in character based on your system prompt.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: greetingSystemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate greeting response');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "Hello! How can I help you today?";
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
  const origin = req.headers.get('Origin') || req.headers.get('Referer');
  
  // Default CORS headers - will be updated based on origin validation
  let corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const startTime = Date.now();
    const { bot_id, message, session_id, lead_id, conversation_history = [] } = await req.json() as ChatRequest;
    
    // Generate or use provided session ID
    const currentSessionId = session_id || crypto.randomUUID();
    console.log(`Session ID: ${currentSessionId}`);
    
    // Detect if this is a new session (first message)
    const isNewSession = conversation_history.length === 0;
    
    if (!bot_id || !message) {
      return new Response(JSON.stringify({ error: 'Missing bot_id or message' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log(`Chat request for bot: ${bot_id}, message: ${message.substring(0, 50)}...`);
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Fire chat.started webhook for new sessions
    if (isNewSession) {
      console.log('New session detected - triggering chat.started webhook');
      triggerWebhooks(supabase, bot_id, 'chat.started', {
        session_id: currentSessionId,
        first_message: message,
        lead_id: lead_id || null,
      });
    }
    
    // Fetch bot configuration
    const { data: bot, error: botError } = await supabase
      .from('ab_bots')
      .select('*')
      .eq('id', bot_id)
      .single() as { data: BotConfig | null; error: unknown };
    
    if (botError || !bot) {
      return new Response(JSON.stringify({ error: 'Bot not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // SECURITY: Validate origin against allowed domains
    const isOriginAllowed = validateOrigin(origin, bot.allowed_domains || []);
    if (!isOriginAllowed) {
      console.warn(`Origin rejected: ${origin} not in allowed domains: ${bot.allowed_domains}`);
      return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Update CORS headers with validated origin
    if (origin && isOriginAllowed) {
      corsHeaders = {
        ...corsHeaders,
        'Access-Control-Allow-Origin': origin,
      };
    }
    
    // Fetch per-bot API keys
    const { data: apiKeys } = await supabase
      .from('ab_bot_api_keys')
      .select('*')
      .eq('bot_id', bot_id)
      .single();
    
    // Determine which API key to use (per-bot or global fallback)
    let openaiApiKey = GLOBAL_OPENAI_API_KEY;
    if (apiKeys?.openai_key_encrypted) {
      const decrypted = decryptApiKey(apiKeys.openai_key_encrypted);
      if (decrypted) {
        openaiApiKey = decrypted;
        console.log('Using per-bot OpenAI API key');
      }
    }
    
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ 
        error: 'No API key configured. Please add your OpenAI API key in bot settings.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Generate embedding for the user's message
    const queryEmbedding = await generateQueryEmbedding(message, openaiApiKey);
    
    // Phase 2: Get per-bot retrieval settings with defaults
    const DEFAULT_THRESHOLD = 0.30;
    const DEFAULT_RETRIEVAL_COUNT = 5;
    const minRelevance = bot.similarity_threshold ?? DEFAULT_THRESHOLD;
    const retrievalCount = bot.retrieval_count ?? DEFAULT_RETRIEVAL_COUNT;
    
    console.log(`Retrieval config - Threshold: ${minRelevance}, Top-K: ${retrievalCount}`);
    
    // Search for relevant knowledge chunks using similarity search
    const { data: chunks, error: searchError } = await supabase
      .rpc('match_knowledge_embeddings', {
        query_embedding: `[${queryEmbedding.join(',')}]`,
        match_bot_id: bot_id,
        match_threshold: 0.0, // Not used in DB anymore, kept for compatibility
        match_count: retrievalCount, // Now configurable per bot
      });
    
    if (searchError) {
      console.error('Search error:', searchError);
      // Continue without context if search fails
    }
    
    // Get bot configuration with defaults
    const temperature = bot.temperature ?? 0.3;
    const maxTokens = bot.max_tokens ?? 1024;
    const fallbackMessage = bot.fallback_message || 
      "I apologize, but I don't have specific information about that in my knowledge base. Please contact us directly for assistance.";
    
    // Calculate relevance metrics for debugging
    const topSimilarity = chunks && chunks.length > 0 
      ? Math.max(...chunks.map((c: { similarity: number }) => c.similarity)) 
      : 0;
    const chunkCount = chunks?.length || 0;
    const topChunkPreview = chunks && chunks.length > 0 
      ? chunks[0].chunk_text.substring(0, 100) + '...'
      : null;
    
    // Enhanced Phase 2 logging for retrieval analysis
    console.log(`Retrieval stats - Top similarity: ${topSimilarity.toFixed(3)}, Chunks found: ${chunkCount}`);
    if (chunks && chunks.length > 0) {
      console.log(`Chunk similarities: ${chunks.map((c: { similarity: number }) => c.similarity.toFixed(3)).join(', ')}`);
    }
    console.log(`Threshold check: ${topSimilarity >= minRelevance ? 'PASSED' : 'FAILED'} (min: ${minRelevance})`);
    if (topChunkPreview) {
      console.log(`Top chunk preview: ${topChunkPreview}`);
    }
    
    // GREETING HANDLING: Respond to greetings without requiring knowledge
    if (isGreeting(message)) {
      console.log('Greeting detected - generating friendly response');
      try {
        const greetingResponse = await generateGreetingResponse(
          bot.system_prompt || 'You are a helpful assistant.',
          message,
          openaiApiKey,
          bot.model_name || 'gpt-4o-mini'
        );
        
        const responseTime = Date.now() - startTime;
        
        // Log greeting (fire and forget)
        supabase
          .from('ab_chat_logs')
          .insert({
            bot_id,
            session_id: currentSessionId,
            user_message: message,
            bot_response: greetingResponse,
            chunks_retrieved: 0,
            top_similarity: topSimilarity,
            used_fallback: false,
            response_time_ms: responseTime,
          })
          .then(({ error }) => {
            if (error) console.error('Error logging greeting:', error);
          });
        
        // Fire chat.message webhook for greeting
        triggerWebhooks(supabase, bot_id, 'chat.message', {
          session_id: currentSessionId,
          user_message: message,
          bot_response: greetingResponse,
          is_fallback: false,
          is_greeting: true,
          lead_id: lead_id || null,
        });
        
        return new Response(JSON.stringify({
          response: greetingResponse,
          chunks_used: 0,
          is_greeting: true,
          session_id: currentSessionId,
          top_similarity: topSimilarity,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (greetingError) {
        console.error('Greeting response error:', greetingError);
        // Fall through to normal flow if greeting response fails
      }
    }

    // FALLBACK HANDLING: Only fallback if similarity is below per-bot threshold
    if (!chunks || chunks.length === 0 || topSimilarity < minRelevance) {
      console.log(`Low relevance (${topSimilarity.toFixed(3)} < ${minRelevance}) - returning fallback message`);
      
      const responseTime = Date.now() - startTime;
      
      // Log fallback (fire and forget)
      supabase
        .from('ab_chat_logs')
        .insert({
          bot_id,
          session_id: currentSessionId,
          user_message: message,
          bot_response: fallbackMessage,
          chunks_retrieved: chunkCount,
          top_similarity: topSimilarity,
          used_fallback: true,
          response_time_ms: responseTime,
        })
        .then(({ error }) => {
          if (error) console.error('Error logging fallback:', error);
        });
      
      // Fire chat.message webhook for fallback
      triggerWebhooks(supabase, bot_id, 'chat.message', {
        session_id: currentSessionId,
        user_message: message,
        bot_response: fallbackMessage,
        is_fallback: true,
        is_greeting: false,
        lead_id: lead_id || null,
      });
      
      return new Response(JSON.stringify({ 
        response: fallbackMessage,
        chunks_used: 0,
        is_fallback: true,
        session_id: currentSessionId,
        top_similarity: topSimilarity,
        similarity_threshold: minRelevance,
        retrieval_count: retrievalCount,
        chunk_count: chunkCount,
        top_chunk_preview: topChunkPreview,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Build context from retrieved chunks
    const context = chunks
      .map((chunk: { chunk_text: string; similarity: number }, index: number) => 
        `[${index + 1}] ${chunk.chunk_text}`
      )
      .join('\n\n');
    console.log(`Found ${chunks.length} relevant chunks`);
    
    // Build the user message using the template
    const userMessageTemplate = bot.user_message_template || 'Context:\n{context}\n\nUser Question:\n{question}';
    const formattedUserMessage = userMessageTemplate
      .replace('{context}', context)
      .replace('{question}', message);
    
    // Build messages array for OpenAI
    const messages: { role: string; content: string }[] = [];
    
    // Add system prompt with anti-hallucination rules
    const enhancedSystemPrompt = (bot.system_prompt || 'You are a helpful assistant.') + ANTI_HALLUCINATION_PROMPT;
    messages.push({ role: 'system', content: enhancedSystemPrompt });
    
    // Add conversation history
    for (const msg of conversation_history) {
      messages.push({ role: msg.role, content: msg.content });
    }
    
    // Add the current user message with context
    messages.push({ role: 'user', content: formattedUserMessage });
    
    // Determine model to use
    const model = bot.model_name || 'gpt-4o-mini';
    
    console.log(`Using model: ${model}, temperature: ${temperature}, max_tokens: ${maxTokens}`);
    
    // Call OpenAI Chat API (non-streaming) with bot-configured settings
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature: temperature,
      }),
    });
    
    if (!chatResponse.ok) {
      const error = await chatResponse.text();
      console.error('OpenAI Chat API error:', error);
      throw new Error(`OpenAI API error: ${chatResponse.status}`);
    }
    
    const chatData = await chatResponse.json();
    const assistantMessage = chatData.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    
    console.log('Response generated successfully');
    
    // Check for calendar keyword triggers
    let calendarTriggered = false;
    let bookingLink: string | null = null;
    let bookingInstruction: string | null = null;
    let triggeredKeyword: string | null = null;
    
    // Fetch calendar settings
    const { data: calendarSettings } = await supabase
      .from('ab_bot_calendar_settings')
      .select('*')
      .eq('bot_id', bot_id)
      .single() as { data: CalendarSettings | null; error: unknown };
    
    if (calendarSettings?.enabled && calendarSettings.booking_link) {
      triggeredKeyword = checkCalendarKeywords(message, calendarSettings.trigger_keywords || []);
      if (triggeredKeyword) {
        calendarTriggered = true;
        bookingLink = calendarSettings.booking_link;
        bookingInstruction = calendarSettings.booking_instruction || 
          'Would you like to schedule an appointment? Click the link below to book a time that works for you.';
        console.log(`Calendar triggered by keyword: ${triggeredKeyword}`);
        
        // Track appointment trigger (fire and forget)
        supabase
          .from('ab_bot_appointments')
          .insert({
            bot_id,
            session_id: currentSessionId,
            lead_id: lead_id || null,
            triggered_by_keyword: triggeredKeyword,
            booking_link_clicked: false,
          })
          .then(({ error }) => {
            if (error) console.error('Error tracking appointment:', error);
            else console.log('Appointment trigger tracked');
          });
        
        // Fire appointment.interest webhook
        triggerWebhooks(supabase, bot_id, 'appointment.interest', {
          session_id: currentSessionId,
          lead_id: lead_id || null,
          triggered_keyword: triggeredKeyword,
          booking_link: bookingLink,
        });
      }
    }
    
    // Build final response
    let finalResponse = assistantMessage;
    if (calendarTriggered && bookingInstruction && bookingLink) {
      finalResponse = `${assistantMessage}\n\n${bookingInstruction}`;
    }
    
    const responseTime = Date.now() - startTime;
    
    // Log successful response (fire and forget)
    supabase
      .from('ab_chat_logs')
      .insert({
        bot_id,
        session_id: currentSessionId,
        user_message: message,
        bot_response: finalResponse,
        chunks_retrieved: chunks?.length || 0,
        top_similarity: topSimilarity,
        used_fallback: false,
        response_time_ms: responseTime,
      })
      .then(({ error }) => {
        if (error) console.error('Error logging chat:', error);
      });
    
    // Fire chat.message webhook for normal response
    triggerWebhooks(supabase, bot_id, 'chat.message', {
      session_id: currentSessionId,
      user_message: message,
      bot_response: finalResponse,
      is_fallback: false,
      is_greeting: false,
      lead_id: lead_id || null,
      calendar_triggered: calendarTriggered,
    });
    
    return new Response(JSON.stringify({ 
      response: finalResponse,
      chunks_used: chunks?.length || 0,
      session_id: currentSessionId,
      calendar_triggered: calendarTriggered,
      booking_link: bookingLink,
      triggered_keyword: triggeredKeyword,
      // Debug fields for retrieval analysis
      top_similarity: topSimilarity,
      chunk_count: chunkCount,
      top_chunk_preview: topChunkPreview,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in chat:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
