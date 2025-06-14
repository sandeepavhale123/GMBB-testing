import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Star, Bot, MessageSquare, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setFilter, replyToReview } from '../../store/slices/reviewsSlice';
import { Timeline } from './Timeline';
import { AIReplyGenerator } from './AIReplyGenerator';

interface Review {
  id: string;
  customerName: string;
  customerInitials: string;
  rating: number;
  comment: string;
  business: string;
  date: string;
  replied: boolean;
  replyText?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  platform: string;
}

export const ReviewsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.reviews);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showingAIGenerator, setShowingAIGenerator] = useState<string | null>(null);

  const reviews: Review[] = [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      customerInitials: 'SJ',
      rating: 5,
      comment: 'Amazing coffee and friendly staff! The atmosphere is perfect for working and the pastries are delicious. Will definitely come back.',
      business: 'Downtown Coffee',
      date: '2024-06-08',
      replied: true,
      replyText: 'Thank you so much for your kind words, Sarah! We\'re thrilled you enjoyed your experience.',
      sentiment: 'positive',
      platform: 'Google'
    },
    {
      id: '2',
      customerName: 'Mike Chen',
      customerInitials: 'MC',
      rating: 4,
      comment: 'Great atmosphere and delicious pastries. Coffee could be stronger though.',
      business: 'Main Street Bakery',
      date: '2024-06-07',
      replied: false,
      sentiment: 'positive',
      platform: 'Yelp'
    },
    {
      id: '3',
      customerName: 'Emily Rodriguez',
      customerInitials: 'ER',
      rating: 5,
      comment: 'Best local coffee shop! Love the seasonal drinks and the baristas always remember my order.',
      business: 'Downtown Coffee',
      date: '2024-06-06',
      replied: true,
      replyText: 'Emily, you made our day! Thank you for being such a loyal customer.',
      sentiment: 'positive',
      platform: 'Google'
    },
    {
      id: '4',
      customerName: 'David Thompson',
      customerInitials: 'DT',
      rating: 3,
      comment: 'Decent coffee but service was slow. Had to wait 15 minutes for a simple latte.',
      business: 'Downtown Coffee',
      date: '2024-06-05',
      replied: false,
      sentiment: 'neutral',
      platform: 'Google'
    },
    {
      id: '5',
      customerName: 'Lisa Wang',
      customerInitials: 'LW',
      rating: 5,
      comment: 'Outstanding service and quality! The new summer menu is fantastic.',
      business: 'Main Street Bakery',
      date: '2024-06-04',
      replied: true,
      replyText: 'Thank you Lisa! We\'re so happy you\'re enjoying our summer offerings.',
      sentiment: 'positive',
      platform: 'Yelp'
    }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && !review.replied) ||
                         (filter === 'replied' && review.replied);
    return matchesSearch && matchesFilter;
  });

  const reviewsPerPage = 10;
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);

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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleGenerateReply = (reviewId: string) => {
    setShowingAIGenerator(reviewId);
  };

  const handleManualReply = (reviewId: string) => {
    setEditingReply(reviewId);
    setReplyText('');
  };

  const handleSaveReply = (reviewId: string, reply?: string) => {
    dispatch(replyToReview(reviewId));
    setEditingReply(null);
    setShowingAIGenerator(null);
    setReplyText('');
    console.log('Saving reply for review:', reviewId, reply || replyText);
  };

  const handleCancelAIGenerator = () => {
    setShowingAIGenerator(null);
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Customer Reviews</CardTitle>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filter} onValueChange={(value) => dispatch(setFilter(value))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending Reply</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="rating-high">Highest Rating</SelectItem>
              <SelectItem value="rating-low">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {currentReviews.map((review, index) => (
            <div key={review.id} className="flex gap-4">
              {/* Timeline */}
              <Timeline 
                sentiment={review.sentiment}
                date={review.date}
                isLast={index === currentReviews.length - 1}
              />
              
              {/* Review Content */}
              <div className="flex-1 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-4">
                  {/* Customer Avatar */}
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {review.customerInitials}
                  </div>

                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                        <Badge variant="outline" className="text-xs">{review.platform}</Badge>
                        <Badge className={`text-xs ${getSentimentColor(review.sentiment)}`}>
                          {review.sentiment}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-600">({review.rating}/5)</span>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 mb-3">{review.comment}</p>

                    {/* Reply Section */}
                    {review.replied && review.replyText && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                        <p className="text-sm text-gray-700">{review.replyText}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-blue-600">Business response</span>
                        </div>
                      </div>
                    )}

                    {/* Edit Reply Form */}
                    {editingReply === review.id && (
                      <div className="mb-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          rows={3}
                        />
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={() => handleSaveReply(review.id)}>
                            Save Reply
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingReply(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* AI Reply Generator */}
                    {showingAIGenerator === review.id && (
                      <AIReplyGenerator
                        reviewId={review.id}
                        customerName={review.customerName}
                        rating={review.rating}
                        comment={review.comment}
                        sentiment={review.sentiment}
                        onSave={handleSaveReply}
                        onCancel={handleCancelAIGenerator}
                      />
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {!review.replied && showingAIGenerator !== review.id && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateReply(review.id)}
                            className="flex items-center gap-1"
                          >
                            <Bot className="w-4 h-4" />
                            Generate using Genie
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleManualReply(review.id)}
                            className="flex items-center gap-1"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Reply Manually
                          </Button>
                        </>
                      )}
                      {review.replied && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleManualReply(review.id)}
                          className="flex items-center gap-1"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Reply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + reviewsPerPage, filteredReviews.length)} of {filteredReviews.length} reviews
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
