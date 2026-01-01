import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CalendarSettings, DEFAULT_CALENDAR_SETTINGS } from '../types';

export function useCalendarSettings(botId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['calendar-settings', botId],
    queryFn: async () => {
      if (!botId) return null;
      
      const { data, error } = await supabase
        .from('ab_bot_calendar_settings')
        .select('*')
        .eq('bot_id', botId)
        .maybeSingle();
      
      if (error) throw error;
      
      // Return default settings if none exist
      if (!data) {
        return { ...DEFAULT_CALENDAR_SETTINGS, bot_id: botId };
      }
      
      return data as CalendarSettings;
    },
    enabled: !!botId,
  });

  const upsertMutation = useMutation({
    mutationFn: async (newSettings: Partial<CalendarSettings>) => {
      if (!botId) throw new Error('Bot ID is required');
      
      const payload = {
        bot_id: botId,
        ...newSettings,
        updated_at: new Date().toISOString(),
      };
      
      // Check if settings exist
      const { data: existing } = await supabase
        .from('ab_bot_calendar_settings')
        .select('id')
        .eq('bot_id', botId)
        .maybeSingle();
      
      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('ab_bot_calendar_settings')
          .update(payload)
          .eq('bot_id', botId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('ab_bot_calendar_settings')
          .insert(payload)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-settings', botId] });
      toast.success('Calendar settings saved');
    },
    onError: (error) => {
      console.error('Error saving calendar settings:', error);
      toast.error('Failed to save calendar settings');
    },
  });

  return {
    settings,
    isLoading,
    error,
    upsertSettings: upsertMutation.mutate,
    isUpsertingSettings: upsertMutation.isPending,
  };
}
