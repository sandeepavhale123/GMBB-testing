
import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { setFilter, replyToReview, updateReply } from '../../store/slices/reviewsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Search, Star, Sparkles, Send, X, Edit3 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const ReviewsManagementPage = () => {
  const dispatch = useAppDispatch();
  const { reviews, filter } = useAppSelector((state) => state.reviews);
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [currentReviewForAI, setCurrentReviewForAI] = useState<any>(null);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && !review.replied) ||
                         (filter === 'replied' && review.replied);
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReplySubmit = (reviewId: string) => {
    if (replyText.trim()) {
      if (editingReply) {
        dispatch(updateReply({ id: reviewId, reply: replyText }));
        setEditingReply(null);
        toast({
          title: "Reply Updated",
          description: "Your reply has been successfully updated.",
        });
      } else {
        dispatch(replyToReview({ id: reviewId, reply: replyText }));
        toast({
          title: "Reply Sent",
          description: "Your reply has been successfully sent.",
        });
      }
      setReplyingTo(null);
      setReplyText('');
    }
  };

  const handleEditReply = (review: any) => {
    setEditingReply(review.id);
    setReplyingTo(review.id);
    setReplyText(review.reply || '');
  };

  const generateAIResponses = (review: any) => {
    const responses = [];
    if (review.sentiment === 'positive') {
      responses.push(`Thank you so much for your wonderful review, ${review.customerName}! We're thrilled you had such a great experience. We look forward to seeing you again soon!`);
      responses.push(`${review.customerName}, your kind words truly made our day! We're so happy you enjoyed your visit and appreciate you taking the time to share your experience.`);
    } else if (review.sentiment === 'negative') {
      responses.push(`We sincerely apologize for your disappointing experience, ${review.customerName}. Your feedback is invaluable to us, and we're taking immediate steps to address these concerns. Please give us another opportunity to make things right.`);
      responses.push(`Thank you for bringing this to our attention, ${review.customerName}. We take your concerns seriously and are committed to improving. We'd love the chance to make your next visit exceptional.`);
    } else {
      responses.push(`Thank you for your honest feedback, ${review.customerName}. We appreciate you taking the time to review us and we're always working to improve our service.`);
      responses.push(`We value your input, ${review.customerName}. Your feedback helps us understand how we can better serve our customers. Thank you for visiting us!`);
    }
    return responses;
  };

  const handleAIResponseSelect = (response: string) => {
    setReplyText(response);
    setReplyingTo(currentReviewForAI?.id);
    setAiDialogOpen(false);
    setCurrentReviewForAI(null);
  };

  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => !r.replied).length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const positiveReviews = reviews.filter(r => r.sentiment === 'positive').length;
  const negativeReviews = reviews.filter(r => r.sentiment === 'negative').length;
  const neutralReviews = reviews.filter(r => r.sentiment === 'neutral').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Review Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-4 w-4 ${star <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = (count / totalReviews) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="w-3">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="w-8 text-gray-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Sentiment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle 
                    cx="18" cy="18" r="16" fill="none" 
                    stroke="#10b981" strokeWidth="3"
                    strokeDasharray={`${(positiveReviews / totalReviews) * 100} 100`}
                    strokeDashoffset="0"
                  />
                  <circle 
                    cx="18" cy="18" r="16" fill="none" 
                    stroke="#ef4444" strokeWidth="3"
                    strokeDasharray={`${(negativeReviews / totalReviews) * 100} 100`}
                    strokeDashoffset={`-${(positiveReviews / totalReviews) * 100}`}
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm">Positive</span>
                  </div>
                  <span className="text-sm font-medium">{positiveReviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm">Negative</span>
                  </div>
                  <span className="text-sm font-medium">{negativeReviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    <span className="text-sm">Neutral</span>
                  </div>
                  <span className="text-sm font-medium">{neutralReviews}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalReviews}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold text-orange-600">{pendingReviews}</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-green-600">{totalReviews - pendingReviews}</div>
                  <div className="text-xs text-gray-600">Replied</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Response Rate</div>
                <div className="text-lg font-semibold">{Math.round(((totalReviews - pendingReviews) / totalReviews) * 100)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Reviews Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">All Reviews</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => dispatch(setFilter('all'))}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  onClick={() => dispatch(setFilter('pending'))}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={filter === 'replied' ? 'default' : 'outline'}
                  onClick={() => dispatch(setFilter('replied'))}
                  size="sm"
                >
                  Replied
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border-l-4 border-gray-200 pl-6 relative">
                <div className="absolute left-0 top-6 w-4 h-4 bg-white border-2 border-gray-300 rounded-full -translate-x-1/2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {getInitials(review.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <Badge className={getSentimentColor(review.sentiment)}>
                              {review.sentiment}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-700">{formatDate(review.date)}</div>
                          <div className="text-xs text-gray-500">{review.business}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{review.comment}</p>
                      
                      {review.replied && review.reply && !editingReply && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-sm font-medium text-blue-800">Your Reply</div>
                            <Badge variant="secondary">Replied</Badge>
                          </div>
                          <p className="text-blue-700 text-sm">{review.reply}</p>
                        </div>
                      )}

                      {replyingTo === review.id && (
                        <div className="space-y-3 mb-4">
                          <Textarea
                            placeholder="Write your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleReplySubmit(review.id)}>
                              <Send className="h-4 w-4 mr-1" />
                              Send
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                                setEditingReply(null);
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {!review.replied ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setReplyingTo(review.id)}
                            >
                              Reply Manually
                            </Button>
                            <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setCurrentReviewForAI(review)}
                                >
                                  <Sparkles className="h-4 w-4 mr-1" />
                                  Generate using Genie
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>AI Generated Responses</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {currentReviewForAI && generateAIResponses(currentReviewForAI).map((response, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-600">Option {index + 1}</span>
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleAIResponseSelect(response)}
                                        >
                                          Select
                                        </Button>
                                      </div>
                                      <p className="text-gray-700">{response}</p>
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditReply(review)}
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsManagementPage;
