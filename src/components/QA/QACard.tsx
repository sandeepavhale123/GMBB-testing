import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Reply, CheckCircle, XCircle, User } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Question } from "../../types/qaTypes";
import { useListingContext } from "@/context/ListingContext";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface QACardProps {
  question: Question;
}

export const QACard: React.FC<QACardProps> = ({ question }) => {
  const { selectedListing } = useListingContext();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { t } = useI18nNamespace("QA/qaCard");

  const handleReply = () => {
    // Handle reply submission - would need another API endpoint
    setIsReplying(false);
    setReplyText("");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30)
      return `${Math.ceil(diffDays / 7)} week${
        Math.ceil(diffDays / 7) > 1 ? "s" : ""
      } ago`;
    return `${Math.ceil(diffDays / 30)} month${
      Math.ceil(diffDays / 30) > 1 ? "s" : ""
    } ago`;
  };

  const highlightKeywords = (text: string) => {
    // Simple keyword highlighting for demonstration
    const keywords = [
      "delivery",
      "Brooklyn",
      "Manhattan",
      "NYC",
      "location",
      "parking",
    ];
    let highlightedText = text;

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span class="bg-yellow-100 px-1 rounded">${keyword}</span>`
      );
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
                  {selectedListing?.name || t("qaCard.listingFallback.name")}
                </Badge>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">
                  {selectedListing?.address ||
                    t("qaCard.listingFallback.address")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  question.status === "answered" ? "default" : "destructive"
                }
                className="text-xs flex items-center gap-1"
              >
                {question.status === "answered" ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {question.status === "answered"
                  ? t("qaCard.answered")
                  : t("qaCard.unanswered")}
              </Badge>
            </div>
          </div>

          {/* User Info with Avatar */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {question.photo ? (
                <AvatarImage
                  src={
                    question.photo.startsWith("//")
                      ? `https:${question.photo}`
                      : question.photo
                  }
                  alt={question.name || "User"}
                />
              ) : null}
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="text-xs text-gray-500">
              {t("qaCard.askedBy")}
              <span className="font-medium">
                {question.name || t("qaCard.anonymousUser")}
              </span>{" "}
              • {formatTimestamp(question.timestamp)}
            </div>
          </div>

          {/* Answer or Reply Section */}
          {question.status === "answered" && question.answer ? (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div
                className="text-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlightKeywords(question.answer),
                }}
              />
              {question.answerTimestamp && (
                <div className="text-xs text-gray-500 mt-2">
                  {t("qaCard.answeredLabel", {
                    timeAgo: formatTimestamp(question.answerTimestamp),
                  })}
                  {/* Answered {formatTimestamp(question.answerTimestamp)} */}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {!isReplying ? (
                <Button
                  onClick={() => setIsReplying(true)}
                  className="w-full sm:w-auto flex items-center gap-2"
                  title={t("qaCard.replyTitle")}
                >
                  <Reply className="h-4 w-4" />
                  {t("qaCard.reply")}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder={t("qaCard.answerPlaceholder")}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-24"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleReply} size="sm">
                      {t("qaCard.postAnswer")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsReplying(false)}
                    >
                      {t("qaCard.cancel")}
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
