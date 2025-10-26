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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Download, Star, MessageSquare, Share2 } from "lucide-react";
import { ShareReviewModal } from "../components/ShareReviewModal";

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

// TODO: Replace with real API call when backend is ready
// Example: const { data: reviews, isLoading } = useReviews({ channel, sentiment, search });
const mockReviews = [
  {
    id: 1,
    author: "John Doe",
    rating: 5,
    content: "Excellent service! The team was professional and delivered beyond expectations. Highly recommend their services to anyone looking for quality work.",
    channel: "Google Business Profile",
    sentiment: "positive",
    date: "2024-01-15",
    replied: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: 2,
    author: "Jane Smith",
    rating: 4,
    content: "Good experience overall. The service was prompt and the staff was friendly. Minor issues with communication, but they were resolved quickly.",
    channel: "Facebook",
    sentiment: "positive",
    date: "2024-01-14",
    replied: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  {
    id: 3,
    author: "Bob Johnson",
    rating: 2,
    content: "Not satisfied with the service. Expected better quality for the price. The response time was slow and the results were disappointing.",
    channel: "Google Business Profile",
    sentiment: "negative",
    date: "2024-01-13",
    replied: true,
    avatar: undefined,
  },
  {
    id: 4,
    author: "Alice Williams",
    rating: 5,
    content: "Outstanding experience! The team went above and beyond to ensure everything was perfect. Will definitely be returning for future projects.",
    channel: "Yelp",
    sentiment: "positive",
    date: "2024-01-12",
    replied: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  },
  {
    id: 5,
    author: "Charlie Brown",
    rating: 3,
    content: "Average service. It was okay but nothing exceptional. Met basic expectations but didn't exceed them in any particular way.",
    channel: "Facebook",
    sentiment: "neutral",
    date: "2024-01-11",
    replied: false,
    avatar: undefined,
  },
  {
    id: 6,
    author: "Diana Prince",
    rating: 5,
    content: "Absolutely fantastic! The attention to detail and customer service was impeccable. This is how business should be done.",
    channel: "Google Business Profile",
    sentiment: "positive",
    date: "2024-01-10",
    replied: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
  },
  {
    id: 7,
    author: "Edward Norton",
    rating: 1,
    content: "Very disappointing. The service did not match what was promised. Poor communication and subpar results. Would not recommend.",
    channel: "Yelp",
    sentiment: "negative",
    date: "2024-01-09",
    replied: true,
    avatar: undefined,
  },
  {
    id: 8,
    author: "Fiona Green",
    rating: 4,
    content: "Great service with minor room for improvement. The team was responsive and professional. A few small hiccups but overall very satisfied.",
    channel: "Facebook",
    sentiment: "positive",
    date: "2024-01-08",
    replied: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona",
  },
];

export const Review: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<typeof mockReviews[0] | null>(null);

  // Filter reviews based on search and filters
  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch = review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = selectedChannel === "all" || 
                          review.channel.toLowerCase().includes(selectedChannel.toLowerCase());
    const matchesSentiment = selectedSentiment === "all" || 
                            review.sentiment === selectedSentiment;
    
    return matchesSearch && matchesChannel && matchesSentiment;
  });

  // TODO: Implement real export functionality when backend is ready
  const handleExport = () => {
    console.log("Exporting reviews...", {
      totalReviews: filteredReviews.length,
      filters: { searchTerm, selectedChannel, selectedSentiment }
    });
    // Future: Generate CSV/PDF export
  };

  const handleShareClick = (review: typeof mockReviews[0]) => {
    setSelectedReview(review);
    setIsShareModalOpen(true);
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
            <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
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
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* User Avatar */}
                      <Avatar className="w-10 h-10 border-2 border-border">
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                          {review.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Author Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground">{review.author}</h4>
                        <p className="text-sm text-muted-foreground">
                          {review.channel} • {review.date}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Channel Logo */}
                    <div className={`w-8 h-8 rounded-full ${channelColors[review.channel]} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                      {channelLogos[review.channel]}
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-foreground leading-relaxed">{review.content}</p>

                  {/* Sentiment Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        review.sentiment === "positive"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : review.sentiment === "negative"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {review.sentiment}
                    </span>
                    {review.replied && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Replied
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      {review.replied ? "View Reply" : "Reply"}
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleShareClick(review)}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
