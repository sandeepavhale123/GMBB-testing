import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Star, Bot, MessageSquare, Edit3, Trash2 } from "lucide-react";
import { Review } from "../../services/reviewService";
import { AIReplyGenerator } from "../Reviews/AIReplyGenerator";
import { ReviewReplyForm } from "../Reviews/ReviewReplyForm";
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
} from "../ui/alert-dialog";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface DashboardReviewCardProps {
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

export const DashboardReviewCard: React.FC<DashboardReviewCardProps> = ({
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
  const { t } = useI18nNamespace("Dashboard/dashboardReviewCard");
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200";
      case "negative":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getCustomerInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSentimentFromRating = (rating: number) => {
    if (rating >= 4) return "positive";
    if (rating <= 2) return "negative";
    return "neutral";
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start gap-3">
        {/* Customer Avatar */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
          {review.profile_image_url ? (
            <img
              src={review.profile_image_url}
              alt={review.customer_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            getCustomerInitials(review.customer_name)
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold text-gray-900 text-sm">
                {review.customer_name}
              </h4>
              <Badge
                variant="outline"
                className={`text-xs pointer-events-none ${getSentimentColor(
                  getSentimentFromRating(review.rating)
                )}`}
              >
                {getSentimentFromRating(review.rating)}
              </Badge>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-xs text-gray-600">({review.rating}/5)</span>
          </div>

          {/* Review Text */}
          {review.comment && (
            <p className="text-gray-700 mb-3 text-sm leading-relaxed line-clamp-3">
              {review.comment}
            </p>
          )}

          {/* Reply Section */}
          {review.replied &&
            review.reply_text &&
            editingReply !== review.id && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3 rounded-r-md">
                <p className="text-sm text-gray-700">{review.reply_text}</p>
                {review.reply_date && (
                  <p className="text-xs text-gray-500 mt-2">
                    {t("reply.repliedOn", {
                      date: new Date(review.reply_date).toLocaleDateString(),
                    })}
                    {/* Replied on{" "}
                    {new Date(review.reply_date).toLocaleDateString()} */}
                  </p>
                )}
              </div>
            )}

          {/* Edit Reply Form */}
          {editingReply === review.id && (
            <ReviewReplyForm
              initialText={review.reply_text || ""}
              isLoading={replyLoading}
              onSave={(text) => onSaveReply(review.id, text)}
              onCancel={() => onManualReply("")}
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
            {!review.replied &&
              showingAIGenerator !== review.id &&
              editingReply !== review.id && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onGenerateReply(review.id)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Bot className="w-3 h-3" />
                    <span className="hidden sm:inline">
                      {t("reply.aiReply")}
                    </span>
                    <span className="sm:hidden">{t("buttons.ai")} </span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onManualReply(review.id)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span className="hidden sm:inline">
                      {t("buttons.reply")}{" "}
                    </span>
                    <span className="sm:hidden">{t("buttons.reply")}</span>
                  </Button>
                </>
              )}
            {review.replied &&
              editingReply !== review.id &&
              showingAIGenerator !== review.id && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onManualReply(review.id)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Edit3 className="w-3 h-3" />
                    {t("reply.editReply")}
                  </Button>

                  {onDeleteReply && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-xs border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                          {t("buttons.delete")}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("reply.deleteConfirmTitle")}{" "}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("reply.deleteConfirmDescription")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t("reply.cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteReply(review.id)}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deleteLoading
                              ? t("reply.deleting")
                              : t("reply.deleteReply")}
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
