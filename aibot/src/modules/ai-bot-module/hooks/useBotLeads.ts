import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BotLead } from '../types';

interface UseLeadsOptions {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
}

export function useBotLeads(botId: string | undefined, options: UseLeadsOptions = {}) {
  const queryClient = useQueryClient();
  const { page = 1, pageSize = 20, dateFrom, dateTo } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ['bot-leads', botId, page, pageSize, dateFrom, dateTo],
    queryFn: async () => {
      if (!botId) return { leads: [], count: 0 };
      
      let query = supabase
        .from('ab_bot_leads')
        .select('*', { count: 'exact' })
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
        leads: (data || []) as BotLead[],
        count: count || 0,
      };
    },
    enabled: !!botId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (leadId: string) => {
      const { error } = await supabase
        .from('ab_bot_leads')
        .delete()
        .eq('id', leadId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot-leads', botId] });
      toast.success('Lead deleted');
    },
    onError: (error) => {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    },
  });

  const updateConversationSnapshot = useMutation({
    mutationFn: async ({ leadId, snapshot }: { leadId: string; snapshot: { role: 'user' | 'assistant'; content: string }[] }) => {
      const { error } = await supabase
        .from('ab_bot_leads')
        .update({ conversation_snapshot: snapshot })
        .eq('id', leadId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot-leads', botId] });
    },
  });

  return {
    leads: data?.leads || [],
    totalCount: data?.count || 0,
    totalPages: Math.ceil((data?.count || 0) / pageSize),
    isLoading,
    error,
    deleteLead: deleteMutation.mutate,
    isDeletingLead: deleteMutation.isPending,
    updateConversationSnapshot: updateConversationSnapshot.mutate,
  };
}

// Hook for exporting leads to CSV
export function useExportLeads(botId: string | undefined) {
  return useMutation({
    mutationFn: async () => {
      if (!botId) throw new Error('Bot ID is required');
      
      const { data, error } = await supabase
        .from('ab_bot_leads')
        .select('*')
        .eq('bot_id', botId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert to CSV
      const leads = data as BotLead[];
      if (leads.length === 0) {
        throw new Error('No leads to export');
      }
      
      const headers = ['Name', 'Email', 'Phone', 'Message', 'Source URL', 'Created At'];
      const rows = leads.map(lead => [
        lead.name || '',
        lead.email || '',
        lead.phone || '',
        lead.message || '',
        lead.source_url || '',
        new Date(lead.created_at).toLocaleString(),
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n');
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `leads_${botId}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      return leads.length;
    },
    onSuccess: (count) => {
      toast.success(`Exported ${count} leads`);
    },
    onError: (error) => {
      console.error('Error exporting leads:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to export leads');
    },
  });
}
