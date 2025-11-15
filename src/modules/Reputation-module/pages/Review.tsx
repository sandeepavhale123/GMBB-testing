import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, MessageSquare } from "lucide-react";
import { ShareReviewModal } from "../components/ShareReviewModal";
import { ReputationReviewCard } from "../components/ReputationReviewCard";
import { Review as ReviewType } from "@/services/reviewService";

// TODO: Replace with real API call when backend is ready
// Example: const { data: reviews, isLoading } = useReviews({ channel, sentiment, search });
const mockReviews: ReviewType[] = [
  {
    id: "1",
    listingId: "1",
    accountId: "1",
    customer_name: "John Doe",
    rating: 5,
    comment:
      "Excellent service! The team was professional and delivered beyond expectations. Highly recommend their services to anyone looking for quality work.",
    platform: "Google Business Profile",
    date: "2024-01-15",
    replied: true,
    reply_text:
      "Thank you so much for your wonderful feedback! We're thrilled to hear you had such a positive experience.",
    reply_date: "2024-01-16",
    profile_image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    locationName: "Downtown Location",
    zipcode: "10001",
    is_new: false,
    reply_type: "manual",
    reply_setting: null,
  },
  {
    id: "2",
    listingId: "1",
    accountId: "1",
    customer_name: "Jane Smith",
    rating: 4,
    comment:
      "Good experience overall. The service was prompt and the staff was friendly. Minor issues with communication, but they were resolved quickly.",
    platform: "Facebook",
    date: "2024-01-14",
    replied: false,
    reply_text: "",
    reply_date: "",
    profile_image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    locationName: "Midtown Office",
    zipcode: "10002",
    is_new: false,
    reply_type: "",
    reply_setting: null,
  },
  {
    id: "3",
    listingId: "1",
    accountId: "1",
    customer_name: "Bob Johnson",
    rating: 2,
    comment:
      "Not satisfied with the service. Expected better quality for the price. The response time was slow and the results were disappointing.",
    platform: "Google Business Profile",
    date: "2024-01-13",
    replied: true,
    reply_text:
      "We apologize for not meeting your expectations. We'd love to discuss this further and make things right. Please contact us directly.",
    reply_date: "2024-01-14",
    profile_image_url: "",
    locationName: "Downtown Location",
    zipcode: "10001",
    is_new: false,
    reply_type: "manual",
    reply_setting: null,
  },
  {
    id: "4",
    listingId: "1",
    accountId: "1",
    customer_name: "Alice Williams",
    rating: 5,
    comment:
      "Outstanding experience! The team went above and beyond to ensure everything was perfect. Will definitely be returning for future projects.",
    platform: "Yelp",
    date: "2024-01-12",
    replied: false,
    reply_text: "",
    reply_date: "",
    profile_image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    locationName: "Uptown Branch",
    zipcode: "10003",
    is_new: false,
    reply_type: "",
    reply_setting: null,
  },
  {
    id: "5",
    listingId: "1",
    accountId: "1",
    customer_name: "Charlie Brown",
    rating: 3,
    comment:
      "Average service. It was okay but nothing exceptional. Met basic expectations but didn't exceed them in any particular way.",
    platform: "Facebook",
    date: "2024-01-11",
    replied: false,
    reply_text: "",
    reply_date: "",
    profile_image_url: "",
    locationName: "Midtown Office",
    zipcode: "10002",
    is_new: false,
    reply_type: "",
    reply_setting: null,
  },
  {
    id: "6",
    listingId: "1",
    accountId: "1",
    customer_name: "Diana Prince",
    rating: 5,
    comment:
      "Absolutely fantastic! The attention to detail and customer service was impeccable. This is how business should be done.",
    platform: "Google Business Profile",
    date: "2024-01-10",
    replied: true,
    reply_text:
      "Thank you Diana! It's customers like you that make what we do so rewarding. We appreciate your business!",
    reply_date: "2024-01-11",
    profile_image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
    locationName: "Downtown Location",
    zipcode: "10001",
    is_new: false,
    reply_type: "AI",
    reply_setting: null,
  },
  {
    id: "7",
    listingId: "1",
    accountId: "1",
    customer_name: "Edward Norton",
    rating: 1,
    comment:
      "Very disappointing. The service did not match what was promised. Poor communication and subpar results. Would not recommend.",
    platform: "Yelp",
    date: "2024-01-09",
    replied: true,
    reply_text:
      "We're very sorry to hear about your experience. This is not up to our standards. Please reach out so we can address your concerns.",
    reply_date: "2024-01-10",
    profile_image_url: "",
    locationName: "Uptown Branch",
    zipcode: "10003",
    is_new: false,
    reply_type: "manual",
    reply_setting: null,
  },
  {
    id: "8",
    listingId: "1",
    accountId: "1",
    customer_name: "Fiona Green",
    rating: 4,
    comment:
      "Great service with minor room for improvement. The team was responsive and professional. A few small hiccups but overall very satisfied.",
    platform: "Facebook",
    date: "2024-01-08",
    replied: false,
    reply_text: "",
    reply_date: "",
    profile_image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona",
    locationName: "Midtown Office",
    zipcode: "10002",
    is_new: false,
    reply_type: "",
    reply_setting: null,
  },
];

