import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getEncoding } from "https://esm.sh/js-tiktoken@1.0.12";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const API_KEY_ENCRYPTION_SECRET = Deno.env.get('API_KEY_ENCRYPTION_SECRET') || 'default-dev-key-32-chars-long!!';

// Simple XOR-based decryption (matches encryption in frontend)
function decryptApiKey(encrypted: string): string {
  try {
    const decoded = atob(encrypted);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ API_KEY_ENCRYPTION_SECRET.charCodeAt(i % API_KEY_ENCRYPTION_SECRET.length)
      );
    }
    return result;
  } catch (e) {
    console.error('Failed to decrypt API key:', e);
    return '';
  }
}

// Initialize encoder for text-embedding-3-small (uses cl100k_base)
const encoder = getEncoding("cl100k_base");

interface ProcessRequest {
  knowledge_source_id: string;
  bot_id: string;
  source_type: 'file' | 'company_info' | 'qa';
  content?: string;
}

interface ChunkOptions {
  targetTokens?: number;    // Default 800 (sweet spot for retrieval)
  maxTokens?: number;       // Default 1000 (hard cap)
  minTokens?: number;       // Default 100 (avoid tiny chunks)
  overlapTokens?: number;   // Default 100 (10-12.5% of target)
}

// Get token count for a text string
function getTokenCount(text: string): number {
  return encoder.encode(text).length;
}

// Detect markdown tables
function containsMarkdownTable(text: string): boolean {
  return /\|[^\n]+\|\n\|[-:\s|]+\|/m.test(text);
}

// Extract tables and return text without tables + extracted tables
function extractTables(text: string): { tables: { table: string; nearestHeading: string | null }[], textWithoutTables: string } {
  const tablePattern = /(\|[^\n]+\|\n(?:\|[-:\s|]+\|\n)?(?:\|[^\n]+\|\n?)+)/gm;
  const tables: { table: string; nearestHeading: string | null }[] = [];
  
  // Find all headers before each table
  let lastIndex = 0;
  const textWithoutTables = text.replace(tablePattern, (match, _p1, offset) => {
    // Look for nearest heading before this table
    const textBefore = text.slice(lastIndex, offset);
    const headingMatch = textBefore.match(/(?:^|\n)(#{1,3}\s+[^\n]+)(?:\n|$)(?!.*#{1,3}\s)/);
    const nearestHeading = headingMatch ? headingMatch[1].trim() : null;
    
    tables.push({ table: match, nearestHeading });
    lastIndex = offset + match.length;
    return '\n[TABLE_PLACEHOLDER_' + (tables.length - 1) + ']\n';
  });
  
  return { tables, textWithoutTables };
}

// Convert table to natural language (row-wise)
function normalizeTableToText(table: string, nearestHeading: string | null): string {
  const rows = table.trim().split('\n').filter(row => row.includes('|'));
  if (rows.length < 2) return table;
  
  // Parse header row
  const headers = rows[0].split('|').map(h => h.trim()).filter(Boolean);
  
  // Skip separator row (|---|---|)
  const dataStartIndex = rows[1]?.match(/^[\s|:-]+$/) ? 2 : 1;
  const dataRows = rows.slice(dataStartIndex);
  
  let result = nearestHeading ? `${nearestHeading}\n\n` : '';
  
  for (const row of dataRows) {
    const cells = row.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length === 0) continue;
    
    // Convert to natural language
    const parts = headers.map((header, idx) => {
      const value = cells[idx] || '';
      return value ? `${header}: ${value}` : null;
    }).filter(Boolean);
    
    if (parts.length > 0) {
      result += parts.join(', ') + '.\n';
    }
  }
  
  return result.trim();
}

// Detect and split Q&A pairs as atomic units
function detectAndSplitQA(text: string, maxTokens: number): string[] {
  // Look for Q: A: or **Question:** patterns
  const qaPattern = /(?:^|\n)(Q:|Question:|FAQ:|\*\*Q[:\s])/i;
  
  if (!qaPattern.test(text) || getTokenCount(text) <= maxTokens) {
    return [text];
  }
  
  // Split by Q&A pairs, keeping each as atomic unit
  const pairs = text.split(/(?=(?:^|\n)(?:Q:|Question:|\*\*Q))/i);
  return pairs.filter(p => p.trim()).map(p => p.trim());
}

// Apply overlap between consecutive chunks
function applyOverlap(chunks: string[], overlapTokens: number): string[] {
  if (chunks.length <= 1 || overlapTokens <= 0) return chunks;
  
  const overlappedChunks: string[] = [];
  
  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];
    
    // For chunks after the first, prepend overlap from previous chunk
    if (i > 0) {
      const prevChunk = chunks[i - 1];
      const prevSentences = prevChunk.split(/(?<=[.!?])\s+/);
      
      // Get sentences from end of previous chunk that fit within overlap budget
      let overlapText = '';
      let overlapTokenCount = 0;
      
      for (let j = prevSentences.length - 1; j >= 0; j--) {
        const sentence = prevSentences[j];
        const sentenceTokens = getTokenCount(sentence);
        
        if (overlapTokenCount + sentenceTokens <= overlapTokens) {
          overlapText = sentence + (overlapText ? ' ' + overlapText : '');
          overlapTokenCount += sentenceTokens;
        } else {
          break;
        }
      }
      
      if (overlapText.trim()) {
        chunk = `[...] ${overlapText.trim()}\n\n${chunk}`;
      }
    }
    
    overlappedChunks.push(chunk);
  }
  
  return overlappedChunks;
}

