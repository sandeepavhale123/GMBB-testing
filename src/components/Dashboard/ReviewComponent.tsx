import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import {
  MoreVertical,
  Search,
  Star,
  Bot,
  MessageSquare,
  Clock,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useToast } from "../../hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ReviewComponent: React.FC = () => {
  const { t } = useI18nNamespace("Dashboard/reviewComponent");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedReply, setExpandedReply] = useState<string | null>(null);
  const [showAIResponse, setShowAIResponse] = useState<string | null>(null);
  const [manualReply, setManualReply] = useState("");
  const [aiResponseText, setAiResponseText] = useState<{
    [key: string]: string;
  }>({});
  const { toast } = useToast();
  const sentimentData = [
    {
      name: t("positive"),
      value: 86,
      fill: "#10b981",
    },
    {
      name: t("neutral"),
      value: 10,
      fill: "#6b7280",
    },
    {
      name: t("negative"),
      value: 4,
      fill: "#ef4444",
    },
  ];
  const reviewsData = [
    {
      id: "1",
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-01-10",
      sentiment: "Positive",
      comment:
        "Absolutely love this place! The food is amazing and the service is top-notch. Will definitely be coming back.",
      aiResponse:
        "Thank you so much for your wonderful review, Sarah! We're thrilled you enjoyed your experience with us.",
      isGenerated: true,
      isNew: false,
      hasReply: true,
      replyType: "ai",
    },
    {
      id: "2",
      name: "Mike Chen",
      rating: 4,
      date: "2024-01-09",
      sentiment: "Positive",
      comment:
        "Good food and decent service. The atmosphere could be better but overall a nice experience.",
      aiResponse:
        "Hi Mike, thank you for your feedback! We appreciate your comments about the atmosphere and will work on improving it.",
      isGenerated: true,
      isNew: true,
      hasReply: false,
      replyType: null,
    },
    {
      id: "3",
      name: "Emily Davis",
      rating: 1,
      date: "2024-01-05",
      sentiment: "Negative",
      comment:
        "Waited too long for our order and the food was cold when it arrived. Very disappointed.",
      aiResponse:
        "Hi Emily, we sincerely apologize for your disappointing experience. We'd love to make this right - please contact us directly.",
      isGenerated: true,
      isNew: false,
      hasReply: true,
      replyType: "manual",
    },
  ];
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  const handleGenerateAIResponse = (reviewId: string) => {
    const review = reviewsData.find((r) => r.id === reviewId);
    if (review) {
      setAiResponseText((prev) => ({
        ...prev,
        [reviewId]: review.aiResponse,
      }));
    }
    setShowAIResponse(reviewId);
    setExpandedReply(null);
    toast({
      title: t("toasts.aiGeneratedTitle"),
      description: t("toasts.aiGeneratedDesc"),
    });
  };
  const handleReplyManually = (reviewId: string) => {
    setExpandedReply(reviewId);
    setShowAIResponse(null);
  };
  const handleUseResponse = (reviewId: string) => {
    const responseText = aiResponseText[reviewId] || "";
    toast({
      title: t("toasts.responseUsedTitle"),
      description: t("toasts.responseUsedDesc"),
    });
    setShowAIResponse(null);
    setAiResponseText((prev) => {
      const updated = {
        ...prev,
      };
      delete updated[reviewId];
      return updated;
    });
  };
  const handleSendManualReply = (reviewId: string) => {
    toast({
      title: t("toasts.replySentTitle"),
      description: t("toasts.replySentDesc"),
    });
    setExpandedReply(null);
    setManualReply("");
  };
  const renderStars = (rating: number) => {
    return Array.from(
      {
        length: 5,
      },
      (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      )
    );
  };
  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-100 text-green-800";
      case "Negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getReplyStatusBadge = (review: any) => {
    if (!review.hasReply) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          {t("badges.noReply")}
        </Badge>
      );
    }
    if (review.replyType === "ai") {
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <Bot className="w-3 h-3" />
          {t("badges.aiResponded")}
        </Badge>
      );
    }
    if (review.replyType === "manual") {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {t("badges.manualReply")}
        </Badge>
      );
    }
    return null;
  };
  return (
    <div className="space-y-1 ">
      {/* Header */}
      <div className="flex items-center justify-between"></div>

      {/* Top Cards - Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Review Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t("reviewSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">4.6</div>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(4)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {t("reviewsCount", { count: 282 })}
                </div>
              </div>
            </div>

            {/* Rating Breakdown with Stars */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars, index) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-600 h-2 rounded-full"
                      style={{
                        width: `${[80, 60, 40, 25, 15][index]}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t("sentimentBreakdown")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{t("positive")}</span>
                </div>
                <div className="font-semibold">86 %</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{t("neutral")}</span>
                </div>
                <div className="font-semibold">10 %</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{t("negative")}</span>
                </div>
                <div className="font-semibold">4 %</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews Title */}
      <h2 className="text-xl font-semibold text-gray-900 space-y-5">
        {t("recentReviews")}
      </h2>
      {/* Filters and Search */}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t("filters.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("filters.newest")}</SelectItem>
                  <SelectItem value="oldest">{t("filters.oldest")}</SelectItem>
                  <SelectItem value="highest">
                    {t("filters.highest")}
                  </SelectItem>
                  <SelectItem value="lowest">{t("filters.lowest")}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={t("filters.rating")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allRatings")}</SelectItem>
                  <SelectItem value="5">
                    {t("filters.stars", { count: 5 })}
                  </SelectItem>
                  <SelectItem value="4">
                    {t("filters.stars", { count: 4 })}
                  </SelectItem>
                  <SelectItem value="3">
                    {t("filters.stars", { count: 3 })}
                  </SelectItem>
                  <SelectItem value="2">
                    {t("filters.stars", { count: 2 })}
                  </SelectItem>
                  <SelectItem value="1">
                    {t("filters.stars", { count: 1 })}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterSentiment}
                onValueChange={setFilterSentiment}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={t("filters.sentiment")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.all")}</SelectItem>
                  <SelectItem value="positive">{t("positive")}</SelectItem>
                  <SelectItem value="neutral">{t("neutral")}</SelectItem>
                  <SelectItem value="negative">{t("negative")}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t("filters.replyStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allStatus")}</SelectItem>
                  <SelectItem value="responded">
                    {t("filters.responded")}
                  </SelectItem>
                  <SelectItem value="not-responded">
                    {t("filters.notResponded")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {/* Review Items */}
        {reviewsData.map((review) => (
          <Card
            key={review.id}
            className={`border ${
              review.isNew || !review.hasReply
                ? "border-l-4 border-l-blue-500"
                : "border-gray-200"
            }`}
          >
            <CardContent className="p-4 sm:p-6 mx-0 my-[9px]">
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.name}`}
                      alt="user-profile"
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                      {getInitials(review.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">
                        {review.name}
                      </span>
                      {review.isNew && (
                        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t("badges.new")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <Badge
                        className={getSentimentBadgeColor(review.sentiment)}
                      >
                        {review.sentiment}
                      </Badge>
                      {getReplyStatusBadge(review)}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.date)}
                </span>
              </div>

              {/* Review Comment */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                {review.comment}
              </p>

              {/* Reply Actions - Now shown for ALL reviews */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Button
                  variant="outline"
                  onClick={() => handleGenerateAIResponse(review.id)}
                  className="flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  {t("buttons.generateAIResponse")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReplyManually(review.id)}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {t("buttons.replyManually")}
                </Button>
              </div>

              {/* AI Response Section (when visible) - Now editable */}
              {showAIResponse === review.id && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900 flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      {t("aiSuggestedResponse")}
                    </span>
                  </div>
                  <Textarea
                    value={aiResponseText[review.id] || ""}
                    onChange={(e) =>
                      setAiResponseText((prev) => ({
                        ...prev,
                        [review.id]: e.target.value,
                      }))
                    }
                    className="mb-3 bg-white border-blue-200 focus:border-blue-400"
                    rows={4}
                    placeholder={t("placeholders.aiResponse")}
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUseResponse(review.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {t("buttons.useResponse")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAIResponse(null)}
                    >
                      {t("buttons.cancel")}
                    </Button>
                  </div>
                </div>
              )}

              {/* Manual Reply Editor */}
              {expandedReply === review.id && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-900">
                      {t("writeYourReply")}
                    </span>
                  </div>
                  <Textarea
                    placeholder={t("placeholders.manualResponse")}
                    value={manualReply}
                    onChange={(e) => setManualReply(e.target.value)}
                    className="mb-3"
                    rows={4}
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSendManualReply(review.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {t("buttons.sendReply")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedReply(null)}
                    >
                      {t("buttons.cancel")}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
