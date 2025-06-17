
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Search, Star, Bot, MessageSquare, Clock, ExternalLink } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const RecentReviewsCard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [expandedReply, setExpandedReply] = useState<string | null>(null);
  const [showAIResponse, setShowAIResponse] = useState<string | null>(null);
  const [manualReply, setManualReply] = useState('');
  const [aiResponseText, setAiResponseText] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  // Sample data for recent reviews (limited to 5 for dashboard)
  const recentReviews = [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 5,
      date: '2024-01-10',
      sentiment: 'Positive',
      comment: 'Absolutely love this place! The food is amazing and the service is top-notch.',
      aiResponse: "Thank you so much for your wonderful review, Sarah! We're thrilled you enjoyed your experience.",
      isNew: false,
      hasReply: true,
      replyType: 'ai'
    },
    {
      id: '2',
      name: 'Mike Chen',
      rating: 4,
      date: '2024-01-09',
      sentiment: 'Positive',
      comment: 'Good food and decent service. The atmosphere could be better.',
      aiResponse: "Hi Mike, thank you for your feedback! We appreciate your comments about the atmosphere.",
      isNew: true,
      hasReply: false,
      replyType: null
    },
    {
      id: '3',
      name: 'Emily Davis',
      rating: 2,
      date: '2024-01-08',
      sentiment: 'Negative',
      comment: 'Waited too long for our order and the food was cold when it arrived.',
      aiResponse: "Hi Emily, we sincerely apologize for your disappointing experience. We'd love to make this right.",
      isNew: false,
      hasReply: true,
      replyType: 'manual'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleGenerateAIResponse = (reviewId: string) => {
    const review = recentReviews.find(r => r.id === reviewId);
    if (review) {
      setAiResponseText(prev => ({
        ...prev,
        [reviewId]: review.aiResponse
      }));
    }
    setShowAIResponse(reviewId);
    setExpandedReply(null);
    toast({
      title: "AI Response Generated",
      description: "AI has generated a response for this review."
    });
  };

  const handleReplyManually = (reviewId: string) => {
    setExpandedReply(reviewId);
    setShowAIResponse(null);
  };

  const handleUseResponse = (reviewId: string) => {
    toast({
      title: "Response Used",
      description: "The AI suggested response has been used for this review."
    });
    setShowAIResponse(null);
    setAiResponseText(prev => {
      const updated = { ...prev };
      delete updated[reviewId];
      return updated;
    });
  };

  const handleSendManualReply = (reviewId: string) => {
    toast({
      title: "Reply Sent",
      description: "Your manual reply has been sent successfully."
    });
    setExpandedReply(null);
    setManualReply('');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-green-100 text-green-800';
      case 'Negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReplyStatusBadge = (review: any) => {
    if (!review.hasReply) {
      return <Badge className="bg-yellow-100 text-yellow-800">No Reply</Badge>;
    }
    if (review.replyType === 'ai') {
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <Bot className="w-3 h-3" />
          AI Responded
        </Badge>
      );
    }
    if (review.replyType === 'manual') {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          Manual Reply
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Recent Reviews</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View All Reviews
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="highest">Highest</SelectItem>
                <SelectItem value="lowest">Lowest</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {recentReviews.map(review => (
            <Card key={review.id} className={`border ${review.isNew || !review.hasReply ? 'border-l-4 border-l-blue-500' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.name}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-xs">
                        {getInitials(review.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{review.name}</span>
                        {review.isNew && (
                          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <Badge className={getSentimentBadgeColor(review.sentiment)}>
                          {review.sentiment}
                        </Badge>
                        {getReplyStatusBadge(review)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
                </div>

                {/* Review Comment */}
                <p className="text-sm text-gray-700 mb-3">{review.comment}</p>

                {/* Reply Actions */}
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateAIResponse(review.id)}
                    className="flex items-center gap-2"
                  >
                    <Bot className="w-3 h-3" />
                    Generate AI Response
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReplyManually(review.id)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Reply Manually
                  </Button>
                </div>

                {/* AI Response Section */}
                {showAIResponse === review.id && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-900 flex items-center gap-2">
                        <Bot className="w-3 h-3" />
                        AI Suggested Response
                      </span>
                    </div>
                    <Textarea
                      value={aiResponseText[review.id] || ''}
                      onChange={(e) => setAiResponseText(prev => ({
                        ...prev,
                        [review.id]: e.target.value
                      }))}
                      className="mb-2 bg-white border-blue-200 focus:border-blue-400 text-sm"
                      rows={3}
                      placeholder="AI suggested response will appear here..."
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUseResponse(review.id)}>
                        Use Response
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowAIResponse(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Manual Reply Editor */}
                {expandedReply === review.id && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-900">Write your reply</span>
                    </div>
                    <Textarea
                      placeholder="Type your response..."
                      value={manualReply}
                      onChange={(e) => setManualReply(e.target.value)}
                      className="mb-2 text-sm"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSendManualReply(review.id)}>
                        Send Reply
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setExpandedReply(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
