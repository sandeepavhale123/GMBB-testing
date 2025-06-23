
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Reply, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Question } from './QAList';

interface QACardProps {
  question: Question;
}

export const QACard: React.FC<QACardProps> = ({ question }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    // Handle reply submission
    console.log('Reply submitted:', replyText);
    setIsReplying(false);
    setReplyText('');
  };

  const highlightKeywords = (text: string) => {
    // Simple keyword highlighting for demonstration
    const keywords = ['delivery', 'Brooklyn', 'Manhattan', 'NYC', 'location', 'parking'];
    let highlightedText = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="bg-yellow-100 px-1 rounded">${keyword}</span>`);
    });
    
    return highlightedText;
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-relaxed">
                {question.question}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {question.listingName}
                </Badge>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{question.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={question.status === 'answered' ? 'default' : 'destructive'}
                className="text-xs flex items-center gap-1"
              >
                {question.status === 'answered' ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {question.status === 'answered' ? 'Answered' : 'Unanswered'}
              </Badge>
            </div>
          </div>

          {/* User Info */}
          <div className="text-xs text-gray-500">
            Asked by <span className="font-medium">{question.userName}</span> • {question.timestamp}
          </div>

          {/* Answer or Reply Section */}
          {question.status === 'answered' && question.answer ? (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="text-sm text-gray-700 leading-relaxed" 
                   dangerouslySetInnerHTML={{ __html: highlightKeywords(question.answer) }} />
            </div>
          ) : (
            <div className="space-y-3">
              {!isReplying ? (
                <Button 
                  onClick={() => setIsReplying(true)}
                  className="w-full sm:w-auto flex items-center gap-2"
                  title="Use relevant keywords in your answer"
                >
                  <Reply className="h-4 w-4" />
                  Reply
                </Button>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Write your answer using relevant keywords like city names, services, or products to boost local SEO..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-24"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleReply} size="sm">
                      Post Answer
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsReplying(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
