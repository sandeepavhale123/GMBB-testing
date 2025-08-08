import React from 'react';
import { Star, MessageCircle, MoreVertical, Bot, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
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
import { Review } from '../../services/reviewService';
import { formatToDayMonthYear } from '../../utils/dateUtils';
import { AIReplyGenerator } from '../Reviews/AIReplyGenerator';
import { ReviewReplyForm } from '../Reviews/ReviewReplyForm';

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
  onCancelAIGenerator,
}) => {
  const isEditing = editingReply === review.id;
  const isShowingAI = showingAIGenerator === review.id;
  const isDNR = review.reply_setting === 'DNR';

  const getSentimentBadge = () => {
    if (!review.sentiment) return null;
    
    const sentimentColors = {
      positive: 'bg-green-100 text-green-700',
      neutral: 'bg-gray-100 text-gray-700', 
      negative: 'bg-red-100 text-red-700'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded ${sentimentColors[review.sentiment as keyof typeof sentimentColors]}`}>
        {review.sentiment}
      </span>
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-6">
        {/* Review Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {review.profile_image_url ? (
              <img
                src={review.profile_image_url}
                alt={`${review.customer_name}'s profile`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {getInitials(review.customer_name)}
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground">{review.customer_name}</span>
                {getSentimentBadge()}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({review.rating}/5)
                </span>
                {review.locationName && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {review.locationName}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatToDayMonthYear(review.date)}
          </span>
        </div>

        {/* Review Text */}
        {review.comment && (
          <p className="text-sm text-foreground mb-4 leading-relaxed">
            {review.comment}
          </p>
        )}

        {/* Existing Reply Section */}
        {review.reply_text && !isEditing && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r">
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              {review.reply_text}
            </p>
            {review.reply_date && (
              <p className="text-xs text-muted-foreground">
                Replied on {formatToDayMonthYear(review.reply_date)}
              </p>
            )}
          </div>
        )}

        {/* AI Reply Generator */}
        {isShowingAI && (
          <AIReplyGenerator
            reviewId={review.id}
            customerName={review.customer_name}
            rating={review.rating}
            comment={review.comment}
            sentiment={(review.sentiment as "positive" | "neutral" | "negative") || "neutral"}
            onSave={(reviewId, reply) => onSaveReply(reviewId, reply)}
            onCancel={onCancelAIGenerator}
          />
        )}

        {/* Reply Form */}
        {isEditing && (
          <ReviewReplyForm
            initialText={review.reply_text}
            isLoading={replyLoading}
            onSave={(text) => onSaveReply(review.id, text)}
            onCancel={() => onSaveReply(review.id)}
          />
        )}

        {/* Action Buttons */}
        {!isEditing && !isShowingAI && (
          <div className="flex gap-2">
            {!review.replied ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onGenerateReply(review.id)}
                          disabled={isDNR || replyLoading}
                          className="gap-2"
                        >
                          <Bot className="w-4 h-4" />
                          Generate using Genie
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {isDNR && (
                      <TooltipContent>
                        <p>Do Not Respond to this review</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onManualReply(review.id)}
                          disabled={isDNR || replyLoading}
                          className="gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Reply Manually
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {isDNR && (
                      <TooltipContent>
                        <p>Do Not Respond to this review</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onManualReply(review.id)}
                  disabled={replyLoading}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Reply
                </Button>

                {onDeleteReply && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deleteLoading}
                        className="gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Reply
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Reply</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this reply? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteReply(review.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