export const Review: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);

  // Reply management state
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [showingAIGenerator, setShowingAIGenerator] = useState<string | null>(
    null
  );
  const [replyLoading, setReplyLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Calculate sentiment from rating
  const getSentiment = (rating: number): string => {
    if (rating >= 4) return "positive";
    if (rating >= 3) return "neutral";
    return "negative";
  };

  // Filter reviews based on search and filters
  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel =
      selectedChannel === "all" ||
      review.platform.toLowerCase().includes(selectedChannel.toLowerCase());
    const sentiment = getSentiment(review.rating);
    const matchesSentiment =
      selectedSentiment === "all" || sentiment === selectedSentiment;

    return matchesSearch && matchesChannel && matchesSentiment;
  });

  // TODO: Implement real export functionality when backend is ready
  const handleExport = () => {
    // Future: Generate CSV/PDF export
  };

  const handleShareClick = (review: ReviewType) => {
    setSelectedReview(review);
    setIsShareModalOpen(true);
  };

  // Reply handlers
  const handleGenerateReply = (reviewId: string) => {
    setShowingAIGenerator(reviewId);
    setEditingReply(null);
  };

  const handleManualReply = (reviewId: string) => {
    setEditingReply(reviewId);
    setShowingAIGenerator(null);
  };

  const handleSaveReply = async (reviewId: string, reply?: string) => {
    // TODO: Implement API call to save reply
    setReplyLoading(true);

    // Simulate API call
    setTimeout(() => {
      setReplyLoading(false);
      setEditingReply(null);
      setShowingAIGenerator(null);
      // TODO: Update review in state or refetch reviews
    }, 1000);
  };

  const handleDeleteReply = async (reviewId: string) => {
    // TODO: Implement API call to delete reply
    setDeleteLoading(true);

    setTimeout(() => {
      setDeleteLoading(false);
      // TODO: Update review in state or refetch reviews
    }, 1000);
  };

  const handleCancelAIGenerator = () => {
    setEditingReply(null);
    setShowingAIGenerator(null);
  };

  const handleViewDetails = (review: ReviewType) => {
    //
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
          <p className="text-muted-foreground">
            View and manage customer reviews from all connected channels
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Reviews
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Channel Filter */}
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="google">Google Business Profile</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="yelp">Yelp</SelectItem>
              </SelectContent>
            </Select>

            {/* Sentiment Filter */}
            <Select
              value={selectedSentiment}
              onValueChange={setSelectedSentiment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredReviews.length} of {mockReviews.length} reviews
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No reviews found matching your filters</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <ReputationReviewCard
              key={review.id}
              review={review}
              editingReply={editingReply}
              showingAIGenerator={showingAIGenerator}
              replyLoading={replyLoading}
              deleteLoading={deleteLoading}
              onGenerateReply={handleGenerateReply}
              onManualReply={handleManualReply}
              onSaveReply={handleSaveReply}
              onDeleteReply={handleDeleteReply}
              onCancelAIGenerator={handleCancelAIGenerator}
              onShare={handleShareClick}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </div>

      {/* Share Review Modal */}
      {selectedReview && (
        <ShareReviewModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedReview(null);
          }}
          review={selectedReview}
        />
      )}
    </div>
  );
};
