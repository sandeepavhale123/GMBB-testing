
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Bot, RotateCcw, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { generateAIReply, clearAIGenerationError } from '../../store/slices/reviews';
import { useToast } from '../../hooks/use-toast';

interface AIReplyGeneratorProps {
  reviewId: string;
  customerName: string;
  rating: number;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  onSave: (reviewId: string, reply: string) => void;
  onCancel: () => void;
}

export const AIReplyGenerator: React.FC<AIReplyGeneratorProps> = ({
  reviewId,
  customerName,
  rating,
  comment,
  sentiment,
  onSave,
  onCancel
}) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { aiGenerationLoading, aiGenerationError } = useAppSelector(state => state.reviews);
  
  const [aiReply, setAiReply] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateReply = async () => {
    try {
      setHasGenerated(false);
      dispatch(clearAIGenerationError());
      
      const result = await dispatch(generateAIReply(parseInt(reviewId)));
      
      if (generateAIReply.fulfilled.match(result)) {
        setAiReply(result.payload.replyText);
        setHasGenerated(true);
      } else {
        toast.error({
          title: "AI Generation Failed",
          description: result.payload as string || "Failed to generate AI reply. Please try again."
        });
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: "An unexpected error occurred while generating the reply."
      });
    }
  };

  // Auto-generate reply on component mount
  useEffect(() => {
    generateReply();
  }, []);

  const handleRegenerate = () => {
    generateReply();
  };

  const handleSave = () => {
    if (aiReply.trim()) {
      onSave(reviewId, aiReply);
    }
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-700">AI Reply Generator</span>
      </div>
      
      {aiGenerationLoading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Generating AI reply...</span>
        </div>
      )}

      {aiGenerationError && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {aiGenerationError}
        </div>
      )}
      
      {hasGenerated && !aiGenerationLoading && (
        <div className="space-y-3">
          <Textarea
            value={aiReply}
            onChange={(e) => setAiReply(e.target.value)}
            placeholder="AI generated reply..."
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={!aiReply.trim()}>
              Save Reply
            </Button>
            <Button size="sm" variant="outline" onClick={handleRegenerate} disabled={aiGenerationLoading}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Regenerate
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
