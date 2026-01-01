import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BotAppointment } from '../types';

interface UseAppointmentsOptions {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
}

export function useBotAppointments(botId: string | undefined, options: UseAppointmentsOptions = {}) {
  const queryClient = useQueryClient();
  const { page = 1, pageSize = 20, dateFrom, dateTo } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ['bot-appointments', botId, page, pageSize, dateFrom, dateTo],
    queryFn: async () => {
      if (!botId) return { appointments: [], count: 0 };
      
      let query = supabase
        .from('ab_bot_appointments')
        .select('*, lead:ab_bot_leads(*)', { count: 'exact' })
        .eq('bot_id', botId)
        .order('created_at', { ascending: false });
      
      // Apply date filters if provided
      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        appointments: (data || []) as BotAppointment[],
        count: count || 0,
      };
    },
    enabled: !!botId,
  });

  // Get appointment analytics
  const { data: analytics } = useQuery({
    queryKey: ['bot-appointments-analytics', botId],
    queryFn: async () => {
      if (!botId) return { totalTriggers: 0, totalClicks: 0, clickRate: 0 };
      
      const { data, error } = await supabase
        .from('ab_bot_appointments')
        .select('booking_link_clicked')
        .eq('bot_id', botId);
      
      if (error) throw error;
      
      const totalTriggers = data?.length || 0;
      const totalClicks = data?.filter(a => a.booking_link_clicked).length || 0;
      const clickRate = totalTriggers > 0 ? (totalClicks / totalTriggers) * 100 : 0;
      
      return {
        totalTriggers,
        totalClicks,
        clickRate: Math.round(clickRate * 10) / 10,
      };
    },
    enabled: !!botId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await supabase
        .from('ab_bot_appointments')
        .delete()
        .eq('id', appointmentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot-appointments', botId] });
      queryClient.invalidateQueries({ queryKey: ['bot-appointments-analytics', botId] });
      toast.success('Appointment record deleted');
    },
    onError: (error) => {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment record');
    },
  });

  return {
    appointments: data?.appointments || [],
    totalCount: data?.count || 0,
    totalPages: Math.ceil((data?.count || 0) / pageSize),
    analytics: analytics || { totalTriggers: 0, totalClicks: 0, clickRate: 0 },
    isLoading,
    error,
    deleteAppointment: deleteMutation.mutate,
    isDeletingAppointment: deleteMutation.isPending,
  };
}
