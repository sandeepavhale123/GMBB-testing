import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DateRangePicker } from '../ui/date-range-picker';
import { Search, Star, Bot, MessageSquare, Edit3, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setFilter, setDateRange, clearDateRange, replyToReview } from '../../store/slices/reviewsSlice';
import { AIReplyGenerator } from './AIReplyGenerator';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, parseISO } from 'date-fns';

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
  const {
    filter,
    dateRange
  } = useAppSelector(state => state.reviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showingAIGenerator, setShowingAIGenerator] = useState<string | null>(null);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>();

  const reviews: Review[] = [{
    id: '1',
    customerName: 'Sarah Johnson',
    customerInitials: 'SJ',
    rating: 5,
    comment: 'Amazing coffee and friendly staff! The atmosphere is perfect for working and the pastries are delicious. Will definitely come back.',
    business: 'Downtown Coffee',
    date: '2024-06-11',
    replied: true,
    replyText: 'Thank you so much for your kind words, Sarah! We\'re thrilled you enjoyed your experience.',
    sentiment: 'positive',
    platform: 'Google'
  }, {
    id: '2',
    customerName: 'Mike Chen',
    customerInitials: 'MC',
    rating: 4,
    comment: 'Great atmosphere and delicious pastries. Coffee could be stronger though.',
    business: 'Main Street Bakery',
    date: '2024-06-10',
    replied: false,
    sentiment: 'positive',
    platform: 'Google'
  }, {
    id: '3',
    customerName: 'Emily Rodriguez',
    customerInitials: 'ER',
    rating: 5,
    comment: 'Best local coffee shop! Love the seasonal drinks and the baristas always remember my order.',
    business: 'Downtown Coffee',
    date: '2024-06-09',
    replied: true,
    replyText: 'Emily, you made our day! Thank you for being such a loyal customer.',
    sentiment: 'positive',
    platform: 'Google'
  }, {
    id: '4',
    customerName: 'David Thompson',
    customerInitials: 'DT',
    rating: 3,
    comment: 'Decent coffee but service was slow. Had to wait 15 minutes for a simple latte.',
    business: 'Downtown Coffee',
    date: '2024-06-08',
    replied: false,
    sentiment: 'neutral',
    platform: 'Google'
  }, {
    id: '5',
    customerName: 'Lisa Wang',
    customerInitials: 'LW',
    rating: 5,
    comment: 'Outstanding service and quality! The new summer menu is fantastic.',
    business: 'Main Street Bakery',
    date: '2024-06-07',
    replied: true,
    replyText: 'Thank you Lisa! We\'re so happy you\'re enjoying our summer offerings.',
    sentiment: 'positive',
    platform: 'Google'
  }];
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && !review.replied) || 
                         (filter === 'replied' && review.replied);
    
    // Date range filtering
    let matchesDateRange = true;
    if (dateRange.startDate && dateRange.endDate) {
      const reviewDate = parseISO(review.date);
      const startDate = parseISO(dateRange.startDate);
      const endDate = parseISO(dateRange.endDate);
      matchesDateRange = isWithinInterval(reviewDate, { start: startDate, end: endDate });
    }
    
    return matchesSearch && matchesFilter && matchesDateRange;
  });
  const reviewsPerPage = 10;
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, index) => <Star key={index} className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);
  };
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  const handleGenerateReply = (reviewId: string) => {
    setShowingAIGenerator(reviewId);
    setEditingReply(null); // Close any manual editing
  };
  const handleManualReply = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    setEditingReply(reviewId);
    setShowingAIGenerator(null); // Close AI generator
    // Pre-populate with existing reply text if it exists, otherwise empty
    setReplyText(review?.replyText || '');
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
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setLocalDateRange(range);
    if (range?.from && range?.to) {
      dispatch(setDateRange({
        startDate: format(range.from, 'yyyy-MM-dd'),
        endDate: format(range.to, 'yyyy-MM-dd')
      }));
    } else if (!range?.from && !range?.to) {
      dispatch(clearDateRange());
    }
  };

  const handleClearDateRange = () => {
    setLocalDateRange(undefined);
    dispatch(clearDateRange());
  };

  return <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Customer Reviews</CardTitle>
        
        {/* Filters and Search */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search reviews..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="pl-10" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={filter} onValueChange={value => dispatch(setFilter(value))}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="pending">Pending Reply</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating-high">Highest Rating</SelectItem>
                <SelectItem value="rating-low">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <DateRangePicker
                date={localDateRange}
                onDateChange={handleDateRangeChange}
                placeholder="Select date range"
                className="w-full sm:w-64"
              />
              {(dateRange.startDate || dateRange.endDate) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearDateRange}
                  className="px-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-6">
          {currentReviews.map(review => <div key={review.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Customer Avatar */}
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {review.customerInitials}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{review.customerName}</h4>
                      <Badge variant="outline" className="text-xs">{review.platform}</Badge>
                      <Badge className={`text-xs ${getSentimentColor(review.sentiment)}`}>
                        {review.sentiment}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500 flex-shrink-0">{new Date(review.date).toLocaleDateString()}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">{review.comment}</p>

                  {/* Reply Section - Hide when editing */}
                  {review.replied && review.replyText && editingReply !== review.id && <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded-r-md">
                      <p className="text-sm text-gray-700">{review.replyText}</p>
                      <div className="flex items-center gap-1 mt-2">
                        
                      </div>
                    </div>}

                  {/* Edit Reply Form */}
                  {editingReply === review.id && <div className="mb-4">
                      <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write your reply..." className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} />
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button size="sm" onClick={() => handleSaveReply(review.id)}>
                          Save Reply
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingReply(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>}

                  {/* AI Reply Generator */}
                  {showingAIGenerator === review.id && <AIReplyGenerator reviewId={review.id} customerName={review.customerName} rating={review.rating} comment={review.comment} sentiment={review.sentiment} onSave={handleSaveReply} onCancel={handleCancelAIGenerator} />}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {!review.replied && showingAIGenerator !== review.id && editingReply !== review.id && <>
                        <Button size="sm" variant="outline" onClick={() => handleGenerateReply(review.id)} className="flex items-center gap-1 text-xs sm:text-sm">
                          <Bot className="w-4 h-4" />
                          <span className="hidden sm:inline">Generate using Genie</span>
                          <span className="sm:hidden">AI Reply</span>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleManualReply(review.id)} className="flex items-center gap-1 text-xs sm:text-sm">
                          <MessageSquare className="w-4 h-4" />
                          <span className="hidden sm:inline">Reply Manually</span>
                          <span className="sm:hidden">Reply</span>
                        </Button>
                      </>}
                    {review.replied && editingReply !== review.id && showingAIGenerator !== review.id && <Button size="sm" variant="outline" onClick={() => handleManualReply(review.id)} className="flex items-center gap-1 text-xs sm:text-sm">
                        <Edit3 className="w-4 h-4" />
                        Edit Reply
                      </Button>}
                  </div>
                </div>
              </div>
            </div>)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200 gap-4">
            <p className="text-sm text-gray-600 order-2 sm:order-1">
              Showing {startIndex + 1} to {Math.min(startIndex + reviewsPerPage, filteredReviews.length)} of {filteredReviews.length} reviews
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <span className="text-sm text-gray-600 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center gap-1">
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>}
      </CardContent>
    </Card>;
};
