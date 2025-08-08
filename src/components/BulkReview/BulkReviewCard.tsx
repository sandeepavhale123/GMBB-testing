import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Star, Bot, MessageSquare, Edit3, Trash2 } from 'lucide-react';
import { Review } from '../../services/reviewService';
import { AIReplyGenerator } from '../Reviews/AIReplyGenerator';
import { ReviewReplyForm } from '../Reviews/ReviewReplyForm';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface BulkReviewCardProps {
  review: Review;
  editingReply: string | null;
  showingAIGenerator: string | null;
  replyLoading: boolean;
  deleteLoading?: boolean;
  onGenerateReply: (reviewId: string) => void;
  onManualReply: (reviewId: string) => void;
  onSaveReply: (reviewId: string, reply?: string) => void;
  onDeleteReply?: (reviewId: string) => void;
  onCancelAIGenerator: () => void;
}

export const BulkReviewCard: React.FC<BulkReviewCardProps> = ({
  review,
  editingReply,
  showingAIGenerator,
  replyLoading,
  deleteLoading,
  onGenerateReply,
  onManualReply,
  onSaveReply,
  onDeleteReply,
  onCancelAIGenerator
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
      />
    ));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getCustomerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getSentimentFromRating = (rating: number) => {
    if (rating >= 4) return 'positive';
    if (rating <= 2) return 'negative';
    return 'neutral';
  };

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            {review.profile_image_url ? (
              <img 
                src={review.profile_image_url} 
                alt={review.customer_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">{getCustomerInitials(review.customer_name)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-foreground">{review.customer_name}</span>
              <Badge 
                variant="outline" 
                className={`text-xs pointer-events-none ${getSentimentColor(getSentimentFromRating(review.rating))}`}
              >
                {getSentimentFromRating(review.rating)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
            </div>
          </div>
        </div>
        <span className="text-sm text-muted-foreground flex-shrink-0">
          {new Date(review.date).toLocaleDateString()}
        </span>
      </div>

      {/* Review Text */}
      {review.comment && (
        <p className="text-sm text-foreground mb-4 leading-relaxed">
          {review.comment}
        </p>
      )}

      {/* Reply Section */}
      {review.replied && review.reply_text && editingReply !== review.id && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">{review.reply_text}</p>
          {review.reply_date && (
            <p className="text-xs text-muted-foreground mt-2">
              Replied on {new Date(review.reply_date).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Edit Reply Form */}
      {editingReply === review.id && (
        <ReviewReplyForm
          initialText={review.reply_text || ''}
          isLoading={replyLoading}
          onSave={(text) => onSaveReply(review.id, text)}
          onCancel={() => onManualReply('')}
        />
      )}

      {/* AI Reply Generator */}
      {showingAIGenerator === review.id && (
        <AIReplyGenerator 
          reviewId={review.id}
          customerName={review.customer_name}
          rating={review.rating}
          comment={review.comment}
          sentiment={getSentimentFromRating(review.rating)}
          onSave={onSaveReply}
          onCancel={onCancelAIGenerator}
        />
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {!review.replied && showingAIGenerator !== review.id && editingReply !== review.id && (
          <>
            <Button size="sm" variant="outline" onClick={() => onGenerateReply(review.id)} className="flex items-center gap-1">
              <Bot className="w-4 h-4" />
              Generate using Genie
            </Button>
            <Button size="sm" variant="outline" onClick={() => onManualReply(review.id)} className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Reply Manually
            </Button>
          </>
        )}
        {review.replied && editingReply !== review.id && showingAIGenerator !== review.id && (
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onManualReply(review.id)} className="flex items-center gap-1">
              <Edit3 className="w-4 h-4" />
              Edit Reply
            </Button>
            
            {onDeleteReply && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Reply
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Reply</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this reply? This action cannot be undone and the reply will be permanently removed from the review.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDeleteReply(review.id)}
                      disabled={deleteLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete Reply'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>
    </div>
  );
};