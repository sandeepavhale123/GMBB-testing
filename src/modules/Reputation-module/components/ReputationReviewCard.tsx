import React, { useState } from "react";
import { Star, MessageSquare, Edit, Trash2, Bot, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AIReplyGenerator } from "@/components/Reviews/AIReplyGenerator";
import { ReviewReplyForm } from "@/components/Reviews/ReviewReplyForm";
import { Review } from "@/services/reviewService";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ReputationReviewCardProps {
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
  onShare?: (review: Review) => void;
  onViewDetails?: (review: Review) => void;
}

// Channel logo mapping
const channelLogos: Record<string, string> = {
  "Google Business Profile": "G",
  "Facebook": "f",
  "Yelp": "Y"
};

const channelColors: Record<string, string> = {
  "Google Business Profile": "bg-blue-500",
  "Facebook": "bg-blue-600",
  "Yelp": "bg-red-600"
};

const renderStars = (rating: number): JSX.Element => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const getSentimentColor = (sentiment: string): string => {
  switch (sentiment.toLowerCase()) {
    case "positive":
      return "bg-green-100 text-green-700";
    case "neutral":
      return "bg-yellow-100 text-yellow-700";
    case "negative":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getCustomerInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const ReputationReviewCard: React.FC<ReputationReviewCardProps> = ({
  review,
  editingReply,
  showingAIGenerator,
  replyLoading,
  deleteLoading = false,
  onGenerateReply,
  onManualReply,
  onSaveReply,
  onDeleteReply,
  onCancelAIGenerator,
  onShare,
  onViewDetails,
}) => {
  const { t } = useI18nNamespace("Reputation/reputationReviewCard");

  const getSentimentFromRating = (rating: number): string => {
    if (rating >= 4) return t("sentiment.positive");
    if (rating >= 3) return t("sentiment.neutral");
    return t("sentiment.negative");
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const sentiment = getSentimentFromRating(review.rating);
  const isEditing = editingReply === review.id;
  const isGeneratingAI = showingAIGenerator === review.id;
  const isDNR = review.reply_setting === "DNR";

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDeleteReply?.(review.id);
    setShowDeleteDialog(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 relative">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={review.profile_image_url}
              alt={`${review.customer_name} profile`}
            />
            <AvatarFallback className="text-sm font-medium bg-muted text-muted-foreground">
              {getCustomerInitials(review.customer_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-foreground">
                {review.customer_name}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${getSentimentColor(
                  sentiment
                )}`}
              >
                {sentiment}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              {renderStars(review.rating)}
              <span className="text-sm text-muted-foreground">
                ({review.rating}/5)
              </span>
            </div>
            <div className="text-[12px] text-black font-medium bg-slate-200 py-1 px-2 rounded-lg">
              {review.locationName} • {review.zipcode}
            </div>
          </div>
        </div>
        
        {/* Channel Logo & Date */}
        <div className="flex flex-col items-end gap-2">
          <div className={`w-8 h-8 rounded-full ${channelColors[review.platform]} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
            {channelLogos[review.platform]}
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDate(review.date)}
          </span>
        </div>
      </div>

      {/* Review Text */}
      {review.comment && (
        <p className="text-sm text-foreground mb-4 leading-relaxed">
          {review.comment}
        </p>
      )}

      {/* Existing Reply */}
      {review.replied && review.reply_text && !isEditing && !isGeneratingAI && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {review.reply_text}
          </p>
          {review.reply_date && (
            <p className="text-xs text-muted-foreground mt-2">
              {t("review.repliedOn", { date: formatDate(review.reply_date) })}
            </p>
          )}
        </div>
      )}

      {/* AI Reply Generator */}
      {isGeneratingAI && (
        <div className="mb-4">
          <AIReplyGenerator
            reviewId={review.id}
            customerName={review.customer_name}
            rating={review.rating}
            comment={review.comment}
            sentiment={sentiment as "positive" | "neutral" | "negative"}
            onSave={onSaveReply}
            onCancel={onCancelAIGenerator}
          />
        </div>
      )}

      {/* Manual Reply Form */}
      {isEditing && (
        <div className="mb-4">
          <ReviewReplyForm
            initialText={review.reply_text}
            isLoading={replyLoading}
            onSave={(text) => onSaveReply(review.id, text)}
            onCancel={onCancelAIGenerator}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {!review.replied && !isEditing && !isGeneratingAI && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGenerateReply(review.id)}
                      disabled={isDNR || replyLoading}
                    >
                      <Bot className="w-4 h-4 mr-1" />
                      {t("actions.generateAI")}
                    </Button>
                  </span>
                </TooltipTrigger>
                {isDNR && (
                  <TooltipContent>
                    <p>{t("tooltips.dnr")}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onManualReply(review.id)}
                      disabled={isDNR || replyLoading}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {t("actions.replyManually")}
                    </Button>
                  </span>
                </TooltipTrigger>
                {isDNR && (
                  <TooltipContent>
                    <p>{t("tooltips.dnr")}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        {review.replied && !isEditing && !isGeneratingAI && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onManualReply(review.id)}
              disabled={replyLoading}
            >
              <Edit className="w-4 h-4 mr-1" />
              {t("actions.editReply")}
            </Button>

            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  onClick={handleDeleteClick}
                  disabled={deleteLoading}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t("actions.deleteReply")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("dialogs.deleteReply.title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("dialogs.deleteReply.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("dialogs.deleteReply.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {t("dialogs.deleteReply.confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        {/* Share Button */}
        {onShare && !isEditing && !isGeneratingAI && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(review)}
          >
            <Share2 className="w-4 h-4 mr-1" />
            {t("actions.share")}
          </Button>
        )}

        {/* View Details Button */}
        {onViewDetails && !isEditing && !isGeneratingAI && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(review)}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            {t("actions.viewDetails")}
          </Button>
        )}
      </div>
    </div>
  );
};
