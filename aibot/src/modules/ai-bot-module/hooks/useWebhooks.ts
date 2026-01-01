import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Webhook {
  id: string;
  bot_id: string;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  secret_key: string | null;
  headers: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface WebhookLog {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  response_status: number | null;
  response_body: string | null;
  error_message: string | null;
  created_at: string;
}

export interface CreateWebhookData {
  bot_id: string;
  name: string;
  url: string;
  events: string[];
  is_active?: boolean;
  secret_key?: string;
  headers?: Record<string, string>;
}

export interface UpdateWebhookData {
  name?: string;
  url?: string;
  events?: string[];
  is_active?: boolean;
  secret_key?: string;
  headers?: Record<string, string>;
}

export const WEBHOOK_EVENTS = [
  { value: 'lead.created', label: 'Lead Created', description: 'When a new lead submits the form' },
  { value: 'lead.updated', label: 'Lead Updated', description: 'When a lead is updated' },
  { value: 'chat.started', label: 'Chat Started', description: 'When a new chat session begins' },
  { value: 'chat.message', label: 'Chat Message', description: 'When a message is exchanged in chat' },
  { value: 'appointment.interest', label: 'Appointment Interest', description: 'When user shows interest in booking (keyword triggered)' },
  { value: 'booking.link_clicked', label: 'Booking Link Clicked', description: 'When user clicks the booking link' },
] as const;

export function useWebhooks(botId: string | undefined) {
  return useQuery({
    queryKey: ['webhooks', botId],
    queryFn: async () => {
      if (!botId) return [];
      
      const { data, error } = await supabase
        .from('ab_bot_webhooks')
        .select('*')
        .eq('bot_id', botId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as Webhook[];
    },
    enabled: !!botId,
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateWebhookData) => {
      const { data: webhook, error } = await supabase
        .from('ab_bot_webhooks')
        .insert({
          bot_id: data.bot_id,
          name: data.name,
          url: data.url,
          events: data.events,
          is_active: data.is_active ?? true,
          secret_key: data.secret_key || null,
          headers: data.headers || {},
        })
        .select()
        .single();
      
      if (error) throw error;
      return webhook as Webhook;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', variables.bot_id] });
      toast.success('Webhook created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create webhook: ${error.message}`);
    },
  });
}

export function useUpdateWebhook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, botId, data }: { id: string; botId: string; data: UpdateWebhookData }) => {
      const { data: webhook, error } = await supabase
        .from('ab_bot_webhooks')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { webhook: webhook as Webhook, botId };
    },
    onSuccess: ({ botId }) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', botId] });
      toast.success('Webhook updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update webhook: ${error.message}`);
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, botId }: { id: string; botId: string }) => {
      const { error } = await supabase
        .from('ab_bot_webhooks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { botId };
    },
    onSuccess: ({ botId }) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', botId] });
      toast.success('Webhook deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete webhook: ${error.message}`);
    },
  });
}

export function useToggleWebhook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, botId, isActive }: { id: string; botId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('ab_bot_webhooks')
        .update({ is_active: isActive })
        .eq('id', id);
      
      if (error) throw error;
      return { botId };
    },
    onSuccess: ({ botId }) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', botId] });
    },
    onError: (error) => {
      toast.error(`Failed to toggle webhook: ${error.message}`);
    },
  });
}

export function useWebhookLogs(webhookId: string | undefined, limit = 50) {
  return useQuery({
    queryKey: ['webhook-logs', webhookId],
    queryFn: async () => {
      if (!webhookId) return [];
      
      const { data, error } = await supabase
        .from('ab_bot_webhook_logs')
        .select('*')
        .eq('webhook_id', webhookId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return (data || []) as WebhookLog[];
    },
    enabled: !!webhookId,
  });
}

export function useTestWebhook() {
  return useMutation({
    mutationFn: async (webhook: Webhook) => {
      const testPayload = {
        event: 'test',
        timestamp: new Date().toISOString(),
        bot_id: webhook.bot_id,
        data: {
          message: 'This is a test webhook from your AI Bot',
          webhook_name: webhook.name,
        },
      };

      const response = await supabase.functions.invoke('ai-bot-webhook-trigger', {
        body: {
          webhook_id: webhook.id,
          event_type: 'test',
          payload: testPayload,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast.success('Test webhook sent successfully');
    },
    onError: (error) => {
      toast.error(`Failed to send test webhook: ${error.message}`);
    },
  });
}
