
import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Star, Bot, MessageSquare, Edit3, Trash2 } from 'lucide-react';
import { Review } from '../../services/reviewService';
import { AIReplyGenerator } from './AIReplyGenerator';
import { ReviewReplyForm } from './ReviewReplyForm';
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

interface ReviewCardProps {
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

export const ReviewCard: React.FC<ReviewCardProps> = ({
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
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Customer Avatar */}
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {review.profile_image_url ? (
            <img 
              src={review.profile_image_url} 
              alt={review.customer_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            getCustomerInitials(review.customer_name)
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{review.customer_name}</h4>
              {/* <Badge variant="outline" className="text-xs">{review.platform}</Badge> */}
              <Badge className={`text-xs ${getSentimentColor(getSentimentFromRating(review.rating))}`}>
                {getSentimentFromRating(review.rating)}
              </Badge>
            </div>
            <span className="text-sm text-gray-500 flex-shrink-0">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-sm text-gray-600">({review.rating}/5)</span>
          </div>

          {/* Review Text */}
          {review.comment && (
            <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">{review.comment}</p>
          )}

          {/* Reply Section */}
          {review.replied && review.reply_text && editingReply !== review.id && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded-r-md">
              <p className="text-sm text-gray-700">{review.reply_text}</p>
              {review.reply_date && (
                <p className="text-xs text-gray-500 mt-2">
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
                <Button size="sm" variant="outline" onClick={() => onGenerateReply(review.id)} className="flex items-center gap-1 text-xs sm:text-sm">
                  <Bot className="w-4 h-4" />
                  <span className="hidden sm:inline">Generate using Genie</span>
                  <span className="sm:hidden">AI Reply</span>
                </Button>
                <Button size="sm" variant="outline" onClick={() => onManualReply(review.id)} className="flex items-center gap-1 text-xs sm:text-sm">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Reply Manually</span>
                  <span className="sm:hidden">Reply</span>
                </Button>
              </>
            )}
            {review.replied && editingReply !== review.id && showingAIGenerator !== review.id && (
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => onManualReply(review.id)} className="flex items-center gap-1 text-xs sm:text-sm">
                  <Edit3 className="w-4 h-4" />
                  Edit Reply
                </Button>
                
                {onDeleteReply && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1 text-xs sm:text-sm border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete Reply</span>
                        <span className="sm:hidden">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this reply?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The reply will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDeleteReply(review.id)}
                          disabled={deleteLoading}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleteLoading ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
