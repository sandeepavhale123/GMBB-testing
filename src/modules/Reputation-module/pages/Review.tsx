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
import { Search, Download, Star, MessageSquare } from "lucide-react";

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
  },
];

export const Review: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");

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
                <div className="space-y-3">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{review.author}</h4>
                      <p className="text-sm text-muted-foreground">
                        {review.channel} • {review.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
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

                  {/* Review Content */}
                  <p className="text-foreground">{review.content}</p>

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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
