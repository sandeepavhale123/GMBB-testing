import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bot, BotWizardFormData, EmbedSettings, DEFAULT_EMBED_SETTINGS } from '../types';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface UseBotReturn {
  loading: boolean;
  error: string | null;
  createBot: (formData: BotWizardFormData, status: 'draft' | 'published', projectId?: string, workspaceId?: string) => Promise<Bot | null>;
  updateBot: (botId: string, formData: Partial<BotWizardFormData>) => Promise<Bot | null>;
  getBot: (botId: string) => Promise<Bot | null>;
  getBotByProject: (projectId: string) => Promise<Bot | null>;
  publishBot: (botId: string) => Promise<boolean>;
  deleteBot: (botId: string) => Promise<boolean>;
  saveApiKeys: (botId: string, openaiKey?: string, geminiKey?: string) => Promise<boolean>;
}

// Simple XOR-based encryption for API keys (basic obfuscation)
const ENCRYPTION_KEY = 'lovable-ai-bot-encryption-key';

function encryptApiKey(key: string): string {
  let result = '';
  for (let i = 0; i < key.length; i++) {
    result += String.fromCharCode(
      key.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    );
  }
  return btoa(result);
}

// Parse embed settings from Json to EmbedSettings type
function parseEmbedSettings(json: Json | null): EmbedSettings {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return DEFAULT_EMBED_SETTINGS;
  }
  const obj = json as Record<string, unknown>;
  return {
    bubble_position: (obj.bubble_position as 'bottom-right' | 'bottom-left') || DEFAULT_EMBED_SETTINGS.bubble_position,
    bubble_color: (obj.bubble_color as string) || DEFAULT_EMBED_SETTINGS.bubble_color,
    welcome_message: (obj.welcome_message as string) || DEFAULT_EMBED_SETTINGS.welcome_message,
    chat_height: (obj.chat_height as string) || DEFAULT_EMBED_SETTINGS.chat_height,
    chat_width: (obj.chat_width as string) || DEFAULT_EMBED_SETTINGS.chat_width,
  };
}

// Convert database row to Bot type
function toBot(data: Record<string, unknown>): Bot {
  return {
    id: data.id as string,
    project_id: (data.project_id as string) || null,
    owner_id: (data.owner_id as string) || null,
    name: data.name as string,
    intent: data.intent as Bot['intent'],
    system_prompt: data.system_prompt as string | null,
    user_message_template: data.user_message_template as string | null,
    model_provider: data.model_provider as Bot['model_provider'],
    model_name: data.model_name as string,
    is_active: data.is_active as boolean,
    status: data.status as Bot['status'],
    temperature: (data.temperature as number) ?? 0.3,
    max_tokens: (data.max_tokens as number) ?? 1024,
    fallback_message: data.fallback_message as string | null,
    allowed_domains: (data.allowed_domains as string[]) || [],
    is_public: (data.is_public as boolean) ?? false,
    embed_settings: parseEmbedSettings(data.embed_settings as Json),
    created_at: data.created_at as string,
    updated_at: data.updated_at as string,
  };
}

