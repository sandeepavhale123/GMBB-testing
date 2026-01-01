import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeSource, QAPair } from '../types';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface UseKnowledgeSourcesReturn {
  loading: boolean;
  error: string | null;
  getKnowledgeSources: (botId: string) => Promise<KnowledgeSource[]>;
  addKnowledgeSource: (source: Omit<KnowledgeSource, 'id' | 'created_at' | 'updated_at'>) => Promise<KnowledgeSource | null>;
  updateKnowledgeSource: (id: string, data: Partial<KnowledgeSource>) => Promise<KnowledgeSource | null>;
  deleteKnowledgeSource: (id: string) => Promise<boolean>;
  getQAPairs: (knowledgeSourceId: string) => Promise<QAPair[]>;
  addQAPair: (pair: Omit<QAPair, 'id' | 'created_at' | 'updated_at'>) => Promise<QAPair | null>;
  updateQAPair: (id: string, data: Partial<QAPair>) => Promise<QAPair | null>;
  deleteQAPair: (id: string) => Promise<boolean>;
}

export const useKnowledgeSources = (): UseKnowledgeSourcesReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getKnowledgeSources = useCallback(async (botId: string): Promise<KnowledgeSource[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('ab_knowledge_sources')
        .select('*')
        .eq('bot_id', botId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      return (data || []) as KnowledgeSource[];
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch knowledge sources';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addKnowledgeSource = useCallback(
    async (source: Omit<KnowledgeSource, 'id' | 'created_at' | 'updated_at'>): Promise<KnowledgeSource | null> => {
      setLoading(true);
      setError(null);
      try {
        const insertData = {
          bot_id: source.bot_id,
          source_type: source.source_type as string,
          title: source.title,
          content: source.content || null,
          url: source.url || null,
          file_url: source.file_url || null,
          file_name: source.file_name || null,
          char_count: source.char_count,
          status: source.status as string,
          error_message: source.error_message || null,
          metadata: source.metadata as Json,
        };
        
        const { data, error: insertError } = await supabase
          .from('ab_knowledge_sources')
          .insert(insertData)
          .select()
          .single();

        if (insertError) throw insertError;
        toast.success('Knowledge source added');
        return data as KnowledgeSource;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to add knowledge source';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateKnowledgeSource = useCallback(
    async (id: string, updateData: Partial<KnowledgeSource>): Promise<KnowledgeSource | null> => {
      setLoading(true);
      setError(null);
      try {
        // Convert to Supabase-compatible types
        const dbUpdateData: Record<string, unknown> = {};
        if (updateData.bot_id !== undefined) dbUpdateData.bot_id = updateData.bot_id;
        if (updateData.source_type !== undefined) dbUpdateData.source_type = updateData.source_type;
        if (updateData.title !== undefined) dbUpdateData.title = updateData.title;
        if (updateData.content !== undefined) dbUpdateData.content = updateData.content;
        if (updateData.url !== undefined) dbUpdateData.url = updateData.url;
        if (updateData.file_url !== undefined) dbUpdateData.file_url = updateData.file_url;
        if (updateData.file_name !== undefined) dbUpdateData.file_name = updateData.file_name;
        if (updateData.char_count !== undefined) dbUpdateData.char_count = updateData.char_count;
        if (updateData.status !== undefined) dbUpdateData.status = updateData.status;
        if (updateData.error_message !== undefined) dbUpdateData.error_message = updateData.error_message;
        if (updateData.metadata !== undefined) dbUpdateData.metadata = updateData.metadata as Json;

        const { data: updated, error: updateError } = await supabase
          .from('ab_knowledge_sources')
          .update(dbUpdateData)
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;
        return updated as KnowledgeSource;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update knowledge source';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteKnowledgeSource = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase.from('ab_knowledge_sources').delete().eq('id', id);

      if (deleteError) throw deleteError;
      toast.success('Knowledge source removed');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete knowledge source';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getQAPairs = useCallback(async (knowledgeSourceId: string): Promise<QAPair[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('ab_qa_pairs')
        .select('*')
        .eq('knowledge_source_id', knowledgeSourceId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      return (data || []) as QAPair[];
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch Q&A pairs';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addQAPair = useCallback(
    async (pair: Omit<QAPair, 'id' | 'created_at' | 'updated_at'>): Promise<QAPair | null> => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: insertError } = await supabase.from('ab_qa_pairs').insert(pair).select().single();

        if (insertError) throw insertError;
        return data as QAPair;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to add Q&A pair';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateQAPair = useCallback(async (id: string, data: Partial<QAPair>): Promise<QAPair | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data: updated, error: updateError } = await supabase
        .from('ab_qa_pairs')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return updated as QAPair;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update Q&A pair';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQAPair = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase.from('ab_qa_pairs').delete().eq('id', id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete Q&A pair';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getKnowledgeSources,
    addKnowledgeSource,
    updateKnowledgeSource,
    deleteKnowledgeSource,
    getQAPairs,
    addQAPair,
    updateQAPair,
    deleteQAPair,
  };
};
