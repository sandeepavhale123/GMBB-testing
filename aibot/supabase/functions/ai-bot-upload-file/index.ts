import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const ALLOWED_TYPES = [
  'text/plain',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

serve(async (req) => {
  console.log('[ai-bot-upload-file] Function invoked, method:', req.method);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('[ai-bot-upload-file] Parsing form data...');
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const botId = formData.get('bot_id') as string;
    const projectId = formData.get('project_id') as string;
    
    console.log('[ai-bot-upload-file] Received - file:', file?.name, 'botId:', botId, 'projectId:', projectId);
    
    if (!file || !botId) {
      console.log('[ai-bot-upload-file] Missing file or bot_id');
      return new Response(JSON.stringify({ error: 'Missing file or bot_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log(`[ai-bot-upload-file] Uploading file: ${file.name}, type: ${file.type}, size: ${file.size}`);
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.txt')) {
      return new Response(JSON.stringify({ 
        error: 'Invalid file type. Allowed: PDF, TXT, DOC, DOCX' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ 
        error: 'File too large. Maximum size is 10MB' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Generate unique file path
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${botId}/${timestamp}_${sanitizedName}`;
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('knowledge-files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Failed to upload file' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Create knowledge source record
    const { data: source, error: sourceError } = await supabase
      .from('ab_knowledge_sources')
      .insert({
        bot_id: botId,
        source_type: 'file',
        title: file.name,
        file_name: file.name,
        file_url: filePath,
        status: 'pending',
        char_count: 0,
        metadata: {
          file_type: file.type,
          file_size: file.size,
        },
      })
      .select()
      .single();
    
    if (sourceError) {
      console.error('Source creation error:', sourceError);
      // Clean up uploaded file
      await supabase.storage.from('knowledge-files').remove([filePath]);
      return new Response(JSON.stringify({ error: 'Failed to create knowledge source' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // For text files, process immediately
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const content = await file.text();
      
      console.log('[ai-bot-upload-file] Processing text file content, length:', content.length);
      
      // Direct HTTP call to process-knowledge function (more reliable than supabase.functions.invoke from edge function)
      try {
        const processResponse = await fetch(`${SUPABASE_URL}/functions/v1/ai-bot-process-knowledge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            knowledge_source_id: source.id,
            bot_id: botId,
            source_type: 'file',
            content,
          }),
        });

        if (!processResponse.ok) {
          const errorText = await processResponse.text();
          console.error('[ai-bot-upload-file] Process error response:', processResponse.status, errorText);
        } else {
          const processData = await processResponse.json();
          console.log('[ai-bot-upload-file] Processing successful:', processData);
        }
      } catch (processError) {
        console.error('[ai-bot-upload-file] Process fetch error:', processError);
        // Don't fail the upload, processing can be retried
      }
    } else {
      // For non-text files, mark as pending for manual processing
      // PDF/DOC parsing would require additional libraries
      await supabase
        .from('ab_knowledge_sources')
        .update({ 
          status: 'pending',
          error_message: 'PDF/DOC parsing not yet implemented. Please use TXT files.',
        })
        .eq('id', source.id);
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      source_id: source.id,
      file_path: filePath,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
