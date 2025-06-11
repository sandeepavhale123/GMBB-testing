import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Search, Star, Bot, MessageSquare, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useToast } from '../../hooks/use-toast';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { setFilter, replyToReview } from '../../store/slices/reviewsSlice';

export const ReviewComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [replyText, setReplyText] = useState<{[key: string]: string}>({});
  const [expandedReply, setExpandedReply] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { reviews, filter } = useAppSelector((state) => state.reviews);
  const dispatch = useAppDispatch();

  const sentimentData = [
    { name: 'Positive', value: 86, fill: '#10b981' },
    { name: 'Neutral', value: 10, fill: '#6b7280' },
    { name: 'Negative', value: 4, fill: '#ef4444' }
  ];

  const mockReviews = [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing pizza and outstanding service! The staff was incredibly friendly and attentive. Will definitely be coming back soon.',
      date: '2024-06-11',
      replied: true,
      sentiment: 'Positive',
      reply: 'Thank you so much for your wonderful review, Sarah! We\'re thrilled to hear you enjoyed both our pizza and service. We look forward to welcoming you back soon!'
    },
    {
      id: '2',
      customerName: 'Mike Chen',
      rating: 4,
      comment: 'Great food quality and good atmosphere. The only minor issue was the wait time, but it was worth it.',
      date: '2024-06-10',
      replied: false,
      sentiment: 'Positive'
    },
    {
      id: '3',
      customerName: 'Emily Davis',
      rating: 3,
      comment: 'The pizza was okay, nothing special. Service was average. Might try other places next time.',
      date: '2024-06-09',
      replied: false,
      sentiment: 'Neutral'
    },
    {
      id: '4',
      customerName: 'John Smith',
      rating: 1,
      comment: 'Very disappointed with the experience. Food was cold and service was slow. Not recommended.',
      date: '2024-06-08',
      replied: true,
      sentiment: 'Negative',
      reply: 'We sincerely apologize for your disappointing experience, John. This is not the standard we strive for. We would love the opportunity to make this right. Please contact our manager directly at manager@pizzaplace.com so we can address your concerns properly.'
    },
    {
      id: '5',
      customerName: 'Lisa Wong',
      rating: 5,
      comment: 'Excellent pizza! Fresh ingredients and perfect crust. The staff was very professional.',
      date: '2024-06-07',
      replied: true,
      sentiment: 'Positive',
      reply: 'Thank you for the fantastic review, Lisa! We\'re delighted you enjoyed our fresh ingredients and crust. Our team takes great pride in delivering quality food and professional service.'
    }
  ];

  const totalReviews = mockReviews.length;
  const averageRating = 4.6;
  const respondedReviews = mockReviews.filter(r => r.replied).length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'text-green-600 bg-green-50';
      case 'Negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleGenerateReply = (reviewId: string) => {
    const review = mockReviews.find(r => r.id === reviewId);
    if (review) {
      let generatedReply = '';
      if (review.sentiment === 'Positive') {
        generatedReply = `Thank you so much for your wonderful review! We're thrilled you had a great experience with us.`;
      } else if (review.sentiment === 'Negative') {
        generatedReply = `We sincerely apologize for your experience. We'd love to make this right. Please contact us directly so we can address your concerns.`;
      } else {
        generatedReply = `Thank you for your feedback! We appreciate you taking the time to share your experience with us.`;
      }
      
      setReplyText(prev => ({
        ...prev,
        [reviewId]: generatedReply
      }));
      setExpandedReply(reviewId);
      
      toast({
        title: "AI Reply Generated",
        description: "An AI-generated reply has been created for this review."
      });
    }
  };

  const handleSendReply = (reviewId: string) => {
    dispatch(replyToReview(reviewId));
    setExpandedReply(null);
    setReplyText(prev => {
      const updated = { ...prev };
      delete updated[reviewId];
      return updated;
    });
    
    toast({
      title: "Reply Sent",
      description: "Your reply has been sent successfully."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
      </div>

      {/* Top Row - 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Review Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {renderStars(Math.floor(averageRating))}
              </div>
              <div className="text-sm text-gray-600">{totalReviews} reviews</div>
            </div>
            
            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stars === 5 ? 197 : stars === 4 ? 56 : stars === 3 ? 22 : stars === 2 ? 5 : 2;
                const percentage = (count / 282) * 100;
                
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-8">
                      <span className="text-sm font-medium">{stars}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sentiment breakdown</CardTitle>
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Positive</span>
                </div>
                <span className="font-semibold">86%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Neutral</span>
                </div>
                <span className="font-semibold">10%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Negative</span>
                </div>
                <span className="font-semibold">4%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{totalReviews}</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{respondedReviews}</div>
              <div className="text-sm text-gray-600">Responded Reviews</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">All Reviews</h2>
          <span className="text-sm text-gray-600">{mockReviews.length} reviews</span>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
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
              
              <div className="flex gap-3">
                <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Sentiments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiments</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Newest First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Rating</SelectItem>
                    <SelectItem value="lowest">Lowest Rating</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="not-replied">No Reply</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {mockReviews.map((review) => (
            <Card key={review.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium">
                      {formatDate(review.date).split(' ')[1]}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                        {getInitials(review.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{review.customerName}</span>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSentimentColor(review.sentiment)}>
                          {review.sentiment}
                        </Badge>
                        {review.replied ? (
                          <Badge className="bg-blue-100 text-blue-800">AI Responded</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">No Reply</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

                {/* Existing Reply */}
                {review.replied && review.reply && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Your Reply:</span>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <p className="text-blue-800 text-sm">{review.reply}</p>
                  </div>
                )}

                {/* Reply Actions */}
                {!review.replied && (
                  <div className="flex gap-3 mb-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleGenerateReply(review.id)}
                      className="flex items-center gap-2"
                    >
                      <Bot className="w-4 h-4" />
                      Generate using Genie
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setExpandedReply(review.id)}
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Reply Manually
                    </Button>
                  </div>
                )}

                {/* Reply Editor */}
                {expandedReply === review.id && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-900">Your Reply:</span>
                    </div>
                    <Textarea
                      placeholder="Type your response..."
                      value={replyText[review.id] || ''}
                      onChange={(e) => setReplyText(prev => ({
                        ...prev,
                        [review.id]: e.target.value
                      }))}
                      className="mb-3"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleSendReply(review.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Send Reply
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setExpandedReply(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
