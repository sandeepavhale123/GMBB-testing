import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// Type definitions for LLM options
interface OpenAIOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

interface PerplexityOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  searchDomainFilter?: string[];
  searchRecencyFilter?: "day" | "week" | "month" | "year";
}

interface GeminiOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

// Detect if brand name or domain appears in LLM response
function detectMentions(
  responseText: string,
  citations: string[],
  brandName: string | null,
  domain: string | null,
): { brandMentioned: boolean; domainMentioned: boolean } {
  const textLower = responseText.toLowerCase();

  let brandMentioned = false;
  if (brandName && brandName.trim()) {
    const brandLower = brandName.toLowerCase().trim();
    brandMentioned = textLower.includes(brandLower);
  }

  let domainMentioned = false;
  if (domain && domain.trim()) {
    const domainNormalized = domain
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .toLowerCase()
      .trim();

    const domainInText = textLower.includes(domainNormalized);
    const domainInCitations = citations.some((cite) => cite.toLowerCase().includes(domainNormalized));
    domainMentioned = domainInText || domainInCitations;
  }

  return { brandMentioned, domainMentioned };
}

async function runOpenAI(prompt: string, options: OpenAIOptions = {}): Promise<{ text: string; citations?: string[] }> {
  const {
    systemPrompt = "You are a helpful assistant that provides realistic business names with their websites for search queries. Focus on businesses in ${locationContext || 'United States'}. Always return valid JSON with businesses array and sources array. Include official website URLs and cite exact source links you used.
",
    temperature,
    maxTokens = 1000,
    model = "gpt-4o-mini",
  } = options;

  console.log(`Running OpenAI (${model}) with prompt:`, prompt.substring(0, 100));

  const requestBody: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    max_tokens: maxTokens,
  };

  // Only add temperature if provided (some models don't support it)
  if (temperature !== undefined) {
    requestBody.temperature = temperature;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("OpenAI error:", error);
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log("OpenAI response received");
  return { text: data.choices[0].message.content };
}

async function runPerplexity(
  prompt: string,
  options: PerplexityOptions = {},
): Promise<{ text: string; citations?: string[] }> {
  const {
    systemPrompt = "You are a helpful assistant that provides realistic business names with their websites for search queries. Focus on businesses in ${locationContext || 'United States'}. Always return valid JSON with businesses array and sources array. Include official website URLs and cite exact source links you used.
",
    temperature,
    maxTokens,
    model = "sonar",
    searchDomainFilter,
    searchRecencyFilter,
  } = options;

  console.log(`Running Perplexity (${model}) with prompt:`, prompt.substring(0, 100));

  const requestBody: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  };

  if (temperature !== undefined) requestBody.temperature = temperature;
  if (maxTokens !== undefined) requestBody.max_tokens = maxTokens;
  if (searchDomainFilter?.length) requestBody.search_domain_filter = searchDomainFilter;
  if (searchRecencyFilter) requestBody.search_recency_filter = searchRecencyFilter;

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Perplexity error:", error);
    throw new Error(`Perplexity API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log("Perplexity response received");
  return {
    text: data.choices[0].message.content,
    citations: data.citations || [],
  };
}

async function runGemini(prompt: string, options: GeminiOptions = {}): Promise<{ text: string; citations?: string[] }> {
  const {
    systemPrompt = "You are a helpful assistant that provides realistic business names with their websites for search queries. Focus on businesses in ${locationContext || 'United States'}. Always return valid JSON with businesses array and sources array. Include official website URLs and cite exact source links you used.
",
    temperature,
    maxTokens,
    model = "gemini-2.0-flash",
  } = options;

  console.log(`Running Gemini (${model}) with prompt:`, prompt.substring(0, 100));

  const requestBody: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  // Add system instruction if provided
  if (systemPrompt) {
    requestBody.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  // Add generation config if any options provided
  const generationConfig: Record<string, unknown> = {};
  if (temperature !== undefined) generationConfig.temperature = temperature;
  if (maxTokens !== undefined) generationConfig.maxOutputTokens = maxTokens;

  if (Object.keys(generationConfig).length > 0) {
    requestBody.generationConfig = generationConfig;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Gemini error:", error);
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log("Gemini response received");
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return { text };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      prompt,
      model,
      promptId,
      brandName,
      domain,
      // Common parameters
      systemPrompt,
      temperature,
      maxTokens,
      // Model-specific parameters
      openaiModel,
      perplexityModel,
      geminiModel,
      searchDomainFilter,
      searchRecencyFilter,
    } = await req.json();

    console.log(`Processing request: model=${model}, promptId=${promptId}, brandName=${brandName}, domain=${domain}`);

    if (!prompt || !model) {
      throw new Error("Missing required fields: prompt and model");
    }

    let result: { text: string; citations?: string[] };

    switch (model) {
      case "openai":
        if (!OPENAI_API_KEY) throw new Error("OpenAI API key not configured");
        result = await runOpenAI(prompt, {
          systemPrompt,
          temperature,
          maxTokens,
          model: openaiModel,
        });
        break;
      case "perplexity":
        if (!PERPLEXITY_API_KEY) throw new Error("Perplexity API key not configured");
        result = await runPerplexity(prompt, {
          systemPrompt,
          temperature,
          maxTokens,
          model: perplexityModel,
          searchDomainFilter,
          searchRecencyFilter,
        });
        break;
      case "gemini":
        if (!GEMINI_API_KEY) throw new Error("Gemini API key not configured");
        result = await runGemini(prompt, {
          systemPrompt,
          temperature,
          maxTokens,
          model: geminiModel,
        });
        break;
      default:
        throw new Error(`Unknown model: ${model}`);
    }

    // Detect brand and domain mentions
    const citations = result.citations || [];
    const { brandMentioned, domainMentioned } = detectMentions(
      result.text,
      citations,
      brandName || null,
      domain || null,
    );

    console.log(`Detection results: brandMentioned=${brandMentioned}, domainMentioned=${domainMentioned}`);

    // Store result in database
    if (promptId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: insertError } = await supabase.from("llm_results").insert({
        prompt_id: promptId,
        model_name: model,
        response_text: result.text,
        citations: citations,
        brand_mentioned: brandMentioned,
        domain_mentioned: domainMentioned,
      });

      if (insertError) {
        console.error("Error saving result:", insertError);
      } else {
        console.log("Result saved to database with mention detection");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: result.text,
        citations: result.citations,
        brandMentioned,
        domainMentioned,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in run-llm function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
