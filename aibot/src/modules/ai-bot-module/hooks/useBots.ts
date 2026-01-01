import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bot, EmbedSettings, DEFAULT_EMBED_SETTINGS } from '../types';
import { Json } from '@/integrations/supabase/types';

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

export function useBots(workspaceId?: string | null) {
  return useQuery({
    queryKey: ['bots-list', workspaceId],
    queryFn: async () => {
      let query = supabase
        .from('ab_bots')
        .select('*')
        .order('created_at', { ascending: false });

      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).map((row) => toBot(row as unknown as Record<string, unknown>));
    },
    enabled: workspaceId !== undefined,
  });
}

export function useBotById(botId: string | undefined) {
  return useQuery({
    queryKey: ['bot', botId],
    queryFn: async () => {
      if (!botId) throw new Error('Bot ID required');
      
      const { data, error } = await supabase
        .from('ab_bots')
        .select('*')
        .eq('id', botId)
        .single();

      if (error) throw error;
      return toBot(data as unknown as Record<string, unknown>);
    },
    enabled: !!botId,
  });
}
