import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface RetrainRequest {
  bot_id: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { bot_id } = await req.json() as RetrainRequest;
    
    if (!bot_id) {
      return new Response(JSON.stringify({ error: 'Missing bot_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log(`Retraining bot: ${bot_id}`);
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Verify bot exists
    const { data: bot, error: botError } = await supabase
      .from('ab_bots')
      .select('id')
      .eq('id', bot_id)
      .single();
    
    if (botError || !bot) {
      return new Response(JSON.stringify({ error: 'Bot not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Delete all existing embeddings for this bot
    const { error: deleteError } = await supabase
      .from('ab_knowledge_embeddings')
      .delete()
      .eq('bot_id', bot_id);
    
    if (deleteError) {
      console.error('Failed to delete embeddings:', deleteError);
      throw new Error('Failed to delete existing embeddings');
    }
    
    console.log('Deleted existing embeddings');
    
    // Fetch all knowledge sources for this bot
    const { data: sources, error: sourcesError } = await supabase
      .from('ab_knowledge_sources')
      .select('*')
      .eq('bot_id', bot_id);
    
    if (sourcesError) {
      throw new Error('Failed to fetch knowledge sources');
    }
    
    if (!sources || sources.length === 0) {
      return new Response(JSON.stringify({ 
        success: true,
        message: 'No knowledge sources to process',
        processed_count: 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log(`Found ${sources.length} knowledge sources to process`);
    
    // Process each source
    let processedCount = 0;
    let errorCount = 0;
    
    for (const source of sources) {
      try {
        // Update source status to processing
        await supabase
          .from('ab_knowledge_sources')
          .update({ status: 'processing' })
          .eq('id', source.id);
        
        // Call the process function
        const processResponse = await fetch(`${SUPABASE_URL}/functions/v1/ai-bot-process-knowledge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            knowledge_source_id: source.id,
            bot_id,
            source_type: source.source_type,
            content: source.content,
          }),
        });
        
        if (processResponse.ok) {
          processedCount++;
          console.log(`Processed source: ${source.id}`);
        } else {
          const errorText = await processResponse.text();
          console.error(`Failed to process source ${source.id}:`, errorText);
          errorCount++;
          
          await supabase
            .from('ab_knowledge_sources')
            .update({ 
              status: 'failed',
              error_message: 'Failed during retraining',
            })
            .eq('id', source.id);
        }
      } catch (error) {
        console.error(`Error processing source ${source.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Retraining complete. Processed: ${processedCount}, Errors: ${errorCount}`);
    
    return new Response(JSON.stringify({ 
      success: true,
      processed_count: processedCount,
      error_count: errorCount,
      total_sources: sources.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error retraining bot:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
