import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useKnowledgeProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);

  const processKnowledgeSource = useCallback(async (
    knowledgeSourceId: string,
    botId: string,
    sourceType: 'file' | 'company_info' | 'qa',
    content?: string
  ) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-bot-process-knowledge', {
        body: {
          knowledge_source_id: knowledgeSourceId,
          bot_id: botId,
          source_type: sourceType,
          content,
        },
      });

      if (error) {
        console.error('Processing error:', error);
        toast.error('Failed to process knowledge source');
        return null;
      }

      toast.success('Knowledge source processed successfully');
      return data;
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process knowledge source');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const retrainBot = useCallback(async (botId: string) => {
    setIsRetraining(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-bot-retrain', {
        body: { bot_id: botId },
      });

      if (error) {
        console.error('Retrain error:', error);
        toast.error('Failed to retrain bot');
        return null;
      }

      toast.success(`Retraining complete. Processed ${data.processed_count} sources.`);
      return data;
    } catch (error) {
      console.error('Retrain error:', error);
      toast.error('Failed to retrain bot');
      return null;
    } finally {
      setIsRetraining(false);
    }
  }, []);

  return {
    isProcessing,
    isRetraining,
    processKnowledgeSource,
    retrainBot,
  };
};
