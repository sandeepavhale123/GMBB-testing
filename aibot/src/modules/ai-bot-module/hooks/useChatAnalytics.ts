import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ChatLog {
  id: string;
  bot_id: string;
  session_id: string;
  user_message: string;
  bot_response: string | null;
  chunks_retrieved: number;
  top_similarity: number | null;
  used_fallback: boolean;
  response_time_ms: number | null;
  created_at: string;
}

export interface ChatAnalyticsData {
  totalMessages: number;
  uniqueSessions: number;
  fallbackRate: number;
  avgResponseTime: number | null;
  avgSimilarity: number | null;
  recentLogs: ChatLog[];
  missedQueries: ChatLog[];
  lowSimilarityQueries: ChatLog[];
  allLogs: ChatLog[];
}

const LOW_SIMILARITY_THRESHOLD = 0.25;

export function useChatAnalytics(botId: string) {
  return useQuery({
    queryKey: ['chat-analytics', botId],
    queryFn: async (): Promise<ChatAnalyticsData> => {
      // Fetch all logs for this bot (limited to last 30 days for performance)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: logs, error } = await supabase
        .from('ab_chat_logs')
        .select('*')
        .eq('bot_id', botId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      
      const allLogs = (logs || []) as ChatLog[];
      
      // Calculate metrics
      const totalMessages = allLogs.length;
      const uniqueSessions = new Set(allLogs.map(l => l.session_id)).size;
      const fallbackCount = allLogs.filter(l => l.used_fallback).length;
      const fallbackRate = totalMessages > 0 ? (fallbackCount / totalMessages) * 100 : 0;
      
      // Average response time (excluding nulls)
      const responseTimes = allLogs
        .map(l => l.response_time_ms)
        .filter((t): t is number => t !== null);
      const avgResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : null;
      
      // Average similarity (excluding nulls and fallbacks)
      const similarities = allLogs
        .filter(l => !l.used_fallback)
        .map(l => l.top_similarity)
        .filter((s): s is number => s !== null);
      const avgSimilarity = similarities.length > 0
        ? similarities.reduce((a, b) => a + b, 0) / similarities.length
        : null;
      
      // Missed queries (used fallback)
      const missedQueries = allLogs.filter(l => l.used_fallback);
      
      // Low similarity queries (not fallback, but low similarity)
      const lowSimilarityQueries = allLogs.filter(l => 
        !l.used_fallback && 
        l.top_similarity !== null && 
        l.top_similarity < LOW_SIMILARITY_THRESHOLD
      );
      
      return {
        totalMessages,
        uniqueSessions,
        fallbackRate,
        avgResponseTime,
        avgSimilarity,
        recentLogs: allLogs.slice(0, 20),
        missedQueries,
        lowSimilarityQueries,
        allLogs,
      };
    },
    enabled: !!botId,
    refetchInterval: 30000,
  });
}

export function exportToCSV(logs: ChatLog[], filename: string) {
  const headers = ['Timestamp', 'Question', 'Response', 'Similarity', 'Fallback', 'Chunks'];
  const rows = logs.map(log => [
    log.created_at,
    `"${(log.user_message || '').replace(/"/g, '""')}"`,
    `"${(log.bot_response || '').replace(/"/g, '""')}"`,
    log.top_similarity?.toFixed(3) || '',
    log.used_fallback ? 'Yes' : 'No',
    log.chunks_retrieved.toString()
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