export const useBot = (): UseBotReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBot = useCallback(
    async (formData: BotWizardFormData, status: 'draft' | 'published', projectId?: string, workspaceId?: string): Promise<Bot | null> => {
      setLoading(true);
      setError(null);
      try {
        // Get current user for owner_id
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('You must be logged in to create a bot');
        }

        // Create the bot with owner_id (and optional project_id and workspace_id)
        const { data: bot, error: botError } = await supabase
          .from('ab_bots')
          .insert({
            owner_id: user.id,
            project_id: projectId || null,
            workspace_id: workspaceId || null,
            name: formData.name,
            intent: formData.intent,
            system_prompt: formData.systemPrompt,
            user_message_template: formData.userMessageTemplate,
            model_provider: formData.modelProvider,
            model_name: formData.modelName,
            temperature: formData.temperature,
            max_tokens: formData.maxTokens,
            fallback_message: formData.fallbackMessage,
            allowed_domains: formData.allowedDomains,
            is_public: formData.isPublic,
            embed_settings: formData.embedSettings as unknown as Json,
            status,
          })
          .select()
          .single();

        if (botError) throw botError;

        // Save API keys if provided
        if (formData.openaiApiKey || formData.geminiApiKey) {
          await saveApiKeysInternal(bot.id, formData.openaiApiKey, formData.geminiApiKey);
        }

        // Create knowledge sources
        if (formData.knowledgeSources.length > 0) {
          const sourcesToInsert = formData.knowledgeSources.map((source) => ({
            bot_id: bot.id,
            source_type: source.source_type as string,
            title: source.title || 'Untitled',
            content: source.content || null,
            url: source.url || null,
            file_url: source.file_url || null,
            file_name: source.file_name || null,
            char_count: source.char_count || 0,
            status: 'completed' as const,
            metadata: (source.metadata || {}) as Json,
          }));

          const { data: sources, error: sourcesError } = await supabase
            .from('ab_knowledge_sources')
            .insert(sourcesToInsert)
            .select();

          if (sourcesError) throw sourcesError;

          // Create Q&A pairs if any
          const qaSources = sources?.filter((s) => s.source_type === 'qa') || [];
          if (qaSources.length > 0 && formData.qaPairs.length > 0) {
            const qaSourceId = qaSources[0].id;
            const qaPairsToInsert = formData.qaPairs.map((pair) => ({
              knowledge_source_id: qaSourceId,
              question: pair.question || '',
              answer: pair.answer || '',
            }));

            const { error: qaError } = await supabase.from('ab_qa_pairs').insert(qaPairsToInsert);

            if (qaError) throw qaError;
          }
        }

        toast.success(status === 'published' ? 'Bot published successfully!' : 'Bot saved as draft');
        return toBot(bot);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create bot';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateBot = useCallback(
    async (botId: string, formData: Partial<BotWizardFormData>): Promise<Bot | null> => {
      setLoading(true);
      setError(null);
      try {
        const updateData: Record<string, unknown> = {};
        if (formData.name !== undefined) updateData.name = formData.name;
        if (formData.intent !== undefined) updateData.intent = formData.intent;
        if (formData.systemPrompt !== undefined) updateData.system_prompt = formData.systemPrompt;
        if (formData.userMessageTemplate !== undefined) updateData.user_message_template = formData.userMessageTemplate;
        if (formData.modelProvider !== undefined) updateData.model_provider = formData.modelProvider;
        if (formData.modelName !== undefined) updateData.model_name = formData.modelName;
        if (formData.temperature !== undefined) updateData.temperature = formData.temperature;
        if (formData.maxTokens !== undefined) updateData.max_tokens = formData.maxTokens;
        if (formData.fallbackMessage !== undefined) updateData.fallback_message = formData.fallbackMessage;
        if (formData.allowedDomains !== undefined) updateData.allowed_domains = formData.allowedDomains;
        if (formData.isPublic !== undefined) updateData.is_public = formData.isPublic;
        if (formData.embedSettings !== undefined) updateData.embed_settings = formData.embedSettings;

        const { data: bot, error: botError } = await supabase
          .from('ab_bots')
          .update(updateData)
          .eq('id', botId)
          .select()
          .single();

        if (botError) throw botError;

        // Update API keys if provided
        if (formData.openaiApiKey || formData.geminiApiKey) {
          await saveApiKeysInternal(botId, formData.openaiApiKey, formData.geminiApiKey);
        }

        toast.success('Bot updated successfully!');
        return toBot(bot);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update bot';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getBot = useCallback(async (botId: string): Promise<Bot | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('ab_bots')
        .select('*')
        .eq('id', botId)
        .single();

      if (fetchError) throw fetchError;
      return toBot(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bot';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBotByProject = useCallback(async (projectId: string): Promise<Bot | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('ab_bots')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      return data ? toBot(data) : null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bot';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const publishBot = useCallback(async (botId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('ab_bots')
        .update({ status: 'published', is_active: true })
        .eq('id', botId);

      if (updateError) throw updateError;
      toast.success('Bot published successfully!');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to publish bot';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBot = useCallback(async (botId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase.from('ab_bots').delete().eq('id', botId);

      if (deleteError) throw deleteError;
      toast.success('Bot deleted successfully!');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete bot';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Internal function to save API keys
  const saveApiKeysInternal = async (botId: string, openaiKey?: string, geminiKey?: string): Promise<boolean> => {
    try {
      const updateData: Record<string, string | null> = {};
      if (openaiKey) updateData.openai_key_encrypted = encryptApiKey(openaiKey);
      if (geminiKey) updateData.gemini_key_encrypted = encryptApiKey(geminiKey);

      // Check if record exists
      const { data: existing } = await supabase
        .from('ab_bot_api_keys')
        .select('id')
        .eq('bot_id', botId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('ab_bot_api_keys')
          .update(updateData)
          .eq('bot_id', botId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ab_bot_api_keys')
          .insert({ bot_id: botId, ...updateData });
        if (error) throw error;
      }
      return true;
    } catch (err) {
      console.error('Failed to save API keys:', err);
      return false;
    }
  };

  const saveApiKeys = useCallback(async (botId: string, openaiKey?: string, geminiKey?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await saveApiKeysInternal(botId, openaiKey, geminiKey);
      if (result) {
        toast.success('API keys saved successfully!');
      } else {
        toast.error('Failed to save API keys');
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createBot,
    updateBot,
    getBot,
    getBotByProject,
    publishBot,
    deleteBot,
    saveApiKeys,
  };
};