// Semantic-aware text chunking with header context preservation
function chunkText(text: string, options: ChunkOptions = {}): string[] {
  const { 
    targetTokens = 800, 
    maxTokens = 1000, 
    minTokens = 30,  // Lowered from 100 to preserve small but important sections
    overlapTokens = 100 
  } = options;
  
  const chunks: string[] = [];
  const tableChunks: string[] = [];
  
  // Extract page title (first # header)
  const pageTitleMatch = text.match(/^#\s+([^\n]+)/m);
  const pageTitle = pageTitleMatch ? pageTitleMatch[1].trim() : null;
  
  // Step 1: Extract and normalize markdown tables
  let processedText = text;
  if (containsMarkdownTable(text)) {
    const { tables, textWithoutTables } = extractTables(text);
    processedText = textWithoutTables;
    
    // Normalize each table and add as separate chunk
    for (const { table, nearestHeading } of tables) {
      const normalizedTable = normalizeTableToText(table, nearestHeading);
      if (normalizedTable.trim()) {
        // Add page title context if available
        const tableChunk = pageTitle 
          ? `# ${pageTitle}\n\n${normalizedTable}` 
          : normalizedTable;
        tableChunks.push(tableChunk);
      }
    }
    
    console.log(`Extracted ${tables.length} markdown tables`);
  }
  
  // Step 2: Split by major headers (## or ###)
  const sections = processedText.split(/(?=^#{2,3}\s)/m);
  
  // Track small sections to merge them instead of discarding
  let pendingSmallContent = '';
  let pendingSmallTokens = 0;
  
  for (const section of sections) {
    if (!section.trim()) continue;
    // Skip table placeholders
    if (/^\[TABLE_PLACEHOLDER_\d+\]$/.test(section.trim())) continue;
    
    // Extract section header if present
    const headerMatch = section.match(/^(#{2,3}\s+[^\n]+)\n?/);
    const sectionTitle = headerMatch ? headerMatch[1].trim() : null;
    const content = headerMatch ? section.slice(headerMatch[0].length) : section;
    
    // Build context prefix (page title + section title)
    let contextPrefix = '';
    if (pageTitle) contextPrefix += `# ${pageTitle}\n`;
    if (sectionTitle) contextPrefix += `${sectionTitle}\n\n`;
    
    const sectionTokens = getTokenCount(section);
    
    // Step 3: If section is small enough, keep it whole with context
    if (sectionTokens <= maxTokens) {
      const fullChunk = contextPrefix + content.trim();
      const chunkTokens = getTokenCount(fullChunk);
      
      // If chunk meets minimum, add it (possibly with pending small content)
      if (chunkTokens >= minTokens) {
        // First, flush any pending small content
        if (pendingSmallContent) {
          const combinedWithPending = pendingSmallContent + '\n\n' + fullChunk;
          if (getTokenCount(combinedWithPending) <= maxTokens) {
            chunks.push(combinedWithPending);
            pendingSmallContent = '';
            pendingSmallTokens = 0;
          } else {
            // Pending content + new chunk too big, add pending as-is (even if small)
            chunks.push(pendingSmallContent);
            chunks.push(fullChunk);
            pendingSmallContent = '';
            pendingSmallTokens = 0;
          }
        } else {
          chunks.push(fullChunk);
        }
      } else {
        // Small section - accumulate instead of discarding
        if (pendingSmallContent) {
          pendingSmallContent += '\n\n' + fullChunk;
          pendingSmallTokens += chunkTokens;
        } else {
          pendingSmallContent = fullChunk;
          pendingSmallTokens = chunkTokens;
        }
        
        // If accumulated small content reaches minTokens, flush it
        if (pendingSmallTokens >= minTokens) {
          chunks.push(pendingSmallContent);
          pendingSmallContent = '';
          pendingSmallTokens = 0;
        }
        
        console.log(`Accumulated small section (${chunkTokens} tokens): "${fullChunk.substring(0, 50)}..."`);
      }
      continue;
    }
    
    // Step 4: Split large sections by paragraphs
    // First flush any pending small content
    if (pendingSmallContent) {
      chunks.push(pendingSmallContent);
      pendingSmallContent = '';
      pendingSmallTokens = 0;
    }
    
    const paragraphs = content.split(/\n\n+/);
    let currentChunk = contextPrefix;
    let currentTokens = getTokenCount(contextPrefix);
    
    for (const para of paragraphs) {
      if (!para.trim()) continue;
      // Skip table placeholders in paragraph
      if (/\[TABLE_PLACEHOLDER_\d+\]/.test(para)) continue;
      
      const paraTokens = getTokenCount(para);
      
      // If adding this paragraph would exceed target, save current and start new
      if (currentTokens + paraTokens > targetTokens && currentTokens >= minTokens) {
        chunks.push(currentChunk.trim());
        // Start new chunk with context prefix
        currentChunk = contextPrefix + para + '\n\n';
        currentTokens = getTokenCount(currentChunk);
      } else {
        currentChunk += para + '\n\n';
        currentTokens += paraTokens + 2; // +2 for newlines (approx)
      }
    }
    
    // Don't forget the last chunk
    if (currentChunk.trim() && currentChunk.trim() !== contextPrefix.trim()) {
      if (getTokenCount(currentChunk) >= minTokens) {
        chunks.push(currentChunk.trim());
      } else if (chunks.length > 0) {
        // Append small remaining content to previous chunk if possible
        const lastChunk = chunks[chunks.length - 1];
        const combined = lastChunk + '\n\n' + currentChunk.trim();
        if (getTokenCount(combined) <= maxTokens * 1.2) {
          chunks[chunks.length - 1] = combined;
        } else {
          // Still add it even if small - don't lose content
          chunks.push(currentChunk.trim());
        }
      } else {
        // No previous chunks, add anyway to avoid losing content
        chunks.push(currentChunk.trim());
      }
    }
  }
  
  // Step 5: Flush any remaining pending small content (ALWAYS keep it)
  if (pendingSmallContent) {
    console.log(`Flushing remaining small content (${pendingSmallTokens} tokens)`);
    if (chunks.length > 0) {
      // Try to merge with last chunk
      const lastChunk = chunks[chunks.length - 1];
      const combined = lastChunk + '\n\n' + pendingSmallContent;
      if (getTokenCount(combined) <= maxTokens * 1.2) {
        chunks[chunks.length - 1] = combined;
      } else {
        chunks.push(pendingSmallContent);
      }
    } else {
      chunks.push(pendingSmallContent);
    }
  }
  
  // Step 6: Handle Q&A pairs specially - split any large chunks that contain Q&A
  const qaProcessedChunks = chunks.flatMap(chunk => detectAndSplitQA(chunk, maxTokens));
  
  // Step 7: Apply overlap between consecutive chunks
  const overlappedChunks = applyOverlap(qaProcessedChunks, overlapTokens);
  
  // Step 8: Combine with table chunks
  const finalChunks = [...overlappedChunks, ...tableChunks];
  
  console.log(`Token-based chunking: ${sections.length} sections -> ${finalChunks.length} chunks`);
  console.log(`Chunk token counts: ${finalChunks.map(c => getTokenCount(c)).join(', ')}`);
  
  return finalChunks.filter(chunk => chunk.length > 0);
}

// Generate embeddings using OpenAI with user's API key
async function generateEmbeddings(texts: string[], apiKey: string): Promise<number[][]> {
  if (!apiKey) {
    throw new Error('No API key provided for embeddings');
  }
  
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: texts,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${response.status} - Invalid API key or rate limit exceeded`);
  }
  
  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

serve(async (req) => {
  console.log('[ai-bot-process-knowledge] Function invoked, method:', req.method);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const body = await req.json();
    console.log('[ai-bot-process-knowledge] Received body:', JSON.stringify(body));
    
    const { knowledge_source_id, bot_id, source_type, content } = body as ProcessRequest;
    
    if (!knowledge_source_id || !bot_id) {
      console.error('[ai-bot-process-knowledge] Missing required fields:', { knowledge_source_id, bot_id });
      return new Response(JSON.stringify({ error: 'Missing knowledge_source_id or bot_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log(`[ai-bot-process-knowledge] Processing knowledge source: ${knowledge_source_id}, type: ${source_type}, bot: ${bot_id}`);
    console.log(`[ai-bot-process-knowledge] Content length: ${content?.length || 0}`);
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Fetch per-bot API key - REQUIRED (no fallback to global key)
    const { data: botApiKeys, error: apiKeyError } = await supabase
      .from('ab_bot_api_keys')
      .select('openai_key_encrypted, gemini_key_encrypted')
      .eq('bot_id', bot_id)
      .single();

    if (apiKeyError || !botApiKeys?.openai_key_encrypted) {
      console.error('[ai-bot-process-knowledge] No API key configured for bot:', bot_id);
      
      // Update source status to failed
      await supabase
        .from('ab_knowledge_sources')
        .update({ 
          status: 'failed',
          error_message: 'No API key configured. Please add your OpenAI API key in bot settings.'
        })
        .eq('id', knowledge_source_id);
        
      return new Response(JSON.stringify({ 
        error: 'No API key configured for this bot. Please add your OpenAI API key in bot settings.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Decrypt the per-bot API key
    const userApiKey = decryptApiKey(botApiKeys.openai_key_encrypted);
    if (!userApiKey) {
      console.error('[ai-bot-process-knowledge] Failed to decrypt API key for bot:', bot_id);
      
      await supabase
        .from('ab_knowledge_sources')
        .update({ 
          status: 'failed',
          error_message: 'Failed to decrypt API key. Please re-enter your API key in bot settings.'
        })
        .eq('id', knowledge_source_id);
        
      return new Response(JSON.stringify({ 
        error: 'Failed to decrypt API key. Please re-enter your API key.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[ai-bot-process-knowledge] Using per-bot API key for embeddings');
    
    // Update source status to processing
    const { error: updateError } = await supabase
      .from('ab_knowledge_sources')
      .update({ status: 'processing' })
      .eq('id', knowledge_source_id);
    
    if (updateError) {
      console.error('[ai-bot-process-knowledge] Failed to update status:', updateError);
    } else {
      console.log('[ai-bot-process-knowledge] Status updated to processing');
    }
    
    let textContent = content || '';
    
    // If content not provided, fetch from knowledge source
    if (!textContent && knowledge_source_id) {
      const { data: source, error: sourceError } = await supabase
        .from('ab_knowledge_sources')
        .select('*')
        .eq('id', knowledge_source_id)
        .single();
      
      if (sourceError || !source) {
        throw new Error(`Failed to fetch knowledge source: ${sourceError?.message}`);
      }
      
      // Handle different source types
      if (source.source_type === 'file' && source.file_url) {
        // Download file from storage
        const { data: fileData, error: fileError } = await supabase
          .storage
          .from('knowledge-files')
          .download(source.file_url);
        
        if (fileError) {
          throw new Error(`Failed to download file: ${fileError.message}`);
        }
        
        // For now, handle text files. PDF parsing would need additional library
        textContent = await fileData.text();
      } else if (source.content) {
        textContent = source.content;
      }
    }
    
    if (!textContent || textContent.trim().length === 0) {
      throw new Error('No content to process');
    }
    
    // Delete existing embeddings for this source
    await supabase
      .from('ab_knowledge_embeddings')
      .delete()
      .eq('knowledge_source_id', knowledge_source_id);
    
    // Chunk the content with new token-based settings
    const chunks = chunkText(textContent, {
      targetTokens: 800,
      maxTokens: 1000,
      minTokens: 30,  // Lowered to preserve small but critical sections like "About Us"
      overlapTokens: 100,
    });
    console.log(`Created ${chunks.length} chunks from content (token-based)`);
    
    if (chunks.length === 0) {
      throw new Error('No chunks created from content');
    }
    
    // Generate embeddings in batches of 20
    const batchSize = 20;
    const allEmbeddings: { chunk_index: number; chunk_text: string; embedding: number[] }[] = [];
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batchChunks = chunks.slice(i, i + batchSize);
      const embeddings = await generateEmbeddings(batchChunks, userApiKey);
      
      for (let j = 0; j < batchChunks.length; j++) {
        allEmbeddings.push({
          chunk_index: i + j,
          chunk_text: batchChunks[j],
          embedding: embeddings[j],
        });
      }
    }
    
    // Store embeddings in database
    const embeddingRecords = allEmbeddings.map(e => ({
      knowledge_source_id,
      bot_id,
      chunk_index: e.chunk_index,
      chunk_text: e.chunk_text,
      embedding: `[${e.embedding.join(',')}]`,
    }));
    
    const { error: insertError } = await supabase
      .from('ab_knowledge_embeddings')
      .insert(embeddingRecords);
    
    if (insertError) {
      console.error('Failed to insert embeddings:', insertError);
      throw new Error(`Failed to store embeddings: ${insertError.message}`);
    }
    
    // Update source status and char count
    const charCount = textContent.length;
    const tokenCount = getTokenCount(textContent);
    await supabase
      .from('ab_knowledge_sources')
      .update({ 
        status: 'completed',
        char_count: charCount,
      })
      .eq('id', knowledge_source_id);
    
    console.log(`Successfully processed ${chunks.length} chunks with ${charCount} characters (${tokenCount} tokens)`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      chunks_count: chunks.length,
      char_count: charCount,
      token_count: tokenCount,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error processing knowledge source:', error);
    
    // Try to update source status to failed
    try {
      const { knowledge_source_id } = await req.json();
      if (knowledge_source_id) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        await supabase
          .from('ab_knowledge_sources')
          .update({ 
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          })
          .eq('id', knowledge_source_id);
      }
    } catch {}
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
