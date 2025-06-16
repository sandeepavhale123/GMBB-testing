
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Bot, RotateCcw, Loader2 } from 'lucide-react';

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
  const [aiReply, setAiReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateAIReply = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let reply = '';
    
    if (sentiment === 'positive') {
      reply = `Hi ${customerName}! Thank you so much for your wonderful ${rating}-star review! We're thrilled to hear that you enjoyed your experience with us. Your kind words mean the world to our team and motivate us to continue providing excellent service. We look forward to welcoming you back soon!`;
    } else if (sentiment === 'negative') {
      reply = `Hi ${customerName}, thank you for taking the time to share your feedback. We sincerely apologize that your experience didn't meet your expectations. Your concerns are very important to us, and we'd love the opportunity to make things right. Please reach out to us directly so we can address your concerns and improve your experience with us.`;
    } else {
      reply = `Hi ${customerName}, thank you for your ${rating}-star review and for taking the time to share your experience. We appreciate your feedback and are always looking for ways to improve our service. We hope to have the opportunity to serve you again and provide an even better experience next time!`;
    }
    
    setAiReply(reply);
    setIsGenerating(false);
    setHasGenerated(true);
  };

  const handleRegenerate = () => {
    setHasGenerated(false);
    generateAIReply();
  };

  const handleSave = () => {
    onSave(reviewId, aiReply);
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-700">AI Reply Generator</span>
      </div>
      
      {!hasGenerated && !isGenerating && (
        <Button
          onClick={generateAIReply}
          className="flex items-center gap-2"
          size="sm"
        >
          <Bot className="w-4 h-4" />
          Generate using Genie
        </Button>
      )}
      
      {isGenerating && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Generating AI reply...</span>
        </div>
      )}
      
      {hasGenerated && (
        <div className="space-y-3">
          <Textarea
            value={aiReply}
            onChange={(e) => setAiReply(e.target.value)}
            placeholder="AI generated reply..."
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              Save Reply
            </Button>
            <Button size="sm" variant="outline" onClick={handleRegenerate}>
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
